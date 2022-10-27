import { NextFunction, Request, Response, Router } from 'express';

import { IMiddleware } from '@interface';

export interface IControllerRoutes {
	path: string;
	func: (req: Request, res: Response, next: NextFunction) => void;
	method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>;
	middlewares?: IMiddleware[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExpressReturn = Response<any, Record<string, any>>;
