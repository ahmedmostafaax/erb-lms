import User from "../../../../database/models/user.model.js";
import catchError from "../../../middleware/catchError.js";

const searchInstructors = catchError(async (req, res) => {
  const q = (req.query.q || "").toString().trim();
  if (!q) {
    return res.json({ status: "success", results: 0, data: [] });
  }
  const users = await User.find({
    role: { $in: ["instructor", "admin"] },
    name: { $regex: q, $options: "i" },
  })
    .select("name avatarUrl profile.bio profile.experienceYears")
    .limit(20);
  res.json({ status: "success", results: users.length, data: users });
});

export default searchInstructors;
