export function getHealth(_req, res) {
  res.json({
    status: "ok",
    service: "newhr-backend",
    timestamp: new Date().toISOString()
  });
}
