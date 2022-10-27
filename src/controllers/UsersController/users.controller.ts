import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { UserLoginDto, UserRegisterDto } from '@dto';
import { HTTPError } from '@errors';
import { ValidateMiddleware } from '@middleware';
import { ILogger } from '@service';
import { TYPES } from '@types';

import { BaseController } from '../BaseController';
import { UserService } from './../../service/users/user.service';
import { IUsersController } from './users.controller.interface';

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(
		@inject(TYPES.ILogger) logger: ILogger,
		@inject(TYPES.UsersService) private userService: UserService,
	) {
		super(logger);

		this.bindRoutes([
			{
				path: '/login',
				method: 'post',
				func: this.login,
			},
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
		]);
	}

	login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
		// this.ok(res, 'login');

		console.log(req.body);
		next(new HTTPError(401, 'Error to login', 'Login'));
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);

		if (!result) {
			return next(new HTTPError(422, 'Such a user already exists'));
		}
		this.ok(res, { email: result.email });
	}
}
