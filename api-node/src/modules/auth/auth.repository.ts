import { AppError, ConflictError } from '@src/core/utils/index.js';
import { users, db } from '@src/db/index.js';
import { userResponseSchema, type TUser, type TUserCreate, type TUserResponse } from '@src/modules/user/index.js';
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

	public async create(userData: TUserCreate): Promise<string> {
		const [user] = await db.insert(users).values(userData).returning({ email: users.email });

		if (!user) throw new ConflictError('Registration failed: User already exists.');

		return user.email;
	}

	async findByEmailRaw(email: string): Promise<TUser | null> {
		const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
		return user || null;
	}

	async findByIdRaw(id: string): Promise<TUser | null> {
		const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
		if (!user) return null;
		return user || null;
	}

	async findById(id: string): Promise<TUserResponse | null> {
		const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
		if (!user) return null;

		return userResponseSchema.parse(this.format(user));
	}
}

export const authRepository = new AuthRepository();
