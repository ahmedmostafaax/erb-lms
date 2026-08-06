import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectDB from "./database/config/db.js";
import bootstrap from "./src/modules/index.routes.js";

const app = express();

connectDB();

app.set("trust proxy", 1);
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "fail", message: "عدد الطلبات تجاوز الحد المسموح، حاول تاني بعد شوية" },
});
app.use("/api", limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "fail", message: "محاولات كثيرة على تسجيل الدخول، استنى شوية" },
});
app.use("/api/auth", authLimiter);

app.get("/health", (req, res) =>
  res.json({ status: "ok", time: new Date().toISOString() })
);

bootstrap(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
