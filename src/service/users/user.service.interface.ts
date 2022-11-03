import type { UserLoginDto, UserRegisterDto } from '@dto';
import type { UserModel } from '@prisma/client';

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<UserModel | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
	getUserInfo: (email: string) => Promise<UserModel | null>;
}
