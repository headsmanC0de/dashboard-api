import { BaseController } from 'controllers/BaseController';

import { ControllerRouteHandler } from '@interface';

export interface IUsersController extends BaseController {
	login: ControllerRouteHandler;
	register: ControllerRouteHandler;
}
