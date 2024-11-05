import { LeafletSingle, MultiLeafletMapPin } from '@/Components/LeafletMap';
import { PageProps } from '@/types';

export default function Welcome({
  auth,
  laravelVersion,
  phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
  const singleLocation = {
    position: [-6.2088, 106.8456],
    name: "Bengkel A",
    address: "Jl. Sample No. 1"
  };

  const multipleLocations = [
    {
      position: [-6.2088, 106.8456],
      name: "Bengkel A",
      address: "Jl. Sample No. 1"
    },
    {
      position: [-6.2548, 106.81546],
      name: "Bengkel B",
      address: "Jl. Sample No. 2"
    },
    {
      position: [-6.18, 106.9990],
      name: "Bengkel C",
      address: "Jl. Sample No. 3"
    }
  ];

  return (
    <div className="gap-3 p-4 d-flex flex-column">
      {/* Single marker example */}
      <LeafletSingle {...singleLocation} />

      {/* Multiple markers example */}
      <MultiLeafletMapPin
        locations={multipleLocations}
        height="600px"
        showAllMarkers={true}
      />
    </div>
  );
}
