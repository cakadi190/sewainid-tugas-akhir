/**
 * @fileoverview Komponen peta interaktif menggunakan Leaflet untuk menampilkan lokasi tunggal atau multiple
 * @module LeafletMap
 * @requires react
 * @requires react-leaflet
 * @requires leaflet
 */

import React, { useMemo, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

L.Icon.Default.imagePath = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/';

/**
 * Tipe data untuk posisi koordinat
 * @typedef {number[] | [number, number]} PositionType
 */
type PositionType = number[] | [number, number];

/**
 * Interface untuk kustomisasi marker
 * @interface MarkerCustomizationInterface
 * @property {string} [iconUrl] - URL untuk icon marker
 * @property {string} [iconRetinaUrl] - URL untuk icon marker retina
 * @property {string} [shadowUrl] - URL untuk shadow marker
 * @property {[number, number]} [iconSize] - Ukuran icon [width, height]
 * @property {[number, number]} [iconAnchor] - Anchor point icon [x, y]
 * @property {[number, number]} [popupAnchor] - Anchor point popup [x, y]
 * @property {[number, number]} [shadowSize] - Ukuran shadow [width, height]
 */
interface MarkerCustomizationInterface {
  iconUrl?: string;
  iconRetinaUrl?: string;
  shadowUrl?: string;
  iconSize?: [number, number];
  iconAnchor?: [number, number];
  popupAnchor?: [number, number];
  shadowSize?: [number, number];
}

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
 * @interface LeafletLocationInterface
 * @property {PositionType} position - Koordinat lokasi
 * @property {string} name - Nama lokasi
 * @property {string} address - Alamat lokasi
 * @property {MarkerCustomizationInterface} [markerCustomization] - Kustomisasi marker untuk lokasi ini
 */
export interface LeafletLocationInterface {
  position: PositionType;
  name: string;
  address: string;
  markerCustomization?: MarkerCustomizationInterface;
}

/**
 * Interface untuk props komponen peta lokasi tunggal
 * @interface LeafletSingleProps
 * @extends {Omit<LeafletLocationInterface, 'position'>}
 * @property {PositionType} position - Koordinat lokasi
 * @property {string|number} [height='400px'] - Tinggi peta
 * @property {string|number} [width='100%'] - Lebar peta
 * @property {MarkerCustomizationInterface} [markerCustomization] - Kustomisasi marker
 * @property {boolean} [disableZoom=true] - Menonaktifkan zoom peta
 * @property {boolean} [disableDrag=true] - Menonaktifkan drag peta
 */
interface LeafletSingleProps extends Omit<LeafletLocationInterface, 'position' | 'markerCustomization'> {
  position: PositionType;
  height?: string | number;
  width?: string | number;
  markerCustomization?: MarkerCustomizationInterface;
  disableZoom?: boolean;
  disableDrag?: boolean;
}

/**
 * Interface untuk props komponen peta multi lokasi
 * @interface MultiLeafletMapProps
 * @property {LeafletLocationInterface[]} locations - Array lokasi yang akan ditampilkan
 * @property {string|number} [height='400px'] - Tinggi peta
 * @property {string|number} [width='100%'] - Lebar peta
 * @property {number} [initialZoom=12] - Level zoom awal
 * @property {boolean} [showAllMarkers=true] - Menampilkan semua marker dalam viewport
 * @property {MarkerCustomizationInterface} [defaultMarkerCustomization] - Kustomisasi default untuk semua marker
 * @property {boolean} [disableZoom=true] - Menonaktifkan zoom peta
 * @property {boolean} [disableDrag=true] - Menonaktifkan drag peta
 */
interface MultiLeafletMapProps {
  locations: LeafletLocationInterface[];
  height?: string | number;
  width?: string | number;
  initialZoom?: number;
  showAllMarkers?: boolean;
  defaultMarkerCustomization?: MarkerCustomizationInterface;
  disableZoom?: boolean;
  disableDrag?: boolean;
}

/**
 * Fungsi untuk membuat icon marker berdasarkan konfigurasi
 * @param {MarkerCustomizationInterface} customization - Konfigurasi marker
 * @returns {L.Icon} Icon Leaflet
 */
const createCustomIcon = (customization?: MarkerCustomizationInterface): L.Icon => {
  const defaultCustomization = {
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41] as [number, number],
    iconAnchor: [12, 41] as [number, number],
    popupAnchor: [1, -34] as [number, number],
    shadowSize: [41, 41] as [number, number]
  };

  const config = { ...defaultCustomization, ...customization };

  return L.icon({
    iconUrl: config.iconUrl,
    iconRetinaUrl: config.iconRetinaUrl,
    shadowUrl: config.shadowUrl,
    iconSize: config.iconSize,
    iconAnchor: config.iconAnchor,
    popupAnchor: config.popupAnchor,
    shadowSize: config.shadowSize
  });
};

