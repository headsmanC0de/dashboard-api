import { Container, ContainerModule, interfaces } from 'inversify';

import { App } from './app';
import { UserController } from './controllers';
import { ExeptionFilter, IExceptionFilter } from './errors';
import { IBootstrapReturn } from './interface';
import { ILogger, LoggerService } from './service/logger';
import { TYPES } from './types';

export const appBinding = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService);
	bind<IExceptionFilter>(TYPES.IExceptionFilter).to(ExeptionFilter);
	bind<UserController>(TYPES.UserController).to(UserController);
	bind<App>(TYPES.Application).to(App);
});

function bootstrap(): IBootstrapReturn {
	const appContainer = new Container();
	appContainer.load(appBinding);

	const app = appContainer.get<App>(TYPES.Application);

	app.init();

	return { app, appContainer };
}

export const { app, appContainer } = bootstrap();
