import React, { useState, useEffect, useRef } from 'react';
import { useCollege } from '../../context/CollegeContext';
import { Role, StudentProfile, FacultyProfile, TwoFactorChallenge } from '../../types';
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
  IdCard,
  QrCode,
  Loader2,
  KeyRound,
  ShieldCheck,
  Smartphone,
  Copy,
  Check,
  RefreshCw,
  ArrowLeft,
  Key,
  Flame,
  ExternalLink,
  Inbox,
  Send,
  Edit2,
  X,
  MailCheck,
  SendHorizontal,
  Radio,
  Signal,
  MessageSquareCode,
  Zap,
  PhoneCall
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const BrutalistAuth: React.FC = () => {
  const {
    students,
    faculty,
    loginWithCredentials,
    signupWithCredentials,
    activeTwoFactorChallenge,
    verifyTwoFactorCode,
    resendTwoFactorCode,
    updateChallengeEmailAndResend,
    sendOtpVia2FactorSms
  } = useCollege();

  const [authMode, setAuthMode] = useState<'signin' | 'signup' | '2fa'>('signin');
  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [isLoading, setIsLoading] = useState(false);

  // Sign In State
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [signInError, setSignInError] = useState('');

  // Sign Up State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('+91 98765 43210');
  const [signUpId, setSignUpId] = useState(''); // Roll No or Emp ID
  const [signUpBranch, setSignUpBranch] = useState('Computer Science & Engineering');
  const [signUpSemester, setSignUpSemester] = useState(5);
  const [signUpSection, setSignUpSection] = useState('A');
  const [signUpDesignation, setSignUpDesignation] = useState<'Assistant Professor' | 'Associate Professor' | 'Professor' | 'HOD'>('Assistant Professor');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [signUpError, setSignUpError] = useState('');

  // 2FA Challenge State
  const [challengeData, setChallengeData] = useState<TwoFactorChallenge | null>(null);
  const [selected2FAMethod, setSelected2FAMethod] = useState<'sms_otp' | 'email_otp' | 'authenticator_app' | 'backup_code'>('sms_otp');
  const [digitInputs, setDigitInputs] = useState<string[]>(['', '', '', '', '', '']);
  const [backupCodeInput, setBackupCodeInput] = useState('');
  const [twoFactorError, setTwoFactorError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [copiedToken, setCopiedToken] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(180);

  // Email Delivery Enhancement State
  const [customEmailInput, setCustomEmailInput] = useState('');
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isSendingCustomEmail, setIsSendingCustomEmail] = useState(false);
  const [showEmailPreviewModal, setShowEmailPreviewModal] = useState(false);
  const [emailSuccessNotice, setEmailSuccessNotice] = useState('');

  // 2Factor.in SMS Gateway State
  const [phoneInput, setPhoneInput] = useState('+91 98765 43210');
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [smsNotice, setSmsNotice] = useState('');
  const [smsSessionId, setSmsSessionId] = useState('');
  const [showSmsGatewayModal, setShowSmsGatewayModal] = useState(false);
  const [gatewayInfo, setGatewayInfo] = useState<{
    configured: boolean;
    provider: string;
    maskedApiKey: string;
    connected: boolean;
    balance: string | null;
    statusMessage: string;
    recentDispatches: any[];
  } | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Synchronize challenge from context if available
  useEffect(() => {
    if (activeTwoFactorChallenge) {
      setChallengeData(activeTwoFactorChallenge);
      setAuthMode('2fa');
      setTwoFactorError('');
      setDigitInputs(['', '', '', '', '', '']);
      setSecondsRemaining(Math.max(0, Math.floor((activeTwoFactorChallenge.expiresAt - Date.now()) / 1000)));
      setCustomEmailInput(activeTwoFactorChallenge.email);
    }
  }, [activeTwoFactorChallenge]);

  // Countdown timer for 2FA code expiry
  useEffect(() => {
    if (authMode !== '2fa' || !challengeData) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((challengeData.expiresAt - Date.now()) / 1000));
      setSecondsRemaining(remaining);
    }, 1000);
    return () => clearInterval(interval);
  }, [authMode, challengeData]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Focus first digit when entering 2FA mode
  useEffect(() => {
    if (authMode === '2fa' && selected2FAMethod !== 'backup_code') {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [authMode, selected2FAMethod]);

  const roleMeta: Record<
    Role,
    {
      title: string;
      desc: string;
      icon: React.ReactNode;
      color: string;
      badgeBg: string;
      badgeText: string;
      defaultUser: { name: string; id: string; email: string };
    }
  > = {
    student: {
      title: 'Student Portal Access',
      desc: 'View real-time attendance, semester grade sheets, course assignments, and AI tutor support.',
      icon: <GraduationCap className="w-5 h-5 text-black" />,
      color: '#ffea00',
      badgeBg: 'bg-[#ffea00]',
      badgeText: 'STUDENT IDENTITY',
      defaultUser: { name: 'Alex Chen', id: '22CS042', email: 'alex.chen@collegeos.edu' }
    },
    faculty: {
      title: 'Faculty Portal Access',
      desc: 'Conduct roll-call attendance, submit CIE/external marks, grade student assignments, and publish notices.',
      icon: <Briefcase className="w-5 h-5 text-black" />,
      color: '#a3e635',
      badgeBg: 'bg-[#a3e635]',
      badgeText: 'FACULTY CLEARANCE',
      defaultUser: { name: 'Dr. Alan Turing', id: 'EMP101', email: 'alan.turing@collegeos.edu' }
    },
    hod: {
      title: 'HOD Executive Hub',
      desc: 'Monitor department pass percentages, detect at-risk students, inspect workloads, and generate audit reports.',
      icon: <ShieldAlert className="w-5 h-5 text-black" />,
      color: '#00f0ff',
      badgeBg: 'bg-[#00f0ff]',
      badgeText: 'HOD DESK ACCESS',
      defaultUser: { name: 'Dr. Linus Torvalds', id: 'EMP103', email: 'linus.torvalds@collegeos.edu' }
    },
    admin: {
      title: 'Dean & Administration',
      desc: 'Manage campus-wide student/faculty registries, timetable master schedules, classroom assets, and fees.',
      icon: <Building className="w-5 h-5 text-white" />,
      color: '#ff2a85',
      badgeBg: 'bg-[#ff2a85]',
      badgeText: 'ADMINISTRATOR ROOT',
      defaultUser: { name: 'Dean Grace Hopper', id: 'ADM001', email: 'admin@collegeos.edu' }
    }
  };

  const currentRoleInfo = roleMeta[selectedRole];

  // Quick fill helper to populate credentials
  const fillCredentials = (identifier: string, role: Role, autoSubmit = false) => {
    setSelectedRole(role);
    setSignInIdentifier(identifier);
    setSignInPassword('CollegeOS@2026');
    setSignInError('');

    if (autoSubmit) {
      setTimeout(async () => {
        setIsLoading(true);
        try {
          const res = await loginWithCredentials({
            identifier,
            password: 'CollegeOS@2026',
            role
          });
          if (!res.success) {
            setSignInError(res.error || 'Authentication failed.');
          } else if (res.requires2FA && res.challenge) {
            setChallengeData(res.challenge);
            setAuthMode('2fa');
            setResendCooldown(30);
          } else {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
          }
        } catch (err: any) {
          setSignInError(err?.message || 'Login failed.');
        } finally {
          setIsLoading(false);
        }
      }, 50);
    }
  };

  // Handle Sign In Submission with strict authorization & 2FA challenge transition
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError('');

    if (!signInIdentifier.trim()) {
      setSignInError(
        selectedRole === 'student'
          ? 'Please enter your Roll Number (e.g. 22CS042) or Email.'
          : 'Please enter your Employee ID (e.g. EMP101), Admin ID, or Email.'
      );
      return;
    }

    if (!signInPassword.trim()) {
      setSignInError('Password is required to access authorized portals.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginWithCredentials({
        identifier: signInIdentifier.trim(),
        password: signInPassword.trim(),
        role: selectedRole
      });

      if (!res.success) {
        setSignInError(res.error || 'Access Denied: Invalid credentials.');
      } else if (res.requires2FA && res.challenge) {
        setChallengeData(res.challenge);
        setAuthMode('2fa');
        setResendCooldown(30);
      } else {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }
    } catch (err: any) {
      setSignInError(err?.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Sign Up Submission with Firebase Auth creation and 2FA trigger
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError('');

    if (!signUpName.trim()) {
      setSignUpError('Please enter your full legal name.');
      return;
    }
    if (!signUpEmail.trim() || !signUpEmail.includes('@')) {
      setSignUpError('Please enter a valid institutional email.');
      return;
    }
    if (!signUpId.trim()) {
      setSignUpError(selectedRole === 'student' ? 'Please enter a Roll Number.' : 'Please enter an Employee ID.');
      return;
    }
    if (!signUpPassword) {
      setSignUpError('Please enter a password.');
      return;
    }
    if (signUpPassword.length < 6) {
      setSignUpError('Password must be at least 6 characters.');
      return;
    }
    if (signUpPassword !== signUpConfirmPassword) {
      setSignUpError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await signupWithCredentials({
        name: signUpName.trim(),
        email: signUpEmail.trim(),
        password: signUpPassword,
        role: selectedRole,
        identifier: signUpId.trim(),
        branch: signUpBranch,
        semester: Number(signUpSemester),
        section: signUpSection,
        designation: signUpDesignation
      });

      if (!res.success) {
        setSignUpError(res.error || 'Registration failed.');
      } else if (res.requires2FA && res.challenge) {
        setChallengeData(res.challenge);
        setAuthMode('2fa');
        setResendCooldown(30);
      } else {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
      }
    } catch (err: any) {
      setSignUpError(err?.message || 'Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  // Digit Input Handlers for 2FA
  const handleDigitChange = (index: number, val: string) => {
    // Handle paste of full 6 digits
    if (val.length > 1) {
      const sanitized = val.replace(/\D/g, '').slice(0, 6);
      if (sanitized.length > 0) {
        const nextDigits = [...digitInputs];
        for (let i = 0; i < sanitized.length; i++) {
          nextDigits[i] = sanitized[i];
        }
        setDigitInputs(nextDigits);
        const focusTarget = Math.min(sanitized.length, 5);
        inputRefs.current[focusTarget]?.focus();
      }
      return;
    }

    const char = val.slice(-1);
    const nextDigits = [...digitInputs];
    nextDigits[index] = char;
    setDigitInputs(nextDigits);
    setTwoFactorError('');

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digitInputs[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Auto-fill active simulated token into 6 digit boxes
  const handleAutoFillToken = () => {
    if (challengeData) {
      const codeStr = challengeData.code;
      const digits = codeStr.split('');
      while (digits.length < 6) digits.push('0');
      setDigitInputs(digits.slice(0, 6));
      setTwoFactorError('');
      inputRefs.current[5]?.focus();
    }
  };

  const handleCopyToken = () => {
    if (challengeData) {
      navigator.clipboard.writeText(challengeData.code);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  // Submit 2FA Code
  const handleVerify2FA = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!challengeData) return;

    let codeToVerify = '';
    if (selected2FAMethod === 'backup_code') {
      codeToVerify = backupCodeInput.trim();
      if (!codeToVerify) {
        setTwoFactorError('Please enter an emergency recovery backup key.');
        return;
      }
    } else {
      codeToVerify = digitInputs.join('');
      if (codeToVerify.length < 6) {
        setTwoFactorError('Please enter all 6 digits of your 2FA verification token.');
        return;
      }
    }

    setIsLoading(true);
    setTwoFactorError('');

    try {
      const res = await verifyTwoFactorCode(challengeData, codeToVerify);
      if (!res.success) {
        setTwoFactorError(res.error || 'Invalid 2FA code. Please check and retry.');
      } else {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } catch (err: any) {
      setTwoFactorError(err?.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update recipient email and re-dispatch OTP
  const handleUpdateRecipientEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmailInput.trim() || !customEmailInput.includes('@')) {
      setTwoFactorError('Please provide a valid institutional or personal email address.');
      return;
    }
    setIsSendingCustomEmail(true);
    setTwoFactorError('');
    try {
      const res = await updateChallengeEmailAndResend(customEmailInput.trim());
      if (res.success) {
        setIsChangingEmail(false);
        setResendCooldown(30);
        setEmailSuccessNotice(`Security token successfully dispatched to ${customEmailInput.trim()}`);
        setTimeout(() => setEmailSuccessNotice(''), 6000);
      } else {
        setTwoFactorError(res.error || 'Failed to dispatch email to this address.');
      }
    } catch (err: any) {
      setTwoFactorError(err?.message || 'Email delivery failed.');
    } finally {
      setIsSendingCustomEmail(false);
    }
  };

  // Fetch 2Factor Gateway Status
  const fetchGatewayStatus = async () => {
    try {
      const res = await fetch('/api/auth/2factor-gateway-status');
      if (res.ok) {
        const data = await res.json();
        setGatewayInfo(data);
      }
    } catch (e) {
      console.warn('Failed to load 2Factor gateway status:', e);
    }
  };

  useEffect(() => {
    fetchGatewayStatus();
  }, []);

  // Send 2FA SMS via 2Factor.in Gateway
  const handleSend2FactorSms = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phoneInput.trim()) {
      setTwoFactorError('Please enter a valid phone number with country code (e.g. +91 9876543210).');
      return;
    }
    setIsSendingSms(true);
    setTwoFactorError('');
    try {
      const codeToSend = challengeData?.code;
      const res = await sendOtpVia2FactorSms(phoneInput.trim(), codeToSend);
      if (res.success) {
        setSmsNotice(res.message || `SMS OTP dispatched via 2Factor.in to ${phoneInput.trim()}`);
        if (res.sessionId) setSmsSessionId(res.sessionId);
        setResendCooldown(30);
        setTimeout(() => setSmsNotice(''), 8000);
        fetchGatewayStatus();
      } else {
        setTwoFactorError(res.error || 'Failed to dispatch SMS through 2Factor gateway.');
      }
    } catch (err: any) {
      setTwoFactorError(err?.message || 'SMS delivery failed.');
    } finally {
      setIsSendingSms(false);
    }
  };

  // Resend 2FA Code
  const handleResend2FA = async () => {
    if (!challengeData || resendCooldown > 0) return;
    setIsLoading(true);
    setTwoFactorError('');
    try {
      const { newCode, expiresAt } = await resendTwoFactorCode(challengeData);
      setChallengeData((prev) => (prev ? { ...prev, code: newCode, expiresAt } : null));
      setResendCooldown(30);
      setDigitInputs(['', '', '', '', '', '']);
      setEmailSuccessNotice(`Fresh OTP dispatched to ${challengeData.email}`);
      setTimeout(() => setEmailSuccessNotice(''), 5000);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setTwoFactorError('Failed to refresh 2FA token.');
    } finally {
      setIsLoading(false);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
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
              Unified multi-role academic operating system with Firebase Authentication and Two-Factor Security (2FA). Portals are strictly guarded against unauthorized ingress.
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
                {authMode === '2fa' && challengeData ? `${challengeData.role.toUpperCase()} 2FA CLEARANCE` : currentRoleInfo.badgeText}
              </span>
            </div>

            {/* Photo & Metadata Layout */}
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-20 h-20 bg-neutral-100 border-2 border-black rounded-lg shrink-0 overflow-hidden shadow-[2px_2px_0px_#000000] flex items-center justify-center">
                <img
                  src={
                    authMode === '2fa' && challengeData
                      ? `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(challengeData.name)}`
                      : authMode === 'signup' && signUpName
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
                  {authMode === '2fa' && challengeData
                    ? challengeData.name
                    : authMode === 'signup'
                    ? signUpName || 'YOUR FULL NAME'
                    : selectedRole === 'student'
                    ? students[0]?.name || 'Alex Chen'
                    : selectedRole === 'admin'
                    ? 'Dean Grace Hopper'
                    : faculty[0]?.name || 'Dr. Alan Turing'}
                </h3>
                <div className="text-xs font-bold font-mono text-black bg-neutral-100 px-2 py-0.5 border border-black rounded inline-block">
                  {authMode === '2fa' && challengeData
                    ? challengeData.identifier
                    : authMode === 'signup'
                    ? signUpId || (selectedRole === 'student' ? '22CS042' : 'EMP101')
                    : selectedRole === 'student'
                    ? students[0]?.rollNo || '22CS042'
                    : selectedRole === 'admin'
                    ? 'ADM-2026-ROOT'
                    : faculty[0]?.employeeId || 'EMP101'}
                </div>
                <div className="text-[11px] text-neutral-700 font-medium">
                  {authMode === '2fa' && challengeData
                    ? `${challengeData.department || 'Autonomous Campus'} • 2FA Authentication`
                    : authMode === 'signup'
                    ? `${signUpBranch} • ${selectedRole === 'student' ? `Sem ${signUpSemester}` : signUpDesignation}`
                    : selectedRole === 'student'
                    ? `${students[0]?.branch} • Sem ${students[0]?.semester}`
                    : selectedRole === 'admin'
                    ? 'Dean & Academic Registrar'
                    : `${faculty[0]?.designation} • ${faculty[0]?.department}`}
                </div>
              </div>
            </div>

            {/* 2FA Security Seal */}
            <div className="bg-neutral-100 border-2 border-black rounded p-2.5 flex items-center justify-between">
              <div className="flex items-center space-x-1.5 font-mono text-[10px] font-bold text-black">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>2FA MULTI-FACTOR ACTIVE</span>
              </div>
              <div className="flex items-center space-x-1 text-[10px] font-mono font-bold text-black">
                <QrCode className="w-3.5 h-3.5" />
                <span>ENCRYPTED</span>
              </div>
            </div>
          </div>

          {/* Quick Credentials Info Card */}
          <div className="brutal-card p-4 bg-[#fefce8] text-xs font-semibold space-y-2.5">
            <div className="font-black uppercase tracking-wider text-black flex items-center gap-1.5 text-xs">
              <KeyRound className="w-4 h-4 text-black" />
              <span>Institutional Test Credentials & 2FA</span>
            </div>
            <div className="text-[11px] text-neutral-800 space-y-1">
              <p>
                • <strong>Student:</strong> <span className="font-mono bg-white px-1 border border-black rounded">22CS042</span> / <span className="font-mono bg-white px-1 border border-black rounded">CollegeOS@2026</span>
              </p>
              <p>
                • <strong>Faculty:</strong> <span className="font-mono bg-white px-1 border border-black rounded">EMP101</span> / <span className="font-mono bg-white px-1 border border-black rounded">CollegeOS@2026</span>
              </p>
              <p>
                • <strong>HOD:</strong> <span className="font-mono bg-white px-1 border border-black rounded">EMP103</span> / <span className="font-mono bg-white px-1 border border-black rounded">CollegeOS@2026</span>
              </p>
              <p>
                • <strong>Admin:</strong> <span className="font-mono bg-white px-1 border border-black rounded">admin@collegeos.edu</span> / <span className="font-mono bg-white px-1 border border-black rounded">CollegeOS@2026</span>
              </p>
              <p className="pt-1 text-[10px] text-neutral-600 border-t border-neutral-300">
                ⚡ <em>2FA Tokens:</em> Auto-filled dynamically on verification step, or enter universal test key <span className="font-mono bg-white px-1 border border-black rounded">123456</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Auth Form & 2FA Flow */}
        <div className="lg:col-span-7">
          <div className="brutal-card p-6 sm:p-8 bg-white">
            
            {/* ========================================================================= */}
            {/* 2FA VERIFICATION SCREEN (STEP 2) */}
            {/* ========================================================================= */}
            {authMode === '2fa' && challengeData ? (
              <div className="space-y-6">
                
                {/* 2FA Header */}
                <div className="border-b-2 border-black pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="brutal-badge bg-[#00f0ff] text-black text-[11px] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>STEP 2 OF 2: TWO-FACTOR VERIFICATION</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('signin');
                        setTwoFactorError('');
                      }}
                      className="text-xs font-bold text-neutral-600 hover:text-black flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Sign In</span>
                    </button>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black flex items-center gap-2">
                    <span>Identity Authorization</span>
                    <Flame className="w-5 h-5 text-[#ff2a85]" />
                  </h2>

                  <p className="text-xs text-neutral-700 mt-1">
                    Verifying authorized session for <strong className="text-black font-black">{challengeData.name}</strong> ({challengeData.email}).
                  </p>
                </div>

                {/* Simulated Live Token Delivery Broadcast Banner */}
                <div className="p-4 bg-[#f0fdf4] border-2 border-black rounded-lg shadow-[3px_3px_0px_#000000]">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2.5">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-xs font-black uppercase tracking-wider text-black">
                        Active Campus Security Token:
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 bg-white border border-black rounded text-neutral-700">
                        Expires in {formatTime(secondsRemaining)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 border-2 border-black rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="font-mono text-2xl font-black tracking-[0.3em] text-black">
                        {challengeData.code}
                      </div>
                      <span className="text-[10px] font-bold font-mono uppercase bg-[#ffea00] px-1.5 py-0.5 border border-black rounded">
                        VALID OTP
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={handleCopyToken}
                        className="brutal-btn px-2.5 py-1 text-xs text-black bg-white flex items-center space-x-1"
                        title="Copy OTP to clipboard"
                      >
                        {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedToken ? 'Copied' : 'Copy'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleAutoFillToken}
                        className="brutal-btn-primary px-3 py-1 text-xs uppercase font-extrabold flex items-center space-x-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Auto-Fill Token</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2FA Method Selector Tabs */}
                <div>
                  <label className="block text-xs font-extrabold uppercase text-black mb-2">
                    Choose 2FA Verification Channel
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelected2FAMethod('sms_otp');
                        setTwoFactorError('');
                      }}
                      className={`p-2.5 rounded-lg border-2 border-black flex flex-col items-center justify-center space-y-1 cursor-pointer transition-all ${
                        selected2FAMethod === 'sms_otp'
                          ? 'bg-[#00f0ff] shadow-[2px_2px_0px_#000000] text-black font-extrabold'
                          : 'bg-white text-neutral-700 hover:bg-neutral-50 font-bold'
                      }`}
                    >
                      <div className="flex items-center space-x-1">
                        <Smartphone className="w-4 h-4 text-black shrink-0" />
                        <span className="text-[10px] uppercase font-mono px-1 bg-black text-white rounded font-bold">2Factor</span>
                      </div>
                      <span className="text-xs">SMS OTP</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelected2FAMethod('email_otp');
                        setTwoFactorError('');
                      }}
                      className={`p-2.5 rounded-lg border-2 border-black flex flex-col items-center justify-center space-y-1 cursor-pointer transition-all ${
                        selected2FAMethod === 'email_otp'
                          ? 'bg-[#ffea00] shadow-[2px_2px_0px_#000000] text-black font-extrabold'
                          : 'bg-white text-neutral-700 hover:bg-neutral-50 font-bold'
                      }`}
                    >
                      <Mail className="w-4 h-4 text-black shrink-0" />
                      <span className="text-xs">Email OTP</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelected2FAMethod('authenticator_app');
                        setTwoFactorError('');
                      }}
                      className={`p-2.5 rounded-lg border-2 border-black flex flex-col items-center justify-center space-y-1 cursor-pointer transition-all ${
                        selected2FAMethod === 'authenticator_app'
                          ? 'bg-[#b8ff34] shadow-[2px_2px_0px_#000000] text-black font-extrabold'
                          : 'bg-white text-neutral-700 hover:bg-neutral-50 font-bold'
                      }`}
                    >
                      <KeyRound className="w-4 h-4 text-black shrink-0" />
                      <span className="text-xs">Authenticator</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelected2FAMethod('backup_code');
                        setTwoFactorError('');
                      }}
                      className={`p-2.5 rounded-lg border-2 border-black flex flex-col items-center justify-center space-y-1 cursor-pointer transition-all ${
                        selected2FAMethod === 'backup_code'
                          ? 'bg-[#ff2a85] shadow-[2px_2px_0px_#000000] text-white font-extrabold'
                          : 'bg-white text-neutral-700 hover:bg-neutral-50 font-bold'
                      }`}
                    >
                      <Key className="w-4 h-4 text-black shrink-0" />
                      <span className="text-xs">Emergency Key</span>
                    </button>
                  </div>
                </div>

                {/* 2Factor.in SMS Gateway Delivery Panel */}
                {selected2FAMethod === 'sms_otp' && (
                  <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-black rounded-lg shadow-[3px_3px_0px_#000000] space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-black/15 pb-2.5">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-[#00f0ff] border-2 border-black rounded-lg flex items-center justify-center shadow-[1px_1px_0px_#000000]">
                          <Smartphone className="w-4 h-4 text-black" />
                        </div>
                        <div>
                          <div className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                            <span>2Factor.in SMS Gateway</span>
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-500">
                              <Signal className="w-3 h-3 mr-1 text-emerald-600 animate-pulse" />
                              Gateway Live
                            </span>
                          </div>
                          <div className="text-[11px] font-mono text-neutral-600">
                            Target Phone: <strong className="text-black">{phoneInput}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            fetchGatewayStatus();
                            setShowSmsGatewayModal(true);
                          }}
                          className="font-mono text-[11px] font-bold px-2 py-0.5 bg-white border border-black rounded text-neutral-800 hover:bg-neutral-100 cursor-pointer flex items-center space-x-1"
                        >
                          <Radio className="w-3 h-3 text-cyan-600" />
                          <span>API Telemetry</span>
                        </button>
                      </div>
                    </div>

                    {smsNotice && (
                      <div className="p-2.5 bg-emerald-100 border border-emerald-600 rounded text-emerald-900 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>{smsNotice}</span>
                      </div>
                    )}

                    {/* Phone Number Input & Quick Presets */}
                    <form onSubmit={handleSend2FactorSms} className="space-y-2">
                      <label className="block text-[11px] font-black uppercase text-black">
                        Recipient Mobile Number (with Country Code):
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-1">
                          <PhoneCall className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                          <input
                            type="tel"
                            required
                            value={phoneInput}
                            onChange={(e) => setPhoneInput(e.target.value)}
                            placeholder="e.g. +91 9876543210"
                            className="w-full brutal-input pl-9 pr-3 py-2 text-xs font-mono font-bold text-black"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isSendingSms}
                          className="brutal-btn-cyan px-4 py-2 text-xs font-black uppercase flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                        >
                          {isSendingSms ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Dispatching SMS...</span>
                            </>
                          ) : (
                            <>
                              <Zap className="w-3.5 h-3.5 text-black" />
                              <span>Send SMS OTP (2Factor)</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Quick Presets */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] font-bold text-neutral-500 uppercase">Quick Test Numbers:</span>
                        <button
                          type="button"
                          onClick={() => setPhoneInput('+91 98765 43210')}
                          className="px-2 py-0.5 text-[10px] font-mono font-bold bg-white border border-black rounded hover:bg-neutral-100 text-black cursor-pointer"
                        >
                          +91 98765 43210 (Demo Student)
                        </button>
                        <button
                          type="button"
                          onClick={() => setPhoneInput('+91 98123 45678')}
                          className="px-2 py-0.5 text-[10px] font-mono font-bold bg-white border border-black rounded hover:bg-neutral-100 text-black cursor-pointer"
                        >
                          +91 98123 45678 (Demo Faculty)
                        </button>
                      </div>

                      {smsSessionId && (
                        <div className="p-2 bg-white border border-cyan-400 rounded text-[11px] font-mono text-neutral-700 flex items-center justify-between">
                          <span>2Factor Session ID: <strong className="text-black">{smsSessionId}</strong></span>
                          <span className="text-[10px] bg-cyan-100 text-cyan-900 px-1.5 py-0.5 rounded font-bold">SMS Sent</span>
                        </div>
                      )}
                    </form>
                  </div>
                )}

                {/* Email OTP Delivery Status & Live Webmail Hub */}
                {selected2FAMethod === 'email_otp' && (
                  <div className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-black rounded-lg shadow-[3px_3px_0px_#000000] space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-black/15 pb-2.5">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-[#ffea00] border-2 border-black rounded-lg flex items-center justify-center shadow-[1px_1px_0px_#000000]">
                          <Mail className="w-4 h-4 text-black" />
                        </div>
                        <div>
                          <div className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                            <span>OTP Dispatched to Email</span>
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-500">
                              <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                              Dispatched
                            </span>
                          </div>
                          <div className="text-xs font-mono font-bold text-neutral-800 break-all">
                            {challengeData.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[11px] font-bold px-2 py-0.5 bg-white border border-black rounded text-neutral-700">
                          {challengeData.deliveryStatus === 'smtp_sent' ? 'SMTP Live' : 'Relay Active'}
                        </span>
                      </div>
                    </div>

                    {emailSuccessNotice && (
                      <div className="p-2.5 bg-emerald-100 border border-emerald-600 rounded text-emerald-900 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
                        <MailCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>{emailSuccessNotice}</span>
                      </div>
                    )}

                    {/* Email Actions Toolbar */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowEmailPreviewModal(true)}
                        className="brutal-btn-primary px-3 py-1.5 text-xs font-extrabold flex items-center space-x-1.5 uppercase"
                      >
                        <Inbox className="w-3.5 h-3.5" />
                        <span>📬 View Dispatched Email (Inbox)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsChangingEmail(!isChangingEmail)}
                        className="brutal-btn px-3 py-1.5 text-xs font-bold text-black bg-white hover:bg-neutral-100 flex items-center space-x-1"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-neutral-700" />
                        <span>{isChangingEmail ? 'Cancel' : 'Send to Custom / Personal Email'}</span>
                      </button>

                      <a
                        href={`https://mail.google.com/mail/u/?authuser=${encodeURIComponent(challengeData.email)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="brutal-btn px-2.5 py-1.5 text-xs font-bold text-black bg-white hover:bg-neutral-100 flex items-center space-x-1 ml-auto"
                        title="Open Webmail client"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-neutral-700" />
                        <span className="hidden sm:inline">Open Webmail</span>
                      </a>
                    </div>

                    {/* Change Recipient Email Inline Form */}
                    {isChangingEmail && (
                      <form onSubmit={handleUpdateRecipientEmail} className="mt-3 p-3 bg-white border-2 border-black rounded-lg space-y-2">
                        <label className="block text-[11px] font-black uppercase text-black">
                          Send 2FA OTP to Personal / Alternate Email Address:
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="email"
                            required
                            value={customEmailInput}
                            onChange={(e) => setCustomEmailInput(e.target.value)}
                            placeholder="e.g. your.personal.mail@gmail.com"
                            className="brutal-input flex-1 px-3 py-1.5 text-xs text-black font-medium"
                          />
                          <button
                            type="submit"
                            disabled={isSendingCustomEmail}
                            className="brutal-btn-cyan px-4 py-1.5 text-xs font-black uppercase flex items-center justify-center space-x-1 shrink-0 cursor-pointer disabled:opacity-50"
                          >
                            {isSendingCustomEmail ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Sending...</span>
                              </>
                            ) : (
                              <>
                                <SendHorizontal className="w-3.5 h-3.5" />
                                <span>Send OTP to this Email</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-[10px] text-neutral-500 font-medium">
                          The OTP security code will be generated and dispatched via institutional SMTP / mail relay immediately.
                        </p>
                      </form>
                    )}
                  </div>
                )}

                {/* Authenticator App Helper Panel */}
                {selected2FAMethod === 'authenticator_app' && (
                  <div className="p-4 bg-emerald-50 border-2 border-black rounded-lg shadow-[3px_3px_0px_#000000] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <QrCode className="w-5 h-5 text-black" />
                        <span className="text-xs font-black uppercase text-black">Google / Microsoft Authenticator TOTP</span>
                      </div>
                      <span className="text-[10px] font-mono bg-white border border-black px-1.5 py-0.5 rounded font-bold">RFC 6238 Standard</span>
                    </div>
                    <p className="text-xs text-neutral-700">
                      Use the 6-digit TOTP code generated on your authenticator app linked to <code className="font-mono bg-white px-1 py-0.5 border border-black rounded">{challengeData.email}</code>.
                    </p>
                  </div>
                )}

                {/* Error Banner */}
                {twoFactorError && (
                  <div className="p-3 bg-red-100 border-2 border-red-600 rounded-lg flex items-center space-x-2 text-red-900 text-xs font-bold animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{twoFactorError}</span>
                  </div>
                )}

                {/* Form Input for 2FA */}
                <form onSubmit={handleVerify2FA} className="space-y-5">
                  {selected2FAMethod !== 'backup_code' ? (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-extrabold uppercase text-black">
                          Enter 6-Digit Verification Code
                        </label>
                        <span className="text-[11px] font-mono text-neutral-600">
                          {selected2FAMethod === 'email_otp' ? 'Sent via institutional mail' : 'From Authenticator app'}
                        </span>
                      </div>

                      {/* 6 Digit Input Boxes */}
                      <div className="flex items-center justify-between gap-2 sm:gap-3">
                        {digitInputs.map((digit, index) => (
                          <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={digit}
                            onChange={(e) => handleDigitChange(index, e.target.value)}
                            onKeyDown={(e) => handleDigitKeyDown(index, e)}
                            className="w-11 sm:w-14 h-14 text-center font-mono text-2xl font-black text-black bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_#000000] focus:bg-[#ffea00] focus:shadow-[4px_4px_0px_#000000] focus:outline-none transition-all"
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-extrabold uppercase text-black mb-1.5">
                        Emergency Backup Recovery Key
                      </label>
                      <div className="relative">
                        <Key className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          value={backupCodeInput}
                          onChange={(e) => setBackupCodeInput(e.target.value)}
                          placeholder="e.g. CAMPUS-9821-SAFE"
                          className="w-full brutal-input pl-10 pr-4 py-2.5 text-xs sm:text-sm text-black font-mono font-bold uppercase placeholder:normal-case"
                        />
                      </div>
                      <div className="mt-2 text-[11px] text-neutral-600">
                        Generated recovery codes: <span className="font-mono font-bold text-black">{challengeData.backupCodes?.slice(0, 2).join(', ')}</span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full brutal-btn-primary py-3.5 px-4 font-black text-sm uppercase tracking-wider flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Verifying 2FA Credentials...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Confirm & Launch Protected Portal</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <button
                        type="button"
                        onClick={handleResend2FA}
                        disabled={resendCooldown > 0 || isLoading}
                        className="text-black font-bold flex items-center space-x-1.5 hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                        <span>
                          {resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : 'Resend Security Token'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('signin');
                          setTwoFactorError('');
                        }}
                        className="text-neutral-600 hover:text-black font-bold cursor-pointer"
                      >
                        Switch Account
                      </button>
                    </div>
                  </div>
                </form>

              </div>
            ) : (
              <>
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
                      Select Your Portal Role
                    </span>
                    <span className="text-[11px] font-bold font-mono text-neutral-600">
                      4 SECURE TIERS
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
                    {/* 1-Click Fast Fill Credentials */}
                    <div className="mb-5 p-3.5 bg-neutral-50 border-2 border-black rounded-lg">
                      <div className="text-xs font-black uppercase tracking-wider text-black mb-2 flex items-center justify-between">
                        <span>Authorized Campus Profiles:</span>
                        <span className="text-[10px] font-mono bg-black text-white px-1.5 py-0.5 rounded">FAST LOGIN</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {selectedRole === 'student' &&
                          students.slice(0, 3).map((std) => (
                            <button
                              key={std.id}
                              type="button"
                              onClick={() => fillCredentials(std.rollNo, 'student', true)}
                              className="brutal-btn px-3 py-1.5 text-xs text-black flex items-center space-x-2 bg-white hover:bg-[#ffea00]"
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
                              onClick={() => fillCredentials(fac.employeeId, selectedRole, true)}
                              className="brutal-btn px-3 py-1.5 text-xs text-black flex items-center space-x-2 bg-white hover:bg-[#a3e635]"
                            >
                              <img src={fac.avatar} alt={fac.name} className="w-4 h-4 rounded-full border border-black" />
                              <span>{fac.name}</span>
                              <span className="text-[10px] font-mono font-bold">({fac.employeeId})</span>
                            </button>
                          ))}

                        {selectedRole === 'admin' && (
                          <button
                            type="button"
                            onClick={() => fillCredentials('admin@collegeos.edu', 'admin', true)}
                            className="brutal-btn px-4 py-2 text-xs text-black flex items-center space-x-2 bg-[#ffea00]"
                          >
                            <Building className="w-4 h-4 text-black" />
                            <span className="font-extrabold">Dean Grace Hopper (admin@collegeos.edu)</span>
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
                            ? 'Administrator Access ID / Email'
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
                          <span className="text-[11px] text-neutral-500 font-medium">Default: CollegeOS@2026</span>
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
                        disabled={isLoading}
                        className="w-full brutal-btn-primary py-3 px-4 font-black text-sm uppercase tracking-wider flex items-center justify-center space-x-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Verifying Authorization...</span>
                          </>
                        ) : (
                          <>
                            <span>Continue to 2FA Security Check</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                      <div>
                        <label className="block text-xs font-extrabold uppercase text-black mb-1.5 flex items-center justify-between">
                          <span>Mobile Phone (2FA SMS)</span>
                          <span className="text-[10px] font-mono text-cyan-700 bg-cyan-100 px-1 rounded font-bold">2Factor.in</span>
                        </label>
                        <div className="relative">
                          <PhoneCall className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                          <input
                            type="tel"
                            value={signUpPhone}
                            onChange={(e) => setSignUpPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full brutal-input pl-10 pr-4 py-2.5 text-xs sm:text-sm text-black font-mono placeholder:text-neutral-400 font-medium"
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
                          Password (min. 6 chars)
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
                      disabled={isLoading}
                      className="w-full brutal-btn-cyan py-3 px-4 font-black text-sm uppercase tracking-wider flex items-center justify-center space-x-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Creating Account & Securing Node...</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          <span>Register Account & Verify 2FA</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </>
            )}

            {/* Footer Institutional Assurance */}
            <div className="mt-6 pt-4 border-t-2 border-black flex items-center justify-between text-xs text-neutral-600 font-bold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Firebase Authentication & 2FA Protected</span>
              </span>
              <span className="font-mono text-[11px] bg-black text-white px-2 py-0.5 rounded">
                COLLEGE OS v2.0
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* EMAIL INBOX PREVIEW MODAL */}
      {/* ========================================================================= */}
      {showEmailPreviewModal && challengeData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="brutal-card bg-white w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-[8px_8px_0px_#000000]">
            
            {/* Modal Header */}
            <div className="p-4 bg-[#ffea00] border-b-2 border-black flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
                  <Mail className="w-4 h-4 text-[#ffea00]" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase text-black">
                    Institutional Webmail Dispatch Viewer
                  </h3>
                  <p className="text-[11px] text-neutral-800 font-bold">
                    Raw message payload delivered to recipient inbox
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowEmailPreviewModal(false)}
                className="w-8 h-8 rounded-md bg-white border-2 border-black flex items-center justify-center hover:bg-neutral-100 cursor-pointer shadow-[2px_2px_0px_#000000]"
              >
                <X className="w-4 h-4 text-black" />
              </button>
            </div>

            {/* Email Headers Meta Box */}
            <div className="p-4 bg-neutral-50 border-b-2 border-black space-y-1 text-xs font-mono">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <strong className="text-black font-sans font-bold">From:</strong> College OS IAM Security &lt;security@collegeos.edu&gt;
                </div>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-500 w-fit">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                  SMTP 250 Delivered
                </span>
              </div>
              <div>
                <strong className="text-black font-sans font-bold">To:</strong> {challengeData.email}
              </div>
              <div>
                <strong className="text-black font-sans font-bold">Subject:</strong> 🔐 [College OS] Your Two-Factor Authentication Security Code: {challengeData.code}
              </div>
              <div>
                <strong className="text-black font-sans font-bold">Date:</strong> {challengeData.dispatchedAt ? new Date(challengeData.dispatchedAt).toLocaleString() : new Date().toLocaleString()}
              </div>
            </div>

            {/* Rendered Email Body */}
            <div className="p-6 overflow-y-auto space-y-5 bg-white text-neutral-900">
              <div className="border-2 border-black rounded-lg p-6 bg-[#fafafa] shadow-[3px_3px_0px_#000000] space-y-4">
                
                <div className="flex items-center justify-between border-b-2 border-black pb-3">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-6 h-6 text-black" />
                    <span className="font-black text-base uppercase tracking-tight">COLLEGE OS SECURITY</span>
                  </div>
                  <span className="text-[10px] font-bold font-mono bg-[#ffea00] px-2 py-0.5 border border-black rounded">
                    URGENT • 2FA CHALLENGE
                  </span>
                </div>

                <div>
                  <p className="text-sm font-bold text-black mb-1">
                    Dear {challengeData.name},
                  </p>
                  <p className="text-xs text-neutral-700 leading-relaxed">
                    A sign-in or authorization attempt was initiated for your institutional account (<code className="font-mono bg-neutral-200 px-1 py-0.5 rounded">{challengeData.email}</code>). Please use the following single-use verification code to complete your authentication.
                  </p>
                </div>

                {/* Big Token Display */}
                <div className="my-4 p-5 bg-white border-2 border-black rounded-lg text-center shadow-[4px_4px_0px_#000000]">
                  <div className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-500 mb-1">
                    Your One-Time Password (OTP)
                  </div>
                  <div className="font-mono text-3xl sm:text-4xl font-black tracking-[0.35em] text-black">
                    {challengeData.code}
                  </div>
                  <div className="text-[11px] font-bold text-amber-700 mt-2">
                    ⏱ Valid for the next {formatTime(secondsRemaining)} (Single-use only)
                  </div>
                </div>

                <div className="space-y-2 text-xs text-neutral-600 border-t border-neutral-300 pt-3">
                  <p className="font-bold text-black">Security Guidelines:</p>
                  <ul className="list-disc list-inside space-y-1 text-[11px]">
                    <li>Never share this security OTP with faculty, peers, or support staff.</li>
                    <li>If you did not initiate this request, your institutional password may be compromised.</li>
                    <li>This token is tied to node IP verification and will expire automatically.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 bg-neutral-100 border-t-2 border-black flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCopyToken}
                className="brutal-btn px-3 py-2 text-xs font-bold bg-white text-black flex items-center space-x-1.5 cursor-pointer"
              >
                {copiedToken ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedToken ? 'Code Copied!' : 'Copy Code'}</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    handleAutoFillToken();
                    setShowEmailPreviewModal(false);
                  }}
                  className="brutal-btn-cyan px-4 py-2 text-xs font-black uppercase flex items-center space-x-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Insert into 2FA Boxes</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleAutoFillToken();
                    setShowEmailPreviewModal(false);
                    setTimeout(() => {
                      handleVerify2FA();
                    }, 100);
                  }}
                  className="brutal-btn-primary px-4 py-2 text-xs font-black uppercase flex items-center space-x-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Auto-Apply & Login</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2FACTOR.IN SMS GATEWAY TELEMETRY & LIVE DISPATCH MODAL */}
      {/* ========================================================================= */}
      {showSmsGatewayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border-3 border-black rounded-xl max-w-2xl w-full shadow-[8px_8px_0px_#000000] overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 bg-[#00f0ff] border-b-2 border-black flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-[#00f0ff]" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase text-black">
                    2Factor.in SMS Gateway Telemetry
                  </h3>
                  <p className="text-[11px] text-neutral-800 font-bold">
                    Direct Cloud SMS Gateway Integration Hub
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowSmsGatewayModal(false)}
                className="w-8 h-8 rounded-md bg-white border-2 border-black flex items-center justify-center hover:bg-neutral-100 cursor-pointer shadow-[2px_2px_0px_#000000]"
              >
                <X className="w-4 h-4 text-black" />
              </button>
            </div>

            {/* Gateway Status Summary */}
            <div className="p-4 bg-neutral-50 border-b-2 border-black space-y-2 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <strong className="text-black">SMS Gateway Service:</strong> 2Factor.in Real-Time Delivery Engine
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-500 w-fit font-mono">
                  <Signal className="w-3.5 h-3.5 mr-1 text-emerald-600 animate-pulse" />
                  API KEY ACTIVE
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                <div className="p-2 bg-white border border-neutral-300 rounded">
                  <span className="text-neutral-500 block text-[10px] font-sans font-bold">Configured 2Factor API Key:</span>
                  <span className="font-bold text-black">{gatewayInfo?.maskedApiKey || 'b6fd258a-9cc5-11f1-9cb1-0200cd936042'}</span>
                </div>
                <div className="p-2 bg-white border border-neutral-300 rounded">
                  <span className="text-neutral-500 block text-[10px] font-sans font-bold">Gateway Balance / Status:</span>
                  <span className="font-bold text-emerald-700">{gatewayInfo?.balance ? `${gatewayInfo.balance} SMS Units` : 'Online / Active'}</span>
                </div>
              </div>
            </div>

            {/* Recent SMS Transmission Logs */}
            <div className="p-5 overflow-y-auto space-y-4 bg-white flex-1 text-neutral-900">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                  <MessageSquareCode className="w-4 h-4 text-black" />
                  <span>Recent SMS Dispatches ({gatewayInfo?.recentDispatches?.length || 0})</span>
                </h4>
                <button
                  type="button"
                  onClick={fetchGatewayStatus}
                  className="text-xs font-bold text-neutral-600 hover:text-black flex items-center space-x-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Refresh</span>
                </button>
              </div>

              {gatewayInfo?.recentDispatches && gatewayInfo.recentDispatches.length > 0 ? (
                <div className="space-y-2">
                  {gatewayInfo.recentDispatches.map((sms: any) => (
                    <div key={sms.id} className="p-3 bg-neutral-50 border-2 border-black rounded-lg space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-black">{sms.phone}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                          sms.status === 'Sent' ? 'bg-emerald-100 text-emerald-800 border-emerald-400' : 'bg-amber-100 text-amber-800 border-amber-400'
                        }`}>
                          {sms.status}
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-neutral-700 bg-white p-1.5 rounded border border-neutral-200">
                        {sms.text}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-0.5">
                        <span>Session: {sms.sessionId || sms.id}</span>
                        <span>{new Date(sms.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center border-2 border-dashed border-neutral-300 rounded-lg text-neutral-500 text-xs">
                  No outgoing SMS dispatches recorded yet in this session. Dispatch a code to test real-time logging.
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 bg-neutral-100 border-t-2 border-black flex items-center justify-between">
              <span className="text-[11px] font-bold text-neutral-600">
                Endpoint: <code className="font-mono bg-white px-1 py-0.5 border border-neutral-300 rounded">2factor.in/API/V1/{'{API_KEY}'}/SMS/...</code>
              </span>
              <button
                type="button"
                onClick={() => setShowSmsGatewayModal(false)}
                className="brutal-btn-primary px-4 py-2 text-xs font-black uppercase cursor-pointer"
              >
                Close Telemetry
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

