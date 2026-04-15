import { messageSchema, type ClientRegisterPayload, } from '../schemas/websocket-message.schema';
import type { OutgoingWsMessage } from '../types';

interface HandlerResult {
  personal: OutgoingWsMessage[];
  broadcast: OutgoingWsMessage[];
}

const createErrorResponse = (error: string): OutgoingWsMessage => {
  return {
    type: 'ERROR',
    payload: { error: error },
  };
};

//! Handlers específicos

export const handleGetClients = (): HandlerResult => {
  return {
    broadcast: [],
    personal: [
      {
        type: 'CLIENT_STATE',
        payload: []
      }
    ]
  }
}

export const handleClientRegister = (clientId: string, payload: ClientRegisterPayload): HandlerResult => {
  return {
    broadcast: [],
    personal: [{
      type: 'CLIENT_JOIN',
      payload: {
        clientId: clientId,
        name: payload.name,
        color: payload.color || 'gray',
        coords: payload.coords,
        updatedAt: 12342342342342,
      }
    }]
  }
}

export const handleClientMoved = (clientId: string, payload: any): HandlerResult => {
  return {
    broadcast: [],
    personal: []
  }
}

export const handleMessage = (clientId: string, rawMessage: string): HandlerResult => {
  try {
    const jsonData: unknown = JSON.parse(rawMessage);
    const parsedResult = messageSchema.safeParse(jsonData);

    if (!parsedResult.success) {
      console.log(parsedResult.error);
      const errorMessage = parsedResult.error.issues
        .map((issue) => issue.message)
        .join(', ');

      return {
        broadcast: [],
        personal: [createErrorResponse(`Validation error ${errorMessage}`)]
      }
    }

    const { type, payload } = parsedResult.data;

    switch (type) {
      case 'GET_CLIENTS':
        return handleGetClients();
      case 'CLIENT_REGISTER':
        return handleClientRegister(clientId, payload);
      case 'CLIENT_MOVE':
        return handleClientMoved(clientId, payload);
      default:
        return {
          broadcast: [],
          personal: [createErrorResponse(`Unknown message type: ${type}`)]
        };
    }
  } catch (error) {
    console.log(error);
    return {
      broadcast: [],
      personal: [createErrorResponse(`Unknown error found`)]
    };
  }
};
