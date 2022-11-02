import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { sign } from 'jsonwebtoken';

import { KEYS } from '@constants';
import { UserLoginDto, UserRegisterDto } from '@dto';
import { HTTPError } from '@errors';
import { AuthGuard } from '@guards';
import { ValidateMiddleware } from '@middleware';
import { IConfigService, ILogger, IUserService } from '@service';

import { BaseController } from '../BaseController';
import { IUsersController } from './users.controller.interface';

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(
		@inject(KEYS.ILogger) logger: ILogger,
		@inject(KEYS.UsersService) private userService: IUserService,
		@inject(KEYS.ConfigService) private configService: IConfigService,
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
			{
				path: '/info',
				method: 'get',
				handler: this.info,
				middlewares: [new AuthGuard()],
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
		const jwt = await this.signJWT(body.email, this.configService.get('SECRET'));
		this.ok(res, { jwt });
	}

	async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		const userInfo = await this.userService.getUserInfo(user);
		this.ok(res, { email: userInfo?.email, id: userInfo?.id });
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err);
					}
					resolve(token as string);
				},
			);
		});
	}
}
