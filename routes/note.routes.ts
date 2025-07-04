import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import Note from '../models/note.model';
import { asyncHandler } from '../utils/asyncHandler'; // 👈 Import the wrapper

const router = express.Router();

// GET all notes for logged-in user
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json(notes);
}));

// POST new note
router.post('/', authMiddleware, asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const note = await Note.create({ title, content, user: req.userId });
  res.status(201).json(note);
}));

// PUT update note
router.put('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const note = await Note.findOneAndUpdate(
    { _id: id, user: req.userId },
    { title, content },
    { new: true }
  );

  if (!note) return res.status(404).json({ message: 'Note not found' });

  res.json(note);
}));

// DELETE note
router.delete('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await Note.findOneAndDelete({ _id: id, user: req.userId });

  if (!result) return res.status(404).json({ message: 'Note not found' });

  res.json({ message: 'Note deleted' });
}));

export default router;
