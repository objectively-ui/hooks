import { navigator } from "@objectively/utils";
import { useCallback, useEffect, useState } from "react";

interface UseGeolocationOptions {
  maxCacheAge?: number;
  timeout?: number;
  highAccuracy?: boolean;
  watch?: boolean;
}

interface UseGeolocationReturn {
  coordinates?: GeolocationCoordinates;
  lastUpdatedAt: number;
  error?: GeolocationPositionError;
  errorCode?: (typeof geolocationErrorCodes)[keyof typeof geolocationErrorCodes];
  refresh: () => Promise<GeolocationCoordinates>;
}

const errorForErrorCodes = new GeolocationPositionError();

const geolocationErrorCodes = {
  [errorForErrorCodes.PERMISSION_DENIED]: "PERMISSION_DENIED",
  [errorForErrorCodes.POSITION_UNAVAILABLE]: "POSITION_UNAVAILABLE",
  [errorForErrorCodes.TIMEOUT]: "TIMEOUT",
} as const;

export const useGeolocation = (opts: UseGeolocationOptions = {}): UseGeolocationReturn => {
  const { maxCacheAge, timeout, highAccuracy, watch } = opts;
  const [position, setPosition] = useState<GeolocationPosition>();
  const [error, setError] = useState<GeolocationPositionError>();

  useEffect(() => {
    if (watch) {
      let id: number;

      try {
        id = navigator.geolocation.watchPosition(
          (pos) => {
            setPosition(pos);
            setError(undefined);
          },
          (error) => {
            setError(error);
          },
          {
            enableHighAccuracy: highAccuracy,
            maximumAge: maxCacheAge,
            timeout,
          },
        );
      } catch (e) {
        setError(e as GeolocationPositionError);
      }

      return () => {
        navigator.geolocation.clearWatch(id);
      };
    }
  }, [maxCacheAge, timeout, highAccuracy, watch]);

  const refresh = useCallback(() => {
    return new Promise<GeolocationCoordinates>((resolve, reject) => {
      try {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setPosition(pos);
            setError(undefined);
            resolve(pos.coords);
          },
          (error) => {
            setError(error);
            reject(error);
          },
          {
            enableHighAccuracy: highAccuracy,
            maximumAge: maxCacheAge,
            timeout,
          },
        );
      } catch (e) {
        setError(e as GeolocationPositionError);
        reject(e);
      }
    });
  }, [maxCacheAge, timeout, highAccuracy]);

  return {
    coordinates: position?.coords,
    lastUpdatedAt: position?.timestamp ?? 0,
    error,
    errorCode: error
      ? geolocationErrorCodes[error.code as keyof typeof geolocationErrorCodes]
      : undefined,
    refresh,
  };
};
