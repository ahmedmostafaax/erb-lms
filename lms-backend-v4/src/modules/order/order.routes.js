import express from "express";
const router = express.Router();

import validation from "../../middleware/validation.js";
import { protect } from "../../middleware/auth.js";
import { createOrderSchema, orderIdSchema, payOrderSchema } from "./order.validation.js";

import createOrder from "./orderModules/CreateOrder.modules.js";
import payOrder from "./orderModules/PayOrder.modules.js";
import getMyOrders from "./orderModules/GetMyOrders.modules.js";
import getOrder from "./orderModules/GetOrder.modules.js";
import paymobWebhook from "./orderModules/PaymobWebhook.modules.js";

router.post("/webhook/paymob", paymobWebhook); // من غير protect، Paymob هو اللي بينادي عليه مش المستخدم

router.use(protect);
router.post("/", validation(createOrderSchema), createOrder);
router.get("/my", getMyOrders);
router.get("/:id", validation(orderIdSchema), getOrder);
router.post("/:id/pay", validation(payOrderSchema), payOrder);

export default router;