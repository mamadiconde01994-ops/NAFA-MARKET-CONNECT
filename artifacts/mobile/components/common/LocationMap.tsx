import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import type { LocationCoords } from "@/types";

export interface MapMarker {
  id: string;
  title: string;
  description?: string;
  coordinate: LocationCoords;
  pinColor?: string;
}

interface LocationMapProps {
  markers: MapMarker[];
  userLocation?: LocationCoords | null;
  onMarkerPress?: (id: string) => void;
  style?: object;
}

function computeRegion(markers: MapMarker[], userLocation?: LocationCoords | null): Region {
  const coords = [...markers.map((marker) => marker.coordinate)];
  if (userLocation) coords.push(userLocation);

  if (coords.length === 0) {
    return {
      latitude: 9.6412,
      longitude: -13.5784,
      latitudeDelta: 0.8,
      longitudeDelta: 0.8,
    };
  }

  const latitudes = coords.map((coord) => coord.latitude);
  const longitudes = coords.map((coord) => coord.longitude);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);
  const midLat = (minLat + maxLat) / 2;
  const midLng = (minLng + maxLng) / 2;
  const latDelta = Math.max(0.05, (maxLat - minLat) * 1.4);
  const lngDelta = Math.max(0.05, (maxLng - minLng) * 1.4);

  return {
    latitude: midLat,
    longitude: midLng,
    latitudeDelta: latDelta,
    longitudeDelta: lngDelta,
  };
}

export function LocationMap({ markers, userLocation, onMarkerPress, style }: LocationMapProps) {
  const region = useMemo(() => computeRegion(markers, userLocation), [markers, userLocation]);

  return (
    <View style={[styles.container, style]}> 
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        region={region}
        showsUserLocation={false}
        showsCompass
        zoomEnabled
        pitchEnabled
        rotateEnabled
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
            pinColor={marker.pinColor}
            onPress={() => onMarkerPress?.(marker.id)}
          />
        ))}
        {userLocation ? (
          <Marker
            key="user-location"
            coordinate={userLocation}
            title="Vous"
            pinColor="#2563EB"
          />
        ) : null}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: "hidden",
    minHeight: 200,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
