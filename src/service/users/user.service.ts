import { inject, injectable } from 'inversify';

import { KEYS } from '@constants';
import { UserLoginDto, UserRegisterDto } from '@dto';
import { User } from '@entity';
import { ConfigService } from '@service';

import { IUserService } from './user.service.interface';

@injectable()
export class UserService implements IUserService {
	constructor(@inject(KEYS.ConfigService) private configService: ConfigService) {}

	async createUser({ name, email, password }: UserRegisterDto): Promise<User | null> {
		const newUser = new User(email, name);
		const salt = this.configService.get('SALT');

		await newUser.setPassword(password, Number(salt));

		return null;
	}

	async validateUser(dto: UserLoginDto): Promise<boolean> {
		return true;
	}
}
