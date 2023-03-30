import { getWebSocketController, WebSocketController } from '../websocket/controllers';
import type { WebSocketClient } from '../websocket/types';
import emitter from '../emitter';
import type { ActionHandler } from '@directus/shared/types';
import type { WebSocketMessage } from '../websocket/messages';

export class WebSocketService {
	private controller: WebSocketController;

	constructor() {
		this.controller = getWebSocketController();
	}

	on(event: 'connect' | 'message' | 'error' | 'close', callback: ActionHandler) {
		emitter.onAction('websocket.' + event, callback);
	}
	off(event: 'connect' | 'message' | 'error' | 'close', callback: ActionHandler) {
		emitter.offAction('websocket.' + event, callback);
	}

	broadcast(message: string | WebSocketMessage, filter?: { user?: string; role?: string }) {
		this.controller.clients.forEach((client: WebSocketClient) => {
			if (filter && filter.user && filter.user !== client.accountability?.user) return;
			if (filter && filter.role && filter.role !== client.accountability?.role) return;
			client.send(typeof message === 'string' ? message : JSON.stringify(message));
		});
	}
	clients(): Set<WebSocketClient> {
		return this.controller.clients;
	}
}
