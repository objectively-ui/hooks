import { navigator } from "@objectively/utils";
import { useCallback, useEffect, useState } from "react";
import { useFrozen } from "../useFrozen";
import {
  type UseGeolocationOptions,
  type UseGeolocationReturn,
  geolocationErrorCodes,
} from "./types";

// GeolocationPosition isn't stringify-able, so it needs to be cloned in this silly way
const clonePosition = (pos: GeolocationPosition): GeolocationPosition => ({
  timestamp: pos.timestamp,
  coords: {
    accuracy: pos.coords.accuracy,
    altitude: pos.coords.altitude,
    altitudeAccuracy: pos.coords.altitudeAccuracy,
    heading: pos.coords.altitudeAccuracy,
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude,
    speed: pos.coords.speed,
  },
});

export const useGeolocation = (opts: UseGeolocationOptions = {}): UseGeolocationReturn => {
  const { maxCacheAge, timeout, highAccuracy, watch, immediateRequest } = opts;
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

  useEffect(() => {
    if (immediateRequest) {
      refresh();
    }
  }, [refresh, immediateRequest]);

  return useFrozen({
    coordinates: position?.coords ? clonePosition(position).coords : undefined,
    lastUpdatedAt: position?.timestamp ?? 0,
    error: error,
    errorCode: error
      ? geolocationErrorCodes[error.code as keyof typeof geolocationErrorCodes]
      : undefined,
    refresh,
  });
};
