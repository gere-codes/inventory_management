import { AppError } from '@src/core/utils/index.js';
import { users, db } from '@src/db/index.js';
import type { TUser, TUserInsert, TUserResponse } from '@src/db/schema/user.js';
import { userSchema } from '@src/modules/user/index.js';
import { eq } from 'drizzle-orm';

class AuthRepository {
	protected format(record: TUser): TUserResponse {
		return {
			id: record.id,
			name: record.name,
			email: record.email,
			updatedAt: record.updatedAt,
		};
	}

	public async create(userData: TUserInsert): Promise<TUserResponse> {
		const [user] = await db.insert(users).values(userData).returning();

		if (!user) throw new AppError(400, 'Registration failed: User already exists.');

		return userSchema.parse(this.format(user));
	}

	async findByEmail(email: string): Promise<TUser | null> {
		const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
		return user || null;
	}
}

export const authRepository = new AuthRepository();
