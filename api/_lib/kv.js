// api/_lib/kv.js
// Redis client powered by Upstash (recommended Vercel storage partner).
// Falls back to a full in-memory store for local `vercel dev` without env vars.
//
// Required Vercel environment variables (set in Vercel project dashboard):
//   UPSTASH_REDIS_REST_URL   — e.g. https://xxx.upstash.io
//   UPSTASH_REDIS_REST_TOKEN — your Upstash REST token
//
// To create a free Upstash Redis database:
//   1. Go to https://upstash.com → Create Database (free tier)
//   2. Copy REST URL + REST token
//   3. Add them to your Vercel project: Settings → Environment Variables

let _redisClient = null;
const _memStore = {};
const _lists = {};
const _hashes = {};

// ── In-memory fallback (mirrors Upstash Redis API surface) ──────────────────
const memKV = {
  async get(key) {
    return _memStore[key] ?? null;
  },
  async set(key, value, opts) {
    _memStore[key] = value;
    return "OK";
  },
  async del(...keys) {
    let count = 0;
    keys.flat().forEach((k) => { if (k in _memStore) { delete _memStore[k]; count++; } });
    return count;
  },
  async keys(pattern) {
    const regex = new RegExp("^" + pattern.replace(/\?/g, ".").replace(/\*/g, ".*") + "$");
    return [...Object.keys(_memStore), ...Object.keys(_lists), ...Object.keys(_hashes)]
      .filter((k, i, a) => a.indexOf(k) === i)
      .filter((k) => regex.test(k));
  },
  async lpush(key, ...values) {
    if (!_lists[key]) _lists[key] = [];
    _lists[key].unshift(...values.flat());
    return _lists[key].length;
  },
  async lrange(key, start, stop) {
    const list = _lists[key] || [];
    if (stop === -1) return list.slice(start);
    return list.slice(start, stop + 1);
  },
  async llen(key) {
    return (_lists[key] || []).length;
  },
  async lset(key, index, value) {
    if (!_lists[key]) throw new Error("ERR no such key");
    _lists[key][index] = value;
    return "OK";
  },
  async lindex(key, index) {
    return (_lists[key] || [])[index] ?? null;
  },
  async incr(key) {
    _memStore[key] = Number(_memStore[key] || 0) + 1;
    return _memStore[key];
  },
  async hset(key, fieldOrObj, value) {
    if (!_hashes[key]) _hashes[key] = {};
    if (typeof fieldOrObj === "object") {
      Object.assign(_hashes[key], fieldOrObj);
      return Object.keys(fieldOrObj).length;
    }
    _hashes[key][fieldOrObj] = value;
    return 1;
  },
  async hget(key, field) {
    return (_hashes[key] || {})[field] ?? null;
  },
  async hgetall(key) {
    return _hashes[key] ? { ..._hashes[key] } : null;
  },
  async expire(key, seconds) {
    // TTL not tracked in memory fallback — silently accepted
    return 1;
  },
};

// ── Upstash Redis client ─────────────────────────────────────────────────────
async function buildUpstashClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;

  try {
    const { Redis } = await import("@upstash/redis");
    return new Redis({ url, token });
  } catch (e) {
    console.warn("[KV] @upstash/redis import failed:", e.message);
    return null;
  }
}

// ── Public API ───────────────────────────────────────────────────────────────
export async function getKV() {
  if (_redisClient) return _redisClient;

  const upstash = await buildUpstashClient();
  if (upstash) {
    console.info("[KV] Connected to Upstash Redis");
    _redisClient = upstash;
    return _redisClient;
  }

  console.info("[KV] No UPSTASH_REDIS_REST_URL — using in-memory fallback (resets on restart)");
  _redisClient = memKV;
  return _redisClient;
}
