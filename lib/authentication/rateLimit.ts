import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const rateLimit = async (
  key: string,
  limit = 3,
  windowSeconds = 60
) => {
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, windowSeconds);
  }

  if (current > limit) {
    throw new Error("Too many requests. Please try again later.");
  }

  return {
    allowed: true,
    remaining: Math.max(0, limit - current),
  };
};
