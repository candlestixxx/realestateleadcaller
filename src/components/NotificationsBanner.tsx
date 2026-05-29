'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export function NotificationsBanner() {
  const [notifications, setNotifications] = useState<any[]>([]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        setNotifications(await res.json());
      }
    } catch (e) {
      console.error('Failed to fetch notifications', e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: 'PUT' });
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }
    } catch (e) {
      console.error('Failed to mark read', e);
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2 w-80">
      {notifications.slice(0, 3).map(notif => (
        <div key={notif.id} className="bg-white rounded-lg shadow-lg border-l-4 border-blue-500 p-4 flex justify-between items-start">
          <div className="flex-1">
            <h4 className="text-sm font-bold text-gray-900">{notif.title}</h4>
            <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
            {notif.link && (
              <Link href={notif.link} className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                View Details &rarr;
              </Link>
            )}
          </div>
          <button
            onClick={() => markAsRead(notif.id)}
            className="text-gray-400 hover:text-gray-600 text-xs ml-4"
          >
            &#10005;
          </button>
        </div>
      ))}
      {notifications.length > 3 && (
        <div className="bg-gray-800 text-white text-xs text-center py-2 rounded-lg shadow cursor-pointer">
          +{notifications.length - 3} more notifications
        </div>
      )}
    </div>
  );
}
