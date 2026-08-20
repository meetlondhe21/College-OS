import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import { Role, StudentProfile, FacultyProfile } from '../../types';
import {
  GraduationCap,
  Briefcase,
  ShieldAlert,
  Building,
  Lock,
  Mail,
  User,
  ArrowRight,
  UserPlus,
  LogIn,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Hash,
  BookOpen,
  Sparkles,
  Award,
  IdCard,
  QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const BrutalistAuth: React.FC = () => {
  const {
    students,
    faculty,
    loginAsStudent,
    loginAsFaculty,
    loginAsRole,
    addStudent,
    addFaculty
  } = useCollege();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<Role>('student');

  // Sign In State
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [signInError, setSignInError] = useState('');

  // Sign Up State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpId, setSignUpId] = useState(''); // Roll No or Emp ID
  const [signUpBranch, setSignUpBranch] = useState('Computer Science & Engineering');
  const [signUpSemester, setSignUpSemester] = useState(5);
  const [signUpSection, setSignUpSection] = useState('A');
  const [signUpDesignation, setSignUpDesignation] = useState<'Assistant Professor' | 'Associate Professor' | 'Professor' | 'HOD'>('Assistant Professor');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [signUpError, setSignUpError] = useState('');

  const roleMeta: Record<
    Role,
    {
      title: string;
      desc: string;
      icon: React.ReactNode;
      color: string;
      badgeBg: string;
      badgeText: string;
    }
  > = {
    student: {
      title: 'Student Portal Access',
      desc: 'View real-time attendance, semester grade sheets, course assignments, and AI tutor support.',
      icon: <GraduationCap className="w-5 h-5 text-black" />,
      color: '#ffea00',
      badgeBg: 'bg-[#ffea00]',
      badgeText: 'STUDENT IDENTITY'
    },
    faculty: {
      title: 'Faculty Portal Access',
      desc: 'Conduct roll-call attendance, submit CIE/external marks, grade student assignments, and publish notices.',
      icon: <Briefcase className="w-5 h-5 text-black" />,
      color: '#a3e635',
      badgeBg: 'bg-[#a3e635]',
      badgeText: 'FACULTY CLEARANCE'
    },
    hod: {
      title: 'HOD Executive Hub',
      desc: 'Monitor department pass percentages, detect at-risk students, inspect workloads, and generate audit reports.',
      icon: <ShieldAlert className="w-5 h-5 text-black" />,
      color: '#00f0ff',
      badgeBg: 'bg-[#00f0ff]',
      badgeText: 'HOD DESK ACCESS'
    },
    admin: {
      title: 'Dean & Administration',
      desc: 'Manage campus-wide student/faculty registries, timetable master schedules, classroom assets, and fees.',
      icon: <Building className="w-5 h-5 text-white" />,
      color: '#ff2a85',
      badgeBg: 'bg-[#ff2a85]',
      badgeText: 'ADMINISTRATOR ROOT'
    }
  };

  const currentRoleInfo = roleMeta[selectedRole];

  // Handle Sign In Submission
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError('');

    const query = signInIdentifier.trim().toLowerCase();

    if (selectedRole === 'student') {
      const match = students.find(
        (s) =>
          s.rollNo.toLowerCase() === query ||
          s.email.toLowerCase() === query ||
          s.name.toLowerCase().includes(query)
      );

      if (match) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        loginAsStudent(match);
        return;
      }

      // If no query typed, pick the first student
      if (!query) {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
        loginAsStudent(students[0]);
        return;
      }

      setSignInError('No student found matching this Roll Number or Email. Try demo profiles below!');
    } else if (selectedRole === 'faculty' || selectedRole === 'hod') {
      const match = faculty.find(
        (f) =>
          f.employeeId.toLowerCase() === query ||
          f.email.toLowerCase() === query ||
          f.name.toLowerCase().includes(query)
      );

      if (match) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        loginAsFaculty(match, selectedRole);
        return;
      }

      if (!query) {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
        loginAsFaculty(faculty[0], selectedRole);
        return;
      }

      setSignInError('No faculty found matching this Employee ID or Email.');
    } else {
      // Admin
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      loginAsRole('admin');
    }
  };

  // Handle Sign Up Submission
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError('');

    if (!signUpName.trim()) {
      setSignUpError('Please enter your full name.');
      return;
    }
    if (!signUpEmail.trim()) {
      setSignUpError('Please enter an institutional email.');
      return;
    }
    if (!signUpId.trim()) {
      setSignUpError(selectedRole === 'student' ? 'Please enter a Roll Number.' : 'Please enter an Employee ID.');
      return;
    }
    if (signUpPassword && signUpPassword !== signUpConfirmPassword) {
      setSignUpError('Passwords do not match.');
      return;
    }

    confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });

    if (selectedRole === 'student') {
      const newStudent: Omit<StudentProfile, 'id'> = {
        rollNo: signUpId.trim().toUpperCase(),
        prn: `PRN2026${Math.floor(100000 + Math.random() * 900000)}`,
        name: signUpName.trim(),
        email: signUpEmail.trim().toLowerCase(),
        avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(signUpName)}`,
        branch: signUpBranch,
        semester: Number(signUpSemester),
        section: signUpSection,
        batch: '2023-2027',
        guardianContact: '+1 (555) 019-2831',
        bloodGroup: 'O+',
        cgpa: 8.5,
        creditsCompleted: 92,
        totalCredits: 160,
        feeDue: 0,
        feeStatus: 'paid',
        attendanceRate: 90.0,
        address: 'University Campus Quad, Building B'
      };

      const fullStudent: StudentProfile = {
        ...newStudent,
        id: `std-${Date.now()}`
      };

      addStudent(newStudent);
      loginAsStudent(fullStudent);
    } else {
      // Faculty, HOD, or Admin
      const newFaculty: Omit<FacultyProfile, 'id'> = {
        employeeId: signUpId.trim().toUpperCase(),
        name: signUpName.trim(),
        email: signUpEmail.trim().toLowerCase(),
        avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(signUpName)}`,
        designation: selectedRole === 'hod' ? 'HOD' : signUpDesignation,
        department: signUpBranch,
        qualification: 'Ph.D. / M.Tech in Computer Science',
        subjectsAssigned: ['CS-501 Design & Analysis of Algorithms', 'CS-502 Database Management Systems'],
        officeHours: 'Mon-Thu 14:00 - 16:00',
        cabinNo: 'Faculty Block B-302',
        experienceYears: 6,
        workloadHoursPerWeek: 16
      };

      const fullFaculty: FacultyProfile = {
        ...newFaculty,
        id: `fac-${Date.now()}`
      };

      addFaculty(newFaculty);
      if (selectedRole === 'admin') {
        loginAsRole('admin');
      } else {
        loginAsFaculty(fullFaculty, selectedRole);
      }
    }
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-center min-h-[80vh]">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Brutalist ID Badge & Campus Identity */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          
          {/* Institutional Header Box */}
          <div className="brutal-card p-6 bg-white">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-[#ffea00] border-2 border-black rounded-lg flex items-center justify-center shadow-[3px_3px_0px_#000000]">
                <BookOpen className="w-6 h-6 text-black" />
              </div>
              <div>
                <span className="brutal-badge bg-black text-white text-[11px] mb-1">
                  OFFICIAL CAMPUS NODE
                </span>
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black">
                  College OS
                </h1>
              </div>
            </div>
            <p className="text-xs text-neutral-700 leading-relaxed font-medium">
              Unified brutalist multi-role academic operating system. Instant synchronization across attendance, grading rosters, timetable scheduling, and curriculum management.
            </p>
          </div>

          {/* Live Reactive Neo-Brutalist ID Card Preview */}
          <div className="brutal-card p-5 bg-white relative overflow-hidden">
            <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <IdCard className="w-5 h-5 text-black" />
                <span className="font-extrabold text-xs tracking-wider uppercase">
                  Institutional Smart Card
                </span>
              </div>
              <span className={`brutal-badge ${currentRoleInfo.badgeBg} text-black text-[10px]`}>
                {currentRoleInfo.badgeText}
              </span>
            </div>

            {/* Photo & Metadata Layout */}
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-20 h-20 bg-neutral-100 border-2 border-black rounded-lg shrink-0 overflow-hidden shadow-[2px_2px_0px_#000000] flex items-center justify-center">
                <img
                  src={
                    authMode === 'signup' && signUpName
                      ? `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(signUpName)}`
                      : selectedRole === 'student'
                      ? students[0]?.avatar
                      : faculty[0]?.avatar
                  }
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1 min-w-0 flex-1">
                <h3 className="font-black text-sm text-black truncate uppercase">
                  {authMode === 'signup'
                    ? signUpName || 'YOUR FULL NAME'
                    : selectedRole === 'student'
                    ? students[0]?.name || 'Alex Chen'
                    : selectedRole === 'admin'
                    ? 'Dean Grace Hopper'
                    : faculty[0]?.name || 'Dr. Alan Turing'}
                </h3>
                <div className="text-xs font-bold font-mono text-black bg-neutral-100 px-2 py-0.5 border border-black rounded inline-block">
                  {authMode === 'signup'
                    ? signUpId || (selectedRole === 'student' ? '22CS042' : 'EMP101')
                    : selectedRole === 'student'
                    ? students[0]?.rollNo || '22CS042'
                    : selectedRole === 'admin'
                    ? 'ADM-2026-ROOT'
                    : faculty[0]?.employeeId || 'EMP101'}
                </div>
                <div className="text-[11px] text-neutral-700 font-medium">
                  {authMode === 'signup'
                    ? `${signUpBranch} • ${selectedRole === 'student' ? `Sem ${signUpSemester}` : signUpDesignation}`
                    : selectedRole === 'student'
                    ? `${students[0]?.branch} • Sem ${students[0]?.semester}`
                    : selectedRole === 'admin'
                    ? 'Dean & Academic Registrar'
                    : `${faculty[0]?.designation} • ${faculty[0]?.department}`}
                </div>
              </div>
            </div>

            {/* Verification Barcode & Signature */}
            <div className="bg-neutral-100 border-2 border-black rounded p-2.5 flex items-center justify-between">
              <div className="font-mono text-[10px] font-bold tracking-widest text-black">
                ||| | |||| | || ||||| | ||| || |
              </div>
              <div className="flex items-center space-x-1 text-[10px] font-mono font-bold text-black">
                <QrCode className="w-3.5 h-3.5" />
                <span>NFC VERIFIED</span>
              </div>
            </div>
          </div>

          {/* Quick Features List */}
          <div className="brutal-card p-4 bg-[#fefce8] text-xs font-semibold space-y-2">
            <div className="font-black uppercase tracking-wider text-black flex items-center gap-1.5 text-xs">
              <Sparkles className="w-4 h-4 text-black" />
              <span>Full Autonomous Capabilities</span>
            </div>
            <ul className="space-y-1.5 text-neutral-800 font-medium">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" />
                <span>Automated 75% attendance threshold monitoring</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" />
                <span>Integrated Gemini 3.7 AI academic tutor & syllabus solver</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" />
                <span>Conflict-free timetable generator & exam gradebooks</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Sign In & Sign Up Form */}
        <div className="lg:col-span-7">
          <div className="brutal-card p-6 sm:p-8 bg-white">
            
            {/* Top Auth Mode Tabs (Sign In vs Sign Up) */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setSignInError('');
                  setSignUpError('');
                }}
                className={`py-3 px-4 rounded-lg font-black text-sm flex items-center justify-center space-x-2 border-2 border-black transition-all cursor-pointer ${
                  authMode === 'signin'
                    ? 'bg-[#ffea00] shadow-[3px_3px_0px_#000000] text-black translate-x-[-1px] translate-y-[-1px]'
                    : 'bg-white text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>SIGN IN</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setSignInError('');
                  setSignUpError('');
                }}
                className={`py-3 px-4 rounded-lg font-black text-sm flex items-center justify-center space-x-2 border-2 border-black transition-all cursor-pointer ${
                  authMode === 'signup'
                    ? 'bg-[#00f0ff] shadow-[3px_3px_0px_#000000] text-black translate-x-[-1px] translate-y-[-1px]'
                    : 'bg-white text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>SIGN UP / REGISTER</span>
              </button>
            </div>

            {/* Role Switcher Grid */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-black uppercase tracking-wider text-black">
                  Select Your Role
                </span>
                <span className="text-[11px] font-bold font-mono text-neutral-600">
                  4 PORTALS AVAILABLE
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['student', 'faculty', 'hod', 'admin'] as Role[]).map((r) => {
                  const meta = roleMeta[r];
                  const isSelected = selectedRole === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setSelectedRole(r);
                        setSignInError('');
                        setSignUpError('');
                      }}
                      className={`p-3 rounded-lg border-2 border-black flex flex-col items-center justify-center space-y-1 cursor-pointer transition-all ${
                        isSelected
                          ? `${meta.badgeBg} shadow-[3px_3px_0px_#000000] text-black font-extrabold translate-x-[-1px] translate-y-[-1px]`
                          : 'bg-white text-neutral-700 hover:bg-neutral-50 font-bold'
                      }`}
                    >
                      <div className="p-1 rounded">{meta.icon}</div>
                      <span className="text-xs capitalize">{r}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Role Description Banner */}
            <div className="p-3 bg-neutral-100 border-2 border-black rounded-lg mb-6 flex items-start space-x-3">
              <div className="p-1.5 bg-white border border-black rounded shadow-[1px_1px_0px_#000000]">
                {currentRoleInfo.icon}
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-black">
                  {currentRoleInfo.title}
                </h4>
                <p className="text-xs text-neutral-700 mt-0.5 font-medium">
                  {currentRoleInfo.desc}
                </p>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SIGN IN FORM */}
            {/* ========================================================================= */}
            {authMode === 'signin' && (
              <div>
                {/* 1-Click Instant Demo Pickers */}
                <div className="mb-5 p-3.5 bg-neutral-50 border-2 border-black rounded-lg">
                  <div className="text-xs font-black uppercase tracking-wider text-black mb-2 flex items-center justify-between">
                    <span>Quick 1-Click Demo Profiles:</span>
                    <span className="text-[10px] font-mono bg-black text-white px-1.5 py-0.5 rounded">FAST LOGIN</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedRole === 'student' &&
                      students.slice(0, 3).map((std) => (
                        <button
                          key={std.id}
                          type="button"
                          onClick={() => {
                            confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
                            loginAsStudent(std);
                          }}
                          className="brutal-btn px-3 py-1.5 text-xs text-black flex items-center space-x-2 bg-white"
                        >
                          <img src={std.avatar} alt={std.name} className="w-4 h-4 rounded-full border border-black" />
                          <span>{std.name}</span>
                          <span className="text-[10px] font-mono font-bold">({std.rollNo})</span>
                        </button>
                      ))}

                    {(selectedRole === 'faculty' || selectedRole === 'hod') &&
                      faculty.slice(0, 3).map((fac) => (
                        <button
                          key={fac.id}
                          type="button"
                          onClick={() => {
                            confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
                            loginAsFaculty(fac, selectedRole);
                          }}
                          className="brutal-btn px-3 py-1.5 text-xs text-black flex items-center space-x-2 bg-white"
                        >
                          <img src={fac.avatar} alt={fac.name} className="w-4 h-4 rounded-full border border-black" />
                          <span>{fac.name}</span>
                          <span className="text-[10px] font-mono font-bold">({fac.employeeId})</span>
                        </button>
                      ))}

                    {selectedRole === 'admin' && (
                      <button
                        type="button"
                        onClick={() => {
                          confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
                          loginAsRole('admin');
                        }}
                        className="brutal-btn px-4 py-2 text-xs text-black flex items-center space-x-2 bg-[#ffea00]"
                      >
                        <Building className="w-4 h-4 text-black" />
                        <span className="font-extrabold">Dean Grace Hopper (Admin Gateway)</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Manual Sign In Form */}
                <form onSubmit={handleSignIn} className="space-y-4">
                  {signInError && (
                    <div className="p-3 bg-red-100 border-2 border-red-600 rounded-lg flex items-center space-x-2 text-red-900 text-xs font-bold">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{signInError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-extrabold uppercase text-black mb-1.5">
                      {selectedRole === 'student'
                        ? 'Roll Number / Institutional Email'
                        : selectedRole === 'admin'
                        ? 'Administrator Access ID'
                        : 'Employee ID / Faculty Email'}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={signInIdentifier}
                        onChange={(e) => setSignInIdentifier(e.target.value)}
                        placeholder={
                          selectedRole === 'student'
                            ? 'e.g. 22CS042 or alex.chen@collegeos.edu'
                            : selectedRole === 'admin'
                            ? 'admin@collegeos.edu'
                            : 'EMP101 or alan.turing@collegeos.edu'
                        }
                        className="w-full brutal-input pl-10 pr-4 py-2.5 text-xs sm:text-sm text-black placeholder:text-neutral-400 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-extrabold uppercase text-black">
                        Password / Access Key
                      </label>
                      <span className="text-[11px] text-neutral-500 font-medium">Demo password: any key</span>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                      <input
                        type={showSignInPassword ? 'text' : 'password'}
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full brutal-input pl-10 pr-10 py-2.5 text-xs sm:text-sm text-black placeholder:text-neutral-400 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignInPassword(!showSignInPassword)}
                        className="absolute right-3.5 top-3 text-neutral-600 hover:text-black cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full brutal-btn-primary py-3 px-4 font-black text-sm uppercase tracking-wider flex items-center justify-center space-x-2 mt-2"
                  >
                    <span>Authorize & Enter Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SIGN UP FORM */}
            {/* ========================================================================= */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-4">
                {signUpError && (
                  <div className="p-3 bg-red-100 border-2 border-red-600 rounded-lg flex items-center space-x-2 text-red-900 text-xs font-bold">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{signUpError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-black mb-1.5">
                      Full Legal Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        placeholder="e.g. Maya Lin"
                        className="w-full brutal-input pl-10 pr-4 py-2.5 text-xs sm:text-sm text-black placeholder:text-neutral-400 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase text-black mb-1.5">
                      Institutional Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        placeholder="maya.lin@collegeos.edu"
                        className="w-full brutal-input pl-10 pr-4 py-2.5 text-xs sm:text-sm text-black placeholder:text-neutral-400 font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-black mb-1.5">
                      {selectedRole === 'student' ? 'Roll Number / PRN' : 'Employee ID Number'}
                    </label>
                    <div className="relative">
                      <Hash className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={signUpId}
                        onChange={(e) => setSignUpId(e.target.value)}
                        placeholder={selectedRole === 'student' ? '22CS105' : 'EMP205'}
                        className="w-full brutal-input pl-10 pr-4 py-2.5 text-xs sm:text-sm text-black placeholder:text-neutral-400 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase text-black mb-1.5">
                      Academic Department / Branch
                    </label>
                    <select
                      value={signUpBranch}
                      onChange={(e) => setSignUpBranch(e.target.value)}
                      className="w-full brutal-input px-3 py-2.5 text-xs sm:text-sm text-black font-semibold cursor-pointer"
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                    </select>
                  </div>
                </div>

                {selectedRole === 'student' ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-extrabold uppercase text-black mb-1.5">
                        Current Semester
                      </label>
                      <select
                        value={signUpSemester}
                        onChange={(e) => setSignUpSemester(Number(e.target.value))}
                        className="w-full brutal-input px-3 py-2.5 text-xs sm:text-sm text-black font-semibold cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                          <option key={s} value={s}>
                            Semester {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase text-black mb-1.5">
                        Class Section
                      </label>
                      <select
                        value={signUpSection}
                        onChange={(e) => setSignUpSection(e.target.value)}
                        className="w-full brutal-input px-3 py-2.5 text-xs sm:text-sm text-black font-semibold cursor-pointer"
                      >
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                        <option value="C">Section C</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-black mb-1.5">
                      Academic Designation
                    </label>
                    <select
                      value={signUpDesignation}
                      onChange={(e) => setSignUpDesignation(e.target.value as any)}
                      className="w-full brutal-input px-3 py-2.5 text-xs sm:text-sm text-black font-semibold cursor-pointer"
                    >
                      <option value="Assistant Professor">Assistant Professor</option>
                      <option value="Associate Professor">Associate Professor</option>
                      <option value="Professor">Professor</option>
                      <option value="HOD">Head of Department (HOD)</option>
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-black mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                      <input
                        type={showSignUpPassword ? 'text' : 'password'}
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full brutal-input pl-10 pr-10 py-2.5 text-xs sm:text-sm text-black placeholder:text-neutral-400 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                        className="absolute right-3.5 top-3 text-neutral-600 hover:text-black cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase text-black mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                      <input
                        type={showSignUpPassword ? 'text' : 'password'}
                        value={signUpConfirmPassword}
                        onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full brutal-input pl-10 pr-4 py-2.5 text-xs sm:text-sm text-black placeholder:text-neutral-400 font-medium"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full brutal-btn-cyan py-3 px-4 font-black text-sm uppercase tracking-wider flex items-center justify-center space-x-2 mt-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account & Log In</span>
                </button>
              </form>
            )}

            {/* Footer Institutional Assurance */}
            <div className="mt-6 pt-4 border-t-2 border-black flex items-center justify-between text-xs text-neutral-600 font-bold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>NAAC / NBA Accredited System</span>
              </span>
              <span className="font-mono text-[11px] bg-black text-white px-2 py-0.5 rounded">
                COLLEGE OS v2.0
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
