const MAX_BODY_BYTES = 15_000;

export class RequestBodyError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// Count bytes while reading: Content-Length can be missing or dishonest.
export async function readRegistrationBody(request) {
  if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES) {
    throw new RequestBodyError('Request too large', 413);
  }
  if (!request.body) throw new RequestBodyError('Invalid request', 400);

  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new RequestBodyError('Request too large', 413);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  } catch {
    throw new RequestBodyError('Invalid JSON', 400);
  }
}

// A bounded, per-process guard. Production proxies must overwrite client IP headers.
export function createRegistrationRateLimiter({
  windowMs = 15 * 60 * 1000,
  maxAttempts = 5,
  maxClients = 5_000,
  now = Date.now
} = {}) {
  const attempts = new Map();
  return (ip) => {
    const time = now();
    const current = attempts.get(ip);
    if (current && time < current.expiresAt) {
      if (current.count >= maxAttempts) return true;
      current.count += 1;
      return false;
    }
    if (attempts.size >= maxClients) {
      for (const [key, entry] of attempts) {
        if (time >= entry.expiresAt) attempts.delete(key);
      }
      // Fail closed instead of growing the map or evicting active limits.
      if (attempts.size >= maxClients) return true;
    }
    attempts.set(ip, { count: 1, expiresAt: time + windowMs });
    return false;
  };
}
