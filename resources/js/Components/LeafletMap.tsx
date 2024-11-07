/**
 * @fileoverview Komponen peta interaktif menggunakan Leaflet untuk menampilkan lokasi tunggal atau multiple
 * @module LeafletMap
 * @requires react
 * @requires react-leaflet
 * @requires leaflet
 */

import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

L.Icon.Default.imagePath = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/';

/**
 * Konfigurasi default icon untuk marker peta
 * @constant {L.Icon}
 */
const defaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

/**
 * Tipe data untuk posisi koordinat
 * @typedef {number[] | [number, number]} PositionType
 */
type PositionType = number[] | [number, number];

/**
 * Memastikan format posisi koordinat valid
 * @param {PositionType} pos - Posisi koordinat yang akan divalidasi
 * @returns {[number, number]} Posisi koordinat yang sudah divalidasi
 */
const ensurePosition = (pos: PositionType): [number, number] => {
  if (Array.isArray(pos) && pos.length >= 2) {
    return [pos[0], pos[1]];
  }
  return [0, 0];
};

/**
 * Interface untuk data lokasi tunggal
 * @interface SingleLocation
 * @property {PositionType} position - Koordinat lokasi
 * @property {string} name - Nama lokasi
 * @property {string} address - Alamat lokasi
 */
interface SingleLocation {
  position: PositionType;
  name: string;
  address: string;
}

/**
 * Interface untuk props komponen peta lokasi tunggal
 * @interface LeafletSingleProps
 * @extends {Omit<SingleLocation, 'position'>}
 * @property {PositionType} position - Koordinat lokasi
 * @property {string|number} [height='400px'] - Tinggi peta
 * @property {string|number} [width='100%'] - Lebar peta
 */
interface LeafletSingleProps extends Omit<SingleLocation, 'position'> {
  position: PositionType;
  height?: string | number;
  width?: string | number;
}

/**
 * Interface untuk props komponen peta multi lokasi
 * @interface MultiLeafletMapProps
 * @property {SingleLocation[]} locations - Array lokasi yang akan ditampilkan
 * @property {string|number} [height='400px'] - Tinggi peta
 * @property {string|number} [width='100%'] - Lebar peta
 * @property {number} [initialZoom=12] - Level zoom awal
 * @property {boolean} [showAllMarkers=true] - Menampilkan semua marker dalam viewport
 */
interface MultiLeafletMapProps {
  locations: SingleLocation[];
  height?: string | number;
  width?: string | number;
  initialZoom?: number;
  showAllMarkers?: boolean;
}

/**
 * Komponen untuk menampilkan peta dengan satu marker
 * @component
 * @param {LeafletSingleProps} props - Props komponen
 * @returns {JSX.Element} Komponen peta dengan marker tunggal
 */
export const LeafletSingle: React.FC<LeafletSingleProps> = ({
  position,
  name,
  address,
  height = '400px',
  width = '100%'
}) => {
  const validPosition = ensurePosition(position);

  return (
    <div style={{ height, width }} className="overflow-hidden rounded-lg shadow-md">
      <MapContainer
        center={validPosition}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={validPosition} icon={defaultIcon}>
          <Popup>
            <div className="p-2">
              <h3 className="mb-1 text-lg font-bold">{name}</h3>
              <p className="text-gray-600">{address}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

/**
 * Komponen untuk menampilkan peta dengan multiple marker
 * @component
 * @param {MultiLeafletMapProps} props - Props komponen
 * @returns {JSX.Element} Komponen peta dengan multiple marker
 */
export const MultiLeafletMapPin: React.FC<MultiLeafletMapProps> = ({
  locations,
  height = '400px',
  width = '100%',
  initialZoom = 12,
  showAllMarkers = true
}) => {
  const center = useMemo(() => {
    if (locations.length === 0) return [0, 0] as [number, number];

    const validLocations = locations.map(loc => ensurePosition(loc.position));
    const totalLat = validLocations.reduce((sum, pos) => sum + pos[0], 0);
    const totalLng = validLocations.reduce((sum, pos) => sum + pos[1], 0);

    return [
      totalLat / validLocations.length,
      totalLng / validLocations.length
    ] as [number, number];
  }, [locations]);

  const bounds = useMemo(() => {
    if (!showAllMarkers || locations.length === 0) return undefined;

    const validLocations = locations.map(loc => ensurePosition(loc.position));
    const bounds = L.latLngBounds(validLocations);
    return bounds;
  }, [locations, showAllMarkers]);

  return (
    <div style={{ height, width }} className="overflow-hidden rounded-lg shadow-md">
      <MapContainer
        center={center}
        zoom={initialZoom}
        style={{ height: '100%', width: '100%' }}
        bounds={bounds}
        boundsOptions={{ padding: [50, 50] }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map((location, index) => {
          const validPosition = ensurePosition(location.position);
          return (
            <Marker
              key={`${location.name}-${index}`}
              position={validPosition}
              icon={defaultIcon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="mb-1 text-lg font-bold">{location.name}</h3>
                  <p className="text-gray-600">{location.address}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
