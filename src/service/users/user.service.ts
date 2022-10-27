import { injectable } from 'inversify';

import { UserLoginDto, UserRegisterDto } from '@dto';
import { User } from '@entity';

import { IUserService } from './user.service.interface';

@injectable()
export class UserService implements IUserService {
	async createUser({ name, email, password }: UserRegisterDto): Promise<User | null> {
		const newUser = new User(email, name);
		await newUser.setPassword(password);
		/*
			Перевірка чи є юзер
			Якщо є повертаємо нулл
			Якщо ні створюємо
		*/

		return null;
	}

	async validateUser(dto: UserLoginDto): Promise<boolean> {
		return true;
	}
}
