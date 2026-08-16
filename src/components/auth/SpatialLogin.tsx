import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import { Role } from '../../types';
import { SpatialCard3D } from '../common/SpatialCard3D';
import {
  GraduationCap,
  Briefcase,
  ShieldAlert,
  Building,
  Fingerprint,
  Lock,
  User,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Boxes,
  Compass,
  CheckCircle2,
  ScanLine,
  Eye,
  EyeOff
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SpatialLogin: React.FC = () => {
  const {
    students,
    faculty,
    loginAsStudent,
    loginAsFaculty,
    loginAsRole
  } = useCollege();

  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);

  const roleConfigs: Record<
    Role,
    {
      title: string;
      desc: string;
      icon: React.ReactNode;
      accentGradient: string;
      borderGlow: string;
      badgeText: string;
      colorHex: string;
    }
  > = {
    student: {
      title: 'Student Spatial Portal',
      desc: 'Access holographic attendance, grades, 3D timetable, and Professor Turing AI',
      icon: <GraduationCap className="w-5 h-5 text-indigo-400" />,
      accentGradient: 'from-indigo-500 to-purple-600',
      borderGlow: 'rgba(99, 102, 241, 0.4)',
      badgeText: 'LEVEL 1 ACADEMIC NODE',
      colorHex: '#6366f1'
    },
    faculty: {
      title: 'Faculty Spatial Hub',
      desc: 'Manage grade ledgers, digital attendance rosters, lecture plans, and research grants',
      icon: <Briefcase className="w-5 h-5 text-emerald-400" />,
      accentGradient: 'from-emerald-500 to-teal-600',
      borderGlow: 'rgba(16, 185, 129, 0.4)',
      badgeText: 'PROFESSORIAL FACULTY CLEARANCE',
      colorHex: '#10b981'
    },
    hod: {
      title: 'HOD Executive Desk',
      desc: 'Departmental analytics, faculty workloads, at-risk student predictions, and curriculum approvals',
      icon: <ShieldAlert className="w-5 h-5 text-amber-400" />,
      accentGradient: 'from-amber-500 to-orange-600',
      borderGlow: 'rgba(245, 158, 11, 0.4)',
      badgeText: 'DEPARTMENT HEAD CLEARANCE (SEC-4)',
      colorHex: '#f59e0b'
    },
    admin: {
      title: 'Dean & Administration',
      desc: 'Campus-wide governance, infrastructure logs, fee settlements, audit pipelines, and master timetables',
      icon: <Building className="w-5 h-5 text-pink-400" />,
      accentGradient: 'from-pink-500 to-rose-600',
      borderGlow: 'rgba(236, 72, 153, 0.4)',
      badgeText: 'EXECUTIVE ROOT PRIVILEGES',
      colorHex: '#ec4899'
    }
  };

  const currentConfig = roleConfigs[selectedRole];

  // Active preview object
  const activeStudent = students[selectedPresetIndex % students.length] || students[0];
  const activeFaculty = faculty[selectedPresetIndex % faculty.length] || faculty[0];

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    if (selectedRole === 'student') {
      loginAsStudent(activeStudent);
    } else if (selectedRole === 'faculty') {
      loginAsFaculty(activeFaculty, 'faculty');
    } else if (selectedRole === 'hod') {
      loginAsFaculty(activeFaculty, 'hod');
    } else {
      loginAsRole('admin');
    }
  };

  const handleBiometricAuth = () => {
    setIsScanning(true);
    setScanComplete(false);
    setTimeout(() => {
      setScanComplete(true);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
      setTimeout(() => {
        setIsScanning(false);
        if (selectedRole === 'student') {
          loginAsStudent(activeStudent);
        } else if (selectedRole === 'faculty') {
          loginAsFaculty(activeFaculty, 'faculty');
        } else if (selectedRole === 'hod') {
          loginAsFaculty(activeFaculty, 'hod');
        } else {
          loginAsRole('admin');
        }
      }, 700);
    }, 1400);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 relative z-10">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: 3D Holographic ID Badge & Visual Identity */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-inner">
              <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
              <span>SPATIAL CAMPUS GATEWAY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Spatial Identity Badge
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
              Hover or move cursor over the 3D Holographic Smart Badge to verify biometric credentials
            </p>
          </div>

          {/* 3D Holographic Card Preview */}
          <SpatialCard3D
            depth={18}
            className="w-full max-w-sm rounded-3xl p-6 spatial-glass border border-white/20 shadow-2xl relative"
          >
            {/* Holographic Top Watermark */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center space-x-2.5">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${currentConfig.accentGradient} p-0.5 shadow-lg`}>
                  <div className="w-full h-full bg-slate-950/80 rounded-[10px] flex items-center justify-center text-white">
                    <Boxes className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-black tracking-wider text-white uppercase">
                    Apex Autonomous University
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Spatial Cyber-Physical Campus
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-indigo-300 border border-white/10">
                2026-27
              </span>
            </div>

            {/* Avatar & Persona Info */}
            <div className="flex items-center space-x-4 mb-5">
              <div className="relative">
                <img
                  src={selectedRole === 'student' ? activeStudent.avatar : activeFaculty.avatar}
                  alt="Profile"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-white/40 shadow-xl"
                />
                <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-slate-900 shadow">
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-base font-bold text-white leading-tight">
                  {selectedRole === 'student'
                    ? activeStudent.name
                    : selectedRole === 'admin'
                    ? 'Dr. Grace Hopper (Dean)'
                    : activeFaculty.name}
                </div>
                <div className="text-xs text-indigo-300 font-mono font-semibold">
                  {selectedRole === 'student'
                    ? `ID: ${activeStudent.rollNo}`
                    : selectedRole === 'admin'
                    ? 'ID: ADM-2026-ROOT'
                    : `EMP: ${activeFaculty.employeeId}`}
                </div>
                <div className="text-[11px] text-slate-400">
                  {selectedRole === 'student'
                    ? `${activeStudent.branch} • Sem ${activeStudent.semester}`
                    : selectedRole === 'admin'
                    ? 'Academic Governance & Registrar'
                    : `${activeFaculty.designation} • ${activeFaculty.department}`}
                </div>
              </div>
            </div>

            {/* Holographic Security Strip */}
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 space-y-1.5 mb-4">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>SECURITY CLEARANCE</span>
                <span className="text-emerald-400 font-bold">VERIFIED 256-BIT</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 w-full animate-pulse" />
              </div>
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                <span>PRN: 99482104-X</span>
                <span>BIOMETRIC: PASS</span>
              </div>
            </div>

            {/* Barcode Simulator */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] font-mono text-slate-400">
              <div className="tracking-widest opacity-80">
                |||| | ||| ||||| || |||||| | ||||
              </div>
              <span className="text-indigo-400 font-bold">NFC ENABLED</span>
            </div>
          </SpatialCard3D>
        </div>

        {/* Right Side: Spatial Login Form & Multi-Role Selector */}
        <div className="lg:col-span-7">
          <div className="spatial-glass border border-white/20 p-6 sm:p-8 shadow-2xl rounded-3xl relative overflow-hidden backdrop-blur-2xl">
            
            {/* Top Holographic Role Switcher */}
            <div className="mb-6">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                <span>Select Access Gateway</span>
                <span className="text-[10px] text-indigo-400 font-mono">4 ROLES ENABLED</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['student', 'faculty', 'hod', 'admin'] as Role[]).map((r) => {
                  const cfg = roleConfigs[r];
                  const isSelected = selectedRole === r;
                  return (
                    <button
                      key={r}
                      onClick={() => {
                        setSelectedRole(r);
                        setSelectedPresetIndex(0);
                      }}
                      className={`p-3 rounded-2xl flex flex-col items-center justify-center space-y-1.5 transition-all text-center cursor-pointer border ${
                        isSelected
                          ? 'bg-gradient-to-b from-indigo-600/50 to-purple-700/50 border-indigo-400 text-white shadow-lg shadow-indigo-500/25 scale-[1.03]'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {cfg.icon}
                      <span className="text-xs font-bold capitalize">{r}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Role Header Description */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 mb-6 flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-white/10 text-indigo-400 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{currentConfig.title}</h4>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{currentConfig.desc}</p>
              </div>
            </div>

            {/* Quick 1-Click Demo Profiles */}
            <div className="mb-6">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Instant Demo Profile Pickers:
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedRole === 'student' &&
                  students.slice(0, 3).map((std, idx) => (
                    <button
                      key={std.id}
                      onClick={() => {
                        setSelectedPresetIndex(idx);
                        loginAsStudent(std);
                        confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
                      }}
                      className="spatial-btn px-3 py-1.5 text-xs text-slate-200 flex items-center space-x-2 hover:text-white"
                    >
                      <img src={std.avatar} alt={std.name} className="w-4 h-4 rounded-full" />
                      <span>{std.name.split(' ')[0]}</span>
                      <span className="text-[10px] font-mono text-indigo-300">({std.rollNo})</span>
                    </button>
                  ))}

                {(selectedRole === 'faculty' || selectedRole === 'hod') &&
                  faculty.slice(0, 3).map((fac, idx) => (
                    <button
                      key={fac.id}
                      onClick={() => {
                        setSelectedPresetIndex(idx);
                        loginAsFaculty(fac, selectedRole);
                        confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
                      }}
                      className="spatial-btn px-3 py-1.5 text-xs text-slate-200 flex items-center space-x-2 hover:text-white"
                    >
                      <img src={fac.avatar} alt={fac.name} className="w-4 h-4 rounded-full" />
                      <span>{fac.name}</span>
                    </button>
                  ))}

                {selectedRole === 'admin' && (
                  <button
                    onClick={() => {
                      loginAsRole('admin');
                      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
                    }}
                    className="spatial-btn px-4 py-1.5 text-xs text-slate-200 flex items-center space-x-2 hover:text-white"
                  >
                    <Building className="w-4 h-4 text-pink-400" />
                    <span>Dean & Master Admin Gateway</span>
                  </button>
                )}
              </div>
            </div>

            {/* Manual Form Inputs */}
            <form onSubmit={handleManualLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {selectedRole === 'student'
                    ? 'Roll Number / PRN / Institutional Email'
                    : selectedRole === 'admin'
                    ? 'Administrator Access ID'
                    : 'Employee ID / Faculty Email'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={
                      selectedRole === 'student'
                        ? 'e.g., CS2023001 or aarav@apex.edu'
                        : selectedRole === 'admin'
                        ? 'admin@apex.edu'
                        : 'emp101@apex.edu'
                    }
                    className="w-full spatial-input pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Spatial Passkey / Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full spatial-input pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons: Sign In & Biometric Scan */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="submit"
                  className="spatial-btn-primary py-3 px-4 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2"
                >
                  <span>Authorize & Enter</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleBiometricAuth}
                  disabled={isScanning}
                  className="spatial-btn py-3 px-4 font-bold text-xs sm:text-sm text-indigo-300 hover:text-white flex items-center justify-center space-x-2 relative overflow-hidden"
                >
                  {isScanning ? (
                    <>
                      <ScanLine className="w-4 h-4 animate-bounce text-indigo-400" />
                      <span>Scanning Biometric...</span>
                      {/* Laser scanner effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent animate-pulse" />
                    </>
                  ) : scanComplete ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Biometric Verified!</span>
                    </>
                  ) : (
                    <>
                      <Fingerprint className="w-4 h-4 text-indigo-400" />
                      <span>Spatial Face / Touch ID</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Footer Notice */}
            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero-Trust Spatial Encryption</span>
              </span>
              <span className="text-slate-500 font-mono">v4.2-Spatial</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
