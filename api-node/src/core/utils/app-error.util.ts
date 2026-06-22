export class AppError extends Error {
	constructor(
		public message: string,
		public statusCode: number,
		public isOperational = true,
	) {
		super(message);
		Object.setPrototypeOf(this, new.target.prototype);
		Error.captureStackTrace(this);
	}
}

export class BadRequestError extends AppError {
	constructor(message = 'Bad Request') {
		super(message, 400);
	}
}
export class NotAuthorizedError extends AppError {
	constructor(message = 'Not Authorized') {
		super(message, 401);
	}
}
export class ForbiddenError extends AppError {
	constructor(message = 'Forbidden Access') {
		super(message, 403);
	}
}
export class NotFoundError extends AppError {
	constructor(message = 'Not found') {
		super(message, 404);
	}
}
export class ConflictError extends AppError {
	constructor(message = 'Conflict') {
		super(message, 409);
	}
}
