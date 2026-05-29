'use client';

import dynamic from 'next/dynamic';

const MapComponent = dynamic(
  () => import('./MapComponent'),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg animate-pulse">
        <p className="text-gray-500">Loading Map...</p>
      </div>
    )
  }
);

export default function MapWrapper({ leads }: { leads: any[] }) {
  return <MapComponent leads={leads} />;
}
