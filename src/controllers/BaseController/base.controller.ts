import { Response, Router } from 'express';
import { injectable } from 'inversify';

import { IControllerRoute } from '../../interface';
import { ILogger } from '../../service';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(protected logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	protected send<T>(res: Response, code: number, data: T): Response {
		res.type('application/json');
		return res.status(code).json(data);
	}

	public ok<T>(res: Response, data: T): Response {
		return this.send<T>(res, 200, data);
	}

	public created<T>(res: Response, data: T): Response {
		return this.send(res, 201, data);
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		for (const route of routes) {
			this.logger.log(`[${route.method}] ${route.path}`);
			const middleware = route.middlewares?.map((m) => m.execute.bind(m));

			const boundHandler = route.handler.bind(this);
			const pipeline = middleware ? [...middleware, boundHandler] : boundHandler;
			this.router[route.method](route.path, pipeline);
		}
	}
}
