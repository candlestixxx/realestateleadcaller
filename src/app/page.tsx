'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);

  const loadStats = () => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => setStats(data));
  };

  useEffect(() => {
    loadStats();
  }, []);

  const runEngine = async () => {
    try {
      const res = await fetch('/api/engine/tick', { method: 'POST' });
      const data = await res.json();
      alert(`Engine ran successfully. Processed ${data.processed} leads.`);
      loadStats();
    } catch (e) {
      alert('Error running engine.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">AI Real Estate Concierge Dashboard</h1>
          <button
            onClick={runEngine}
            className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700"
          >
            Run Workflow Engine
          </button>
        </header>

        {stats ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h2 className="text-sm font-medium text-gray-500 uppercase">Total Leads</h2>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalLeads}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h2 className="text-sm font-medium text-gray-500 uppercase">New Leads Today</h2>
              <p className="mt-2 text-3xl font-semibold text-blue-600">{stats.newLeads}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h2 className="text-sm font-medium text-gray-500 uppercase">Hot Leads</h2>
              <p className="mt-2 text-3xl font-semibold text-red-600">{stats.hotLeads}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h2 className="text-sm font-medium text-gray-500 uppercase">Overdue Follow-ups</h2>
              <p className="mt-2 text-3xl font-semibold text-orange-500">{stats.overdueFollowUps}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h2 className="text-sm font-medium text-gray-500 uppercase">Appointments Set</h2>
              <p className="mt-2 text-3xl font-semibold text-green-600">{stats.appointmentsSet}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h2 className="text-sm font-medium text-gray-500 uppercase">Warm Transfers</h2>
              <p className="mt-2 text-3xl font-semibold text-purple-600">{stats.warmTransfersCompleted}</p>
            </div>
          </div>
        ) : (
          <p>Loading stats...</p>
        )}

        <div className="flex gap-4">
          <Link href="/leads" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
            View All Leads
          </Link>
          <Link href="/workflows" className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded shadow hover:bg-gray-50">
            View Workflows
          </Link>
        </div>
      </div>
    </div>
  );
}
