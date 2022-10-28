import 'reflect-metadata';

import { json } from 'body-parser';
import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';

import { UsersController } from '@controllers';
import { IExceptionFilter } from '@errors';
import { ILogger } from '@service';
import { KEYS } from '@types';

@injectable()
export class App {
	public app: Express;
	public server: Server;
	public port: number;

	constructor(
		@inject(KEYS.ILogger) private logger: ILogger,
		@inject(KEYS.UsersController) private usersController: UsersController,
		@inject(KEYS.ExceptionFilter) private exceptionFilter: IExceptionFilter,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware(): void {
		this.app.use(json());
	}

	useRoutes(): void {
		this.app.use('/users', this.usersController.router);
	}

	useExeptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExeptionFilters();
		this.server = this.app.listen(this.port);
		this.logger.log(`Server success started on http://localhost:${this.port}`);
	}
}
