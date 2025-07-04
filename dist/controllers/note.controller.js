"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNote = exports.updateNote = exports.createNote = exports.getNotes = void 0;
const note_model_1 = __importDefault(require("../models/note.model"));
const getNotes = async (req, res) => {
    try {
        const notes = await note_model_1.default.find({ user: req.userId }).sort({ updatedAt: -1 });
        res.status(200).json(notes);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch notes' });
    }
};
exports.getNotes = getNotes;
const createNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        const note = new note_model_1.default({ title, content, user: req.userId });
        await note.save();
        res.status(201).json(note);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to create note' });
    }
};
exports.createNote = createNote;
const updateNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        const note = await note_model_1.default.findOneAndUpdate({ _id: req.params.id, user: req.userId }, { title, content }, { new: true });
        if (!note) {
            res.status(404).json({ message: 'Note not found' });
            return;
        }
        res.status(200).json(note);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to update note' });
    }
};
exports.updateNote = updateNote;
const deleteNote = async (req, res) => {
    try {
        const note = await note_model_1.default.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!note) {
            res.status(404).json({ message: 'Note not found' });
            return;
        }
        res.status(200).json({ message: 'Note deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to delete note' });
    }
};
exports.deleteNote = deleteNote;
