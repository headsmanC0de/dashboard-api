import { UserLoginDto, UserRegisterDto } from '@dto';
import { User } from '@entity';

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<User | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
}
