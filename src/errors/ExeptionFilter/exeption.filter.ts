import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { KEYS } from '@constants';

import { HTTPError } from '../HttpError';
import { ILogger } from './../../service/logger/logger.interface';
import { IExceptionFilter } from './exeption.filter.interface';

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
