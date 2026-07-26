import redis from "../config/redis.js";

const clearCache = async (prefix) => {
  const keys = await redis.keys(`${prefix}:*`);
  if (keys.length) await redis.del(keys);
};

export default clearCache;