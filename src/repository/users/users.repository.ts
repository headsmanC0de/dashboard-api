import { inject, injectable } from 'inversify';

import { KEYS } from '@constants';
import { User } from '@entity';
import { UserModel } from '@prisma/client';
import { PrismaService } from '@service';

import { IUsersRepository } from './users.repository.interface';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(KEYS.PrismaService) private prismaService: PrismaService) {}

	async create({ email, password, name }: User): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: {
				email,
				password,
				name,
			},
		});
	}

	async find(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({
			where: {
				email,
			},
		});
	}
}
