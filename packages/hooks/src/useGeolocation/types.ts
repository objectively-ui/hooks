export interface UseGeolocationOptions {
  maxCacheAge?: number;
  timeout?: number;
  highAccuracy?: boolean;
  watch?: boolean;
  immediateRequest?: boolean;
}

export interface UseGeolocationReturn {
  coordinates?: GeolocationCoordinates;
  lastUpdatedAt: number;
  error?: GeolocationPositionError;
  errorCode?: (typeof geolocationErrorCodes)[keyof typeof geolocationErrorCodes];
  refresh: () => Promise<GeolocationCoordinates>;
}

export const geolocationErrorCodes = {
  [GeolocationPositionError.PERMISSION_DENIED]: "PERMISSION_DENIED",
  [GeolocationPositionError.POSITION_UNAVAILABLE]: "POSITION_UNAVAILABLE",
  [GeolocationPositionError.TIMEOUT]: "TIMEOUT",
} as const;
