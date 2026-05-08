const fileUrl = (file) => {
  if (!file) return "";
  if (file.buffer) {
    return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  }
  return `/uploads/${file.filename}`;
};

module.exports = fileUrl;
