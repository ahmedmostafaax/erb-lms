const slugify = (text) => {
  return (
    text
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\u0621-\u064Aa-z0-9-]/g, "") +
    "-" +
    Date.now().toString().slice(-5)
  );
};

export default slugify;
