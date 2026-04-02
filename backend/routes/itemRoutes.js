const express = require("express");
const router = express.Router();

const { createItem } = require("../controllers/itemController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload"); // multer

// ✅ THIS IS THE IMPORTANT LINE
router.post(
  "/",
  authMiddleware,
  upload.single("image"),   // MUST match Postman key
  createItem
);

module.exports = router;