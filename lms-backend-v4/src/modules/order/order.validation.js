import Joi from "joi";

export const createOrderSchema = Joi.object({
  courseId: Joi.string().hex().length(24).required(),
});

export const orderIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const payOrderSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
  method: Joi.string().valid("card", "wallet", "kiosk").required(),
  mobileNumber: Joi.string()
    .pattern(/^01[0125][0-9]{8}$/)
    .when("method", { is: "wallet", then: Joi.required(), otherwise: Joi.optional() }),
});