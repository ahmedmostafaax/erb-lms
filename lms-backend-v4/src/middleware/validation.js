const validation = (schema) => (req, res, next) => {
  const dataToValidate = { ...req.body, ...req.params, ...req.query };
  const { error } = schema.validate(dataToValidate, { abortEarly: false });

  if (error) {
    const messages = error.details.map((detail) => detail.message);
    return res.status(400).json({ status: "fail", message: messages });
  }

  next();
};

export default validation;
