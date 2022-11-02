import { inject, injectable } from 'inversify';

import { KEYS } from '@constants';
import { UserLoginDto, UserRegisterDto } from '@dto';
import { User } from '@entity';
import { UserModel } from '@prisma/client';
import { IUsersRepository } from '@repository';
import { IConfigService } from '@service';

import { IUserService } from './user.service.interface';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(KEYS.ConfigService) private configService: IConfigService,
		@inject(KEYS.UsersRepository) private usersRepository: IUsersRepository,
	) {}

	async createUser({ name, email, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, name);
		const salt = this.configService.get('SALT');

		await newUser.setPassword(password, Number(salt));

		const existedUser = await this.usersRepository.find(email);
		if (existedUser) {
			return null;
		}

		return this.usersRepository.create(newUser);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.usersRepository.find(email);

		if (!existedUser) {
			return false;
		}

		const newUser = new User(existedUser.email, existedUser.name, existedUser.password);

		return newUser.comparePassword(password);
	}

	async getUserInfo(email: string): Promise<UserModel | null> {
		return this.usersRepository.find(email);
	}
}
