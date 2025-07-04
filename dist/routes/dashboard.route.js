"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.get('/dashboard', auth_middleware_1.authMiddleware, (req, res) => {
    res.status(200).json({ message: 'Welcome to your notes dashboard!' });
});
exports.default = router;
