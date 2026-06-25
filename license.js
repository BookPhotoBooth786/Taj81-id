// Netlify Function: license verification + device binding
// Uses Netlify Blobs as a tiny free database.
import { getStore } from "@netlify/blobs";

const ADMIN_PASSWORD = process.env.TAJ_ADMIN_PASSWORD || "changeme123";

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
  });
}

function randomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no confusing chars
  let out = "";
  for (let i = 0; i < 12; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out; // 12 chars, displayed as XXXX-XXXX-XXXX
}

export default async (req) => {
  if (req.method === "OPTIONS") return json({});

  const store = getStore("taj_licenses");

  let payload = {};
  try { payload = await req.json(); } catch (e) {}

  const action = payload.action || "verify";

  // ---------- ADMIN ACTIONS ----------
  if (action === "admin") {
    if (payload.password !== ADMIN_PASSWORD) {
      return json({ ok: false, error: "bad_password" }, 401);
    }
    const cmd = payload.cmd;

    if (cmd === "generate") {
      const code = randomCode();
      const rec = {
        code,
        device: null,
        disabled: false,
        note: payload.note || "",
        created: new Date().toISOString(),
        activatedAt: null,
      };
      await store.setJSON(code, rec);
      return json({ ok: true, code });
    }

    if (cmd === "list") {
      const { blobs } = await store.list();
      const items = [];
      for (const b of blobs) {
        const rec = await store.get(b.key, { type: "json" });
        if (rec) items.push(rec);
      }
      items.sort((a, b) => (b.created || "").localeCompare(a.created || ""));
      return json({ ok: true, items });
    }

    if (cmd === "disable" || cmd === "enable") {
      const rec = await store.get(payload.code, { type: "json" });
      if (!rec) return json({ ok: false, error: "not_found" });
      rec.disabled = cmd === "disable";
      await store.setJSON(payload.code, rec);
      return json({ ok: true });
    }

    if (cmd === "reset_device") {
      const rec = await store.get(payload.code, { type: "json" });
      if (!rec) return json({ ok: false, error: "not_found" });
      rec.device = null;
      rec.activatedAt = null;
      await store.setJSON(payload.code, rec);
      return json({ ok: true });
    }

    if (cmd === "delete") {
      await store.delete(payload.code);
      return json({ ok: true });
    }

    return json({ ok: false, error: "unknown_cmd" });
  }

  // ---------- CUSTOMER VERIFY ----------
  const code = (payload.code || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const device = payload.device || "";

  if (!code || !device) return json({ ok: false, error: "invalid" });

  const rec = await store.get(code, { type: "json" });
  if (!rec) return json({ ok: false, error: "invalid" });
  if (rec.disabled) return json({ ok: false, error: "disabled" });

  // first activation: bind this device
  if (!rec.device) {
    rec.device = device;
    rec.activatedAt = new Date().toISOString();
    await store.setJSON(code, rec);
    return json({ ok: true });
  }

  // already bound: must match
  if (rec.device === device) {
    return json({ ok: true });
  }
  return json({ ok: false, error: "device_mismatch" });
};
