'use client';

import { useState } from 'react';

export default function ProfileSettingsPage() {
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Mock save delay
    setTimeout(() => {
      setSaving(false);
      alert('Profile saved successfully!');
    }, 800);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Agent Profile</h1>

      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Personal Information</h2>
        <form className="space-y-6" onSubmit={handleSave}>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Display Name</label>
              <input type="text" defaultValue="Jules AI Agent" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Team Name</label>
              <input type="text" defaultValue="Lum's Real Estate Team" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Transfer Phone Number (For Warm Transfers)</label>
              <input type="text" defaultValue="555-0000" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
            </div>
          </div>
          <div className="flex justify-end">
            <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
