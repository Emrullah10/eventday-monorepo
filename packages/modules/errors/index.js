export class AppError extends Error {
  constructor(message, { status = 500, code = 'INTERNAL_ERROR' } = {}) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.code = code;
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, { status: 400, code: 'VALIDATION_ERROR' });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, { status: 401, code: 'UNAUTHORIZED' });
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, { status: 403, code: 'FORBIDDEN' });
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not found') {
    super(message, { status: 404, code: 'NOT_FOUND' });
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, { status: 409, code: 'CONFLICT' });
  }
}

/**
 * Express error-handling middleware. AppError instances are trusted and their
 * status/message are sent as-is; anything else is an unexpected bug so only a
 * generic 500 body is sent to the client (the real error is still logged).
 */
export const handleErrors = (err, req, res, _next) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({ message: err.message, code: err.code });
  }
  console.error(err);
  return res.status(500).json({ message: 'Internal server error', code: 'INTERNAL_ERROR' });
};
