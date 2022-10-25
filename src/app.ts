import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { UserController } from './controllers';
import { IExceptionFilter } from './errors';
import { ILogger } from './service/logger';
import { TYPES } from './types';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.IExceptionFilter) private exceptionFilter: IExceptionFilter,
	) {
		this.app = express();
		this.port = 8000;
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	useExeptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useRoutes();
		this.useExeptionFilters();
		this.server = this.app.listen(this.port);
		this.logger.log(`Server success started on http://localhost:${this.port}`);
	}
}
