import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import MapWrapper from './components/MapWrapper';

export default async function MapDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/login');

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) redirect('/login');

  // Fetch all leads that have valid GPS coordinates
  const leads = await prisma.lead.findMany({
    where: {
      userId: user.id,
      latitude: { not: null },
      longitude: { not: null },
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      property_address: true,
      latitude: true,
      longitude: true,
      lead_type: true,
      status: true
    }
  });

  // Typecast to ensure strict Float parsing for the client component
  const safeLeads = leads.map(l => ({
    ...l,
    latitude: l.latitude as number,
    longitude: l.longitude as number,
    property_address: l.property_address || 'Address Unknown'
  }));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center z-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Circle Prospecting Map</h1>
          <p className="text-sm text-gray-500 mt-1">Viewing {safeLeads.length} leads with location data.</p>
        </div>
        <div className="space-x-4">
          <Link href="/leads" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            &larr; Back to Leads List
          </Link>
          <Link href="/leads/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
            Add New Lead
          </Link>
        </div>
      </header>

      <main className="flex-grow p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[calc(100vh-140px)] overflow-hidden relative">

          {safeLeads.length === 0 && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 backdrop-blur-sm">
              <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-gray-100 max-w-md">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Plotable Leads Found</h3>
                <p className="text-gray-500 mb-6 text-sm">You do not currently have any leads in the system that contain valid geographic coordinates. Try adding a lead with a physical address to see them plotted here.</p>
                <Link href="/leads/new" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                  Create Lead
                </Link>
              </div>
            </div>
          )}

          <MapWrapper leads={safeLeads} />
        </div>
      </main>
    </div>
  );
}
