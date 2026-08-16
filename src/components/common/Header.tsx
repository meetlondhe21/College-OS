import React, { useState, useEffect } from 'react';
import { useCollege } from '../../context/CollegeContext';
import { Role } from '../../types';
import {
  GraduationCap,
  Briefcase,
  ShieldAlert,
  Building,
  Search,
  Bell,
  RotateCcw,
  ChevronDown,
  Sparkles,
  Layers,
  Cpu,
  Compass,
  Boxes,
  LogOut
} from 'lucide-react';

interface HeaderProps {
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications }) => {
  const {
    currentRole,
    setCurrentRole,
    currentStudent,
    setCurrentStudent,
    currentFaculty,
    setCurrentFaculty,
    students,
    faculty,
    notifications,
    setIsSearchOpen,
    resetToDemoData,
    logout
  } = useCollege();

  const [timeStr, setTimeStr] = useState('');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roleMeta: Record<Role, { code: string; label: string; icon: React.ReactNode; color: string }> = {
    student: {
      code: '01',
      label: 'Student Portal',
      icon: <GraduationCap className="w-4 h-4" />,
      color: 'from-blue-500 to-indigo-600'
    },
    faculty: {
      code: '02',
      label: 'Faculty Hub',
      icon: <Briefcase className="w-4 h-4" />,
      color: 'from-emerald-500 to-teal-600'
    },
    hod: {
      code: '03',
      label: 'HOD Desk',
      icon: <ShieldAlert className="w-4 h-4" />,
      color: 'from-amber-500 to-orange-600'
    },
    admin: {
      code: '04',
      label: 'Admin Control',
      icon: <Building className="w-4 h-4" />,
      color: 'from-purple-500 to-pink-600'
    }
  };

  return (
    <header className="sticky top-3 z-40 max-w-7xl mx-auto px-4 sm:px-6 w-full">
      <div className="spatial-glass border border-white/20 p-2 sm:p-3 shadow-2xl relative backdrop-blur-2xl">
        {/* Top Mini Telemetry Header */}
        <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-white/10 text-xs">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/30 text-[11px] font-medium shadow-inner">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping" />
              <span>SPATIAL OS ACTIVE</span>
            </div>
            <span className="text-white/20">|</span>
            <span className="text-slate-300 hidden sm:flex items-center gap-1.5 text-[11px]">
              <Boxes className="w-3.5 h-3.5 text-purple-400" />
              <span>3D Holographic Campus Canvas</span>
            </span>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            <span className="bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10 text-slate-200 font-mono">
              {timeStr}
            </span>
            <button
              onClick={resetToDemoData}
              title="Reset Demo Data"
              className="flex items-center space-x-1 text-slate-400 hover:text-white transition cursor-pointer px-2 py-0.5 rounded-lg hover:bg-white/10"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Main Header Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-2">
          {/* Logo Branding with 3D Depth Icon */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[1.5px] shadow-lg shadow-indigo-500/30 shrink-0 transform hover:rotate-6 transition duration-300">
                <div className="w-full h-full bg-slate-950/80 rounded-[14px] flex items-center justify-center text-indigo-400 backdrop-blur-md">
                  <Compass className="w-5 h-5 animate-pulse" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white drop-shadow-sm">
                    College Spatial OS
                  </h1>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-gradient-to-r from-indigo-500/30 to-purple-500/30 text-indigo-300 border border-indigo-500/40">
                    Vision 3D
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Next-Gen Spatial Academic Campus Intelligence
                </p>
              </div>
            </div>
          </div>

          {/* Role Navigation Pills (Spatial Floating Bar) */}
          <div className="flex items-center space-x-1.5 p-1 bg-black/40 rounded-xl border border-white/10 overflow-x-auto max-w-full">
            {(['student', 'faculty', 'hod', 'admin'] as Role[]).map((r) => {
              const meta = roleMeta[r];
              const isActive = currentRole === r;
              return (
                <button
                  key={r}
                  onClick={() => setCurrentRole(r)}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'spatial-btn-primary text-white shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {meta.icon}
                  <span>{meta.label}</span>
                </button>
              );
            })}
          </div>

          {/* Action Utilities & Avatar Switcher */}
          <div className="flex items-center space-x-2">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="spatial-btn flex items-center space-x-2 px-3 py-1.5 text-xs text-slate-200"
            >
              <Search className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="bg-white/10 text-slate-300 px-1.5 py-0.2 rounded text-[10px] font-mono border border-white/10">⌘K</kbd>
            </button>

            {/* Notifications Trigger */}
            <button
              onClick={onOpenNotifications}
              className="spatial-btn relative p-2 text-slate-200 hover:text-white"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-lg shadow-pink-500/50 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Logout / Switch ID button */}
            <button
              onClick={logout}
              title="Sign Out / Switch ID"
              className="spatial-btn flex items-center space-x-1.5 px-2.5 py-1.5 text-xs text-rose-300 hover:text-white hover:bg-rose-500/20 border-rose-500/30"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Active Persona Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="spatial-btn flex items-center space-x-2 px-3 py-1.5 text-xs text-white"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white shadow">
                  {currentRole === 'student' ? currentStudent.name[0] : 'F'}
                </div>
                <span className="max-w-[80px] truncate text-slate-200">
                  {currentRole === 'student' ? currentStudent.name.split(' ')[0] : currentFaculty.name.split(' ')[1] || 'Admin'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl spatial-glass p-3 text-xs shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 border border-white/20">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/10 pb-1.5 mb-2 flex items-center justify-between">
                    <span>Spatial Profile Node</span>
                    <span className="text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded font-mono">3D Sync</span>
                  </div>

                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 px-1">
                    Student Nodes:
                  </div>
                  <div className="space-y-1 mb-3">
                    {students.slice(0, 3).map((std) => (
                      <button
                        key={std.id}
                        onClick={() => {
                          setCurrentStudent(std);
                          setCurrentRole('student');
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${
                          currentStudent.id === std.id && currentRole === 'student'
                            ? 'bg-indigo-600/40 border border-indigo-500/50 text-white font-semibold shadow-inner'
                            : 'hover:bg-white/10 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <img src={std.avatar} alt={std.name} className="w-6 h-6 rounded-full object-cover border border-white/30" />
                          <span>{std.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{std.rollNo}</span>
                      </button>
                    ))}
                  </div>

                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 px-1">
                    Faculty Nodes:
                  </div>
                  <div className="space-y-1">
                    {faculty.slice(0, 2).map((fac) => (
                      <button
                        key={fac.id}
                        onClick={() => {
                          setCurrentFaculty(fac);
                          setCurrentRole('faculty');
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${
                          currentFaculty.id === fac.id && currentRole === 'faculty'
                            ? 'bg-emerald-600/40 border border-emerald-500/50 text-white font-semibold shadow-inner'
                            : 'hover:bg-white/10 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <img src={fac.avatar} alt={fac.name} className="w-6 h-6 rounded-full object-cover border border-white/30" />
                          <span>{fac.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{fac.employeeId}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
