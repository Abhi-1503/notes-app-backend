"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const note_model_1 = __importDefault(require("../models/note.model"));
const asyncHandler_1 = require("../utils/asyncHandler"); // 👈 Import the wrapper
const router = express_1.default.Router();
// GET all notes for logged-in user
router.get('/', auth_middleware_1.authMiddleware, (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const notes = await note_model_1.default.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(notes);
}));
// POST new note
router.post('/', auth_middleware_1.authMiddleware, (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { title, content } = req.body;
    const note = await note_model_1.default.create({ title, content, user: req.userId });
    res.status(201).json(note);
}));
// PUT update note
router.put('/:id', auth_middleware_1.authMiddleware, (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const note = await note_model_1.default.findOneAndUpdate({ _id: id, user: req.userId }, { title, content }, { new: true });
    if (!note)
        return res.status(404).json({ message: 'Note not found' });
    res.json(note);
}));
// DELETE note
router.delete('/:id', auth_middleware_1.authMiddleware, (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const result = await note_model_1.default.findOneAndDelete({ _id: id, user: req.userId });
    if (!result)
        return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted' });
}));
exports.default = router;
