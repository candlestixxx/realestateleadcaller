'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';
import Link from 'next/link';

// Fix for default marker icons in Leaflet when used with Webpack/Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

type LeadMapMarker = {
  id: string;
  first_name: string;
  last_name: string;
  latitude: number;
  longitude: number;
  property_address: string;
  lead_type: string;
  status: string;
};

export default function MapComponent({ leads }: { leads: LeadMapMarker[] }) {
  // Default center to US (roughly Kansas) if no leads, else first lead coords
  const defaultCenter: [number, number] = leads.length > 0
    ? [leads[0].latitude, leads[0].longitude]
    : [39.8283, -98.5795];

  const defaultZoom = leads.length > 0 ? 11 : 4;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      style={{ height: '100%', width: '100%', zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {leads.map(lead => (
        <Marker
          key={lead.id}
          position={[lead.latitude, lead.longitude]}
          icon={icon}
        >
          <Popup>
            <div className="text-sm">
              <strong className="block mb-1">{lead.first_name} {lead.last_name}</strong>
              <p className="mb-1 text-gray-600">{lead.property_address}</p>
              <div className="flex gap-2 mb-2 text-xs">
                <span className="bg-blue-100 text-blue-800 px-1.5 rounded">{lead.lead_type}</span>
                <span className="bg-gray-100 text-gray-800 px-1.5 rounded">{lead.status}</span>
              </div>
              <Link href={`/leads/${lead.id}`} className="text-blue-600 hover:underline block mt-1">
                View Lead Profile
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
