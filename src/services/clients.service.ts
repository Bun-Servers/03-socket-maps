import type { ClientMovePayload, ClientRegisterPayload } from '../schemas/websocket-message.schema';
import { ClientsStore } from '../store/clients.store';
import type { ClientMarker } from '../types';
import { generateUuid } from '../utils/generate-uuid';

class ClientsService {
    private readonly clientsStore: ClientsStore;

    constructor() {
        this.clientsStore = new ClientsStore();
    }

    getAllClients() {
        return this.clientsStore.getAll();
    }

    registerClient(input: ClientRegisterPayload): { error: string } | ClientMarker {
        if (this.clientsStore.has(input.clientId)) {
            return {
                error: 'Client with this ID already exists'
            };
        }

        const client: ClientMarker = {
            ...input,
            updatedAt: Date.now(),
            color: input.color || 'gray'
        };

        this.clientsStore.add(client);

        return client;
    }

    clientMove(clientId: string, input: ClientMovePayload): { error: string } | ClientMarker {
        const client = this.clientsStore.getById(clientId);

        if (!client) {
            return { error: 'Client not found' };
        }

        const updatedClient = this.clientsStore.updateCoords(clientId, input.coords);

        if (!updatedClient) {
            return { error: 'Failed to update client coordinates' };
        }

        return updatedClient;
    }

    removeClient(clientId: string) {
        return this.clientsStore.remove(clientId);
    }
}

export const clientsService = new ClientsService();
