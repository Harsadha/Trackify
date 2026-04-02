// routes>itemRoutes.js

const express = require("express");
const router = express.Router();

const {
  createItem,
  getItems,
  getMyItems,
  getItemById,
  updateStatus,
  deleteItem
} = require("../controllers/itemController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// CREATE
router.post("/", authMiddleware, upload.single("image"), createItem);

// GET MY ITEMS
router.get("/my", authMiddleware, getMyItems);


// GET ALL
router.get("/", getItems);

// GET ONE
router.get("/:id", getItemById);

// UPDATE STATUS
router.patch("/:id/status", authMiddleware, updateStatus);

// DELETE
router.delete("/:id", authMiddleware, deleteItem);

module.exports = router;