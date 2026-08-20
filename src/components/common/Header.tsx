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
  LogOut,
  BookOpen,
  Clock,
  CheckCircle2,
  Users
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
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

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

  const roleMeta: Record<
    Role,
    { label: string; icon: React.ReactNode; activeBg: string; activeText: string }
  > = {
    student: {
      label: 'Student',
      icon: <GraduationCap className="w-4 h-4" />,
      activeBg: 'bg-[#ffea00]',
      activeText: 'text-black font-extrabold'
    },
    faculty: {
      label: 'Faculty',
      icon: <Briefcase className="w-4 h-4" />,
      activeBg: 'bg-[#a3e635]',
      activeText: 'text-black font-extrabold'
    },
    hod: {
      label: 'HOD',
      icon: <ShieldAlert className="w-4 h-4" />,
      activeBg: 'bg-[#00f0ff]',
      activeText: 'text-black font-extrabold'
    },
    admin: {
      label: 'Admin',
      icon: <Building className="w-4 h-4" />,
      activeBg: 'bg-[#ff2a85]',
      activeText: 'text-white font-extrabold'
    }
  };

  const activeName =
    currentRole === 'student'
      ? currentStudent?.name || 'Alex Chen'
      : currentRole === 'admin'
      ? 'Dean Grace Hopper'
      : currentFaculty?.name || 'Dr. Alan Turing';

  const activeId =
    currentRole === 'student'
      ? currentStudent?.rollNo || '22CS042'
      : currentRole === 'admin'
      ? 'ADMIN-ROOT'
      : currentFaculty?.employeeId || 'EMP101';

  return (
    <header className="sticky top-3 z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="brutal-card p-3 sm:p-4 bg-white border-2 border-black shadow-[4px_4px_0px_#000000]">
        
        {/* Top Mini Telemetry Header Bar */}
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b-2 border-black text-xs">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <span className="brutal-badge bg-[#a3e635] text-black text-[10px] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
              <span>COLLEGE OS ONLINE</span>
            </span>
            <span className="brutal-badge bg-[#ffea00] text-black text-[10px] hidden sm:flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-black" />
              <span>FIRESTORE CLOUD DB</span>
            </span>
            <span className="text-black font-bold hidden sm:inline">|</span>
            <span className="text-neutral-700 font-bold text-[11px] hidden sm:flex items-center gap-1.5">
              <span>Autonomous Engineering Campus</span>
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 text-xs">
            <span className="bg-neutral-100 border border-black px-2.5 py-0.5 rounded text-black font-mono font-bold flex items-center gap-1">
              <Clock className="w-3 h-3 text-black" />
              <span>{timeStr}</span>
            </span>
            <button
              onClick={resetToDemoData}
              title="Reset to Initial Demo State"
              className="brutal-btn px-2 py-0.5 text-[11px] font-bold text-black flex items-center space-x-1 hover:bg-neutral-200"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset Data</span>
            </button>
          </div>
        </div>

        {/* Main Navigation Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Branding Logo */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#ffea00] border-2 border-black rounded-lg flex items-center justify-center shadow-[2px_2px_0px_#000000] shrink-0">
                <BookOpen className="w-5 h-5 text-black" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight text-black">
                    College OS
                  </h1>
                  <span className="bg-black text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                    PRO
                  </span>
                </div>
                <p className="text-[11px] text-neutral-600 font-bold">
                  Academic Management & AI Intelligence
                </p>
              </div>
            </div>

            {/* Mobile Search & Notification Triggers */}
            <div className="flex items-center space-x-1.5 md:hidden">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="brutal-btn p-2 text-black"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenNotifications}
                className="brutal-btn p-2 text-black relative"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#ff2a85] text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full border border-black">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* 4-Role Navigation Pills */}
          <div className="flex items-center space-x-1.5 p-1 bg-neutral-100 border-2 border-black rounded-lg overflow-x-auto max-w-full">
            {(['student', 'faculty', 'hod', 'admin'] as Role[]).map((r) => {
              const meta = roleMeta[r];
              const isActive = currentRole === r;
              return (
                <button
                  key={r}
                  onClick={() => setCurrentRole(r)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                    isActive
                      ? `${meta.activeBg} ${meta.activeText} border-black shadow-[2px_2px_0px_#000000] translate-x-[-1px] translate-y-[-1px]`
                      : 'border-transparent text-neutral-700 hover:text-black hover:bg-white'
                  }`}
                >
                  {meta.icon}
                  <span>{meta.label}</span>
                </button>
              );
            })}
          </div>

          {/* Desktop Search, Notifications, Profile & Logout */}
          <div className="hidden md:flex items-center space-x-2.5">
            {/* Global Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="brutal-btn flex items-center space-x-2 px-3 py-1.5 text-xs text-black"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
              <kbd className="bg-black text-white px-1.5 py-0.2 rounded text-[10px] font-mono">⌘K</kbd>
            </button>

            {/* Notification Drawer Button */}
            <button
              onClick={onOpenNotifications}
              className="brutal-btn relative p-2 text-black hover:bg-neutral-100"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#ff2a85] text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full border border-black shadow">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Active User Switcher / Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="brutal-btn flex items-center space-x-2 px-3 py-1.5 text-xs text-black bg-white"
              >
                <div className="w-5 h-5 rounded bg-[#ffea00] border border-black flex items-center justify-center text-[10px] font-black text-black">
                  {activeName[0]}
                </div>
                <div className="text-left">
                  <span className="font-extrabold max-w-[90px] truncate block text-black">
                    {activeName.split(' ')[0]}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-black" />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-72 brutal-card p-3 text-xs z-50 animate-in fade-in zoom-in-95 duration-100 bg-white border-2 border-black shadow-[5px_5px_0px_#000000]">
                  <div className="border-b-2 border-black pb-2 mb-2">
                    <div className="text-[10px] font-black uppercase text-neutral-500">
                      CURRENT IDENTITY
                    </div>
                    <div className="font-black text-sm text-black">{activeName}</div>
                    <div className="text-xs font-mono font-bold text-neutral-700">{activeId}</div>
                  </div>

                  <div className="text-[10px] font-black uppercase text-neutral-500 mb-1.5">
                    Switch Student Profile:
                  </div>
                  <div className="space-y-1 mb-3">
                    {students.slice(0, 3).map((std) => (
                      <button
                        key={std.id}
                        onClick={() => {
                          setCurrentStudent(std);
                          setCurrentRole('student');
                          setShowProfileDropdown(false);
                        }}
                        className={`w-full text-left p-1.5 rounded border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                          currentStudent?.id === std.id && currentRole === 'student'
                            ? 'bg-[#ffea00] border-black text-black font-extrabold shadow-[1px_1px_0px_#000000]'
                            : 'border-transparent hover:bg-neutral-100 text-neutral-800'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <img src={std.avatar} alt={std.name} className="w-5 h-5 rounded-full border border-black" />
                          <span className="truncate">{std.name}</span>
                        </div>
                        <span className="font-mono text-[10px] font-bold">{std.rollNo}</span>
                      </button>
                    ))}
                  </div>

                  <div className="text-[10px] font-black uppercase text-neutral-500 mb-1.5">
                    Switch Faculty Profile:
                  </div>
                  <div className="space-y-1 mb-3">
                    {faculty.slice(0, 2).map((fac) => (
                      <button
                        key={fac.id}
                        onClick={() => {
                          setCurrentFaculty(fac);
                          setCurrentRole('faculty');
                          setShowProfileDropdown(false);
                        }}
                        className={`w-full text-left p-1.5 rounded border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                          currentFaculty?.id === fac.id && currentRole === 'faculty'
                            ? 'bg-[#a3e635] border-black text-black font-extrabold shadow-[1px_1px_0px_#000000]'
                            : 'border-transparent hover:bg-neutral-100 text-neutral-800'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <img src={fac.avatar} alt={fac.name} className="w-5 h-5 rounded-full border border-black" />
                          <span className="truncate">{fac.name}</span>
                        </div>
                        <span className="font-mono text-[10px] font-bold">{fac.employeeId}</span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-neutral-200">
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        logout();
                      }}
                      className="w-full brutal-btn px-3 py-1.5 text-xs text-red-700 bg-red-50 hover:bg-red-100 border-red-600 flex items-center justify-center space-x-1.5 font-extrabold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out Session</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Logout Button */}
            <button
              onClick={logout}
              title="Sign Out"
              className="brutal-btn p-2 text-red-600 hover:bg-red-50 border-red-600"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
