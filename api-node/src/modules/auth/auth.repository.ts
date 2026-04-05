import { AppError } from '@src/core/utils/index.js';
import { users, db } from '@src/db/index.js';
import type { TUser, TUserInsert, TUserResponse } from '@src/db/schema/user.js';
import { userSchema } from '@src/modules/user/index.js';

export class AuthRepository {
	protected format(record: TUser): TUserResponse {
		return {
			id: record.id,
			name: record.name,
			email: record.email,
			createdAt: record.createdAt,
			updatedAt: record.updatedAt,
		};
	}

	public async register(userData: TUserInsert): Promise<TUserResponse> {
		const [user] = await db.insert(users).values(userData).returning();

		if (!user) throw new AppError(400, 'Registration failed: User already exists or database rejected insert.');

		return userSchema.parse(this.format(user));
	}
}
