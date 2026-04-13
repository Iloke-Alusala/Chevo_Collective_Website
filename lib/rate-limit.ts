type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

declare global {
  var __chevoRateLimitStore: Map<string, RateLimitEntry> | undefined;
}

function getRateLimitStore() {
  if (!globalThis.__chevoRateLimitStore) {
    globalThis.__chevoRateLimitStore = new Map<string, RateLimitEntry>();
  }

  return globalThis.__chevoRateLimitStore;
}

function cleanupExpiredEntries(store: Map<string, RateLimitEntry>, now: number) {
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}

export function checkRateLimit({
  key,
  limit,
  windowMs,
}: RateLimitOptions): RateLimitResult {
  const store = getRateLimitStore();
  const now = Date.now();

  cleanupExpiredEntries(store, now);

  const currentEntry = store.get(key);

  if (!currentEntry || currentEntry.resetAt <= now) {
    store.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });

    return {
      allowed: true,
      remaining: Math.max(limit - 1, 0),
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    };
  }

  currentEntry.count += 1;
  store.set(key, currentEntry);

  return {
    allowed: currentEntry.count <= limit,
    remaining: Math.max(limit - currentEntry.count, 0),
    retryAfterSeconds: Math.max(
      Math.ceil((currentEntry.resetAt - now) / 1000),
      1,
    ),
  };
}
