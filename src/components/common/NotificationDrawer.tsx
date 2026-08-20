import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import {
  Bell,
  X,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  CheckCheck,
  Trash2
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose
}) => {
  const { notifications, markNotificationRead, clearAllNotifications } = useCollege();
  const [filter, setFilter] = useState<'all' | 'unread' | 'alert' | 'info'>('all');

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'alert') return n.type === 'alert' || n.type === 'warning';
    if (filter === 'info') return n.type === 'info' || n.type === 'success';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-600 shrink-0" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'alert':
      case 'warning':
        return 'bg-red-100 text-red-900 border-red-600';
      case 'success':
        return 'bg-emerald-100 text-emerald-900 border-emerald-600';
      default:
        return 'bg-blue-100 text-blue-900 border-blue-600';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md h-full bg-white border-l-2 border-black shadow-[ -6px_0px_0px_#000000] flex flex-col animate-in slide-in-from-right duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 bg-[#ffea00] border-b-2 border-black flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded bg-black flex items-center justify-center text-[#ffea00]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase text-black">Campus Notification Hub</h2>
              <p className="text-[11px] text-neutral-800 font-bold font-mono">
                {notifications.filter((n) => !n.read).length} unread alerts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded bg-black text-white hover:bg-neutral-800 cursor-pointer"
            aria-label="Close notifications"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills Bar */}
        <div className="p-2.5 bg-neutral-100 border-b-2 border-black flex items-center space-x-1.5 overflow-x-auto text-xs">
          {(['all', 'unread', 'alert', 'info'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded text-xs font-black uppercase transition cursor-pointer border-2 border-black ${
                filter === tab
                  ? 'bg-black text-white shadow-[2px_2px_0px_#ffea00]'
                  : 'bg-white text-black hover:bg-neutral-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Notification List Scroll */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-[#faf8f5]">
          {filteredNotifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500 p-6">
              <CheckCheck className="w-10 h-10 text-emerald-600 mb-2" />
              <p className="font-extrabold text-black">All Caught Up!</p>
              <p className="text-xs text-neutral-600 mt-1 font-medium">No pending notices in this category.</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`p-3.5 rounded-lg border-2 border-black transition-all cursor-pointer ${
                  !notif.read
                    ? 'bg-white shadow-[3px_3px_0px_#000000]'
                    : 'bg-neutral-50 opacity-75 hover:opacity-100 shadow-[1px_1px_0px_#000000]'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">{getIcon(notif.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-black text-black truncate">
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#ff2a85] shrink-0 border border-black" />
                      )}
                    </div>
                    <p className="text-xs text-neutral-700 mt-1 leading-relaxed font-medium">
                      {notif.message}
                    </p>
                    <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-neutral-600 font-bold">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-black" /> {notif.timestamp}
                      </span>
                      <span className={`uppercase px-1.5 py-0.5 rounded border text-[9px] ${getBadgeColor(notif.type)}`}>
                        {notif.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-neutral-100 border-t-2 border-black flex items-center justify-between text-xs font-bold text-black">
          <button
            onClick={() => {
              notifications.forEach((n) => markNotificationRead(n.id));
            }}
            className="hover:underline cursor-pointer flex items-center gap-1 font-extrabold"
          >
            <CheckCheck className="w-4 h-4 text-black" />
            <span>Mark all read</span>
          </button>
          
          <button
            onClick={clearAllNotifications}
            className="text-red-700 hover:text-red-900 cursor-pointer flex items-center gap-1 font-extrabold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear list</span>
          </button>
        </div>
      </div>
    </div>
  );
};
