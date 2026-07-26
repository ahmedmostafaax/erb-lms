import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectDB from "./database/config/db.js";
import bootstrap from "./src/modules/index.routes.js";

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 300, // 300 طلب لكل IP كل 15 دقيقة
  message: { status: "fail", message: "عدد الطلبات تجاوز الحد المسموح، حاول تاني بعد شوية" },
});
app.use("/api", limiter);

app.get("/health", (req, res) => res.json({ status: "ok" }));

bootstrap(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));