import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { KEYS } from '@constants';
import { UserLoginDto, UserRegisterDto } from '@dto';
import { HTTPError } from '@errors';
import { ValidateMiddleware } from '@middleware';
import { ILogger } from '@service';

import { BaseController } from '../BaseController';
import { UserService } from './../../service/users/user.service';
import { IUsersController } from './users.controller.interface';

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(
		@inject(KEYS.ILogger) logger: ILogger,
		@inject(KEYS.UsersService) private userService: UserService,
	) {
		super(logger);

		this.bindRoutes([
			{
				path: '/login',
				method: 'post',
				handler: this.login,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/register',
				method: 'post',
				handler: this.register,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
		]);
	}

	async login(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.validateUser(req.body);

		if (!result) {
			return next(new HTTPError(401, 'Error to login', 'Login'));
		}

		this.ok(res, {});
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);

		if (!result) {
			return next(new HTTPError(409, 'Such a user already exists'));
		}
		this.ok(res, { email: result.email, id: result.id });
	}
}
