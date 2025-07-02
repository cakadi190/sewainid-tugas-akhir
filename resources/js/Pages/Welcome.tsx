import type { LeafletLocationInterface } from "@/Components/LeafletMap";
import { LeafletSingle, MultiLeafletMapPin } from "@/Components/LeafletMap";
import { PageProps } from "@/types";

export default function Welcome({
  auth,
  laravelVersion,
  phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
  const singleLocation = {
    position: [-6.175191960534199, 106.82713979017072] as [number, number],
    name: "Monumen Nasional",
    address: "Gambir, Jakarta Pusat, DKI Jakarta",
  };

  const multipleLocations: LeafletLocationInterface[] = [
    {
      position: [-6.175191960534199, 106.82713979017072] as [number, number],
      name: "Monumen Nasional",
      address: "Gambir, Jakarta Pusat, DKI Jakarta",
      markerCustomization: {
        iconUrl: "/assets/monument.png",
        iconSize: [36, 36] as [number, number],
      },
    },
    {
      position: [-7.184061401051592, 112.78365242449267] as [number, number],
      name: "Jembatan Nasional Suramadu",
      address: "Selat Madura, Jawa Timur",
      markerCustomization: {
        iconUrl: "/assets/suramadu.png",
        iconSize: [36, 36] as [number, number],
      },
    },
    {
      position: [-6.194843297744195, 106.82139831962182] as [number, number],
      name: "Grand Indonesia",
      address: "Jl. M.H. Thamrin No.1, Jakarta Pusat",
      markerCustomization: {
        iconUrl: "/assets/mall.png",
        iconSize: [32, 32] as [number, number],
      },
    },
    {
      position: [-8.620967966770396, 115.08681071660948] as [number, number],
      name: "Pura Tanah Lot",
      address: "Beraban, Kediri, Kabupaten Tabanan, Bali",
      markerCustomization: {
        iconUrl: "/assets/temple.png",
        iconSize: [32, 32] as [number, number],
      },
    },
    {
      position: [-7.605850820211221, 110.20336526736837] as [number, number],
      name: "Candi Borobudur",
      address: "Borobudur, Magelang, Jawa Tengah",
      markerCustomization: {
        iconUrl: "/assets/borobudur.png",
        iconSize: [36, 36] as [number, number],
      },
    },
    {
      position: [-7.361017120730611, 111.37051169287577] as [number, number],
      name: "Museum Trinil",
      address: "Kedunggalar, Ngawi, Jawa Timur",
      markerCustomization: {
        iconUrl: "/assets/prehistoric.png",
        iconSize: [36, 36] as [number, number],
      },
    },
  ];

  return (
    <div className="gap-3 p-4 d-flex flex-column">
      <h2 className="mb-2">Lokasi Tunggal: Monumen Nasional</h2>
      <LeafletSingle
        disableDrag={false}
        disableZoom={false}
        height="400px"
        width="100%"
        {...singleLocation}
      />

      <h2 className="mt-4 mb-2">Lokasi Wisata Terkenal di Indonesia</h2>
      <MultiLeafletMapPin
        locations={multipleLocations}
        height="600px"
        width="100%"
        showAllMarkers={true}
        disableDrag={false}
        disableZoom={false}
        initialZoom={5} // Zoom level lebih kecil untuk melihat seluruh Indonesia
        defaultMarkerCustomization={{
          iconUrl: "/assets/default-marker.png",
          iconSize: [32, 32] as [number, number],
        }}
      />
    </div>
  );
}
