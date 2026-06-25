export function uploadImage(req, res) {
  if (!req.file) {
    res.status(400).json({ success: false, error: "Image file is required" });
    return;
  }

  const baseUrl = `https://api.eventmax.in`;
  const url = `${baseUrl}/uploads/${req.file.filename}`;

  res.status(201).json({
    success: true,
    file: {
      filename: req.file.filename,
      url
    }
  });
}
