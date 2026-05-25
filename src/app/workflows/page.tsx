'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function WorkflowsPage() {
  // Mock data for workflows based on the prompt
  const workflows = [
    {
      id: 1,
      name: 'Buyer 10-Day Blitz',
      description: 'Aggressive 10-day follow up for new buyers',
      steps: [
        { day: 0, type: 'Call', content: 'Immediate Double-Tap AI Call' },
        { day: 0, type: 'Email', content: 'Market Snapshot' },
        { day: 1, type: 'Call', content: 'Morning Check-in' },
        { day: 2, type: 'SMS', content: 'Soft Question Text' },
        { day: 10, type: 'SMS', content: 'Break-up Text' }
      ]
    },
    {
      id: 2,
      name: 'Seller 14-Day Follow-Up',
      description: 'Follow-up sequence for new seller leads',
      steps: [
        { day: 1, type: 'Call', content: 'Immediate Call & SMS' },
        { day: 2, type: 'SMS', content: 'Soft Question Text' },
        { day: 3, type: 'Call', content: 'Second Call Attempt' },
        { day: 14, type: 'Email', content: 'Break-up Email & Direct Mail Option' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Workflows</h1>
          <Link href="/" className="text-blue-600 hover:underline">Back to Dashboard</Link>
        </header>

        <div className="space-y-8">
          {workflows.map(wf => (
            <div key={wf.id} className="bg-white shadow rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold mb-2">{wf.name}</h2>
              <p className="text-gray-600 mb-6">{wf.description}</p>

              <div className="relative border-l-2 border-blue-200 ml-3">
                {wf.steps.map((step, idx) => (
                  <div key={idx} className="mb-6 ml-6 relative">
                    <span className="absolute -left-9 top-1 bg-blue-500 w-4 h-4 rounded-full border-2 border-white"></span>
                    <h3 className="font-semibold text-gray-900">Day {step.day} - {step.type}</h3>
                    <p className="text-gray-500 text-sm">{step.content}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
