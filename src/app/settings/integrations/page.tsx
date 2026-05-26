'use client';

export default function IntegrationsSettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Integrations</h1>

      <div className="bg-white rounded-lg shadow p-6 border border-gray-200 space-y-8">

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Voice AI (Vapi / Retell)</h2>
          <p className="text-sm text-gray-500 mb-4">Connect your voice provider for outbound AI calling.</p>
          <div className="flex items-center space-x-4">
            <input type="password" placeholder="sk_test_..." className="flex-1 rounded-md border-gray-300 shadow-sm border p-2 font-mono text-sm" />
            <button className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded shadow hover:bg-gray-50">Connect</button>
          </div>
        </div>

        <hr className="border-gray-200" />

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">SMS (Twilio)</h2>
          <p className="text-sm text-gray-500 mb-4">Configure Twilio credentials for text message follow-ups.</p>
          <div className="space-y-4">
            <input type="text" placeholder="Account SID" className="w-full rounded-md border-gray-300 shadow-sm border p-2 font-mono text-sm" />
            <div className="flex items-center space-x-4">
              <input type="password" placeholder="Auth Token" className="flex-1 rounded-md border-gray-300 shadow-sm border p-2 font-mono text-sm" />
              <button className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded shadow hover:bg-gray-50">Connect</button>
            </div>
          </div>
        </div>

        <hr className="border-gray-200" />

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">CRM Webhook</h2>
          <p className="text-sm text-gray-500 mb-4">Your personalized webhook URL to receive leads from Zillow or Follow Up Boss.</p>
          <div className="bg-gray-100 p-3 rounded border border-gray-200 font-mono text-sm break-all">
            https://jules-ai.example.com/api/webhooks/crm
          </div>
        </div>

      </div>
    </div>
  );
}
