import rateLimit from 'express-rate-limit';
// app limiter
export const apiLimiter = rateLimit({
	windowMs: 60 * 1000,
	limit: 100,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	handler: (req, res, _next, options) => {
		res.status(options.statusCode).json({
			success: false,
			message: 'Too many requests, please try again later.',
		});
	},
});

// auth limiter
export const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 10,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	message: { success: false, message: 'Too many login attempts.' },
});
