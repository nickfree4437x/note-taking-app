const Note = require("../models/Note");

exports.createNote = async (req, res) => {
  const { title, content, tags, userId } = req.body;
  if (!title || !userId) return res.status(400).json({ message: "Missing fields" });

  try {
    const note = await Note.create({ title, content, tags, user: userId });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: "Failed to create note", error: err.message });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notes" });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const updated = await Note.findByIdAndUpdate(req.params.noteId, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update note" });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.noteId);
    res.status(200).json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete note" });
  }
};
