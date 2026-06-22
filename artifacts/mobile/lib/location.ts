import * as Location from "expo-location";

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export const CITY_COORDS: Record<string, LocationCoords> = {
  Conakry: { latitude: 9.6412, longitude: -13.5784 },
  Kindia: { latitude: 10.0599, longitude: -12.8676 },
  Labé: { latitude: 11.3137, longitude: -12.2852 },
  Kankan: { latitude: 10.3894, longitude: -9.3044 },
  Mamou: { latitude: 10.3759, longitude: -12.0919 },
  Coyah: { latitude: 9.8870, longitude: -13.5906 },
  "N'Zérékoré": { latitude: 7.7566, longitude: -8.8173 },
  Boffa: { latitude: 9.6492, longitude: -14.0279 },
};

const DEFAULT_REGION = {
  latitude: 9.6412,
  longitude: -13.5784,
  latitudeDelta: 0.8,
  longitudeDelta: 0.8,
};

export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function getUserLocation(): Promise<LocationCoords | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return null;
    const loc = (await Location.getLastKnownPositionAsync()) || (await Location.getCurrentPositionAsync({}));
    if (!loc) return null;
    return {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    };
  } catch {
    return null;
  }
}

export function getCityCoordinates(location: string): LocationCoords | null {
  return CITY_COORDS[location] ?? null;
}

export function getDistanceToCity(userLocation: LocationCoords | null, location: string): number | null {
  const coords = getCityCoordinates(location);
  if (!userLocation || !coords) return null;
  return haversineDistance(userLocation.latitude, userLocation.longitude, coords.latitude, coords.longitude);
}

export function getDefaultRegion(coords?: LocationCoords) {
  if (!coords) return DEFAULT_REGION;
  return {
    latitude: coords.latitude,
    longitude: coords.longitude,
    latitudeDelta: 0.8,
    longitudeDelta: 0.8,
  };
}
