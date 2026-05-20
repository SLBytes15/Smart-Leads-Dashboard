"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const apiResponse_1 = require("../utils/apiResponse");
// ─── REGISTER ───────────────────────────────────────────
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            (0, apiResponse_1.sendError)(res, "User already exists with this email", 400);
            return;
        }
        // Hash the password (never store plain text passwords!)
        // 10 = salt rounds, higher = more secure but slower
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Create user in DB
        const user = await User_1.default.create({
            name,
            email,
            password: hashedPassword,
            role: role || "sales", // default to sales if not provided
        });
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, // payload (stored inside token)
        process.env.JWT_SECRET, // secret key
        { expiresIn: "7d" });
        (0, apiResponse_1.sendSuccess)(res, {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        }, "User registered successfully", 201);
    }
    catch (error) {
        (0, apiResponse_1.sendError)(res, "Registration failed", 500);
    }
};
exports.register = register;
// ─── LOGIN ──────────────────────────────────────────────
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = await User_1.default.findOne({ email });
        if (!user) {
            (0, apiResponse_1.sendError)(res, "Invalid email or password", 401);
            return;
        }
        // Compare entered password with hashed password in DB
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            (0, apiResponse_1.sendError)(res, "Invalid email or password", 401);
            return;
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        (0, apiResponse_1.sendSuccess)(res, {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        }, "Login successful");
    }
    catch (error) {
        (0, apiResponse_1.sendError)(res, "Login failed", 500);
    }
};
exports.login = login;
