const githubAuthorizeUrl = "https://github.com/login/oauth/authorize";

function missingEnvironmentResponse() {
  return new Response("GitHub OAuth is not configured. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in Cloudflare Pages.", {
    status: 500,
    headers: {
      "content-type": "text/plain; charset=utf-8"
    }
  });
}

export async function onRequestGet({ request, env }) {
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return missingEnvironmentResponse();
  }

  const stateBytes = new Uint8Array(16);
  crypto.getRandomValues(stateBytes);
  const state = Array.from(stateBytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  const url = new URL(request.url);
  const callbackUrl = new URL("/api/auth/callback", url.origin);
  const authorizeUrl = new URL(githubAuthorizeUrl);

  authorizeUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  authorizeUrl.searchParams.set("redirect_uri", callbackUrl.toString());
  authorizeUrl.searchParams.set("scope", "repo");
  authorizeUrl.searchParams.set("state", state);

  return new Response(null, {
    status: 302,
    headers: {
      location: authorizeUrl.toString(),
      "set-cookie": `decap_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
    }
  });
}
