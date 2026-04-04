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

export const sanitizedPhone = sanitized(z.string().regex(/^[0-9+\-()/\s]+$/));
