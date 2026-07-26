// دالة مساعدة بنستخدمها في أكتر من مكان (Course, Modules, Lessons) عشان مانكررش نفس المنطق
const checkOwnership = (ownerId, user) => {
  return ownerId.toString() === user._id.toString() || user.role === "admin";
};

export default checkOwnership;