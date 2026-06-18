import { PassRequest } from "../models/PassRequest.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getPassRequests = asyncHandler(async (_req, res) => {
  const passes = await PassRequest.find().sort({ createdAt: -1 });
  res.json({ success: true, passes });
});

export const updatePassRequest = asyncHandler(async (req, res) => {
  const pass = await PassRequest.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!pass) {
    res.status(404).json({ success: false, error: "Pass request not found" });
    return;
  }

  res.json({ success: true, pass });
});

export const deletePassRequest = asyncHandler(async (req, res) => {
  const pass = await PassRequest.findByIdAndDelete(req.params.id);
  if (!pass) {
    res.status(404).json({ success: false, error: "Pass request not found" });
    return;
  }
  res.json({ success: true });
});
