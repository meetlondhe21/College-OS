import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import {
  User,
  Calendar,
  CheckCircle,
  Clock,
  BookOpen,
  Award,
  FileText,
  Bell,
  Send,
  CreditCard,
  Sparkles,
  AlertTriangle,
  Download,
  Upload,
  Check,
  TrendingUp,
  FileSpreadsheet,
  Layers,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AIAcademicAssistant } from '../ai/AIAcademicAssistant';

type StudentTab =
  | 'overview'
  | 'attendance'
  | 'timetable'
  | 'subjects'
  | 'marks'
  | 'assignments'
  | 'notices'
  | 'leave'
  | 'fees'
  | 'ai_tutor';

export const StudentPortal: React.FC = () => {
  const {
    currentStudent,
    subjects,
    attendance,
    marks,
    assignments,
    notices,
    leaves,
    timetable,
    feeLedgers,
    applyLeave,
    submitAssignment,
    payFee
  } = useCollege();

  const [activeTab, setActiveTab] = useState<StudentTab>('overview');

  // Leave Form State
  const [leaveType, setLeaveType] = useState<'medical' | 'on_duty' | 'casual' | 'emergency'>('medical');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [docName, setDocName] = useState('');
  const [leaveSubmittedMsg, setLeaveSubmittedMsg] = useState(false);

  // Assignment Submission State
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [submissionFile, setSubmissionFile] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [asgSuccess, setAsgSuccess] = useState(false);

  // Fee Payment Modal / Simulator State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payAmount, setPayAmount] = useState(0);
  const [payMethod, setPayMethod] = useState<'UPI' | 'Net Banking' | 'Credit Card' | 'Debit Card'>('UPI');
  const [selectedFeeCategory, setSelectedFeeCategory] = useState<string>('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<string>('');

  // Student specific data calculations
  const studentMarks = marks.filter((m) => m.studentId === currentStudent.id);
  const studentAttendance = attendance.filter((a) => a.studentId === currentStudent.id);
  const studentLeaves = leaves.filter((l) => l.applicantId === currentStudent.id);
  const studentFeeLedger = feeLedgers[currentStudent.id] || {
    totalAmount: 95000,
    paidAmount: 95000 - currentStudent.feeDue,
    balanceDue: currentStudent.feeDue,
    dueDate: '2026-08-30',
    status: currentStudent.feeStatus,
    breakdown: [],
    transactions: []
  };

  // Calculate subject-wise attendance breakdown
  const subjectAttendanceStats = subjects.map((sub) => {
    const records = studentAttendance.filter((a) => a.subjectCode === sub.code);
    const presentCount = records.filter((r) => r.status === 'present' || r.status === 'leave').length;
    const totalCount = Math.max(records.length, 12); // Simulated baseline
    const attended = Math.min(presentCount + Math.floor(Math.random() * 2) + 10, totalCount);
    const percentage = Number(((attended / totalCount) * 100).toFixed(1));
    return {
      code: sub.code,
      name: sub.name,
      faculty: sub.facultyName,
      attended,
      total: totalCount,
      percentage: Math.min(100, percentage),
      isLow: percentage < 75
    };
  });

  const overallAttPercentage = Number(
    (
      subjectAttendanceStats.reduce((acc, curr) => acc + curr.percentage, 0) /
      (subjectAttendanceStats.length || 1)
    ).toFixed(1)
  );

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) return;

    applyLeave({
      applicantId: currentStudent.id,
      applicantName: currentStudent.name,
      applicantRole: 'student',
      applicantRollNo: currentStudent.rollNo,
      applicantDepartment: currentStudent.branch,
      leaveType,
      startDate,
      endDate,
      totalDays: 2,
      reason,
      documentName: docName || 'supporting_document.pdf'
    });

    setLeaveSubmittedMsg(true);
    setReason('');
    setStartDate('');
    setEndDate('');
    setDocName('');
    setTimeout(() => setLeaveSubmittedMsg(false), 4000);
  };

  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignmentId || !submissionFile) return;

    const asg = assignments.find((a) => a.id === selectedAssignmentId);
    submitAssignment(selectedAssignmentId, {
      assignmentId: selectedAssignmentId,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      rollNo: currentStudent.rollNo,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      fileName: submissionFile,
      content: submissionNotes,
      maxScore: asg ? asg.maxMarks : 20
    });

    setAsgSuccess(true);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    setTimeout(() => {
      setAsgSuccess(false);
      setSelectedAssignmentId(null);
      setSubmissionFile('');
      setSubmissionNotes('');
    }, 2500);
  };

  const handleProcessPayment = () => {
    if (payAmount <= 0) return;
    payFee(currentStudent.id, payAmount, payMethod, selectedFeeCategory);
    
    const recNo = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setLastReceipt(recNo);
    setPaymentSuccess(true);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    
    setTimeout(() => {
      setShowPaymentModal(false);
      setPaymentSuccess(false);
    }, 3000);
  };

  const tabs: { id: StudentTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Dashboard', icon: <Layers className="w-4 h-4" /> },
    { id: 'attendance', label: 'Attendance', icon: <CheckCircle className="w-4 h-4" />, badge: `${overallAttPercentage}%` },
    { id: 'timetable', label: 'Timetable', icon: <Calendar className="w-4 h-4" /> },
    { id: 'subjects', label: 'Subjects & Syllabus', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'marks', label: 'Marks & CGPA', icon: <Award className="w-4 h-4" />, badge: `${currentStudent.cgpa} CGPA` },
    { id: 'assignments', label: 'Assignments', icon: <FileText className="w-4 h-4" /> },
    { id: 'notices', label: 'Notices', icon: <Bell className="w-4 h-4" /> },
    { id: 'leave', label: 'Leave Portal', icon: <Clock className="w-4 h-4" /> },
    { id: 'fees', label: 'Fee Ledger', icon: <CreditCard className="w-4 h-4" />, badge: currentStudent.feeDue > 0 ? `$${currentStudent.feeDue} DUE` : 'CLEARED' },
    { id: 'ai_tutor', label: 'AI Academic Mentor', icon: <Sparkles className="w-4 h-4" />, badge: 'AI' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Student Banner Profile Card */}
      <div className="bg-white border-[3px] border-black p-5 brutal-shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={currentStudent.avatar}
            alt={currentStudent.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-none border-[3px] border-black brutal-shadow-sm object-cover"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading font-black text-xl sm:text-2xl text-black">
                {currentStudent.name}
              </h1>
              <span className="font-mono text-xs font-bold bg-[#ffea00] px-2 py-0.5 border-2 border-black">
                {currentStudent.rollNo}
              </span>
              <span className="font-mono text-xs font-bold bg-black text-white px-2 py-0.5">
                {currentStudent.prn}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-mono text-neutral-700 mt-1 font-semibold">
              {currentStudent.branch} • Semester {currentStudent.semester} (Section {currentStudent.section}) • Batch {currentStudent.batch}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono text-neutral-600">
              <span>📧 {currentStudent.email}</span>
              <span>🩸 {currentStudent.bloodGroup}</span>
              <span>📞 Guardian: {currentStudent.guardianContact}</span>
            </div>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-3 gap-2 w-full md:w-auto font-mono text-center shrink-0">
          <div className="p-2.5 bg-[#f7f5f0] border-2 border-black">
            <div className="text-[10px] uppercase font-bold text-neutral-500">CGPA</div>
            <div className="font-heading font-black text-lg text-black">{currentStudent.cgpa}</div>
            <div className="text-[9px] text-[#00f59b] bg-black px-1 font-bold">TOP 5%</div>
          </div>
          <div className="p-2.5 bg-[#f7f5f0] border-2 border-black">
            <div className="text-[10px] uppercase font-bold text-neutral-500">ATTENDANCE</div>
            <div className={`font-heading font-black text-lg ${overallAttPercentage >= 75 ? 'text-black' : 'text-[#ff2a85]'}`}>
              {overallAttPercentage}%
            </div>
            <div className="text-[9px] text-neutral-600 font-bold">75% MIN</div>
          </div>
          <div className="p-2.5 bg-[#f7f5f0] border-2 border-black">
            <div className="text-[10px] uppercase font-bold text-neutral-500">CREDITS</div>
            <div className="font-heading font-black text-lg text-black">{currentStudent.creditsCompleted}</div>
            <div className="text-[9px] text-neutral-600">/{currentStudent.totalCredits}</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Header */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 border-b-2 border-black">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3.5 py-2.5 font-mono text-xs uppercase font-extrabold border-2 border-black transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-black text-[#ffea00] brutal-shadow -translate-y-0.5'
                  : 'bg-white text-black hover:bg-[#fff9c4]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 font-mono font-black ${
                    isActive ? 'bg-[#ffea00] text-black' : 'bg-black text-white'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & DASHBOARD */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Low Attendance Warning Alert if applicable */}
          {overallAttPercentage < 75 && (
            <div className="p-4 bg-[#ff2a85] text-white border-[3px] border-black brutal-shadow flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-heading font-black text-base uppercase">
                  CRITICAL DEFICIT: ATTENDANCE BELOW 75% THRESHOLD ({overallAttPercentage}%)
                </h4>
                <p className="text-xs font-mono mt-1">
                  You are at risk of debarment from Mid-Semester Examinations. Please meet your faculty advisor and attend remedial lab sessions.
                </p>
              </div>
            </div>
          )}

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Col: Today's Schedule & Attendance Meter */}
            <div className="lg:col-span-2 space-y-6">
              {/* Daily Schedule Card */}
              <div className="bg-white border-2 border-black p-5 brutal-shadow">
                <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-black" />
                    <h3 className="font-heading font-black text-lg text-black uppercase">
                      Today's Lecture Schedule
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold bg-[#ffea00] px-2 py-0.5 border border-black">
                    MONDAY
                  </span>
                </div>

                <div className="space-y-3">
                  {timetable
                    .filter((t) => t.day === 'Monday')
                    .map((slot, index) => (
                      <div
                        key={slot.id}
                        className={`p-3 border-2 border-black flex items-center justify-between font-mono text-xs ${
                          index === 0 ? 'bg-[#fffde7] brutal-shadow-sm' : 'bg-[#fcfbfa]'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="font-black bg-black text-white px-2 py-1 text-[11px]">
                            {slot.timeSlot}
                          </span>
                          <div>
                            <div className="font-heading font-bold text-sm text-black">
                              {slot.subjectName} ({slot.subjectCode})
                            </div>
                            <div className="text-[11px] text-neutral-600">
                              Instructor: {slot.facultyName} • {slot.classroom}
                            </div>
                          </div>
                        </div>
                        <span className="font-bold uppercase text-[10px] bg-[#00f59b] px-2 py-0.5 border border-black">
                          {slot.type}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Attendance Quick Matrix */}
              <div className="bg-white border-2 border-black p-5 brutal-shadow">
                <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-black" />
                    <h3 className="font-heading font-black text-lg text-black uppercase">
                      Subject Attendance Summary
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('attendance')}
                    className="text-xs font-mono font-bold underline hover:text-[#ff7a00] cursor-pointer"
                  >
                    View Ledger →
                  </button>
                </div>

                <div className="space-y-3">
                  {subjectAttendanceStats.map((item) => (
                    <div key={item.code} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-black">
                          {item.code} — {item.name}
                        </span>
                        <span className={`font-black ${item.isLow ? 'text-[#ff2a85]' : 'text-black'}`}>
                          {item.attended}/{item.total} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 h-3 border border-black overflow-hidden">
                        <div
                          className={`h-full ${item.isLow ? 'bg-[#ff2a85]' : 'bg-[#00f59b]'}`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: High-Priority Notices & Pending Assignments */}
            <div className="space-y-6">
              {/* Pinned Circulars Card */}
              <div className="bg-white border-2 border-black p-5 brutal-shadow">
                <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-black" />
                    <h3 className="font-heading font-black text-lg text-black uppercase">
                      Urgent Circulars
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-[#ff2a85] text-white px-1.5 py-0.5">
                    HIGH PRIORITY
                  </span>
                </div>

                <div className="space-y-3">
                  {notices.slice(0, 3).map((notice) => (
                    <div key={notice.id} className="p-3 bg-[#fffde7] border-2 border-black text-xs font-mono">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-black uppercase text-[10px] bg-[#ff7a00] px-1.5 py-0.5 border border-black">
                          {notice.category}
                        </span>
                        <span className="text-neutral-500 text-[10px]">{notice.date}</span>
                      </div>
                      <h5 className="font-heading font-bold text-sm text-black mt-1">{notice.title}</h5>
                      <p className="text-neutral-700 text-[11px] font-sans mt-1 line-clamp-2 leading-relaxed">
                        {notice.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assignments Due */}
              <div className="bg-white border-2 border-black p-5 brutal-shadow">
                <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-black" />
                    <h3 className="font-heading font-black text-lg text-black uppercase">
                      Pending Tasks
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('assignments')}
                    className="text-xs font-mono font-bold underline hover:text-[#ff7a00] cursor-pointer"
                  >
                    All Assignments →
                  </button>
                </div>

                <div className="space-y-3">
                  {assignments.slice(0, 2).map((asg) => {
                    const submission = asg.submissions.find((s) => s.studentId === currentStudent.id);
                    return (
                      <div key={asg.id} className="p-3 bg-[#f7f5f0] border-2 border-black text-xs font-mono">
                        <div className="flex items-center justify-between">
                          <span className="font-bold bg-black text-[#ffea00] px-1.5 py-0.5 text-[10px]">
                            {asg.subjectCode}
                          </span>
                          <span className="text-[10px] font-bold text-[#ff2a85]">Due: {asg.dueDate}</span>
                        </div>
                        <div className="font-heading font-bold text-sm mt-1.5 text-black">{asg.title}</div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[10px] text-neutral-600">Max Marks: {asg.maxMarks}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 border border-black ${
                              submission ? 'bg-[#00f59b]' : 'bg-[#ffea00]'
                            }`}
                          >
                            {submission ? 'SUBMITTED' : 'ACTION REQUIRED'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Fee Quick Status */}
              <div className="p-4 bg-black text-white border-2 border-black brutal-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-[#00f0ff] uppercase">Fee Balance</span>
                  <span className="text-xs font-mono bg-neutral-800 px-2 py-0.5 text-neutral-300">
                    SEM V
                  </span>
                </div>
                <div className="text-2xl font-heading font-black text-[#ffea00]">
                  ${currentStudent.feeDue.toLocaleString()} DUE
                </div>
                <button
                  onClick={() => setActiveTab('fees')}
                  className="mt-3 w-full py-2 bg-[#00f59b] hover:bg-[#00df81] text-black font-heading font-black text-xs uppercase border-2 border-black brutal-shadow-sm cursor-pointer"
                >
                  Pay via Student Gateway →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ATTENDANCE LEDGER */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="bg-white border-2 border-black p-5 brutal-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black pb-4 mb-4">
              <div>
                <h3 className="font-heading font-black text-xl text-black uppercase">
                  Official Attendance Register
                </h3>
                <p className="text-xs font-mono text-neutral-600">
                  Real-time biometric & faculty roll call verification logs
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-[#ffea00] border-2 border-black text-xs font-mono font-black">
                  Aggregated Rate: {overallAttPercentage}%
                </div>
              </div>
            </div>

            {/* Subject-Wise Ledger Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="bg-black text-white uppercase text-[11px]">
                    <th className="p-3 border border-black">Course Code</th>
                    <th className="p-3 border border-black">Subject Title</th>
                    <th className="p-3 border border-black">Faculty In-Charge</th>
                    <th className="p-3 border border-black text-center">Attended / Total</th>
                    <th className="p-3 border border-black text-center">Percentage</th>
                    <th className="p-3 border border-black text-center">Status</th>
                    <th className="p-3 border border-black">75% Advisory Action</th>
                  </tr>
                </thead>
                <tbody>
                  {subjectAttendanceStats.map((item) => {
                    const neededClasses = Math.max(0, Math.ceil((0.75 * item.total - item.attended) / 0.25));
                    return (
                      <tr key={item.code} className="hover:bg-neutral-50 border-b border-black">
                        <td className="p-3 font-bold bg-[#f7f5f0] border border-black">{item.code}</td>
                        <td className="p-3 font-heading font-bold border border-black">{item.name}</td>
                        <td className="p-3 text-neutral-700 border border-black">{item.faculty}</td>
                        <td className="p-3 text-center font-bold border border-black">
                          {item.attended} / {item.total}
                        </td>
                        <td className="p-3 text-center border border-black">
                          <span
                            className={`px-2 py-1 font-bold border border-black ${
                              item.isLow ? 'bg-[#ff2a85] text-white' : 'bg-[#00f59b] text-black'
                            }`}
                          >
                            {item.percentage}%
                          </span>
                        </td>
                        <td className="p-3 text-center border border-black">
                          {item.isLow ? (
                            <span className="font-bold text-[#ff2a85] uppercase text-[10px]">DEFICIT ⚠️</span>
                          ) : (
                            <span className="font-bold text-black uppercase text-[10px]">ELIGIBLE ✅</span>
                          )}
                        </td>
                        <td className="p-3 border border-black text-[11px]">
                          {item.isLow
                            ? `Must attend next ${neededClasses || 3} lectures consecutively to reach 75%.`
                            : 'Attendance compliant. Eligible for all examinations.'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Daily Raw Attendance Logs */}
          <div className="bg-white border-2 border-black p-5 brutal-shadow">
            <h4 className="font-heading font-black text-lg text-black uppercase border-b-2 border-black pb-2 mb-4">
              Recent Roll-Call Entries
            </h4>
            <div className="space-y-2 font-mono text-xs">
              {studentAttendance.map((rec) => (
                <div
                  key={rec.id}
                  className="p-2.5 bg-[#f7f5f0] border border-black flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-neutral-600">{rec.date}</span>
                    <span className="font-bold bg-black text-[#ffea00] px-1.5 py-0.5">{rec.subjectCode}</span>
                    <span className="font-heading font-bold text-black">{rec.subjectName}</span>
                    <span className="text-neutral-500 text-[11px]">({rec.period})</span>
                  </div>
                  <span
                    className={`font-bold px-2 py-0.5 border border-black uppercase text-[10px] ${
                      rec.status === 'present'
                        ? 'bg-[#00f59b] text-black'
                        : rec.status === 'leave'
                        ? 'bg-[#00f0ff] text-black'
                        : 'bg-[#ff2a85] text-white'
                    }`}
                  >
                    {rec.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TIMETABLE */}
      {activeTab === 'timetable' && (
        <div className="bg-white border-2 border-black p-5 brutal-shadow space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black pb-4">
            <div>
              <h3 className="font-heading font-black text-xl text-black uppercase">
                Semester V Class Schedule
              </h3>
              <p className="text-xs font-mono text-neutral-600">
                Department of Computer Science & Engineering • Section {currentStudent.section}
              </p>
            </div>
            <div className="flex items-center space-x-2 font-mono text-xs">
              <span className="bg-[#fffde7] px-2 py-1 border border-black">Lecture</span>
              <span className="bg-[#e0f2fe] px-2 py-1 border border-black">Laboratory</span>
            </div>
          </div>

          {/* Timetable Weekly Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 font-mono text-xs">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {
              const daySlots = timetable.filter((t) => t.day === day);
              return (
                <div key={day} className="border-2 border-black bg-[#f7f5f0] overflow-hidden">
                  <div className="bg-black text-white p-2.5 text-center font-heading font-black text-sm uppercase">
                    {day}
                  </div>
                  <div className="p-2 space-y-2">
                    {daySlots.length === 0 ? (
                      <div className="text-center py-6 text-neutral-400 font-mono text-xs">No Lectures</div>
                    ) : (
                      daySlots.map((slot) => (
                        <div
                          key={slot.id}
                          className={`p-2 border-2 border-black brutal-shadow-sm ${
                            slot.type === 'Lab' ? 'bg-[#e0f2fe]' : 'bg-white'
                          }`}
                        >
                          <div className="font-bold text-[10px] text-neutral-500 mb-0.5">{slot.timeSlot}</div>
                          <div className="font-heading font-black text-sm text-black">{slot.subjectCode}</div>
                          <div className="font-semibold text-[11px] text-neutral-800">{slot.subjectName}</div>
                          <div className="text-[10px] text-neutral-600 mt-1 border-t border-neutral-200 pt-1">
                            📍 {slot.classroom}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: SUBJECTS & SYLLABUS */}
      {activeTab === 'subjects' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subjects.map((sub) => (
              <div key={sub.code} className="bg-white border-2 border-black p-5 brutal-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-3">
                    <span className="bg-black text-[#ffea00] px-2 py-0.5 text-xs font-mono font-black">
                      {sub.code}
                    </span>
                    <span className="font-mono text-xs font-bold bg-[#00f59b] px-2 py-0.5 border border-black">
                      {sub.credits} CREDITS
                    </span>
                  </div>

                  <h3 className="font-heading font-black text-lg text-black">{sub.name}</h3>
                  <p className="text-xs font-mono text-neutral-600 mt-1 font-semibold">
                    Faculty: {sub.facultyName} • Total Allocated Hours: {sub.totalLectures}
                  </p>

                  {/* Modules Accordion / List */}
                  <div className="mt-4 space-y-2 font-mono text-xs">
                    <div className="text-[10px] uppercase font-bold text-neutral-500">Syllabus Modules:</div>
                    {sub.syllabusModules.map((mod) => (
                      <div key={mod.moduleNo} className="p-2.5 bg-[#f7f5f0] border border-black">
                        <div className="font-bold text-black flex justify-between">
                          <span>Unit {mod.moduleNo}: {mod.title}</span>
                          <span className="text-neutral-500">{mod.hours} hrs</span>
                        </div>
                        <div className="text-[11px] text-neutral-600 mt-1">
                          Topics: {mod.topics.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between">
                  <div className="text-xs font-mono text-neutral-600">
                    Internal: {sub.internalMaxMarks}M | External: {sub.externalMaxMarks}M
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('ai_tutor');
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-[#ffea00] hover:bg-[#ffe500] border-2 border-black font-mono font-bold text-xs cursor-pointer brutal-shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask AI Tutor</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: MARKS & CGPA ENGINE */}
      {activeTab === 'marks' && (
        <div className="space-y-6">
          {/* CGPA Calculator Header Card */}
          <div className="bg-black text-white border-[3px] border-black p-5 brutal-shadow flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <Award className="w-6 h-6 text-[#ffea00]" />
                <h3 className="font-heading font-black text-2xl text-white uppercase">
                  Academic Performance & Gradebook
                </h3>
              </div>
              <p className="text-xs font-mono text-neutral-300 mt-1">
                Semester V Continuous Internal Evaluation (CIE) and External Projections
              </p>
            </div>
            <div className="flex items-center space-x-4 bg-neutral-900 border-2 border-neutral-700 p-3 font-mono">
              <div>
                <div className="text-[10px] text-neutral-400 uppercase">CUMULATIVE CGPA</div>
                <div className="text-2xl font-heading font-black text-[#00f59b]">{currentStudent.cgpa} / 10.0</div>
              </div>
              <div className="border-l border-neutral-700 pl-4">
                <div className="text-[10px] text-neutral-400 uppercase">ACADEMIC STANDING</div>
                <div className="text-sm font-bold text-[#ffea00]">FIRST CLASS WITH DISTINCTION</div>
              </div>
            </div>
          </div>

          {/* Marks Breakdown Table */}
          <div className="bg-white border-2 border-black p-5 brutal-shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="bg-black text-white uppercase text-[11px]">
                    <th className="p-3 border border-black">Course Code</th>
                    <th className="p-3 border border-black">Subject</th>
                    <th className="p-3 border border-black text-center">CIE 1 (20)</th>
                    <th className="p-3 border border-black text-center">CIE 2 (20)</th>
                    <th className="p-3 border border-black text-center">Assignments (10)</th>
                    <th className="p-3 border border-black text-center">External (50)</th>
                    <th className="p-3 border border-black text-center">Total (100)</th>
                    <th className="p-3 border border-black text-center">Letter Grade</th>
                    <th className="p-3 border border-black text-center">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {studentMarks.map((m) => (
                    <tr key={m.id} className="hover:bg-neutral-50 border-b border-black">
                      <td className="p-3 font-bold bg-[#f7f5f0] border border-black">{m.subjectCode}</td>
                      <td className="p-3 font-heading font-bold border border-black">{m.subjectName}</td>
                      <td className="p-3 text-center border border-black">{m.internal1}</td>
                      <td className="p-3 text-center border border-black">{m.internal2}</td>
                      <td className="p-3 text-center border border-black">{m.assignmentScore}</td>
                      <td className="p-3 text-center border border-black">{m.external}</td>
                      <td className="p-3 text-center font-black text-sm border border-black bg-[#fffde7]">
                        {m.totalMarks}
                      </td>
                      <td className="p-3 text-center font-black border border-black">{m.grade}</td>
                      <td className="p-3 text-center border border-black">
                        <span className="font-bold px-2 py-0.5 bg-[#00f59b] text-black border border-black uppercase text-[10px]">
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: ASSIGNMENTS & SUBMISSION ENGINE */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div className="bg-white border-2 border-black p-5 brutal-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-black text-xl text-black uppercase">
                Coursework & Assignment Submissions
              </h3>
              <p className="text-xs font-mono text-neutral-600">
                Submit programming tasks, case studies, and lab reports before statutory cut-offs
              </p>
            </div>
          </div>

          {asgSuccess && (
            <div className="p-4 bg-[#00f59b] border-2 border-black brutal-shadow font-mono text-xs font-black text-black flex items-center space-x-2">
              <Check className="w-5 h-5" />
              <span>Assignment submitted successfully! Encrypted receipt logged in database.</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignments.map((asg) => {
              const submission = asg.submissions.find((s) => s.studentId === currentStudent.id);
              const isSelected = selectedAssignmentId === asg.id;

              return (
                <div
                  key={asg.id}
                  className={`border-2 border-black p-5 brutal-shadow flex flex-col justify-between ${
                    submission ? 'bg-white' : 'bg-[#fffde7]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
                      <span className="font-mono text-xs font-black bg-black text-[#ffea00] px-2 py-0.5">
                        {asg.subjectCode}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#ff2a85]">
                        Due: {asg.dueDate}
                      </span>
                    </div>

                    <h4 className="font-heading font-black text-base text-black">{asg.title}</h4>
                    <p className="text-xs font-sans text-neutral-700 mt-2 leading-relaxed">
                      {asg.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-neutral-300 flex items-center justify-between text-xs font-mono">
                      <span>Max Score: {asg.maxMarks} Points</span>
                      <span>Faculty: {asg.facultyName}</span>
                    </div>

                    {/* Submission status or details */}
                    {submission ? (
                      <div className="mt-4 p-3 bg-[#f7f5f0] border border-black font-mono text-xs space-y-1.5">
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-[#00f59b] bg-black px-1.5 py-0.2">SUBMISSION RECORDED</span>
                          <span>{submission.submittedAt}</span>
                        </div>
                        <div className="text-[11px] text-neutral-700">File: {submission.fileName}</div>
                        {submission.score !== undefined && (
                          <div className="mt-2 pt-2 border-t border-neutral-300">
                            <span className="font-bold text-black">
                              Grade: {submission.score} / {submission.maxScore}
                            </span>
                            {submission.feedback && (
                              <p className="text-[11px] text-neutral-600 italic mt-0.5">
                                "{submission.feedback}"
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mt-4">
                        {!isSelected ? (
                          <button
                            onClick={() => setSelectedAssignmentId(asg.id)}
                            className="w-full py-2 bg-black text-[#ffea00] hover:bg-neutral-800 font-heading font-black text-xs uppercase border-2 border-black brutal-shadow-sm cursor-pointer"
                          >
                            Submit Assignment File →
                          </button>
                        ) : (
                          <form onSubmit={handleAssignmentSubmit} className="p-3 bg-white border-2 border-black space-y-3 font-mono text-xs">
                            <div className="font-bold uppercase text-black">Upload Assignment Deliverable:</div>
                            <div>
                              <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                                File Name / Repository Link:
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. alex_chen_cs501_assignment.pdf"
                                value={submissionFile}
                                onChange={(e) => setSubmissionFile(e.target.value)}
                                className="w-full p-1.5 bg-[#f7f5f0] border border-black outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                                Notes / Implementation Summary:
                              </label>
                              <textarea
                                rows={2}
                                placeholder="Brief summary of your code, test results, or methodology..."
                                value={submissionNotes}
                                onChange={(e) => setSubmissionNotes(e.target.value)}
                                className="w-full p-1.5 bg-[#f7f5f0] border border-black outline-none resize-none"
                              />
                            </div>
                            <div className="flex items-center space-x-2 pt-1">
                              <button
                                type="submit"
                                className="flex-1 py-1.5 bg-[#00f59b] hover:bg-[#00df81] text-black font-heading font-black uppercase border border-black cursor-pointer"
                              >
                                Final Submit
                              </button>
                              <button
                                type="button"
                                onClick={() => setSelectedAssignmentId(null)}
                                className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-black font-bold uppercase border border-black cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 7: NOTICES & CIRCULARS */}
      {activeTab === 'notices' && (
        <div className="space-y-6">
          <div className="bg-white border-2 border-black p-5 brutal-shadow">
            <h3 className="font-heading font-black text-xl text-black uppercase border-b-2 border-black pb-3 mb-4">
              Official University Notice Board & Circulars
            </h3>

            <div className="space-y-4 font-mono">
              {notices.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 border-2 border-black brutal-shadow-sm ${
                    n.priority === 'high' ? 'bg-[#fffde7]' : 'bg-white'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-300 pb-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-[10px] uppercase bg-[#ff7a00] text-black px-2 py-0.5 border border-black">
                        {n.category}
                      </span>
                      {n.isPinned && (
                        <span className="font-bold text-[10px] bg-black text-[#ffea00] px-1.5 py-0.5">
                          PINNED
                        </span>
                      )}
                      <span className="text-xs text-neutral-500 font-mono">{n.date}</span>
                    </div>
                    <span className="text-xs font-bold text-neutral-700">Issued by: {n.authorName}</span>
                  </div>
                  <h4 className="font-heading font-extrabold text-base text-black">{n.title}</h4>
                  <p className="text-xs font-sans text-neutral-800 mt-2 leading-relaxed whitespace-pre-wrap">
                    {n.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: LEAVE PORTAL */}
      {activeTab === 'leave' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono">
          {/* Apply Leave Form */}
          <div className="lg:col-span-1 bg-white border-2 border-black p-5 brutal-shadow">
            <h3 className="font-heading font-black text-lg text-black uppercase border-b-2 border-black pb-3 mb-4">
              Apply For Leave / OD
            </h3>

            {leaveSubmittedMsg && (
              <div className="p-3 mb-3 bg-[#00f59b] border border-black font-bold text-xs text-black">
                Leave application lodged! Awaiting mentor approval.
              </div>
            )}

            <form onSubmit={handleLeaveSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                  Leave Classification:
                </label>
                <select
                  value={leaveType}
                  onChange={(e: any) => setLeaveType(e.target.value)}
                  className="w-full p-2 bg-[#f7f5f0] border border-black font-mono"
                >
                  <option value="medical">Medical Leave (Cert Attached)</option>
                  <option value="on_duty">On-Duty (OD) / Hackathon / Sports</option>
                  <option value="casual">Casual Leave</option>
                  <option value="emergency">Family Emergency</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                    Start Date:
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 bg-[#f7f5f0] border border-black"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                    End Date:
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 bg-[#f7f5f0] border border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                  Supporting Document (PDF/Doc):
                </label>
                <input
                  type="text"
                  placeholder="e.g. medical_prescription.pdf"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full p-2 bg-[#f7f5f0] border border-black"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                  Detailed Reason:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain reason for absence..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2 bg-[#f7f5f0] border border-black resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-black text-[#ffea00] hover:bg-neutral-800 font-heading font-black uppercase border-2 border-black brutal-shadow-sm cursor-pointer"
              >
                Submit Leave Application →
              </button>
            </form>
          </div>

          {/* Leave History & Status Timeline */}
          <div className="lg:col-span-2 bg-white border-2 border-black p-5 brutal-shadow">
            <h3 className="font-heading font-black text-lg text-black uppercase border-b-2 border-black pb-3 mb-4">
              Leave History & Approvals
            </h3>

            {studentLeaves.length === 0 ? (
              <div className="text-center py-10 text-neutral-400 font-mono">No leave applications recorded.</div>
            ) : (
              <div className="space-y-3 font-mono text-xs">
                {studentLeaves.map((lev) => (
                  <div key={lev.id} className="p-3.5 bg-[#f7f5f0] border-2 border-black space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold bg-black text-white px-1.5 py-0.5 uppercase text-[10px]">
                          {lev.leaveType}
                        </span>
                        <span className="font-heading font-bold text-sm text-black">
                          {lev.startDate} to {lev.endDate} ({lev.totalDays} Days)
                        </span>
                      </div>
                      <span
                        className={`font-bold px-2 py-0.5 border border-black uppercase text-[10px] ${
                          lev.status === 'approved'
                            ? 'bg-[#00f59b] text-black'
                            : lev.status === 'rejected'
                            ? 'bg-[#ff2a85] text-white'
                            : 'bg-[#ffea00] text-black'
                        }`}
                      >
                        {lev.status}
                      </span>
                    </div>

                    <p className="text-neutral-700 text-xs font-sans">{lev.reason}</p>

                    {lev.approverComment && (
                      <div className="mt-2 pt-2 border-t border-neutral-300 text-[11px] text-neutral-600">
                        <span className="font-bold text-black">Mentor Comment ({lev.reviewedBy}):</span>{' '}
                        {lev.approverComment}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 9: FEES & INVOICE PAYMENT SIMULATOR */}
      {activeTab === 'fees' && (
        <div className="space-y-6">
          {/* Fee Status Card */}
          <div className="bg-white border-2 border-black p-5 brutal-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <CreditCard className="w-6 h-6 text-black" />
                <h3 className="font-heading font-black text-2xl text-black uppercase">
                  Fee Ledger & Digital Payments
                </h3>
              </div>
              <p className="text-xs font-mono text-neutral-600 mt-1">
                Student Account: {currentStudent.rollNo} • Semester V (2026-27)
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right font-mono">
                <div className="text-[10px] font-bold text-neutral-500 uppercase">OUTSTANDING BALANCE</div>
                <div className="font-heading font-black text-2xl text-[#ff2a85]">
                  ${studentFeeLedger.balanceDue.toLocaleString()}
                </div>
              </div>
              {studentFeeLedger.balanceDue > 0 && (
                <button
                  onClick={() => {
                    setPayAmount(studentFeeLedger.balanceDue);
                    setShowPaymentModal(true);
                  }}
                  className="px-4 py-2.5 bg-[#00f59b] hover:bg-[#00df81] text-black font-heading font-black text-xs uppercase border-2 border-black brutal-shadow-sm cursor-pointer"
                >
                  Pay Outstanding Now →
                </button>
              )}
            </div>
          </div>

          {/* Breakdown Ledger Table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-black p-5 brutal-shadow">
              <h4 className="font-heading font-black text-lg text-black uppercase border-b-2 border-black pb-2 mb-4">
                Semester Fee Itemized Schedule
              </h4>
              <div className="space-y-3 font-mono text-xs">
                {studentFeeLedger.breakdown.map((item, idx) => (
                  <div key={idx} className="p-3 bg-[#f7f5f0] border border-black flex items-center justify-between">
                    <div>
                      <div className="font-bold text-black">{item.category}</div>
                      <div className="text-[10px] text-neutral-500">Authorized Bursar Fee</div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-sm text-black">${item.amount.toLocaleString()}</div>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 border border-black ${
                          item.paid ? 'bg-[#00f59b]' : 'bg-[#ffea00]'
                        }`}
                      >
                        {item.paid ? 'PAID' : 'PENDING'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transaction Receipts */}
            <div className="bg-white border-2 border-black p-5 brutal-shadow">
              <h4 className="font-heading font-black text-lg text-black uppercase border-b-2 border-black pb-2 mb-4">
                Receipts & Payment History
              </h4>
              <div className="space-y-3 font-mono text-xs">
                {studentFeeLedger.transactions.length === 0 ? (
                  <div className="text-center py-8 text-neutral-400">No payment transactions recorded.</div>
                ) : (
                  studentFeeLedger.transactions.map((tx) => (
                    <div key={tx.id} className="p-3 bg-[#f7f5f0] border border-black flex items-center justify-between">
                      <div>
                        <div className="font-bold text-black">{tx.receiptNo}</div>
                        <div className="text-[11px] text-neutral-600">
                          {tx.paymentDate} • Via {tx.method}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-sm text-black">${tx.amount.toLocaleString()}</div>
                        <span className="text-[9px] font-bold bg-[#00f59b] text-black px-1.5 py-0.2 border border-black">
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Payment Modal */}
          {showPaymentModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="w-full max-w-md bg-[#f7f5f0] border-[3px] border-black brutal-shadow-lg p-5 font-mono text-xs animate-in zoom-in-95">
                <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
                  <h4 className="font-heading font-black text-lg text-black uppercase">
                    Checkout: University Fee Gateway
                  </h4>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="p-1 hover:bg-neutral-200 border border-black font-bold"
                  >
                    ✕
                  </button>
                </div>

                {paymentSuccess ? (
                  <div className="text-center py-6 space-y-3">
                    <div className="w-12 h-12 bg-[#00f59b] border-2 border-black rounded-full flex items-center justify-center mx-auto text-xl">
                      ✓
                    </div>
                    <h4 className="font-heading font-black text-lg text-black">PAYMENT SUCCESSFUL!</h4>
                    <p className="text-neutral-700">Receipt generated: <strong>{lastReceipt}</strong></p>
                    <p className="text-neutral-500 text-[11px]">Fee ledger updated immediately.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                        Amount to Pay ($):
                      </label>
                      <input
                        type="number"
                        value={payAmount}
                        onChange={(e) => setPayAmount(Number(e.target.value))}
                        className="w-full p-2 bg-white border-2 border-black font-heading font-black text-lg text-black"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                        Select Payment Method:
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['UPI', 'Net Banking', 'Credit Card', 'Debit Card'].map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setPayMethod(method as any)}
                            className={`p-2 border-2 border-black font-bold uppercase transition-colors ${
                              payMethod === method ? 'bg-[#ffea00] text-black' : 'bg-white hover:bg-neutral-100'
                            }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-neutral-100 border border-black text-[11px] text-neutral-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Student Roll No:</span>
                        <span className="font-bold text-black">{currentStudent.rollNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Convenience Fee:</span>
                        <span className="font-bold text-black">$0.00 (Waived)</span>
                      </div>
                    </div>

                    <button
                      onClick={handleProcessPayment}
                      className="w-full py-3 bg-[#00f59b] hover:bg-[#00df81] text-black font-heading font-black text-sm uppercase border-2 border-black brutal-shadow cursor-pointer"
                    >
                      Authorize & Pay ${payAmount.toLocaleString()} →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 10: AI ACADEMIC MENTOR */}
      {activeTab === 'ai_tutor' && (
        <div>
          <AIAcademicAssistant />
        </div>
      )}
    </div>
  );
};
