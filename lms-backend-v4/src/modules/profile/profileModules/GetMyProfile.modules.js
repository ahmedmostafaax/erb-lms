import catchError from "../../../middleware/catchError.js";

const getMyProfile = catchError(async (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      phone: req.user.phone,
      age: req.user.age,
      avatarUrl: req.user.avatarUrl,
      profile: req.user.profile,
    },
  });
});

export default getMyProfile;
