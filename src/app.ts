import 'reflect-metadata';

import { json } from 'body-parser';
import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';

import { KEYS } from '@constants';
import { IUsersController, UsersController } from '@controllers';
import { IExceptionFilter } from '@errors';
import { AuthMiddleware } from '@middleware';
import { IConfigService, ILogger, PrismaService } from '@service';

@injectable()
export class App {
	public app: Express;
	public server: Server;
	public port: number;

	constructor(
		@inject(KEYS.ILogger) private logger: ILogger,
		@inject(KEYS.UsersController) private usersController: IUsersController,
		@inject(KEYS.ExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(KEYS.ConfigService) private configService: IConfigService,
		@inject(KEYS.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware(): void {
		this.app.use(json());
		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
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
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`[Server] Server success started on http://localhost:${this.port}`);
	}
}
