import { DotenvConfigOutput, DotenvParseOutput, config } from 'dotenv';
import { inject, injectable } from 'inversify';

import { KEYS } from '@constants';
import type { ILogger } from '@service';

import type { IConfigService } from './config.service.interface';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;

	constructor(@inject(KEYS.ILogger) private logger: ILogger) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.logger.error('[ConfigService] I can`t read the .env file because it is missing');
		} else {
			this.logger.log('[ConfigService] Config .env loaded');
			this.config = result.parsed as DotenvParseOutput;
		}
	}

	get(key: string): string {
		return this.config[key];
	}
}
