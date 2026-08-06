import User from "../../../../database/models/user.model.js";
import catchError from "../../../middleware/catchError.js";

const updateProfile = catchError(async (req, res, next) => {
  const allowedFields = [
    "bio",
    "cvUrl",
    "linkedinUrl",
    "portfolioUrl",
    "specialties",
    "experienceYears",
    "education",
    "certifications",
  ];
  const updateData = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[`profile.${field}`] = req.body[field];
    }
  });

  if (req.body.age !== undefined) {
    updateData.age = Number(req.body.age);
  }

  const user = await User.findByIdAndUpdate(req.user._id, { $set: updateData }, { new: true }).populate(
    "profile.specialties",
    "name slug"
  );

  res.status(200).json({ status: "success", data: user.profile });
});

export default updateProfile;
