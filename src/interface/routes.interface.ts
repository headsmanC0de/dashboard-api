import { NextFunction, Request, Response, Router } from 'express';

import { IMiddleware } from '@interface';

export interface IControllerRoute {
	path: string;
	handler: ControllerRouteHandler;
	method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>;
	middlewares?: IMiddleware[];
}

export type ControllerRouteHandler = (req: Request, res: Response, next: NextFunction) => void;
