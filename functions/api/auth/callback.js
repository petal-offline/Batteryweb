const githubTokenUrl = "https://github.com/login/oauth/access_token";

function parseCookies(cookieHeader) {
  return Object.fromEntries(
    (cookieHeader ?? "")
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const [key, ...value] = part.split("=");
        return [key, value.join("=")];
      })
  );
}

function htmlResponse(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

function closeWithError(message) {
  const errorPayload = JSON.stringify({ message });
  const errorMessage = JSON.stringify(`authorization:github:error:${errorPayload}`);
  return htmlResponse(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Authentication error</title>
  </head>
  <body>
    <script>
      const message = ${errorMessage};
      if (window.opener) {
        window.opener.postMessage(message, window.location.origin);
        window.opener.postMessage(message, '*');
      }
    </script>
    <p>${message}</p>
    <p>Please close this window and try signing in again from the admin page.</p>
  </body>
</html>`, 400);
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookies = parseCookies(request.headers.get("cookie"));
  const callbackUrl = new URL("/api/auth/callback", url.origin);

  if (!code || !state || cookies.decap_oauth_state !== state) {
    return closeWithError("GitHub authorization could not be verified.");
  }

  const tokenResponse = await fetch(githubTokenUrl, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: callbackUrl.toString()
    })
  });

  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok || !tokenData.access_token) {
    return closeWithError(
      tokenData.error_description || tokenData.error || "GitHub did not return an access token."
    );
  }

  const payload = JSON.stringify({
    token: tokenData.access_token,
    provider: "github"
  });
  const successMessage = JSON.stringify(`authorization:github:success:${payload}`);
  const adminUrl = new URL("/admin/#/", url.origin);

  return htmlResponse(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Authentication complete</title>
  </head>
  <body>
    <script>
      const payload = ${payload};
      const messages = [
        ${successMessage},
        { type: 'authorization', provider: 'github', token: payload.token },
        { type: 'authorization:github:success', provider: 'github', token: payload.token }
      ];
      if (window.opener) {
        for (const message of messages) {
          window.opener.postMessage(message, window.location.origin);
          window.opener.postMessage(message, '*');
        }
        window.setTimeout(() => window.close(), 900);
      } else {
        window.location.href = '${adminUrl.toString()}';
      }
    </script>
    <p>Authentication complete. Returning to the admin panel...</p>
    <p><a href="${adminUrl.toString()}">Go back to the admin panel</a></p>
  </body>
</html>`);
}
