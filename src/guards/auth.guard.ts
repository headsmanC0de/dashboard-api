import type { NextFunction, Request, Response } from 'express';

import type { IMiddleware } from '@interface';

export class AuthGuard implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.user) {
			return next();
		}
		res.status(401).send({ error: 'Not authorized' });
	}
}
