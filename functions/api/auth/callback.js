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
      "content-type": "text/html; charset=utf-8"
    }
  });
}

function closeWithError(message) {
  return htmlResponse(`<!doctype html>
<html lang="en">
  <body>
    <script>
      window.opener && window.opener.postMessage(
        'authorization:github:error:${JSON.stringify({ message })}',
        '*'
      );
      window.close();
    </script>
    <p>${message}</p>
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

  return htmlResponse(`<!doctype html>
<html lang="en">
  <body>
    <script>
      window.opener && window.opener.postMessage(
        'authorization:github:success:${payload}',
        '*'
      );
      window.close();
    </script>
    <p>Authentication complete. You can close this window.</p>
  </body>
</html>`);
}
