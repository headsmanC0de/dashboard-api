import type { BaseController } from 'controllers/BaseController';

import type { ControllerRouteHandler } from '@interface';

export interface IUsersController extends BaseController {
	login: ControllerRouteHandler;
	register: ControllerRouteHandler;
	info: ControllerRouteHandler;
}
