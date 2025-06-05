import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styled from '@emotion/styled';
import { useShowModalTrack } from '@/Context/TrackingModalContext';
import { Button } from 'react-bootstrap';

const MapWrapper = styled.div`
  height: 400px;
  width: 100%;
  position: relative;
  overflow: hidden;
  border-radius: .5rem;

  &:hover .map-overlay {
    opacity: 1;
  }
`;

const MapOverlayHover = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  z-index: 1000;
  transition: opacity 0.3s ease;
  opacity: 0;
  cursor: pointer;
`;

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface GpsData {
  device: {
    deviceName: string;
    deviceId: string;
  };
  currentPosition: {
    latitude: number;
    longitude: number;
    speed: number;
    timestamp: string;
  };
}

const MapPreview: React.FC = () => {
  const [gpsData, setGpsData] = useState<GpsData | null>(null);
  const { showModalTrack, setShowModalTrack } = useShowModalTrack();

  useEffect(() => {
    const fetchGps = async () => {
      try {
        const res = await fetch(
          'https://gps.kodinus.web.id/api/gps-history/device/019176185977/current'
        );
        const data = await res.json();
        setGpsData(data);
      } catch (err) {
        console.error('Failed to fetch GPS data:', err);
      }
    };

    fetchGps();
  }, []);

  if (!gpsData) return <p>Loading map...</p>;

  const { latitude, longitude } = gpsData.currentPosition;

  return (
    <MapWrapper>
      <MapOverlayHover
        className="map-overlay"
        onClick={() => setShowModalTrack(!showModalTrack)}
      >
        <Button variant="dark">Lacak Posisi Kendaraan</Button>
      </MapOverlayHover>

      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        dragging={false}
        zoomControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
        keyboard={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]} />
      </MapContainer>
    </MapWrapper>
  );
};

export default MapPreview;
