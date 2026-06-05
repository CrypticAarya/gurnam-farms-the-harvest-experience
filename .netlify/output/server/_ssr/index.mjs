let lastCapturedError;
const TTL_MS = 5e3;
function record(error) {
  lastCapturedError = { error, at: Date.now() };
}
if (typeof globalThis.addEventListener === "function") {
  globalThis.addEventListener("error", (event) => record(event.error ?? event));
  globalThis.addEventListener(
    "unhandledrejection",
    (event) => record(event.reason)
  );
}
function consumeLastCapturedError() {
  if (!lastCapturedError) return void 0;
  if (Date.now() - lastCapturedError.at > TTL_MS) {
    lastCapturedError = void 0;
    return void 0;
  }
  const { error } = lastCapturedError;
  lastCapturedError = void 0;
  return error;
}
function renderErrorPage() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
function maskEmail(v) {
  try {
    const parts = v.split("@");
    if (parts.length !== 2) return "***";
    const local = parts[0];
    const domain = parts[1];
    const visible = local.slice(0, Math.min(2, local.length));
    return `${visible}***@${domain}`;
  } catch {
    return "***";
  }
}
function maskPhone(v) {
  const digits = v.replace(/\D/g, "");
  if (!digits) return "***";
  if (digits.length <= 4) return `***${digits}`;
  return `***${digits.slice(-4)}`;
}
function maskId(v) {
  if (typeof v !== "string") return "***";
  if (v.length <= 10) return "***";
  return `${v.slice(0, 6)}...${v.slice(-4)}`;
}
function sanitizeValue(key, value) {
  if (value == null) return value;
  if (Array.isArray(value)) return value.map((v) => sanitizeValue(key, v));
  if (typeof value === "object") return sanitizeObject(value);
  if (typeof value === "string") {
    const k = (key || "").toLowerCase();
    if (k.includes("email") || k === "to" || /@/.test(value)) return maskEmail(value);
    if (k.includes("phone") || k.includes("tel") || /^(\+?\d[\d\-() ]{3,})$/.test(value)) return maskPhone(value);
    if (k.includes("address")) return "[REDACTED_ADDRESS]";
    if (k.includes("name") || k.includes("full_name")) return "[REDACTED_NAME]";
    if (k.includes("id") || k.includes("uid") || k.includes("uuid")) return maskId(value);
    if (value.length > 200) return `${value.slice(0, 200)}...`;
    return value;
  }
  return value;
}
function sanitizeObject(obj) {
  const out = {};
  for (const key of Object.keys(obj)) {
    try {
      out[key] = sanitizeValue(key, obj[key]);
    } catch {
      out[key] = "[UNSERIALIZABLE]";
    }
  }
  return out;
}
function safeMeta(meta) {
  if (!meta) return void 0;
  try {
    if (typeof meta === "object") return sanitizeObject(meta);
    return meta;
  } catch {
    return void 0;
  }
}
function safeLog(level, msg, meta) {
  const timestamp = (/* @__PURE__ */ new Date()).toISOString();
  const safe = safeMeta(meta);
  const out = safe ? [`[${timestamp}] ${level.toUpperCase()} ${msg}`, safe] : `[${timestamp}] ${level.toUpperCase()} ${msg}`;
  if (level === "info") console.log(...Array.isArray(out) ? out : [out]);
  if (level === "warn") console.warn(...Array.isArray(out) ? out : [out]);
  if (level === "error") console.error(...Array.isArray(out) ? out : [out]);
}
const logger = {
  info: (msg, meta) => safeLog("info", msg, meta),
  warn: (msg, meta) => safeLog("warn", msg, meta),
  error: (msg, meta) => safeLog("error", msg, meta)
};
let serverEntryPromise;
async function getServerEntry() {
  if (!serverEntryPromise) {
    serverEntryPromise = import("./server-DAhxmYZq.mjs").then((n) => n.s).then(
      (m) => m.default ?? m
    );
  }
  return serverEntryPromise;
}
async function normalizeCatastrophicSsrResponse(response) {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;
  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }
  logger.error("SSR swallowed error", { err: String(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`)) });
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" }
  });
}
const server = {
  async fetch(request, env, ctx) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      logger.error("Unhandled server error", { err: String(error) });
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" }
      });
    }
  }
};
export {
  server as default,
  logger as l,
  renderErrorPage as r
};
