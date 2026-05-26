'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import Link from 'next/link';

// Initial mock data for the builder
const initialSteps = [
  { id: 'step-1', day: 0, channel: 'Call', content: 'Immediate Double-Tap AI Call' },
  { id: 'step-2', day: 0, channel: 'Email', content: 'Market Snapshot' },
  { id: 'step-3', day: 1, channel: 'Call', content: 'Morning Check-in' },
  { id: 'step-4', day: 2, channel: 'SMS', content: 'Soft Question Text' },
];

export default function WorkflowBuilderPage() {
  const [steps, setSteps] = useState(initialSteps);
  const [saving, setSaving] = useState(false);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newSteps = Array.from(steps);
    const [reorderedItem] = newSteps.splice(result.source.index, 1);
    newSteps.splice(result.destination.index, 0, reorderedItem);

    setSteps(newSteps);
  };

  const handleSave = () => {
    setSaving(true);
    // Mock save delay
    setTimeout(() => {
      setSaving(false);
      alert('Workflow saved successfully! (Backend integration pending)');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Visual Workflow Builder</h1>
          <div className="space-x-4">
            <Link href="/workflows" className="text-blue-600 hover:underline">Back to Workflows</Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Workflow'}
            </button>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <p className="text-gray-600 mb-6">Drag and drop the steps below to reorder the communication sequence.</p>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="workflow-steps">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3"
                >
                  {steps.map((step, index) => (
                    <Draggable key={step.id} draggableId={step.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="mr-4 text-gray-400 cursor-grab">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path>
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded font-bold uppercase">
                                {step.channel}
                              </span>
                              <span className="font-medium text-gray-900">Day {step.day}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{step.content}</p>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}
