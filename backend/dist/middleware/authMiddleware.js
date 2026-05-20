"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const apiResponse_1 = require("../utils/apiResponse");
const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            (0, apiResponse_1.sendError)(res, "No token provided, access denied", 401);
            return;
        }
        const token = authHeader.split(" ")[1];
        const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    }
    catch (error) {
        (0, apiResponse_1.sendError)(res, "Invalid or expired token", 400);
    }
};
exports.protect = protect;
const adminOnly = (req, res, next) => {
    if (req.user?.role !== "admin") {
        (0, apiResponse_1.sendError)(res, "Access denied. Admins only.", 403);
        return;
    }
    next();
};
exports.adminOnly = adminOnly;
