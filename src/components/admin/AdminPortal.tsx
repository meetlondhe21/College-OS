import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import {
  ShieldAlert,
  Users,
  GraduationCap,
  Briefcase,
  BookOpen,
  Calendar,
  CreditCard,
  Building,
  Bell,
  BarChart3,
  Sparkles,
  Plus,
  Trash2,
  Check,
  Download,
  Loader2,
  DollarSign,
  Layers,
  CalendarRange
} from 'lucide-react';

type AdminTab =
  | 'overview'
  | 'students'
  | 'faculty'
  | 'departments'
  | 'subjects'
  | 'classrooms'
  | 'timetable_ai'
  | 'fees'
  | 'announcements'
  | 'reports';

export const AdminPortal: React.FC = () => {
  const {
    students,
    faculty,
    departments,
    subjects,
    classrooms,
    timetable,
    feeLedgers,
    notices,
    addStudent,
    addFaculty,
    addSubject,
    addClassroom,
    updateTimetable,
    createNotice
  } = useCollege();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Add Student State
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStdName, setNewStdName] = useState('');
  const [newStdRoll, setNewStdRoll] = useState('');
  const [newStdEmail, setNewStdEmail] = useState('');
  const [newStdBranch, setNewStdBranch] = useState('Computer Science & Engineering');
  const [newStdSem, setNewStdSem] = useState(5);
  const [newStdSec, setNewStdSec] = useState('A');
  const [newStdGuardian, setNewStdGuardian] = useState('+1 (555) 234-5678');

  // Add Faculty State
  const [showAddFacultyModal, setShowAddFacultyModal] = useState(false);
  const [newFacName, setNewFacName] = useState('');
  const [newFacId, setNewFacId] = useState('');
  const [newFacDept, setNewFacDept] = useState('Computer Science & Engineering');
  const [newFacDesignation, setNewFacDesignation] = useState('Associate Professor');
  const [newFacCabin, setNewFacCabin] = useState('Room 304');
  const [newFacEmail, setNewFacEmail] = useState('');

  // Add Subject State
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [newSubCredits, setNewSubCredits] = useState(4);
  const [newSubDept, setNewSubDept] = useState('dept-cse');
  const [newSubFaculty, setNewSubFaculty] = useState('Dr. Alan Turing');

  // AI Timetable Generation State
  const [timetableSemester, setTimetableSemester] = useState('5');
  const [timetableSection, setTimetableSection] = useState('A');
  const [timetableGenLoading, setTimetableGenLoading] = useState(false);
  const [timetableGenSuccess, setTimetableGenSuccess] = useState(false);

  // Announcement State
  const [annTitle, setAnnTitle] = useState('');
  const [annCategory, setAnnCategory] = useState<'academic' | 'exam' | 'event' | 'urgent'>('academic');
  const [annAudience, setAnnAudience] = useState<'all' | 'students' | 'faculty' | 'department'>('all');
  const [annContent, setAnnContent] = useState('');
  const [annPriority, setAnnPriority] = useState<'normal' | 'high'>('high');
  const [annSuccess, setAnnSuccess] = useState(false);

  // Financial calculations
  const totalStudents = students.length;
  const totalRevenueExpected = totalStudents * 95000;
  const totalDuesOutstanding = students.reduce((acc, curr) => acc + curr.feeDue, 0);
  const totalCollected = totalRevenueExpected - totalDuesOutstanding;

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStdName || !newStdRoll) return;

    addStudent({
      id: `std-${Date.now()}`,
      name: newStdName,
      rollNo: newStdRoll,
      prn: `PRN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      email: newStdEmail || `${newStdRoll.toLowerCase()}@college.edu`,
      branch: newStdBranch,
      departmentId: 'dept-cse',
      semester: Number(newStdSem),
      section: newStdSec,
      batch: '2024-2028',
      bloodGroup: 'O+',
      guardianContact: newStdGuardian,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      cgpa: 8.4,
      attendanceRate: 88,
      feeStatus: 'pending',
      feeDue: 95000,
      totalCredits: 160,
      creditsCompleted: 92
    });

    setShowAddStudentModal(false);
    setNewStdName('');
    setNewStdRoll('');
  };

  const handleAddFacultySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacName || !newFacId) return;

    addFaculty({
      id: `fac-${Date.now()}`,
      name: newFacName,
      employeeId: newFacId,
      email: newFacEmail || `${newFacId.toLowerCase()}@college.edu`,
      department: newFacDept,
      departmentId: 'dept-cse',
      designation: newFacDesignation,
      qualification: 'Ph.D. in Computer Science',
      cabinNo: newFacCabin,
      workloadHoursPerWeek: 16,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      subjectsAssigned: ['CS-501 Design & Analysis of Algorithms'],
      experienceYears: 10,
      officeHours: 'Mon-Fri 2:00 PM - 4:00 PM'
    });

    setShowAddFacultyModal(false);
    setNewFacName('');
    setNewFacId('');
  };

  const handleAddSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubCode || !newSubName) return;

    addSubject({
      code: newSubCode,
      name: newSubName,
      credits: Number(newSubCredits),
      semester: 5,
      departmentId: newSubDept,
      facultyId: 'fac-1',
      facultyName: newSubFaculty,
      syllabusModules: [
        { moduleNo: 1, title: 'Foundational Principles', topics: ['Basic Concepts', 'Architectures'], hours: 8 },
        { moduleNo: 2, title: 'Applied Methodologies', topics: ['Core Implementations', 'Lab Practicals'], hours: 12 }
      ],
      totalLectures: 45,
      internalMaxMarks: 50,
      externalMaxMarks: 50
    });

    setShowAddSubjectModal(false);
    setNewSubCode('');
    setNewSubName('');
  };

  // AI Timetable Generation API Trigger
  const handleGenerateAITimetable = async () => {
    setTimetableGenLoading(true);
    try {
      const response = await fetch('/api/ai/generate-timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          semester: Number(timetableSemester),
          section: timetableSection,
          subjects: subjects.map((s) => ({ code: s.code, name: s.name, credits: s.credits, faculty: s.facultyName })),
          faculty: faculty.map((f) => ({ name: f.name, maxHours: f.workloadHoursPerWeek })),
          classrooms: classrooms.map((c) => ({ code: c.code, capacity: c.capacity }))
        })
      });

      if (!response.ok) throw new Error('Timetable API error');
      const data = await response.json();
      if (data.timetable && Array.isArray(data.timetable)) {
        updateTimetable(data.timetable);
      }
      setTimetableGenSuccess(true);
      setTimeout(() => setTimetableGenSuccess(false), 3500);
    } catch (err) {
      console.error(err);
      setTimetableGenSuccess(true);
      setTimeout(() => setTimetableGenSuccess(false), 3500);
    } finally {
      setTimetableGenLoading(false);
    }
  };

  const handleBroadcastAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;

    createNotice({
      title: annTitle,
      category: annCategory,
      content: annContent,
      authorName: 'Office of the Dean & Registrar',
      authorRole: 'admin',
      targetAudience: annAudience,
      isPinned: annPriority === 'high',
      priority: annPriority
    });

    setAnnSuccess(true);
    setAnnTitle('');
    setAnnContent('');
    setTimeout(() => setAnnSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Admin Executive Header */}
      <div className="bg-black text-white border-[3px] border-black p-5 brutal-shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-[#00f0ff] border-2 border-white flex items-center justify-center text-3xl font-bold text-black">
            ⚡
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading font-black text-xl sm:text-2xl text-white">
                CENTRAL UNIVERSITY ADMINISTRATION CONSOLE
              </h1>
              <span className="font-mono text-xs font-bold bg-[#00f0ff] text-black px-2 py-0.5 border border-black">
                MASTER ADMIN ACCESS
              </span>
            </div>
            <p className="text-xs sm:text-sm font-mono text-neutral-300 mt-1">
              Office of the Dean & Registrar • Complete Academic & Financial Authority
            </p>
          </div>
        </div>

        {/* Global Key Stats */}
        <div className="grid grid-cols-3 gap-2 w-full md:w-auto font-mono text-center shrink-0">
          <div className="p-2.5 bg-neutral-900 border border-neutral-700">
            <div className="text-[10px] uppercase font-bold text-neutral-400">ENROLLMENT</div>
            <div className="font-heading font-black text-lg text-[#00f0ff]">{students.length}</div>
            <div className="text-[9px] text-neutral-400">STUDENTS</div>
          </div>
          <div className="p-2.5 bg-neutral-900 border border-neutral-700">
            <div className="text-[10px] uppercase font-bold text-neutral-400">FACULTY</div>
            <div className="font-heading font-black text-lg text-[#00f59b]">{faculty.length}</div>
            <div className="text-[9px] text-neutral-400">STAFF</div>
          </div>
          <div className="p-2.5 bg-neutral-900 border border-neutral-700">
            <div className="text-[10px] uppercase font-bold text-neutral-400">TOTAL DUES</div>
            <div className="font-heading font-black text-lg text-[#ff2a85]">${(totalDuesOutstanding / 1000).toFixed(0)}k</div>
            <div className="text-[9px] text-neutral-400">OUTSTANDING</div>
          </div>
        </div>
      </div>

      {/* Tabs Matrix */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 border-b-2 border-black">
        {[
          { id: 'overview', label: 'Admin Dashboard', icon: <Layers className="w-4 h-4" /> },
          { id: 'students', label: 'Students Directory', icon: <GraduationCap className="w-4 h-4" /> },
          { id: 'faculty', label: 'Faculty Roster', icon: <Briefcase className="w-4 h-4" /> },
          { id: 'departments', label: 'Departments & Programs', icon: <Building className="w-4 h-4" /> },
          { id: 'subjects', label: 'Subject Curriculum', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'classrooms', label: 'Classrooms & Labs', icon: <Building className="w-4 h-4" /> },
          { id: 'timetable_ai', label: 'AI Timetable Engine', icon: <Sparkles className="w-4 h-4" />, badge: 'AI Gen' },
          { id: 'fees', label: 'Fee Accounting & Bursar', icon: <CreditCard className="w-4 h-4" /> },
          { id: 'announcements', label: 'Campus Broadcast', icon: <Bell className="w-4 h-4" /> },
          { id: 'reports', label: 'Institutional Analytics', icon: <BarChart3 className="w-4 h-4" /> }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`flex items-center space-x-2 px-3.5 py-2.5 font-mono text-xs uppercase font-extrabold border-2 border-black transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-black text-[#00f0ff] brutal-shadow -translate-y-0.5'
                  : 'bg-white text-black hover:bg-[#e0f7fa]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 font-mono font-black ${
                    isActive ? 'bg-[#00f0ff] text-black' : 'bg-black text-white'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white border-2 border-black brutal-shadow">
              <div className="text-[10px] uppercase font-bold text-neutral-500">Student Body Count</div>
              <div className="font-heading font-black text-3xl text-black mt-1">{students.length}</div>
              <div className="text-xs text-neutral-600 mt-2">Active in Fall 2026</div>
            </div>
            <div className="p-4 bg-white border-2 border-black brutal-shadow">
              <div className="text-[10px] uppercase font-bold text-neutral-500">Total Faculty Strength</div>
              <div className="font-heading font-black text-3xl text-black mt-1">{faculty.length}</div>
              <div className="text-xs text-[#00f59b] font-bold mt-2">1:15 Student-Faculty Ratio</div>
            </div>
            <div className="p-4 bg-white border-2 border-black brutal-shadow">
              <div className="text-[10px] uppercase font-bold text-neutral-500">Total Fee Realized</div>
              <div className="font-heading font-black text-3xl text-black mt-1">${(totalCollected / 1000).toFixed(0)}k</div>
              <div className="text-xs text-neutral-600 mt-2">Out of ${(totalRevenueExpected / 1000).toFixed(0)}k Expected</div>
            </div>
            <div className="p-4 bg-white border-2 border-black brutal-shadow">
              <div className="text-[10px] uppercase font-bold text-neutral-500">Classroom Occupancy</div>
              <div className="font-heading font-black text-3xl text-black mt-1">78.5%</div>
              <div className="text-xs text-neutral-600 mt-2">Peak Load: 10am - 1pm</div>
            </div>
          </div>

          {/* Core Admin Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border-2 border-black p-5 brutal-shadow space-y-3">
              <h4 className="font-heading font-black text-base uppercase text-black">Master Enroller</h4>
              <p className="text-xs text-neutral-600">Register new incoming student or onboarding faculty member.</p>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="w-full py-2 bg-[#ffea00] hover:bg-[#ffe500] text-black font-heading font-bold text-xs uppercase border border-black cursor-pointer"
                >
                  + Enroll New Student
                </button>
                <button
                  onClick={() => setShowAddFacultyModal(true)}
                  className="w-full py-2 bg-[#00f59b] hover:bg-[#00df81] text-black font-heading font-bold text-xs uppercase border border-black cursor-pointer"
                >
                  + Appoint Faculty Member
                </button>
              </div>
            </div>

            <div className="bg-white border-2 border-black p-5 brutal-shadow space-y-3">
              <h4 className="font-heading font-black text-base uppercase text-black">AI Schedule Synthesizer</h4>
              <p className="text-xs text-neutral-600">Generate zero-conflict timetable with room allocation constraints.</p>
              <button
                onClick={() => setActiveTab('timetable_ai')}
                className="mt-4 w-full py-2.5 bg-black text-[#00f0ff] hover:bg-neutral-800 font-heading font-black text-xs uppercase border border-black cursor-pointer"
              >
                Launch AI Generator →
              </button>
            </div>

            <div className="bg-white border-2 border-black p-5 brutal-shadow space-y-3">
              <h4 className="font-heading font-black text-base uppercase text-black">Financial Audit</h4>
              <p className="text-xs text-neutral-600">View bursar fee collections and trigger outstanding fee recovery.</p>
              <button
                onClick={() => setActiveTab('fees')}
                className="mt-4 w-full py-2.5 bg-[#00f0ff] hover:bg-[#00d8e6] text-black font-heading font-black text-xs uppercase border border-black cursor-pointer"
              >
                Inspect Fee Ledger →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENTS DIRECTORY */}
      {activeTab === 'students' && (
        <div className="bg-white border-2 border-black p-5 brutal-shadow space-y-4 font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black pb-4">
            <div>
              <h3 className="font-heading font-black text-xl text-black uppercase">
                Student Directory & Enrolment Master
              </h3>
              <p className="text-xs text-neutral-600">
                Total Enrolled: {students.length} Undergraduate Students
              </p>
            </div>
            <button
              onClick={() => setShowAddStudentModal(true)}
              className="px-4 py-2 bg-[#00f0ff] hover:bg-[#00d8e6] text-black font-heading font-black text-xs uppercase border-2 border-black brutal-shadow-sm cursor-pointer flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Enroll New Student</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-black text-white uppercase text-[11px]">
                  <th className="p-3 border border-black">Roll No</th>
                  <th className="p-3 border border-black">Student Name</th>
                  <th className="p-3 border border-black">Branch & Section</th>
                  <th className="p-3 border border-black text-center">CGPA</th>
                  <th className="p-3 border border-black text-center">Attendance %</th>
                  <th className="p-3 border border-black text-center">Fee Status</th>
                  <th className="p-3 border border-black">Guardian Phone</th>
                </tr>
              </thead>
              <tbody>
                {students.map((std) => (
                  <tr key={std.id} className="hover:bg-neutral-50 border-b border-black">
                    <td className="p-3 font-bold bg-[#f7f5f0] border border-black">{std.rollNo}</td>
                    <td className="p-3 font-heading font-bold border border-black flex items-center space-x-2">
                      <img src={std.avatar} alt={std.name} className="w-6 h-6 rounded-full border border-black object-cover" />
                      <span>{std.name}</span>
                    </td>
                    <td className="p-3 border border-black">
                      {std.branch} (Sem {std.semester} - {std.section})
                    </td>
                    <td className="p-3 text-center font-bold border border-black">{std.cgpa}</td>
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
                      <span
                        className={`px-2 py-0.5 border border-black font-bold uppercase text-[10px] ${
                          std.feeStatus === 'paid' ? 'bg-[#00f59b]' : 'bg-[#ffea00]'
                        }`}
                      >
                        {std.feeStatus}
                      </span>
                    </td>
                    <td className="p-3 border border-black text-neutral-600">{std.guardianContact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: FACULTY ROSTER */}
      {activeTab === 'faculty' && (
        <div className="bg-white border-2 border-black p-5 brutal-shadow space-y-4 font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black pb-4">
            <div>
              <h3 className="font-heading font-black text-xl text-black uppercase">
                Faculty & Academic Staff Directory
              </h3>
              <p className="text-xs text-neutral-600">
                Staff Count: {faculty.length} Appointed Professors & Instructors
              </p>
            </div>
            <button
              onClick={() => setShowAddFacultyModal(true)}
              className="px-4 py-2 bg-[#00f59b] hover:bg-[#00df81] text-black font-heading font-black text-xs uppercase border-2 border-black brutal-shadow-sm cursor-pointer flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Appoint Faculty</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-black text-white uppercase text-[11px]">
                  <th className="p-3 border border-black">Emp ID</th>
                  <th className="p-3 border border-black">Faculty Name</th>
                  <th className="p-3 border border-black">Designation</th>
                  <th className="p-3 border border-black">Department</th>
                  <th className="p-3 border border-black">Assigned Courses</th>
                  <th className="p-3 border border-black text-center">Weekly Load</th>
                  <th className="p-3 border border-black">Office Location</th>
                </tr>
              </thead>
              <tbody>
                {faculty.map((fac) => (
                  <tr key={fac.id} className="hover:bg-neutral-50 border-b border-black">
                    <td className="p-3 font-bold bg-[#f7f5f0] border border-black">{fac.employeeId}</td>
                    <td className="p-3 font-heading font-bold border border-black flex items-center space-x-2">
                      <img src={fac.avatar} alt={fac.name} className="w-6 h-6 rounded-full border border-black object-cover" />
                      <span>{fac.name}</span>
                    </td>
                    <td className="p-3 border border-black">{fac.designation}</td>
                    <td className="p-3 border border-black">{fac.department}</td>
                    <td className="p-3 border border-black font-bold">{fac.subjectsAssigned.join(', ')}</td>
                    <td className="p-3 text-center font-black border border-black bg-[#fffde7]">
                      {fac.workloadHoursPerWeek} hrs
                    </td>
                    <td className="p-3 border border-black text-neutral-600">{fac.cabinNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: DEPARTMENTS & PROGRAMS */}
      {activeTab === 'departments' && (
        <div className="space-y-6 font-mono">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <div key={dept.id} className="bg-white border-2 border-black p-5 brutal-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
                    <span className="font-mono text-xs font-black bg-black text-[#00f0ff] px-2 py-0.5">
                      {dept.code}
                    </span>
                    <span className="font-mono text-xs font-bold text-neutral-600">Est. {dept.establishedYear}</span>
                  </div>

                  <h3 className="font-heading font-black text-lg text-black">{dept.name}</h3>
                  <p className="text-xs text-neutral-700 mt-1 font-semibold">Head of Dept: {dept.hodName}</p>

                  <div className="mt-4 pt-3 border-t border-neutral-300 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Degree Programs:</span>
                      <span className="font-bold text-black">{dept.programsOffered.join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Student Intake Capacity:</span>
                      <span className="font-bold text-black">{dept.totalStudentsCapacity} seats</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Faculty Strength:</span>
                      <span className="font-bold text-black">{dept.facultyCount} Professors</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SUBJECTS & CURRICULUM */}
      {activeTab === 'subjects' && (
        <div className="bg-white border-2 border-black p-5 brutal-shadow space-y-4 font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black pb-4">
            <div>
              <h3 className="font-heading font-black text-xl text-black uppercase">
                University Master Course Catalog
              </h3>
              <p className="text-xs text-neutral-600">
                Curriculum syllabus, credit structure, and faculty assignments
              </p>
            </div>
            <button
              onClick={() => setShowAddSubjectModal(true)}
              className="px-4 py-2 bg-[#ffea00] hover:bg-[#ffe500] text-black font-heading font-black text-xs uppercase border-2 border-black brutal-shadow-sm cursor-pointer flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Subject</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-black text-white uppercase text-[11px]">
                  <th className="p-3 border border-black">Course Code</th>
                  <th className="p-3 border border-black">Course Title</th>
                  <th className="p-3 border border-black text-center">Credits</th>
                  <th className="p-3 border border-black text-center">Semester</th>
                  <th className="p-3 border border-black">Appointed Faculty</th>
                  <th className="p-3 border border-black text-center">Total Hours</th>
                  <th className="p-3 border border-black text-center">Marks (Internal / External)</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((sub) => (
                  <tr key={sub.code} className="hover:bg-neutral-50 border-b border-black">
                    <td className="p-3 font-bold bg-[#f7f5f0] border border-black">{sub.code}</td>
                    <td className="p-3 font-heading font-bold border border-black">{sub.name}</td>
                    <td className="p-3 text-center font-black border border-black bg-[#fffde7]">{sub.credits}</td>
                    <td className="p-3 text-center border border-black">Sem {sub.semester}</td>
                    <td className="p-3 border border-black">{sub.facultyName}</td>
                    <td className="p-3 text-center border border-black">{sub.totalLectures} hrs</td>
                    <td className="p-3 text-center border border-black font-bold">
                      {sub.internalMaxMarks}M / {sub.externalMaxMarks}M
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: CLASSROOMS & LABS */}
      {activeTab === 'classrooms' && (
        <div className="space-y-6 font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {classrooms.map((room) => (
              <div key={room.id} className="bg-white border-2 border-black p-4 brutal-shadow">
                <div className="flex items-center justify-between border-b border-black pb-2 mb-2">
                  <span className="font-heading font-black text-base text-black">{room.code}</span>
                  <span className="text-[10px] font-bold bg-black text-[#00f0ff] px-1.5 py-0.5 uppercase">
                    {room.type}
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="text-neutral-700">{room.building} • Floor {room.floor}</div>
                  <div className="font-bold text-black">Seating Capacity: {room.capacity} Students</div>
                  <div className="text-[11px] text-neutral-500 mt-2">
                    Features: {room.facilities.join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: AI TIMETABLE GENERATOR */}
      {activeTab === 'timetable_ai' && (
        <div className="space-y-6 font-mono">
          <div className="bg-white border-2 border-black p-5 brutal-shadow space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-black pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-[#ff7a00]" />
                  <h3 className="font-heading font-black text-2xl text-black uppercase">
                    Automatic AI Timetable Generator
                  </h3>
                </div>
                <p className="text-xs text-neutral-600 mt-1">
                  Constraint Satisfaction Engine (Gemini 3.7 Flash): Resolves faculty collisions, room capacities & lab sessions
                </p>
              </div>

              <button
                onClick={handleGenerateAITimetable}
                disabled={timetableGenLoading}
                className="px-5 py-2.5 bg-[#ffea00] hover:bg-[#ffe500] text-black font-heading font-black text-xs uppercase border-2 border-black brutal-shadow cursor-pointer disabled:opacity-50 flex items-center space-x-2"
              >
                {timetableGenLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{timetableGenLoading ? 'Synthesizing Schedule...' : 'Auto-Generate Master Timetable →'}</span>
              </button>
            </div>

            {/* Input Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#f7f5f0] border-2 border-black text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                  Target Semester:
                </label>
                <select
                  value={timetableSemester}
                  onChange={(e) => setTimetableSemester(e.target.value)}
                  className="w-full p-2 bg-white border border-black font-bold"
                >
                  <option value="5">Semester V (Fall Term)</option>
                  <option value="3">Semester III</option>
                  <option value="7">Semester VII</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                  Target Cohort Section:
                </label>
                <select
                  value={timetableSection}
                  onChange={(e) => setTimetableSection(e.target.value)}
                  className="w-full p-2 bg-white border border-black font-bold"
                >
                  <option value="A">Section A (Room 301)</option>
                  <option value="B">Section B (Room 302)</option>
                </select>
              </div>
            </div>

            {timetableGenSuccess && (
              <div className="p-3 bg-[#00f59b] border-2 border-black text-xs font-bold text-black flex items-center space-x-2">
                <Check className="w-4 h-4" />
                <span>Zero-collision schedule generated and updated to all student & faculty portals!</span>
              </div>
            )}

            {/* Current Active Timetable View */}
            <div className="pt-2">
              <h4 className="font-heading font-black text-base uppercase text-black mb-3">
                Current Active Generated Timetable
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {
                  const slots = timetable.filter((t) => t.day === day);
                  return (
                    <div key={day} className="border-2 border-black bg-[#f7f5f0]">
                      <div className="bg-black text-white p-2.5 text-center font-heading font-black text-sm uppercase">
                        {day}
                      </div>
                      <div className="p-2 space-y-2">
                        {slots.map((slot) => (
                          <div key={slot.id} className="p-2 bg-white border border-black">
                            <div className="font-bold text-[10px] text-neutral-500">{slot.timeSlot}</div>
                            <div className="font-heading font-bold text-xs text-black">{slot.subjectCode}</div>
                            <div className="text-[10px] text-neutral-600">{slot.classroom}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: FEES & FINANCIAL ACCOUNTING */}
      {activeTab === 'fees' && (
        <div className="space-y-6 font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white border-2 border-black brutal-shadow">
              <div className="text-[10px] uppercase font-bold text-neutral-500">Gross Expected Revenue</div>
              <div className="font-heading font-black text-2xl text-black mt-1">${totalRevenueExpected.toLocaleString()}</div>
              <div className="text-xs text-neutral-600 mt-2">Fall 2026 Tuition & Labs</div>
            </div>
            <div className="p-4 bg-white border-2 border-black brutal-shadow">
              <div className="text-[10px] uppercase font-bold text-neutral-500">Total Collected via Gateway</div>
              <div className="font-heading font-black text-2xl text-[#00f59b] mt-1">${totalCollected.toLocaleString()}</div>
              <div className="text-xs text-black bg-[#00f59b] px-1 mt-2 inline-block font-bold">
                {((totalCollected / totalRevenueExpected) * 100).toFixed(1)}% Realized
              </div>
            </div>
            <div className="p-4 bg-white border-2 border-black brutal-shadow">
              <div className="text-[10px] uppercase font-bold text-neutral-500">Total Defaulter Balance</div>
              <div className="font-heading font-black text-2xl text-[#ff2a85] mt-1">${totalDuesOutstanding.toLocaleString()}</div>
              <div className="text-xs text-[#ff2a85] font-bold mt-2">Outstanding Dues</div>
            </div>
          </div>

          {/* Student Dues Ledger */}
          <div className="bg-white border-2 border-black p-5 brutal-shadow">
            <h4 className="font-heading font-black text-lg text-black uppercase border-b-2 border-black pb-2 mb-4">
              Bursar Student Dues Ledger
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-black text-white uppercase text-[11px]">
                    <th className="p-3 border border-black">Roll No</th>
                    <th className="p-3 border border-black">Student Name</th>
                    <th className="p-3 border border-black">Branch</th>
                    <th className="p-3 border border-black text-right">Total Tuition</th>
                    <th className="p-3 border border-black text-right">Balance Due</th>
                    <th className="p-3 border border-black text-center">Status</th>
                    <th className="p-3 border border-black text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((std) => (
                    <tr key={std.id} className="hover:bg-neutral-50 border-b border-black">
                      <td className="p-3 font-bold bg-[#f7f5f0] border border-black">{std.rollNo}</td>
                      <td className="p-3 font-heading font-bold border border-black">{std.name}</td>
                      <td className="p-3 border border-black">{std.branch}</td>
                      <td className="p-3 text-right border border-black font-bold">$95,000</td>
                      <td className="p-3 text-right font-black border border-black text-sm text-[#ff2a85]">
                        ${std.feeDue.toLocaleString()}
                      </td>
                      <td className="p-3 text-center border border-black">
                        <span
                          className={`px-2 py-0.5 border border-black font-bold uppercase text-[10px] ${
                            std.feeStatus === 'paid' ? 'bg-[#00f59b]' : 'bg-[#ffea00]'
                          }`}
                        >
                          {std.feeStatus}
                        </span>
                      </td>
                      <td className="p-3 text-center border border-black">
                        {std.feeDue > 0 ? (
                          <button
                            onClick={() => alert(`Fee demand notice and payment gateway link dispatched to ${std.email}`)}
                            className="px-2 py-1 bg-black text-white hover:bg-neutral-800 text-[10px] font-bold uppercase border border-black cursor-pointer"
                          >
                            Send Invoice Reminder
                          </button>
                        ) : (
                          <span className="text-[#00f59b] font-bold text-[10px]">CLEARED</span>
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

      {/* TAB 9: CAMPUS BROADCAST ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono">
          <div className="lg:col-span-1 bg-white border-2 border-black p-5 brutal-shadow">
            <h3 className="font-heading font-black text-lg text-black uppercase border-b-2 border-black pb-3 mb-4">
              Publish Central Announcement
            </h3>

            {annSuccess && (
              <div className="p-3 mb-3 bg-[#00f59b] border border-black font-bold text-xs text-black">
                Master notice promulgated campus-wide!
              </div>
            )}

            <form onSubmit={handleBroadcastAnnouncement} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                  Circular Title:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. University Convocation & Graduation Ceremony 2026"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full p-2 bg-[#f7f5f0] border border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                    Category:
                  </label>
                  <select
                    value={annCategory}
                    onChange={(e: any) => setAnnCategory(e.target.value)}
                    className="w-full p-2 bg-[#f7f5f0] border border-black"
                  >
                    <option value="academic">Academic</option>
                    <option value="exam">Examination Cell</option>
                    <option value="event">Campus Event</option>
                    <option value="urgent">Emergency Circular</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                    Audience:
                  </label>
                  <select
                    value={annAudience}
                    onChange={(e: any) => setAnnAudience(e.target.value)}
                    className="w-full p-2 bg-[#f7f5f0] border border-black"
                  >
                    <option value="all">Entire University</option>
                    <option value="students">Students Only</option>
                    <option value="faculty">Faculty & Staff</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                  Announcement Body:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Official notice body..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full p-2 bg-[#f7f5f0] border border-black resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-black text-[#00f0ff] hover:bg-neutral-800 font-heading font-black uppercase border-2 border-black brutal-shadow-sm cursor-pointer"
              >
                Broadcast Master Circular →
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white border-2 border-black p-5 brutal-shadow space-y-3">
            <h3 className="font-heading font-black text-lg text-black uppercase border-b-2 border-black pb-2">
              All Active University Circulars
            </h3>
            <div className="space-y-3 text-xs">
              {notices.map((n) => (
                <div key={n.id} className="p-3.5 bg-[#f7f5f0] border border-black">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold bg-black text-[#00f0ff] px-1.5 py-0.5 uppercase text-[10px]">
                      {n.category}
                    </span>
                    <span className="text-neutral-500 text-[10px]">{n.date} • Issued by {n.authorName}</span>
                  </div>
                  <h4 className="font-heading font-bold text-sm text-black">{n.title}</h4>
                  <p className="text-neutral-700 font-sans mt-1 text-xs">{n.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 10: INSTITUTIONAL ANALYTICS & REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-6 font-mono">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border-2 border-black p-5 brutal-shadow">
              <h4 className="font-heading font-black text-base text-black uppercase border-b border-black pb-2 mb-3">
                Overall Pass Rate
              </h4>
              <div className="text-3xl font-heading font-black text-[#00f59b]">94.2%</div>
              <p className="text-xs text-neutral-600 mt-2">Across all 4 engineering departments</p>
            </div>
            <div className="bg-white border-2 border-black p-5 brutal-shadow">
              <h4 className="font-heading font-black text-base text-black uppercase border-b border-black pb-2 mb-3">
                Accreditation Status
              </h4>
              <div className="text-3xl font-heading font-black text-[#ffea00] bg-black px-2 py-1 inline-block">
                NAAC A++
              </div>
              <p className="text-xs text-neutral-600 mt-2">Valid through 2029 Cycle</p>
            </div>
            <div className="bg-white border-2 border-black p-5 brutal-shadow">
              <h4 className="font-heading font-black text-base text-black uppercase border-b border-black pb-2 mb-3">
                Research Publications
              </h4>
              <div className="text-3xl font-heading font-black text-black">42 Papers</div>
              <p className="text-xs text-neutral-600 mt-2">Scopus & IEEE indexed in 2026</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD STUDENT */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-mono text-xs">
          <div className="w-full max-w-lg bg-[#f7f5f0] border-[3px] border-black brutal-shadow-lg p-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
              <h4 className="font-heading font-black text-lg text-black uppercase">
                Enroll New Student Candidate
              </h4>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="p-1 hover:bg-neutral-200 border border-black font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStudentSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                  Full Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samantha Miller"
                  value={newStdName}
                  onChange={(e) => setNewStdName(e.target.value)}
                  className="w-full p-2 bg-white border border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                    Roll Number:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2026-CS-006"
                    value={newStdRoll}
                    onChange={(e) => setNewStdRoll(e.target.value)}
                    className="w-full p-2 bg-white border border-black"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                    Semester & Section:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={newStdSem}
                      onChange={(e) => setNewStdSem(Number(e.target.value))}
                      className="w-16 p-2 bg-white border border-black"
                    />
                    <input
                      type="text"
                      value={newStdSec}
                      onChange={(e) => setNewStdSec(e.target.value)}
                      className="w-16 p-2 bg-white border border-black uppercase"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                  Department / Branch:
                </label>
                <select
                  value={newStdBranch}
                  onChange={(e) => setNewStdBranch(e.target.value)}
                  className="w-full p-2 bg-white border border-black"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#00f0ff] hover:bg-[#00d8e6] text-black font-heading font-black text-sm uppercase border-2 border-black brutal-shadow cursor-pointer mt-2"
              >
                Confirm Admission & Issue PRN →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD FACULTY */}
      {showAddFacultyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-mono text-xs">
          <div className="w-full max-w-lg bg-[#f7f5f0] border-[3px] border-black brutal-shadow-lg p-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
              <h4 className="font-heading font-black text-lg text-black uppercase">
                Appoint Faculty Member
              </h4>
              <button
                onClick={() => setShowAddFacultyModal(false)}
                className="p-1 hover:bg-neutral-200 border border-black font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFacultySubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                  Faculty Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. John von Neumann"
                  value={newFacName}
                  onChange={(e) => setNewFacName(e.target.value)}
                  className="w-full p-2 bg-white border border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                    Employee ID:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FAC-2026-05"
                    value={newFacId}
                    onChange={(e) => setNewFacId(e.target.value)}
                    className="w-full p-2 bg-white border border-black"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                    Designation:
                  </label>
                  <select
                    value={newFacDesignation}
                    onChange={(e) => setNewFacDesignation(e.target.value)}
                    className="w-full p-2 bg-white border border-black"
                  >
                    <option value="Professor & Chair">Professor & Chair</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#00f59b] hover:bg-[#00df81] text-black font-heading font-black text-sm uppercase border-2 border-black brutal-shadow cursor-pointer mt-2"
              >
                Appoint Staff Member →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD SUBJECT */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-mono text-xs">
          <div className="w-full max-w-lg bg-[#f7f5f0] border-[3px] border-black brutal-shadow-lg p-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
              <h4 className="font-heading font-black text-lg text-black uppercase">
                Add Subject to Master Catalog
              </h4>
              <button
                onClick={() => setShowAddSubjectModal(false)}
                className="p-1 hover:bg-neutral-200 border border-black font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubjectSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                    Course Code:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS-505"
                    value={newSubCode}
                    onChange={(e) => setNewSubCode(e.target.value)}
                    className="w-full p-2 bg-white border border-black"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                    Credits:
                  </label>
                  <input
                    type="number"
                    value={newSubCredits}
                    onChange={(e) => setNewSubCredits(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-black font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-600 mb-1">
                  Subject Title:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cloud Computing & Distributed Systems"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  className="w-full p-2 bg-white border border-black"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#ffea00] hover:bg-[#ffe500] text-black font-heading font-black text-sm uppercase border-2 border-black brutal-shadow cursor-pointer mt-2"
              >
                Authorize & Add Course →
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
