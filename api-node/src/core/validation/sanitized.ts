import sanitizeHtml from 'sanitize-html';
import { z } from 'zod';
export const sanitized = (schema: z.ZodString | z.ZodEmail) =>
	schema.transform((val) => {
		const clean = sanitizeHtml(val, {
			allowedTags: [],
			allowedAttributes: {},
		});

		return clean.trim();
	});

export const passwordRules = sanitized(z.string().min(6).max(60)).transform((p) => p.trim());

export const sanitizedPhone = sanitized(z.string().regex(/^[0-9+\-()/\s]+$/));
