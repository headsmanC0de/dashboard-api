import { Response, Router } from 'express';
import { injectable } from 'inversify';

import { ExpressReturn, IControllerRoutes } from '../../interface';
import { ILogger } from '../../service';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public send<T>(res: Response, code: number, message: T): ExpressReturn {
		res.type('application/json');
		return res.status(code).json(message);
	}

	public ok<T>(res: Response, message: T): ExpressReturn {
		return this.send<T>(res, 200, message);
	}

	public created(res: Response): ExpressReturn {
		return res.sendStatus(201);
	}

	protected bindRoutes(routes: IControllerRoutes[]): void {
		for (const route of routes) {
			const handler = route.func.bind(this);
			this.router[route.method](route.path, handler);

			this.logger.log(`[${route.method}] ${route.path}`);
		}
	}
}
