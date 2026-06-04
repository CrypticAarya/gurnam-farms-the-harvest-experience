// Minimal structured logger with PII-safe sanitization
type Meta = Record<string, any> | undefined;

function maskEmail(v: string) {
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

function maskPhone(v: string) {
  const digits = v.replace(/\D/g, "");
  if (!digits) return "***";
  if (digits.length <= 4) return `***${digits}`;
  return `***${digits.slice(-4)}`;
}

function maskId(v: string) {
  if (typeof v !== "string") return "***";
  if (v.length <= 10) return "***";
  return `${v.slice(0, 6)}...${v.slice(-4)}`;
}

function sanitizeValue(key: string | undefined, value: any): any {
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
    // Truncate long strings
    if (value.length > 200) return `${value.slice(0, 200)}...`;
    return value;
  }
  return value;
}

function sanitizeObject(obj: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    try {
      out[key] = sanitizeValue(key, obj[key]);
    } catch {
      out[key] = "[UNSERIALIZABLE]";
    }
  }
  return out;
}

function safeMeta(meta?: Meta) {
  if (!meta) return undefined;
  try {
    if (typeof meta === "object") return sanitizeObject(meta as Record<string, any>);
    return meta;
  } catch {
    return undefined;
  }
}

function safeLog(level: "info" | "warn" | "error", msg: string, meta?: Meta) {
  const timestamp = new Date().toISOString();
  const safe = safeMeta(meta);
  const out = safe ? [ `[${timestamp}] ${level.toUpperCase()} ${msg}`, safe ] : `[${timestamp}] ${level.toUpperCase()} ${msg}`;
  if (level === "info") console.log(...(Array.isArray(out) ? out : [out]));
  if (level === "warn") console.warn(...(Array.isArray(out) ? out : [out]));
  if (level === "error") console.error(...(Array.isArray(out) ? out : [out]));
}

export const logger = {
  info: (msg: string, meta?: Meta) => safeLog("info", msg, meta),
  warn: (msg: string, meta?: Meta) => safeLog("warn", msg, meta),
  error: (msg: string, meta?: Meta) => safeLog("error", msg, meta),
};

export default logger;
