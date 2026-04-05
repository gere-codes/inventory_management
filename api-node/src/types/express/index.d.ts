import express from 'express';

export declare global {
	namespace Express {
		interface Request {
			user: {
				readonly id: string;
			};
		}
	}
}
