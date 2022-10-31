import { inject, injectable } from 'inversify';

import { KEYS } from '@constants';
import { PrismaClient } from '@prisma/client';
import { ILogger } from '@service';

@injectable()
export class PrismaService {
	client: PrismaClient;

	constructor(@inject(KEYS.ILogger) private logger: ILogger) {
		this.client = new PrismaClient();
	}

	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.logger.log('[PrismaService] Connected to Database Success');
		} catch (e) {
			if (e instanceof Error)
				this.logger.error(
					'[PrismaService] Connection to Database Fail' + `Error: ${e.message}`,
				);
		}
	}

	async disconnect(): Promise<void> {
		await this.client.$disconnect();
	}
}
