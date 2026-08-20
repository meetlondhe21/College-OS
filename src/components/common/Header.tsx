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
  Users,
  ShieldCheck,
  KeyRound,
  QrCode,
  Smartphone,
  Mail,
  Copy,
  Check,
  X,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

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
    logout,
    toggleTwoFactorSetting
  } = useCollege();

  const [timeStr, setTimeStr] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [backupKeys, setBackupKeys] = useState<string[]>([
    'CAMPUS-7821-SAFE',
    'COLLEGE-4492-NODE',
    'AUTH-8820-REST',
    'ROOT-3199-ACAD'
  ]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

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

  const activeEmail =
    currentRole === 'student'
      ? currentStudent?.email || 'alex.chen@collegeos.edu'
      : currentRole === 'admin'
      ? 'admin@collegeos.edu'
      : currentFaculty?.email || 'alan.turing@collegeos.edu';

  const handleToggle2FA = () => {
    const nextState = !is2FAEnabled;
    setIs2FAEnabled(nextState);
    toggleTwoFactorSetting(nextState);
    if (nextState) {
      confetti({ particleCount: 40, spread: 50 });
    }
  };

  const handleGenerateNewKeys = () => {
    const newKeys = [
      `CAMPUS-${Math.floor(1000 + Math.random() * 9000)}-SAFE`,
      `COLLEGE-${Math.floor(1000 + Math.random() * 9000)}-NODE`,
      `AUTH-${Math.floor(1000 + Math.random() * 9000)}-REST`,
      `ROOT-${Math.floor(1000 + Math.random() * 9000)}-ACAD`
    ];
    setBackupKeys(newKeys);
    confetti({ particleCount: 30, spread: 40 });
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

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

            {/* 2FA Security Pill Indicator */}
            <button
              onClick={() => setShow2FAModal(true)}
              className="brutal-badge bg-[#00f0ff] hover:bg-[#ffea00] text-black text-[10px] flex items-center gap-1 cursor-pointer transition-colors border border-black"
              title="Click to view 2FA settings"
            >
              <ShieldCheck className="w-3 h-3 text-black" />
              <span>2FA SECURED</span>
            </button>

            <span className="brutal-badge bg-[#ffea00] text-black text-[10px] hidden sm:flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-black" />
              <span>FIRESTORE CLOUD DB</span>
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
              className="brutal-btn px-2 py-0.5 text-[11px] font-bold text-black flex items-center space-x-1 hover:bg-neutral-200 cursor-pointer"
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
                className="brutal-btn p-2 text-black cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenNotifications}
                className="brutal-btn p-2 text-black relative cursor-pointer"
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
              className="brutal-btn flex items-center space-x-2 px-3 py-1.5 text-xs text-black cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
              <kbd className="bg-black text-white px-1.5 py-0.2 rounded text-[10px] font-mono">⌘K</kbd>
            </button>

            {/* Notification Drawer Button */}
            <button
              onClick={onOpenNotifications}
              className="brutal-btn relative p-2 text-black hover:bg-neutral-100 cursor-pointer"
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
                className="brutal-btn flex items-center space-x-2 px-3 py-1.5 text-xs text-black bg-white cursor-pointer"
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
                    <div className="text-[11px] text-neutral-500">{activeEmail}</div>
                  </div>

                  {/* 2FA Security Status in Dropdown */}
                  <div className="p-2 bg-[#f0fdf4] border border-black rounded mb-3 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-[11px] text-black">2FA Status: Enabled</span>
                    </div>
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        setShow2FAModal(true);
                      }}
                      className="text-[10px] font-extrabold text-blue-700 hover:underline cursor-pointer"
                    >
                      Manage
                    </button>
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
                      className="w-full brutal-btn px-3 py-1.5 text-xs text-red-700 bg-red-50 hover:bg-red-100 border-red-600 flex items-center justify-center space-x-1.5 font-extrabold cursor-pointer"
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
              className="brutal-btn p-2 text-red-600 hover:bg-red-50 border-red-600 cursor-pointer"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2FA SECURITY MODAL */}
      {/* ========================================================================= */}
      {show2FAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md brutal-card p-6 bg-white border-2 border-black shadow-[6px_6px_0px_#000000] relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-black">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-[#00f0ff] border border-black rounded">
                  <ShieldCheck className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="font-black text-base uppercase text-black">
                    Two-Factor Security (2FA)
                  </h3>
                  <p className="text-[11px] text-neutral-600">Multi-Factor Campus Clearance Settings</p>
                </div>
              </div>
              <button
                onClick={() => setShow2FAModal(false)}
                className="p-1 text-black hover:bg-neutral-100 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Toggle Status */}
            <div className="p-3.5 bg-neutral-50 border-2 border-black rounded-lg mb-4 flex items-center justify-between">
              <div>
                <div className="font-black text-xs uppercase text-black flex items-center gap-1.5">
                  <span>Enforce 2FA on Portal Login</span>
                  <span className={`px-1.5 py-0.2 text-[10px] rounded font-bold ${is2FAEnabled ? 'bg-emerald-200 text-emerald-900' : 'bg-neutral-200 text-neutral-700'}`}>
                    {is2FAEnabled ? 'ACTIVE' : 'DISABLED'}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-600 mt-0.5">
                  Requires 6-digit OTP or Authenticator token on every login.
                </p>
              </div>

              <button
                onClick={handleToggle2FA}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors border border-black ${
                  is2FAEnabled ? 'bg-[#a3e635]' : 'bg-neutral-300'
                }`}
              >
                <div
                  className={`bg-black w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    is2FAEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Active Authentication Methods List */}
            <div className="space-y-2.5 mb-4">
              <div className="text-xs font-black uppercase text-black">Configured Channels</div>
              
              <div className="p-2.5 bg-white border-2 border-black rounded-lg flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2.5">
                  <Mail className="w-4 h-4 text-black" />
                  <div>
                    <span className="font-bold text-black block">Institutional Email OTP</span>
                    <span className="text-[10px] text-neutral-500 font-mono">{activeEmail}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-[#a3e635] px-1.5 py-0.5 border border-black rounded">
                  READY
                </span>
              </div>

              <div className="p-2.5 bg-white border-2 border-black rounded-lg flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2.5">
                  <Smartphone className="w-4 h-4 text-black" />
                  <div>
                    <span className="font-bold text-black block">TOTP Authenticator App</span>
                    <span className="text-[10px] text-neutral-500">Google Authenticator, Authy, etc.</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-[#ffea00] px-1.5 py-0.5 border border-black rounded">
                  SUPPORTED
                </span>
              </div>
            </div>

            {/* Emergency Backup Keys Box */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase text-black flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-black" />
                  <span>Emergency Recovery Keys</span>
                </span>
                <button
                  onClick={handleGenerateNewKeys}
                  className="text-[10px] font-extrabold text-blue-700 hover:underline cursor-pointer"
                >
                  Generate New Keys
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1.5 bg-neutral-50 p-2.5 border-2 border-black rounded-lg">
                {backupKeys.map((key) => (
                  <button
                    key={key}
                    onClick={() => handleCopyKey(key)}
                    className="p-1.5 bg-white border border-black rounded text-[11px] font-mono font-bold text-neutral-800 hover:bg-[#ffea00] flex items-center justify-between cursor-pointer"
                    title="Click to copy recovery key"
                  >
                    <span>{key}</span>
                    {copiedKey === key ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3 text-neutral-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShow2FAModal(false)}
              className="w-full brutal-btn-primary py-2.5 text-xs font-black uppercase tracking-wider cursor-pointer"
            >
              Done & Save Security Settings
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

