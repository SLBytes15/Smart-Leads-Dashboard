"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, data, message = ' success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};
exports.sendSuccess = sendSuccess;
const sendError = (res, message = 'Something went wrong', statusCode = 500) => {
    return res.status(statusCode).json({
        success: false,
        message,
        data: null,
    });
};
exports.sendError = sendError;
