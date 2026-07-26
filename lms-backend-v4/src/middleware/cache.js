import redis from "../config/redis.js";

// استخدامها: router.get("/", cache("courses", 300), getCourses)  → كاش 5 دقايق
const cache = (keyPrefix, ttlSeconds = 300) => async (req, res, next) => {
  const cacheKey = `${keyPrefix}:${JSON.stringify(req.query)}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }
  } catch (err) {
    console.error("Cache read error:", err.message);
  }

  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode === 200) {
      redis.set(cacheKey, JSON.stringify(body), "EX", ttlSeconds).catch((err) =>
        console.error("Cache write error:", err.message)
      );
    }
    return originalJson(body);
  };

  next();
};

export default cache;