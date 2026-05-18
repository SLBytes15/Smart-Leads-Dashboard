import { Response } from 'express';
import { UnknownFieldInstance } from 'express-validator/lib/base';

export const sendSuccess = (
    res: Response,
    data: unknown,
    message = ' success',
    statusCode = 200
) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

export const sendError = (
    res: Response,
  message = 'Something went wrong',
  statusCode = 500
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
};
