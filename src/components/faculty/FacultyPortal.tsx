import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import {
  Briefcase,
  CheckCircle2,
  FileSpreadsheet,
  FilePlus2,
  BellPlus,
  BarChart3,
  Calendar,
  Save,
  Check,
  AlertCircle,
  Users,
  Search,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { AIAcademicAssistant } from '../ai/AIAcademicAssistant';

type FacultyTab =
  | 'dashboard'
  | 'attendance'
  | 'marks'
  | 'assignments'
  | 'notices'
  | 'performance'
  | 'timetable'
  | 'ai_assistant';

export const FacultyPortal: React.FC = () => {
  const {
    currentFaculty,
    students,
    subjects,
    attendance,
    marks,
    assignments,
    timetable,
    leaves,
    takeAttendance,
    addMarksBatch,
    createAssignment,
    gradeSubmission,
    createNotice,
    updateLeaveStatus
  } = useCollege();

  const [activeTab, setActiveTab] = useState<FacultyTab>('dashboard');

  // Attendance Sheet State
  const facultySubjects = subjects.filter((s) => s.facultyId === currentFaculty.id || s.facultyName === currentFaculty.name);
  const [selectedSubjectCode, setSelectedSubjectCode] = useState(
    facultySubjects[0]?.code || subjects[0]?.code || 'CS-501'
  );
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [attPeriod, setAttPeriod] = useState('09:00 - 10:00');
  const [studentRollCallState, setStudentRollCallState] = useState<
    Record<string, { status: 'present' | 'absent' | 'leave'; remarks: string }>
  >({});
  const [attSubmittedSuccess, setAttSubmittedSuccess] = useState(false);

  // Marks Gradebook State
  const [marksSubjectCode, setMarksSubjectCode] = useState(
    facultySubjects[0]?.code || subjects[0]?.code || 'CS-501'
  );
  const [editableMarks, setEditableMarks] = useState<Record<string, { internal1: number; internal2: number; assignmentScore: number; external: number }>>({});
  const [marksSavedSuccess, setMarksSavedSuccess] = useState(false);

  // New Assignment State
  const [newAsgTitle, setNewAsgTitle] = useState('');
  const [newAsgSubject, setNewAsgSubject] = useState(facultySubjects[0]?.code || 'CS-501');
  const [newAsgDesc, setNewAsgDesc] = useState('');
  const [newAsgMaxMarks, setNewAsgMaxMarks] = useState(20);
  const [newAsgDueDate, setNewAsgDueDate] = useState('2026-08-30');
  const [asgCreatedSuccess, setAsgCreatedSuccess] = useState(false);

  // Grade Submission Modal / Form
  const [gradingModalAsgId, setGradingModalAsgId] = useState<string | null>(null);
  const [gradingSubId, setGradingSubId] = useState<string | null>(null);
  const [gradeScoreInput, setGradeScoreInput] = useState<number>(18);
  const [gradeFeedbackInput, setGradeFeedbackInput] = useState<string>('Well structured answer.');

  // Create Notice State
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<'academic' | 'exam' | 'event' | 'urgent'>('academic');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeAudience, setNoticeAudience] = useState<'all' | 'students' | 'department'>('students');
  const [noticePriority, setNoticePriority] = useState<'normal' | 'high'>('normal');
  const [noticeCreatedSuccess, setNoticeCreatedSuccess] = useState(false);

  // Initialize Roll Call State for all eligible students
  const filteredStudentsForAttendance = students.filter((s) => s.branch.includes('Computer Science'));

  const initializeRollCall = () => {
    const initialMap: Record<string, { status: 'present' | 'absent' | 'leave'; remarks: string }> = {};
    filteredStudentsForAttendance.forEach((std) => {
      initialMap[std.id] = { status: 'present', remarks: '' };
    });
    setStudentRollCallState(initialMap);
  };

  const handleToggleStatus = (studentId: string, nextStatus: 'present' | 'absent' | 'leave') => {
    setStudentRollCallState((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], status: nextStatus }
    }));
  };

  const handleBulkMarkAll = (status: 'present' | 'absent') => {
    setStudentRollCallState((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((id) => {
        updated[id] = { ...updated[id], status };
      });
      return updated;
    });
  };

  const handleSubmitAttendance = () => {
    const sub = subjects.find((s) => s.code === selectedSubjectCode);
    const records = Object.entries(studentRollCallState).map(([studentId, data]: [string, { status: 'present' | 'absent' | 'leave'; remarks: string }]) => {
      const std = students.find((s) => s.id === studentId);
      return {
        date: attDate,
        subjectCode: selectedSubjectCode,
        subjectName: sub ? sub.name : 'Computer Science Subject',
        studentId,
        studentRollNo: std ? std.rollNo : 'N/A',
        studentName: std ? std.name : 'Student',
        status: data.status,
        remarks: data.remarks,
        period: attPeriod
      };
    });

    takeAttendance(records);
    setAttSubmittedSuccess(true);
    setTimeout(() => setAttSubmittedSuccess(false), 3500);
  };

  // Gradebook batch save handler
  const handleSaveMarksBatch = () => {
    const sub = subjects.find((s) => s.code === marksSubjectCode);
    const recordsToSave = filteredStudentsForAttendance.map((std) => {
      const existing = marks.find((m) => m.studentId === std.id && m.subjectCode === marksSubjectCode);
      const inputs = editableMarks[std.id] || {
        internal1: existing?.internal1 || 18,
        internal2: existing?.internal2 || 18,
        assignmentScore: existing?.assignmentScore || 9,
        external: existing?.external || 42
      };

      const total = inputs.internal1 + inputs.internal2 + inputs.assignmentScore + inputs.external;
      const grade = total >= 90 ? 'O' : total >= 80 ? 'A+' : total >= 70 ? 'A' : total >= 60 ? 'B+' : total >= 50 ? 'B' : total >= 40 ? 'P' : 'F';

      return {
        id: existing?.id || `mrk-${Date.now()}-${std.id}`,
        studentId: std.id,
        studentRollNo: std.rollNo,
        studentName: std.name,
        subjectCode: marksSubjectCode,
        subjectName: sub?.name || 'Subject',
        semester: std.semester,
        internal1: inputs.internal1,
        internal2: inputs.internal2,
        assignmentScore: inputs.assignmentScore,
        external: inputs.external,
        totalMarks: total,
        grade,
        status: total >= 40 ? ('Pass' as const) : ('Fail' as const)
      };
    });

    addMarksBatch(recordsToSave);
    setMarksSavedSuccess(true);
    setTimeout(() => setMarksSavedSuccess(false), 3000);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsgTitle || !newAsgDesc) return;

    const sub = subjects.find((s) => s.code === newAsgSubject);
    createAssignment({
      subjectCode: newAsgSubject,
      subjectName: sub ? sub.name : 'Engineering Coursework',
      title: newAsgTitle,
      description: newAsgDesc,
      maxMarks: newAsgMaxMarks,
      dueDate: newAsgDueDate,
      assignedDate: new Date().toISOString().split('T')[0],
      facultyId: currentFaculty.id,
      facultyName: currentFaculty.name,
      department: currentFaculty.department,
      semester: 5
    });

    setAsgCreatedSuccess(true);
    setNewAsgTitle('');
    setNewAsgDesc('');
    setTimeout(() => setAsgCreatedSuccess(false), 3000);
  };

  const handleGradeSubmissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingModalAsgId || !gradingSubId) return;

    gradeSubmission(gradingModalAsgId, gradingSubId, Number(gradeScoreInput), gradeFeedbackInput);
    setGradingModalAsgId(null);
    setGradingSubId(null);
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle || !noticeContent) return;

    createNotice({
      title: noticeTitle,
      category: noticeCategory,
      content: noticeContent,
      authorName: currentFaculty.name,
      authorRole: 'faculty',
      targetAudience: noticeAudience,
      department: currentFaculty.department,
      isPinned: noticePriority === 'high',
      priority: noticePriority
    });

    setNoticeCreatedSuccess(true);
    setNoticeTitle('');
    setNoticeContent('');
    setTimeout(() => setNoticeCreatedSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Faculty Profile Banner */}
      <div className="bg-white border-[3px] border-black p-5 brutal-shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={currentFaculty.avatar}
            alt={currentFaculty.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-none border-[3px] border-black brutal-shadow-sm object-cover"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading font-black text-xl sm:text-2xl text-black">
                {currentFaculty.name}
              </h1>
              <span className="font-mono text-xs font-bold bg-[#00f59b] px-2 py-0.5 border-2 border-black">
                {currentFaculty.designation}
              </span>
              <span className="font-mono text-xs font-bold bg-black text-white px-2 py-0.5">
                {currentFaculty.employeeId}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-mono text-neutral-700 mt-1 font-semibold">
              {currentFaculty.department} • {currentFaculty.cabinNo}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono text-neutral-600">
              <span>🎓 {currentFaculty.qualification}</span>
              <span>🕒 Office Hours: {currentFaculty.officeHours}</span>
            </div>
          </div>
        </div>

        {/* Quick Workload Stats */}
        <div className="grid grid-cols-3 gap-2 w-full md:w-auto font-mono text-center shrink-0">
          <div className="p-2.5 bg-[#f7f5f0] border-2 border-black">
            <div className="text-[10px] uppercase font-bold text-neutral-500">TEACHING LOAD</div>
            <div className="font-heading font-black text-lg text-black">{currentFaculty.workloadHoursPerWeek} hrs</div>
            <div className="text-[9px] text-neutral-600 font-bold">PER WEEK</div>
          </div>
          <div className="p-2.5 bg-[#f7f5f0] border-2 border-black">
            <div className="text-[10px] uppercase font-bold text-neutral-500">COURSES</div>
            <div className="font-heading font-black text-lg text-black">{currentFaculty.subjectsAssigned.length}</div>
            <div className="text-[9px] text-[#00f59b] bg-black px-1 font-bold">ALLOCATED</div>
          </div>
          <div className="p-2.5 bg-[#f7f5f0] border-2 border-black">
            <div className="text-[10px] uppercase font-bold text-neutral-500">EXPERIENCE</div>
            <div className="font-heading font-black text-lg text-black">{currentFaculty.experienceYears} yrs</div>
            <div className="text-[9px] text-neutral-600">ACADEMIC</div>
          </div>
        </div>
      </div>

      {/* Tabs Matrix */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 border-b-2 border-black">
        {[
          { id: 'dashboard', label: 'Faculty Dashboard', icon: <Briefcase className="w-4 h-4" /> },
          { id: 'attendance', label: 'Take Roll Call', icon: <CheckCircle2 className="w-4 h-4" /> },
          { id: 'marks', label: 'Gradebook & Marks', icon: <FileSpreadsheet className="w-4 h-4" /> },
          { id: 'assignments', label: 'Assignments Manager', icon: <FilePlus2 className="w-4 h-4" /> },
          { id: 'notices', label: 'Publish Notices', icon: <BellPlus className="w-4 h-4" /> },
          { id: 'performance', label: 'Student Analytics', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'timetable', label: 'My Teaching Schedule', icon: <Calendar className="w-4 h-4" /> },
          { id: 'ai_assistant', label: 'AI Academic Assistant', icon: <Sparkles className="w-4 h-4" /> }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as FacultyTab);
                if (tab.id === 'attendance' && Object.keys(studentRollCallState).length === 0) {
                  initializeRollCall();
                }
              }}
              className={`flex items-center space-x-2 px-3.5 py-2.5 font-mono text-xs uppercase font-extrabold border-2 border-black transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-black text-[#00f59b] brutal-shadow -translate-y-0.5'
                  : 'bg-white text-black hover:bg-[#e6fffa]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: FACULTY DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Teaching Sessions */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border-2 border-black p-5 brutal-shadow">
                <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-black" />
                    <h3 className="font-heading font-black text-lg text-black uppercase">
                      My Scheduled Lectures Today
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold bg-[#00f59b] px-2 py-0.5 border border-black">
                    MONDAY
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  {timetable
                    .filter((t) => t.day === 'Monday' && (t.facultyId === currentFaculty.id || t.facultyName === currentFaculty.name))
                    .map((slot) => (
                      <div
                        key={slot.id}
                        className="p-3.5 bg-[#f7f5f0] border-2 border-black flex items-center justify-between brutal-shadow-sm"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="font-black bg-black text-[#00f59b] px-2 py-1">
                            {slot.timeSlot}
                          </span>
                          <div>
                            <div className="font-heading font-bold text-sm text-black">
                              {slot.subjectName} ({slot.subjectCode})
                            </div>
                            <div className="text-[11px] text-neutral-600">
                              Venue: {slot.classroom} • Sem {slot.semester} (Sec {slot.section})
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedSubjectCode(slot.subjectCode);
                            initializeRollCall();
                            setActiveTab('attendance');
                          }}
                          className="px-3 py-1.5 bg-[#ffea00] hover:bg-[#ffe500] font-heading font-black border border-black cursor-pointer uppercase text-[10px]"
                        >
                          Mark Attendance →
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              {/* Pending Leave Requests for Approval */}
              <div className="bg-white border-2 border-black p-5 brutal-shadow">
                <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
                  <h3 className="font-heading font-black text-lg text-black uppercase">
                    Pending Student Leave / OD Sanctions
                  </h3>
                  <span className="text-xs font-mono font-bold bg-[#ff7a00] px-2 py-0.5 border border-black">
                    {leaves.filter((l) => l.status === 'pending').length} ACTION REQUIRED
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  {leaves.filter((l) => l.status === 'pending').length === 0 ? (
                    <div className="text-center py-6 text-neutral-500">No pending student leaves.</div>
                  ) : (
                    leaves
                      .filter((l) => l.status === 'pending')
                      .map((lev) => (
                        <div key={lev.id} className="p-3.5 bg-[#fffde7] border-2 border-black space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-heading font-bold text-sm text-black">{lev.applicantName}</span>
                              <span className="text-[11px] text-neutral-600 ml-2 font-mono">
                                ({lev.applicantRollNo}) • {lev.leaveType.toUpperCase()}
                              </span>
                            </div>
                            <span className="text-neutral-500 text-[10px]">Applied: {lev.appliedAt}</span>
                          </div>
                          <p className="text-neutral-700 text-xs font-sans">"{lev.reason}"</p>
                          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-neutral-300">
                            <button
                              onClick={() => updateLeaveStatus(lev.id, 'approved', 'Leave sanctioned with OD credit.')}
                              className="px-3 py-1 bg-[#00f59b] hover:bg-[#00df81] text-black font-bold uppercase border border-black cursor-pointer text-[10px]"
                            >
                              ✓ Approve Leave
                            </button>
                            <button
                              onClick={() => updateLeaveStatus(lev.id, 'rejected', 'Insufficient medical documentation.')}
                              className="px-3 py-1 bg-[#ff2a85] hover:bg-[#f43f5e] text-white font-bold uppercase border border-black cursor-pointer text-[10px]"
                            >
                              ✕ Reject
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Col: Quick Quick Action Box */}
            <div className="space-y-6">
              <div className="bg-white border-2 border-black p-5 brutal-shadow">
                <h4 className="font-heading font-black text-lg text-black uppercase border-b-2 border-black pb-2 mb-4">
                  Quick Actions
                </h4>
                <div className="space-y-2 font-mono text-xs">
                  <button
                    onClick={() => {
                      initializeRollCall();
                      setActiveTab('attendance');
                    }}
                    className="w-full text-left p-3 bg-[#f7f5f0] hover:bg-[#00f59b] border-2 border-black font-bold flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>📋 Take Roll Call (Daily)</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('marks')}
                    className="w-full text-left p-3 bg-[#f7f5f0] hover:bg-[#ffea00] border-2 border-black font-bold flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>📊 Update CIE / Lab Marks</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('assignments')}
                    className="w-full text-left p-3 bg-[#f7f5f0] hover:bg-[#00f0ff] border-2 border-black font-bold flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>📝 Post New Course Assignment</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('notices')}
                    className="w-full text-left p-3 bg-[#f7f5f0] hover:bg-[#ff7a00] border-2 border-black font-bold flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>📢 Issue Department Circular</span>
                    <span>→</span>
                  </button>
                </div>
              </div>

              {/* Attendance Defaulter Alert Box */}
              <div className="p-4 bg-[#ff2a85] text-white border-2 border-black brutal-shadow font-mono text-xs space-y-2">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-heading font-black text-base uppercase">ATTENDANCE DEFAULTERS</span>
                </div>
                <p className="leading-relaxed">
                  2 students in your designated section have dropped below 65% attendance. Automatic warning SMS triggered to guardians.
                </p>
                <button
                  onClick={() => setActiveTab('performance')}
                  className="mt-2 w-full py-2 bg-black text-[#ffea00] font-heading font-black uppercase border border-black cursor-pointer text-center block"
                >
                  View Defaulter Analytics →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TAKE ATTENDANCE (ROLL CALL SHEET) */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="bg-white border-2 border-black p-5 brutal-shadow space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-black pb-4">
              <div>
                <h3 className="font-heading font-black text-2xl text-black uppercase">
                  Lecture Attendance Roll Call Sheet
                </h3>
                <p className="text-xs font-mono text-neutral-600">
                  Digital Register for Computer Science & Engineering (Semester V)
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleBulkMarkAll('present')}
                  className="px-3 py-1.5 bg-[#00f59b] hover:bg-[#00df81] text-black font-mono font-bold text-xs uppercase border-2 border-black brutal-shadow-sm cursor-pointer"
                >
                  ✓ All Present
                </button>
                <button
                  onClick={() => handleBulkMarkAll('absent')}
                  className="px-3 py-1.5 bg-[#ff2a85] hover:bg-[#f43f5e] text-white font-mono font-bold text-xs uppercase border-2 border-black brutal-shadow-sm cursor-pointer"
                >
                  ✕ All Absent
                </button>
              </div>
            </div>

            {attSubmittedSuccess && (
              <div className="p-4 bg-[#00f59b] border-2 border-black font-mono text-xs font-black text-black flex items-center space-x-2 brutal-shadow">
                <Check className="w-5 h-5" />
                <span>Roll Call saved to institutional attendance ledger! Student metrics recalculated.</span>
              </div>
            )}

            {/* Session Parameters Filter */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs p-3 bg-[#f7f5f0] border-2 border-black">
              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                  Subject / Course:
                </label>
                <select
                  value={selectedSubjectCode}
                  onChange={(e) => setSelectedSubjectCode(e.target.value)}
                  className="w-full p-2 bg-white border border-black font-mono font-bold"
                >
                  {subjects.map((sub) => (
                    <option key={sub.code} value={sub.code}>
                      {sub.code} — {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                  Date of Lecture:
                </label>
                <input
                  type="date"
                  value={attDate}
                  onChange={(e) => setAttDate(e.target.value)}
                  className="w-full p-2 bg-white border border-black font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                  Time Slot / Period:
                </label>
                <select
                  value={attPeriod}
                  onChange={(e) => setAttPeriod(e.target.value)}
                  className="w-full p-2 bg-white border border-black font-mono font-bold"
                >
                  <option value="09:00 - 10:00">09:00 - 10:00 (Period 1)</option>
                  <option value="10:00 - 11:00">10:00 - 11:00 (Period 2)</option>
                  <option value="11:15 - 12:15">11:15 - 12:15 (Period 3)</option>
                  <option value="02:00 - 04:00">02:00 - 04:00 (Lab Slot)</option>
                </select>
              </div>
            </div>

            {/* Students Roll Call List Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="bg-black text-white uppercase text-[11px]">
                    <th className="p-3 border border-black">Roll No</th>
                    <th className="p-3 border border-black">Student Name</th>
                    <th className="p-3 border border-black text-center">Historical Attendance</th>
                    <th className="p-3 border border-black text-center">Status Action</th>
                    <th className="p-3 border border-black">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudentsForAttendance.map((std) => {
                    const currentStatus = studentRollCallState[std.id]?.status || 'present';
                    return (
                      <tr key={std.id} className="hover:bg-neutral-50 border-b border-black">
                        <td className="p-3 font-bold bg-[#f7f5f0] border border-black">{std.rollNo}</td>
                        <td className="p-3 font-heading font-bold border border-black flex items-center space-x-2">
                          <img src={std.avatar} alt={std.name} className="w-6 h-6 rounded-full border border-black object-cover" />
                          <span>{std.name}</span>
                        </td>
                        <td className="p-3 text-center border border-black">
                          <span
                            className={`px-2 py-0.5 border border-black font-bold ${
                              std.attendanceRate >= 75 ? 'bg-[#00f59b]' : 'bg-[#ff2a85] text-white'
                            }`}
                          >
                            {std.attendanceRate}%
                          </span>
                        </td>
                        <td className="p-3 text-center border border-black">
                          <div className="inline-flex items-center border border-black">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(std.id, 'present')}
                              className={`px-3 py-1 font-bold transition-colors cursor-pointer ${
                                currentStatus === 'present' ? 'bg-[#00f59b] text-black font-black' : 'bg-white hover:bg-neutral-100'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(std.id, 'absent')}
                              className={`px-3 py-1 font-bold border-l border-r border-black transition-colors cursor-pointer ${
                                currentStatus === 'absent' ? 'bg-[#ff2a85] text-white font-black' : 'bg-white hover:bg-neutral-100'
                              }`}
                            >
                              Absent
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(std.id, 'leave')}
                              className={`px-3 py-1 font-bold transition-colors cursor-pointer ${
                                currentStatus === 'leave' ? 'bg-[#00f0ff] text-black font-black' : 'bg-white hover:bg-neutral-100'
                              }`}
                            >
                              OD / Leave
                            </button>
                          </div>
                        </td>
                        <td className="p-3 border border-black">
                          <input
                            type="text"
                            placeholder="Optional remark..."
                            value={studentRollCallState[std.id]?.remarks || ''}
                            onChange={(e) =>
                              setStudentRollCallState((prev) => ({
                                ...prev,
                                [std.id]: { ...prev[std.id], remarks: e.target.value }
                              }))
                            }
                            className="w-full p-1 bg-white border border-neutral-300 outline-none text-xs"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Submit Button */}
            <div className="pt-3 border-t-2 border-black flex justify-end">
              <button
                onClick={handleSubmitAttendance}
                className="px-6 py-3 bg-black text-[#00f59b] hover:bg-neutral-800 font-heading font-black text-sm uppercase border-2 border-black brutal-shadow cursor-pointer flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Commit & Publish Roll Call Sheet →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GRADEBOOK & MARKS MANAGER */}
      {activeTab === 'marks' && (
        <div className="space-y-6">
          <div className="bg-white border-2 border-black p-5 brutal-shadow space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black pb-4">
              <div>
                <h3 className="font-heading font-black text-2xl text-black uppercase">
                  Faculty Marks & Gradebook Entry
                </h3>
                <p className="text-xs font-mono text-neutral-600">
                  Continuous Internal Evaluation (CIE) & Semester End Grade Consolidation
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <select
                  value={marksSubjectCode}
                  onChange={(e) => setMarksSubjectCode(e.target.value)}
                  className="p-2 bg-[#f7f5f0] border-2 border-black font-mono font-bold text-xs"
                >
                  {subjects.map((sub) => (
                    <option key={sub.code} value={sub.code}>
                      {sub.code} — {sub.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleSaveMarksBatch}
                  className="px-4 py-2 bg-[#00f59b] hover:bg-[#00df81] text-black font-heading font-black text-xs uppercase border-2 border-black brutal-shadow-sm cursor-pointer flex items-center space-x-1"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Gradebook</span>
                </button>
              </div>
            </div>

            {marksSavedSuccess && (
              <div className="p-3 bg-[#00f59b] border-2 border-black font-mono text-xs font-black text-black flex items-center space-x-2">
                <Check className="w-4 h-4" />
                <span>Marks updated and student transcripts recalculated!</span>
              </div>
            )}

            {/* Editable Spreadsheet Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="bg-black text-white uppercase text-[11px]">
                    <th className="p-3 border border-black">Roll No</th>
                    <th className="p-3 border border-black">Student Name</th>
                    <th className="p-3 border border-black text-center">CIE 1 (Max 20)</th>
                    <th className="p-3 border border-black text-center">CIE 2 (Max 20)</th>
                    <th className="p-3 border border-black text-center">Assignments (Max 10)</th>
                    <th className="p-3 border border-black text-center">External (Max 50)</th>
                    <th className="p-3 border border-black text-center">Total (100)</th>
                    <th className="p-3 border border-black text-center">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudentsForAttendance.map((std) => {
                    const existing = marks.find((m) => m.studentId === std.id && m.subjectCode === marksSubjectCode);
                    const currentValues = editableMarks[std.id] || {
                      internal1: existing?.internal1 || 18,
                      internal2: existing?.internal2 || 17,
                      assignmentScore: existing?.assignmentScore || 9,
                      external: existing?.external || 42
                    };

                    const total = currentValues.internal1 + currentValues.internal2 + currentValues.assignmentScore + currentValues.external;
                    const grade = total >= 90 ? 'O' : total >= 80 ? 'A+' : total >= 70 ? 'A' : total >= 60 ? 'B+' : total >= 50 ? 'B' : total >= 40 ? 'P' : 'F';

                    return (
                      <tr key={std.id} className="hover:bg-neutral-50 border-b border-black">
                        <td className="p-3 font-bold bg-[#f7f5f0] border border-black">{std.rollNo}</td>
                        <td className="p-3 font-heading font-bold border border-black">{std.name}</td>
                        <td className="p-2 text-center border border-black">
                          <input
                            type="number"
                            min={0}
                            max={20}
                            value={currentValues.internal1}
                            onChange={(e) =>
                              setEditableMarks((prev) => ({
                                ...prev,
                                [std.id]: { ...currentValues, internal1: Number(e.target.value) }
                              }))
                            }
                            className="w-16 p-1 text-center bg-[#f7f5f0] border border-black font-bold"
                          />
                        </td>
                        <td className="p-2 text-center border border-black">
                          <input
                            type="number"
                            min={0}
                            max={20}
                            value={currentValues.internal2}
                            onChange={(e) =>
                              setEditableMarks((prev) => ({
                                ...prev,
                                [std.id]: { ...currentValues, internal2: Number(e.target.value) }
                              }))
                            }
                            className="w-16 p-1 text-center bg-[#f7f5f0] border border-black font-bold"
                          />
                        </td>
                        <td className="p-2 text-center border border-black">
                          <input
                            type="number"
                            min={0}
                            max={10}
                            value={currentValues.assignmentScore}
                            onChange={(e) =>
                              setEditableMarks((prev) => ({
                                ...prev,
                                [std.id]: { ...currentValues, assignmentScore: Number(e.target.value) }
                              }))
                            }
                            className="w-16 p-1 text-center bg-[#f7f5f0] border border-black font-bold"
                          />
                        </td>
                        <td className="p-2 text-center border border-black">
                          <input
                            type="number"
                            min={0}
                            max={50}
                            value={currentValues.external}
                            onChange={(e) =>
                              setEditableMarks((prev) => ({
                                ...prev,
                                [std.id]: { ...currentValues, external: Number(e.target.value) }
                              }))
                            }
                            className="w-16 p-1 text-center bg-[#f7f5f0] border border-black font-bold"
                          />
                        </td>
                        <td className="p-3 text-center font-black border border-black bg-[#fffde7] text-sm">
                          {total}
                        </td>
                        <td className="p-3 text-center font-black border border-black">
                          <span
                            className={`px-2 py-0.5 border border-black ${
                              grade === 'F' ? 'bg-[#ff2a85] text-white' : 'bg-[#00f59b] text-black'
                            }`}
                          >
                            {grade}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ASSIGNMENTS & REVIEW MANAGER */}
      {activeTab === 'assignments' && (
        <div className="space-y-6 font-mono">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Create New Assignment Form */}
            <div className="lg:col-span-1 bg-white border-2 border-black p-5 brutal-shadow">
              <h3 className="font-heading font-black text-lg text-black uppercase border-b-2 border-black pb-3 mb-4">
                Post New Course Assignment
              </h3>

              {asgCreatedSuccess && (
                <div className="p-3 mb-3 bg-[#00f59b] border border-black font-bold text-xs text-black">
                  Assignment published to student portals!
                </div>
              )}

              <form onSubmit={handleCreateAssignment} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                    Select Subject:
                  </label>
                  <select
                    value={newAsgSubject}
                    onChange={(e) => setNewAsgSubject(e.target.value)}
                    className="w-full p-2 bg-[#f7f5f0] border border-black font-mono font-bold"
                  >
                    {subjects.map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.code} — {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                    Assignment Title:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Assignment 4: B-Tree Indexing Engine"
                    value={newAsgTitle}
                    onChange={(e) => setNewAsgTitle(e.target.value)}
                    className="w-full p-2 bg-[#f7f5f0] border border-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                      Max Score:
                    </label>
                    <input
                      type="number"
                      value={newAsgMaxMarks}
                      onChange={(e) => setNewAsgMaxMarks(Number(e.target.value))}
                      className="w-full p-2 bg-[#f7f5f0] border border-black font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                      Submission Deadline:
                    </label>
                    <input
                      type="date"
                      value={newAsgDueDate}
                      onChange={(e) => setNewAsgDueDate(e.target.value)}
                      className="w-full p-2 bg-[#f7f5f0] border border-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                    Problem Statement / Requirements:
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Specify algorithm requirements, edge tests, and deliverables..."
                    value={newAsgDesc}
                    onChange={(e) => setNewAsgDesc(e.target.value)}
                    className="w-full p-2 bg-[#f7f5f0] border border-black resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-black text-[#00f59b] hover:bg-neutral-800 font-heading font-black uppercase border-2 border-black brutal-shadow-sm cursor-pointer"
                >
                  Publish Assignment →
                </button>
              </form>
            </div>

            {/* Published Assignments & Grading Submissions */}
            <div className="lg:col-span-2 space-y-4">
              {assignments.map((asg) => (
                <div key={asg.id} className="bg-white border-2 border-black p-5 brutal-shadow space-y-3">
                  <div className="flex items-center justify-between border-b-2 border-black pb-2">
                    <div>
                      <span className="font-mono text-xs font-black bg-black text-[#ffea00] px-2 py-0.5">
                        {asg.subjectCode}
                      </span>
                      <h4 className="font-heading font-black text-base text-black mt-1">{asg.title}</h4>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-neutral-500 uppercase">SUBMISSIONS</div>
                      <div className="font-heading font-black text-lg text-black">
                        {asg.submissions.length} / {students.length}
                      </div>
                    </div>
                  </div>

                  {/* Submissions List */}
                  <div className="space-y-2">
                    <div className="text-[10px] uppercase font-bold text-neutral-500">Student Deliverables:</div>
                    {asg.submissions.length === 0 ? (
                      <div className="p-3 bg-neutral-50 text-neutral-500 text-xs text-center border border-neutral-300">
                        No submissions uploaded yet.
                      </div>
                    ) : (
                      asg.submissions.map((sub) => (
                        <div key={sub.id} className="p-3 bg-[#f7f5f0] border border-black flex items-center justify-between">
                          <div>
                            <div className="font-heading font-bold text-sm text-black">
                              {sub.studentName} ({sub.rollNo})
                            </div>
                            <div className="text-[11px] text-neutral-600">
                              File: <strong>{sub.fileName}</strong> • Submitted: {sub.submittedAt}
                            </div>
                            {sub.feedback && (
                              <div className="text-[10px] text-neutral-700 italic mt-0.5">"{sub.feedback}"</div>
                            )}
                          </div>
                          <div className="flex items-center space-x-3">
                            <span
                              className={`px-2 py-0.5 border border-black font-bold text-[10px] ${
                                sub.status === 'evaluated' ? 'bg-[#00f59b]' : 'bg-[#ffea00]'
                              }`}
                            >
                              {sub.score !== undefined ? `${sub.score} / ${sub.maxScore}` : 'PENDING EVAL'}
                            </span>
                            <button
                              onClick={() => {
                                setGradingModalAsgId(asg.id);
                                setGradingSubId(sub.id);
                                setGradeScoreInput(sub.score || 18);
                                setGradeFeedbackInput(sub.feedback || 'Good work.');
                              }}
                              className="px-2.5 py-1 bg-black text-white hover:bg-neutral-800 text-[10px] font-bold uppercase border border-black cursor-pointer"
                            >
                              Grade / Feedback
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grade Submission Modal */}
          {gradingModalAsgId && gradingSubId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="w-full max-w-md bg-[#f7f5f0] border-[3px] border-black brutal-shadow-lg p-5 font-mono text-xs animate-in zoom-in-95">
                <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
                  <h4 className="font-heading font-black text-lg text-black uppercase">
                    Grade Submission & Feedback
                  </h4>
                  <button
                    onClick={() => {
                      setGradingModalAsgId(null);
                      setGradingSubId(null);
                    }}
                    className="p-1 hover:bg-neutral-200 border border-black font-bold"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleGradeSubmissionSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                      Award Score (Max 20):
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={gradeScoreInput}
                      onChange={(e) => setGradeScoreInput(Number(e.target.value))}
                      className="w-full p-2 bg-white border-2 border-black font-heading font-black text-lg text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                      Constructive Review & Feedback:
                    </label>
                    <textarea
                      rows={3}
                      value={gradeFeedbackInput}
                      onChange={(e) => setGradeFeedbackInput(e.target.value)}
                      className="w-full p-2 bg-white border-2 border-black"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#00f59b] hover:bg-[#00df81] text-black font-heading font-black text-sm uppercase border-2 border-black brutal-shadow cursor-pointer"
                  >
                    Confirm & Publish Grade →
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: PUBLISH NOTICES */}
      {activeTab === 'notices' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono">
          <div className="lg:col-span-1 bg-white border-2 border-black p-5 brutal-shadow">
            <h3 className="font-heading font-black text-lg text-black uppercase border-b-2 border-black pb-3 mb-4">
              Publish Class / Dept Notice
            </h3>

            {noticeCreatedSuccess && (
              <div className="p-3 mb-3 bg-[#00f59b] border border-black font-bold text-xs text-black">
                Notice broadcasted to recipient channels!
              </div>
            )}

            <form onSubmit={handleCreateNotice} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                  Circular Title:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Extra Lab Session for B.Tech CS Sem V"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  className="w-full p-2 bg-[#f7f5f0] border border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                    Category:
                  </label>
                  <select
                    value={noticeCategory}
                    onChange={(e: any) => setNoticeCategory(e.target.value)}
                    className="w-full p-2 bg-[#f7f5f0] border border-black"
                  >
                    <option value="academic">Academic</option>
                    <option value="exam">Exam</option>
                    <option value="event">Event / Workshop</option>
                    <option value="urgent">Urgent Circular</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                    Target Audience:
                  </label>
                  <select
                    value={noticeAudience}
                    onChange={(e: any) => setNoticeAudience(e.target.value)}
                    className="w-full p-2 bg-[#f7f5f0] border border-black"
                  >
                    <option value="students">Students Only</option>
                    <option value="all">Entire Campus</option>
                    <option value="department">CSE Department</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                  Priority:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNoticePriority('normal')}
                    className={`p-2 border border-black font-bold uppercase ${
                      noticePriority === 'normal' ? 'bg-[#ffea00] text-black' : 'bg-white'
                    }`}
                  >
                    Normal
                  </button>
                  <button
                    type="button"
                    onClick={() => setNoticePriority('high')}
                    className={`p-2 border border-black font-bold uppercase ${
                      noticePriority === 'high' ? 'bg-[#ff2a85] text-white' : 'bg-white'
                    }`}
                  >
                    High / Pinned
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                  Full Announcement Text:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detailed instructions or guidelines..."
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  className="w-full p-2 bg-[#f7f5f0] border border-black resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-black text-[#00f59b] hover:bg-neutral-800 font-heading font-black uppercase border-2 border-black brutal-shadow-sm cursor-pointer"
              >
                Broadcast Notice →
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white border-2 border-black p-5 brutal-shadow space-y-3">
            <h3 className="font-heading font-black text-lg text-black uppercase border-b-2 border-black pb-2">
              Recently Issued Notices
            </h3>
            {/* Notices List */}
            <div className="space-y-3 text-xs font-mono">
              {useCollege().notices.slice(0, 4).map((n) => (
                <div key={n.id} className="p-3.5 bg-[#f7f5f0] border border-black">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold bg-black text-white px-1.5 py-0.5 uppercase text-[10px]">
                      {n.category}
                    </span>
                    <span className="text-neutral-500 text-[10px]">{n.date}</span>
                  </div>
                  <h4 className="font-heading font-bold text-sm text-black">{n.title}</h4>
                  <p className="text-neutral-700 font-sans mt-1 text-xs">{n.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: STUDENT PERFORMANCE & DEFECT ANALYTICS */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-white border-2 border-black brutal-shadow">
              <div className="text-xs font-mono uppercase font-bold text-neutral-500">Average Class Attendance</div>
              <div className="font-heading font-black text-3xl text-black mt-1">86.4%</div>
              <div className="text-xs font-mono text-[#00f59b] bg-black px-1.5 py-0.5 mt-2 inline-block font-bold">
                +2.4% vs Previous Term
              </div>
            </div>
            <div className="p-5 bg-white border-2 border-black brutal-shadow">
              <div className="text-xs font-mono uppercase font-bold text-neutral-500">Passing Rate (CIE 1)</div>
              <div className="font-heading font-black text-3xl text-black mt-1">94.8%</div>
              <div className="text-xs font-mono text-neutral-600 mt-2">48 / 50 Students Cleared</div>
            </div>
            <div className="p-5 bg-white border-2 border-black brutal-shadow">
              <div className="text-xs font-mono uppercase font-bold text-neutral-500">At-Risk Watchlist</div>
              <div className="font-heading font-black text-3xl text-[#ff2a85] mt-1">2 Students</div>
              <div className="text-xs font-mono text-[#ff2a85] font-bold mt-2">Attendance &lt; 65%</div>
            </div>
          </div>

          {/* Student Roster Performance Breakdown Table */}
          <div className="bg-white border-2 border-black p-5 brutal-shadow">
            <h4 className="font-heading font-black text-lg text-black uppercase border-b-2 border-black pb-2 mb-4">
              CSE Section A Roster & Performance Diagnostic
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="bg-black text-white uppercase text-[11px]">
                    <th className="p-3 border border-black">Roll No</th>
                    <th className="p-3 border border-black">Student Name</th>
                    <th className="p-3 border border-black text-center">Attendance %</th>
                    <th className="p-3 border border-black text-center">CGPA</th>
                    <th className="p-3 border border-black text-center">Fee Status</th>
                    <th className="p-3 border border-black text-center">Academic Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudentsForAttendance.map((std) => (
                    <tr key={std.id} className="hover:bg-neutral-50 border-b border-black">
                      <td className="p-3 font-bold bg-[#f7f5f0] border border-black">{std.rollNo}</td>
                      <td className="p-3 font-heading font-bold border border-black">{std.name}</td>
                      <td className="p-3 text-center border border-black font-bold">
                        <span
                          className={`px-2 py-0.5 border border-black ${
                            std.attendanceRate >= 75 ? 'bg-[#00f59b]' : 'bg-[#ff2a85] text-white'
                          }`}
                        >
                          {std.attendanceRate}%
                        </span>
                      </td>
                      <td className="p-3 text-center font-bold border border-black">{std.cgpa}</td>
                      <td className="p-3 text-center border border-black">
                        <span
                          className={`px-2 py-0.5 border border-black text-[10px] font-bold uppercase ${
                            std.feeStatus === 'paid' ? 'bg-[#00f59b]' : 'bg-[#ffea00]'
                          }`}
                        >
                          {std.feeStatus}
                        </span>
                      </td>
                      <td className="p-3 text-center border border-black">
                        {std.attendanceRate < 65 || std.cgpa < 6.0 ? (
                          <span className="font-bold text-[#ff2a85] bg-black px-2 py-0.5 uppercase text-[10px]">
                            CRITICAL RISK
                          </span>
                        ) : (
                          <span className="font-bold text-black uppercase text-[10px]">SAFE</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: TEACHING TIMETABLE */}
      {activeTab === 'timetable' && (
        <div className="bg-white border-2 border-black p-5 brutal-shadow space-y-4">
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <div>
              <h3 className="font-heading font-black text-xl text-black uppercase">
                Faculty Weekly Teaching Timetable
              </h3>
              <p className="text-xs font-mono text-neutral-600">
                Instructor: {currentFaculty.name} ({currentFaculty.department})
              </p>
            </div>
            <div className="font-mono text-xs font-bold bg-[#00f59b] px-3 py-1 border border-black">
              Total Weekly Load: {currentFaculty.workloadHoursPerWeek} Hours
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 font-mono text-xs">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {
              const mySlots = timetable.filter(
                (t) => t.day === day && (t.facultyId === currentFaculty.id || t.facultyName === currentFaculty.name)
              );
              return (
                <div key={day} className="border-2 border-black bg-[#f7f5f0]">
                  <div className="bg-black text-white p-2.5 text-center font-heading font-black text-sm uppercase">
                    {day}
                  </div>
                  <div className="p-2 space-y-2">
                    {mySlots.length === 0 ? (
                      <div className="text-center py-6 text-neutral-400 font-mono text-xs">Research / Free</div>
                    ) : (
                      mySlots.map((slot) => (
                        <div key={slot.id} className="p-2.5 bg-white border-2 border-black brutal-shadow-sm">
                          <div className="font-bold text-[10px] text-neutral-500">{slot.timeSlot}</div>
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

      {/* TAB 8: AI ASSISTANT */}
      {activeTab === 'ai_assistant' && (
        <div>
          <AIAcademicAssistant />
        </div>
      )}
    </div>
  );
};
