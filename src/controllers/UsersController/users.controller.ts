import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { HTTPError } from '../../errors';
import { ILogger } from '../../service';
import { TYPES } from '../../types';
import { BaseController } from '../BaseController';
import { IUserController } from './users.controller.interface';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
		super(loggerService);

		this.bindRoutes([
			{ path: '/login', method: 'post', func: this.login },
			{ path: '/register', method: 'post', func: this.register },
		]);
	}

	login(req: Request, res: Response, next: NextFunction): void {
		// this.ok(res, 'login');
		next(new HTTPError(401, 'Error to login', 'Login'));
	}

	register(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, 'register');
	}
}
