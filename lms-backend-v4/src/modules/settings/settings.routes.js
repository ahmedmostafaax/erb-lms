import express from "express";
const router = express.Router();

import validation from "../../middleware/validation.js";
import { protect } from "../../middleware/auth.js";
import {
  updatePersonalDataSchema,
  changePasswordSchema,
  updateSettingsSchema,
} from "./settings.validation.js";

import updatePersonalData from "./settingsModules/UpdatePersonalData.modules.js";
import changePassword from "./settingsModules/ChangePassword.modules.js";
import updateSettings from "./settingsModules/UpdateSettings.modules.js";

router.use(protect); // كل حاجة هنا محتاجة تسجيل دخول

router.put("/personal-data", validation(updatePersonalDataSchema), updatePersonalData);
router.put("/change-password", validation(changePasswordSchema), changePassword);
router.put("/preferences", validation(updateSettingsSchema), updateSettings);

export default router;