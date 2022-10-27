import 'module-alias/register';

import { Container, ContainerModule, interfaces } from 'inversify';

import { IBootstrapReturn } from '@interface';
import { TYPES } from '@types';

import { App } from './app';
import { IUsersController, UsersController } from './controllers';
import { ExeptionFilter, IExceptionFilter } from './errors';
import { ILogger, IUserService, LoggerService, UserService } from './service';

export const appBinding = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService);
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExeptionFilter);
	bind<IUsersController>(TYPES.UsersController).to(UsersController);
	bind<IUserService>(TYPES.UsersService).to(UserService);
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
