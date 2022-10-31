import { UsersRepository } from './../repository/users/users.repository';

export const KEYS = {
	Application: Symbol.for('Application'),
	ILogger: Symbol.for('LoggerService'),
	UsersController: Symbol.for('UsersController'),
	UsersService: Symbol.for('UsersService'),
	ExceptionFilter: Symbol.for('ExeptionFilter'),
	ConfigService: Symbol.for('ConfigService'),
	PrismaService: Symbol.for('PrismaService'),
	UsersRepository: Symbol.for('UsersRepository'),
};
