import type { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { KEYS } from '@constants';
import { HTTPError, IExceptionFilter } from '@errors';
import type { ILogger } from '@service';

@injectable()
export class ExeptionFilter implements IExceptionFilter {
	constructor(@inject(KEYS.ILogger) private logger: ILogger) {}

	catch(err: Error | HTTPError, req: Request, res: Response, nest: NextFunction): void {
		if (err instanceof HTTPError) {
			this.logger.error(`[${err.context}] Error ${err.statusCode}: ${err.message}`);
			res.status(err.statusCode).send({ err: err.message });
		} else {
			this.logger.error(`${err.message}`);
			res.status(500).send({ err: err.message });
		}
	}
}
