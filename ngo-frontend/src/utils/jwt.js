function base64UrlDecode(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return decodeURIComponent(
    atob(padded)
      .split("")
      .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
      .join(""),
  );
}

export function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(base64UrlDecode(payload));
  } catch {
    return null;
  }
}

export function createDemoToken({ email, name, role }) {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  const payload = btoa(JSON.stringify({ sub: email, email, name, role, exp: Math.floor(Date.now() / 1000) + 86400 }))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return `${header}.${payload}.demo-signature`;
}
