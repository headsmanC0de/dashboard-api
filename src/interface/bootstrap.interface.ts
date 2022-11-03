import type { Container } from 'inversify';

import type { App } from './../app';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}
