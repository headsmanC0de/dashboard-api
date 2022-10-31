import 'module-alias/register';

import { Container, ContainerModule, interfaces } from 'inversify';

import { KEYS } from '@constants';
import { IBootstrapReturn } from '@interface';

import { App } from './app';
import { IUsersController, UsersController } from './controllers';
import { ExeptionFilter, IExceptionFilter } from './errors';
import {
	ConfigService,
	IConfigService,
	ILogger,
	IUserService,
	LoggerService,
	UserService,
} from './service';

export const appBinding = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(KEYS.ILogger).to(LoggerService).inSingletonScope();
	bind<IExceptionFilter>(KEYS.ExceptionFilter).to(ExeptionFilter).inSingletonScope();
	bind<IUsersController>(KEYS.UsersController).to(UsersController).inSingletonScope();
	bind<IUserService>(KEYS.UsersService).to(UserService).inSingletonScope();
	bind<IConfigService>(KEYS.ConfigService).to(ConfigService).inSingletonScope();
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
