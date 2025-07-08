const express = require("express");
const router = express.Router();
const {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");

router.post("/create", createNote);
router.get("/:userId", getNotes);
router.put("/:noteId", updateNote);
router.delete("/:noteId", deleteNote);

module.exports = router;
