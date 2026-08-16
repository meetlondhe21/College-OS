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
  Boxes
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose
}) => {
  const { notifications, markNotificationAsRead } = useCollege();
  const [filter, setFilter] = useState<'all' | 'unread' | 'academic' | 'emergency'>('all');

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'academic') return n.category === 'academic';
    if (filter === 'emergency') return n.type === 'emergency' || n.category === 'emergency';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'emergency':
        return <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-indigo-400 shrink-0" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md h-full spatial-glass border-l border-white/20 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Spatial Header */}
        <div className="p-4 bg-slate-900/80 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Spatial Campus Alerts</h2>
              <p className="text-[11px] text-slate-400 font-mono">
                {notifications.filter((n) => !n.read).length} unread updates
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
            aria-label="Close notifications"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="p-2.5 bg-slate-950/40 border-b border-white/10 flex items-center space-x-1.5 overflow-x-auto text-xs">
          {(['all', 'unread', 'academic', 'emergency'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold tracking-wide transition cursor-pointer capitalize ${
                filter === tab
                  ? 'spatial-btn-primary text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* List of Notifications */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {filteredNotifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-6">
              <CheckCheck className="w-10 h-10 text-emerald-400/60 mb-2" />
              <p className="font-semibold text-white">All Clear</p>
              <p className="text-xs text-slate-400 mt-1">No pending updates in this filter.</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationAsRead(notif.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  !notif.read
                    ? 'spatial-card border-indigo-500/40 shadow-lg'
                    : 'bg-white/5 border-white/5 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">{getIcon(notif.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-semibold text-white truncate">
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {notif.timestamp}
                      </span>
                      <span className="uppercase px-1.5 py-0.2 rounded bg-white/10 text-slate-300">
                        {notif.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-900/90 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span className="text-[11px] font-mono">Spatial Telemetry Stream</span>
          <button
            onClick={() => {
              notifications.forEach((n) => markNotificationAsRead(n.id));
            }}
            className="text-xs font-semibold text-indigo-300 hover:text-indigo-200 cursor-pointer"
          >
            Mark all as read
          </button>
        </div>
      </div>
    </div>
  );
};
