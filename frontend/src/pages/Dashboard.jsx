import React, { useState, useEffect } from "react";
import { FaPlus, FaTag, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import logo from "./logo.png";

const Dashboard = () => {
  const navigate = useNavigate();

  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));

  const userId = user?._id || user?.id || "";

  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [editNoteId, setEditNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    if (!userId) return navigate("/login");
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`https://note-taking-app-wciw.onrender.com/api/notes/${userId}`);
      setNotes(res.data);
      setFilteredNotes(res.data);
      const uniqueTags = Array.from(new Set(res.data.flatMap(note => note.tags)));
      setAllTags(uniqueTags);
    } catch (err) {
      toast.error("Failed to fetch notes");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const openModal = (note = null) => {
    if (note) {
      setEditNoteId(note._id);
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags);
    } else {
      setEditNoteId(null);
      setTitle("");
      setContent("");
      setTags([]);
    }
    setIsOpen(true);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (removeIndex) => {
    setTags(tags.filter((_, i) => i !== removeIndex));
  };

  const saveNote = async () => {
    const payload = { title, content, tags, userId };
    try {
      if (editNoteId) {
        await axios.put(`https://note-taking-app-wciw.onrender.com/api/notes/${editNoteId}`, payload);
        toast.success("Note updated");
      } else {
        await axios.post("https://note-taking-app-wciw.onrender.com/api/notes/create", payload);
        toast.success("Note created");
      }
      setIsOpen(false);
      fetchNotes();
    } catch (err) {
      toast.error("Failed to save note");
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await axios.delete(`https://note-taking-app-wciw.onrender.com/api/notes/${id}`);
      toast.success("Note deleted");
      fetchNotes();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = notes.filter(note =>
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      note.tags.some(tag => tag.toLowerCase().includes(query))
    );
    setFilteredNotes(filtered);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative">
      <Toaster position="top-right" />

      {/* Top Bar */}
      <header className="flex justify-between items-center px-4 py-3 shadow-md bg-white sticky top-0 z-10">
        <img src={logo} alt="Logo" className="h-10 w-auto" />
        <button onClick={handleLogout} className="text-sm text-blue-600 hover:underline">
          Sign Out
        </button>
      </header>

      {/* Welcome Section */}
      {!notes.length && (
        <div className="p-6">
          <div className="bg-white shadow-md rounded-lg p-6 text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-2">Welcome, {user?.name}!</h2>
            <p className="text-gray-600 mb-2">
              Click the button below to get started by creating your first note.
            </p>
            <p className="text-gray-500 text-sm mb-4">Email: {user?.email}</p>
            <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700">
              Create Note
            </button>
          </div>
        </div>
      )}

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 px-6 py-3">
          {allTags.map((tag, idx) => (
            <button
              key={idx}
              onClick={() => handleSearch({ target: { value: tag } })}
              className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs hover:bg-blue-200"
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Notes Grid */}
      {filteredNotes.length > 0 && (
        <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6">
          {filteredNotes.map((note) => (
            <div key={note._id} className="border p-4 rounded-lg shadow-md bg-white">
              <h2 className="font-semibold text-lg mb-1">{note.title}</h2>
              <p className="text-sm text-gray-700 mb-2 line-clamp-4">{note.content}</p>
              <div className="flex flex-wrap gap-1">
                {note.tags.map((tag, i) => (
                  <span key={i} className="bg-blue-100 text-blue-600 px-2 py-1 text-xs rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-end mt-3 gap-3">
                <button onClick={() => openModal(note)} className="text-green-600"><FaEdit /></button>
                <button onClick={() => deleteNote(note._id)} className="text-red-600"><FaTrash /></button>
              </div>
            </div>
          ))}
        </main>
      )}

      {/* Floating Create Button */}
      {notes.length > 0 && (
        <button
          onClick={() => openModal()}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
        >
          <FaPlus />
        </button>
      )}

      {/* Note Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="fixed inset-0 flex justify-center items-center p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white max-w-xl w-full p-6 rounded-lg shadow space-y-4"
          >
            <Dialog.Title className="text-xl font-bold">
              {editNoteId ? "Edit Note" : "Create Note"}
            </Dialog.Title>

            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="peer w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter title"
              />
            </div>

            <div className="relative">
              <textarea
                rows="4"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="peer w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter content"
              />
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Add Tag"
                className="border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded w-full"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
              />
              <button onClick={handleAddTag} className="bg-blue-600 text-white px-3 py-2 rounded">
                <FaTag />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 text-sm rounded-full flex items-center gap-1">
                  #{tag}
                  <FaTimes className="cursor-pointer" onClick={() => removeTag(index)} />
                </span>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setIsOpen(false)} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button onClick={saveNote} className="bg-blue-600 text-white px-4 py-2 rounded">
                {editNoteId ? "Update" : "Create"}
              </button>
            </div>
          </motion.div>
        </div>
      </Dialog>
    </div>
  );
};

export default Dashboard;
