//! Este es el objeto que se almacena por cada cliente
export interface WebSocketData {
  clientId: string;
  name: string;
  color: string;
  coords: LatLng;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface ClientMarker {
  clientId: string;
  name: string;
  color: string;
  coords: LatLng;
  updatedAt: number;
}

export type IncomingWsMessage =
  |
  {
    type: 'CLIENT_REGISTER',
    payload: { name: string; color: string; coords: LatLng; }
  }
  |
  {
    type: 'CLIENT_MOVE',
    payload: { coords: LatLng; }
  }
  |
  {
    type: 'GET_CLIENTS',
    payload?: any
  }

export type OutgoingWsMessage =
  |
  {
    type: 'ERROR',
    payload: { error: string; }
  }
  |
  {
    type: 'WELCOME',
    payload: { clientId: string; }
  }
  |
  {
    type: 'CLIENT_STATE',
    payload: ClientMarker[];
  }
  |
  {
    type: 'CLIENT_JOIN',
    payload: ClientMarker;
  }
  |
  {
    type: 'CLIENT_MOVED',
    payload: { clientId: string; coords: LatLng; updatedAt: number }
  }
  |
  {
    type: 'CLIENT_LEFT',
    payload: { clientId: string; }
  }
