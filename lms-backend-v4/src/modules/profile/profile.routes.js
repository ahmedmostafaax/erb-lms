import express from "express";
const router = express.Router();

import validation from "../../middleware/validation.js";
import { protect } from "../../middleware/auth.js";
import { uploadImage, uploadDocument } from "../../middleware/uploadMiddleware.js";
import { updateProfileSchema, userIdSchema } from "./profile.validation.js";

import getDashboard from "./profileModules/GetDashboard.modules.js";
import updateProfile from "./profileModules/UpdateProfile.modules.js";
import getPublicProfile from "./profileModules/GetPublicProfile.modules.js";
import updateAvatar from "./profileModules/UpdateAvatar.modules.js";
import updateCv from "./profileModules/UpdateCv.modules.js";
import getInstructor from "./profileModules/GetInstructor.modules.js";
import searchInstructors from "./profileModules/SearchInstructors.modules.js";
import getMyProfile from "./profileModules/GetMyProfile.modules.js";

router.get("/search-instructors", searchInstructors);
router.get("/instructors/:id", getInstructor);

router.get("/me", protect, getMyProfile);
router.get("/me/dashboard", protect, getDashboard);
router.put("/me", protect, validation(updateProfileSchema), updateProfile);
router.patch("/me/avatar", protect, uploadImage.single("avatar"), updateAvatar);
router.patch("/me/cv", protect, uploadDocument.single("cv"), updateCv);

router.get("/:id", validation(userIdSchema), getPublicProfile);

export default router;