/**
 * Komponen untuk mengupdate center dan posisi marker pada peta
 * @component
 * @param {Object} props - Props komponen
 * @param {[number, number]} props.position - Posisi untuk center peta
 * @returns {null} Komponen tidak merender apapun
 */
const MapUpdater: React.FC<{ position: [number, number] }> = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [map, position]);

  return null;
};

/**
 * Komponen untuk mengupdate bounds pada multi lokasi
 * @component
 * @param {Object} props - Props komponen
 * @param {L.LatLngBounds} [props.bounds] - Bounds untuk peta
 * @returns {null} Komponen tidak merender apapun
 */
const BoundsUpdater: React.FC<{ bounds?: L.LatLngBounds }> = ({ bounds }) => {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, bounds]);

  return null;
};

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
  width = '100%',
  markerCustomization,
  disableZoom = true,
  disableDrag = true
}) => {
  const validPosition = ensurePosition(position);
  const customIcon = createCustomIcon(markerCustomization);

  // Keep track of marker reference untuk update posisi
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    // Update marker position jika marker sudah dibuat dan posisi berubah
    if (markerRef.current) {
      markerRef.current.setLatLng(validPosition);
    }
  }, [validPosition]);

  return (
    <div style={{ height, width }} className="overflow-hidden rounded-lg shadow-md">
      <MapContainer
        center={validPosition}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={!disableZoom}
        zoomControl={!disableZoom}
        dragging={!disableDrag}
        doubleClickZoom={!disableZoom}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={validPosition}
          icon={customIcon}
          ref={markerRef}
        >
          <Popup>
            <div className="p-2">
              <h3 className="mb-0 text-lg font-bold h6">{name}</h3>
              <p className="m-0 mt-2 text-gray-600">{address}</p>
            </div>
          </Popup>
        </Marker>
        <MapUpdater position={validPosition} />
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
  showAllMarkers = true,
  defaultMarkerCustomization,
  disableZoom = true,
  disableDrag = true
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

  const defaultIcon = createCustomIcon(defaultMarkerCustomization);

  // Simpan referensi untuk semua marker
  const markerRefs = useRef<(L.Marker | null)[]>([]);

  // Update refs array size ketika jumlah lokasi berubah
  useEffect(() => {
    markerRefs.current = markerRefs.current.slice(0, locations.length);
    while (markerRefs.current.length < locations.length) {
      markerRefs.current.push(null);
    }
  }, [locations.length]);

  return (
    <div style={{ height, width }} className="overflow-hidden rounded-lg shadow-md">
      <MapContainer
        center={center}
        zoom={initialZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={!disableZoom}
        zoomControl={!disableZoom}
        dragging={!disableDrag}
        doubleClickZoom={!disableZoom}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map(({ name, address, position, markerCustomization }, index) => {
          const validPosition = ensurePosition(position);
          const icon = markerCustomization ? createCustomIcon(markerCustomization) : defaultIcon;

          // Update marker position jika sudah ada dan posisi berubah
          useEffect(() => {
            if (markerRefs.current[index]) {
              markerRefs.current[index]?.setLatLng(validPosition);
            }
          }, [validPosition, index]);

          return (
            <Marker
              key={`${name}-${index}`}
              position={validPosition}
              icon={icon}
              ref={(marker) => { markerRefs.current[index] = marker; }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="mb-0 text-lg font-bold h6">{name}</h3>
                  <p className="m-0 mt-2 text-gray-600">{address}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {showAllMarkers && bounds && <BoundsUpdater bounds={bounds} />}
      </MapContainer>
    </div>
  );
};
