import 'module-alias/register';

import { Container, ContainerModule, interfaces } from 'inversify';

import { IBootstrapReturn } from '@interface';
import { KEYS } from '@types';

import { App } from './app';
import { IUsersController, UsersController } from './controllers';
import { ExeptionFilter, IExceptionFilter } from './errors';
import { ILogger, IUserService, LoggerService, UserService } from './service';

export const appBinding = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(KEYS.ILogger).to(LoggerService);
	bind<IExceptionFilter>(KEYS.ExceptionFilter).to(ExeptionFilter);
	bind<IUsersController>(KEYS.UsersController).to(UsersController);
	bind<IUserService>(KEYS.UsersService).to(UserService);
	bind<App>(KEYS.Application).to(App);
});

function bootstrap(): IBootstrapReturn {
	const appContainer = new Container();
	appContainer.load(appBinding);

	const app = appContainer.get<App>(KEYS.Application);

	app.init();

	return { app, appContainer };
}

export const { app, appContainer } = bootstrap();
