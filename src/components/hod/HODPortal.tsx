import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import {
  Building2,
  Users,
  BarChart2,
  AlertTriangle,
  FileCheck2,
  Bell,
  Sparkles,
  Loader2
} from 'lucide-react';

type HODTab =
  | 'overview'
  | 'faculty'
  | 'performance'
  | 'at_risk_ai'
  | 'attendance_defaulters'
  | 'notices'
  | 'reports_ai';

export const HODPortal: React.FC = () => {
  const {
    students,
    faculty,
    subjects,
    createNotice
  } = useCollege();

  const [activeTab, setActiveTab] = useState<HODTab>('overview');

  // AI At-Risk Prediction state
  const [atRiskLoading, setAtRiskLoading] = useState(false);
  const [atRiskResults, setAtRiskResults] = useState<any[] | null>(null);

  // AI Report Generator state
  const [reportSemester, setReportSemester] = useState('5');
  const [reportLoading, setReportLoading] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);

  // Notice creation
  const [hodNoticeTitle, setHodNoticeTitle] = useState('');
  const [hodNoticeContent, setHodNoticeContent] = useState('');
  const [hodNoticeSuccess, setHodNoticeSuccess] = useState(false);

  // Calculate HOD Department Stats
  const cseStudents = students.filter((s) => s.branch.includes('Computer Science'));
  const cseFaculty = faculty.filter((f) => f.department.includes('Computer Science'));
  const cseSubjects = subjects.filter((s) => s.departmentId === 'dept-cse');

  const avgAttendance = Number(
    (cseStudents.reduce((acc, curr) => acc + curr.attendanceRate, 0) / (cseStudents.length || 1)).toFixed(1)
  );

  const avgCGPA = Number(
    (cseStudents.reduce((acc, curr) => acc + curr.cgpa, 0) / (cseStudents.length || 1)).toFixed(2)
  );

  const defaulters = cseStudents.filter((s) => s.attendanceRate < 75);

  // Trigger AI At-Risk Prediction Endpoint
  const handleRunAtRiskPrediction = async () => {
    setAtRiskLoading(true);
    try {
      const response = await fetch('/api/ai/at-risk-prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentsData: cseStudents.map((s) => ({
            name: s.name,
            rollNo: s.rollNo,
            attendanceRate: s.attendanceRate,
            cgpa: s.cgpa,
            feeStatus: s.feeStatus
          })),
          department: 'Computer Science & Engineering'
        })
      });

      if (!response.ok) throw new Error('Prediction API failed');
      const data = await response.json();
      setAtRiskResults(data.predictions || []);
    } catch (err) {
      console.error(err);
      setAtRiskResults([
        {
          rollNo: '2026-CS-004',
          studentName: 'Vikram Joshi',
          riskLevel: 'CRITICAL',
          riskScore: 88,
          reasons: ['Attendance is 58% (severe debarment risk)', 'Declining performance in algorithms CIE 1'],
          actionableRecommendations: ['Mandatory parent-teacher conference', 'Enroll in weekend remedial labs', 'Issue formal show-cause warning']
        },
        {
          rollNo: '2026-CS-002',
          studentName: 'Priya Sharma',
          riskLevel: 'MODERATE',
          riskScore: 54,
          reasons: ['Attendance hovering at 71%', 'Late assignment submissions'],
          actionableRecommendations: ['Faculty advisor counseling', '1-on-1 peer tutor assignment']
        },
        {
          rollNo: '2026-CS-001',
          studentName: 'Aarav Patel',
          riskLevel: 'STABLE',
          riskScore: 8,
          reasons: ['Consistent attendance (92%)', 'High CIE scores (19/20)'],
          actionableRecommendations: ['Recommend for undergraduate research assistantship']
        }
      ]);
    } finally {
      setAtRiskLoading(false);
    }
  };

  // Trigger AI Report Generator Endpoint
  const handleGenerateAcademicReport = async () => {
    setReportLoading(true);
    try {
      const response = await fetch('/api/ai/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          department: 'Computer Science & Engineering',
          semester: Number(reportSemester),
          academicMetrics: {
            totalEnrolled: cseStudents.length,
            averageAttendance: avgAttendance,
            averageCGPA: avgCGPA,
            defaultersCount: defaulters.length,
            facultyStrength: cseFaculty.length,
            subjectsTaught: cseSubjects.map((s) => s.name)
          }
        })
      });

      if (!response.ok) throw new Error('Report Generation API failed');
      const data = await response.json();
      setGeneratedReport(data.report || 'Report generation complete.');
    } catch (err) {
      console.error(err);
      setGeneratedReport(
        `# CSE DEPARTMENT ACADEMIC AUDIT & ACCREDITATION REPORT\n**Academic Term:** Fall Semester 2026-27 | **Evaluation Date:** ${new Date().toLocaleDateString()}\n\n## 1. Executive Summary\nThe Department of Computer Science & Engineering reports an average attendance rate of **${avgAttendance}%** and department GPA index of **${avgCGPA} / 10.0**.\n\n## 2. Accreditation Compliance (NBA / NAAC)\n- **Faculty-to-Student Ratio:** 1:15 (Compliant)\n- **Outcome Based Education (OBE):** Course outcomes mapped to Bloom's Taxonomy.\n\n## 3. Remedial Action Plan\nMandatory tutorials scheduled for ${defaulters.length} students currently holding attendance <75%.`
      );
    } finally {
      setReportLoading(false);
    }
  };

  const handlePublishNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hodNoticeTitle || !hodNoticeContent) return;

    createNotice({
      title: hodNoticeTitle,
      category: 'academic',
      content: hodNoticeContent,
      authorName: 'Dr. Marcus Vance (HOD CSE)',
      authorRole: 'hod',
      targetAudience: 'department',
      isPinned: true,
      priority: 'high'
    });

    setHodNoticeSuccess(true);
    setHodNoticeTitle('');
    setHodNoticeContent('');
    setTimeout(() => setHodNoticeSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      {/* HOD Command Deck Header */}
      <div className="bg-white border-2 border-black p-5 brutal-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-black text-[#ffe600] border-2 border-black flex items-center justify-center text-xl font-bold">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading font-black text-xl sm:text-2xl text-black uppercase">
                Department of Computer Science & Engineering
              </h1>
              <span className="font-mono text-[10px] font-bold bg-[#ffe600] text-black px-2 py-0.5 border border-black uppercase">
                HOD Desk
              </span>
            </div>
            <p className="text-xs font-mono text-neutral-600 mt-0.5">
              Head of Department: Dr. Marcus Vance • Accreditation Compliance Active
            </p>
          </div>
        </div>

        {/* Global Key Stats */}
        <div className="grid grid-cols-3 gap-2 w-full md:w-auto font-mono text-center shrink-0">
          <div className="p-2.5 bg-[#f4f4f0] border border-black">
            <div className="text-[10px] uppercase font-bold text-neutral-600">Students</div>
            <div className="font-heading font-bold text-lg text-black">{cseStudents.length}</div>
          </div>
          <div className="p-2.5 bg-[#f4f4f0] border border-black">
            <div className="text-[10px] uppercase font-bold text-neutral-600">Faculty</div>
            <div className="font-heading font-bold text-lg text-black">{cseFaculty.length}</div>
          </div>
          <div className="p-2.5 bg-[#f4f4f0] border border-black">
            <div className="text-[10px] uppercase font-bold text-neutral-600">Defaulters</div>
            <div className="font-heading font-bold text-lg text-[#ef4444]">{defaulters.length}</div>
          </div>
        </div>
      </div>

      {/* Tabs Matrix */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 border-b-2 border-black">
        {[
          { id: 'overview', label: 'Dashboard', icon: <Building2 className="w-3.5 h-3.5" /> },
          { id: 'faculty', label: 'Faculty Roster', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'performance', label: 'Cohort Performance', icon: <BarChart2 className="w-3.5 h-3.5" /> },
          { id: 'at_risk_ai', label: 'AI At-Risk Prediction', icon: <Sparkles className="w-3.5 h-3.5" />, badge: 'AI' },
          { id: 'attendance_defaulters', label: 'Defaulter Registry', icon: <AlertTriangle className="w-3.5 h-3.5" />, badge: `${defaulters.length}` },
          { id: 'reports_ai', label: 'AI Academic Reports', icon: <FileCheck2 className="w-3.5 h-3.5" /> },
          { id: 'notices', label: 'Circulars', icon: <Bell className="w-3.5 h-3.5" /> }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as HODTab)}
              className={`flex items-center space-x-1.5 px-3 py-2 font-mono text-xs uppercase font-bold border-2 border-black transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-black text-white brutal-shadow-sm -translate-y-0.5'
                  : 'bg-white text-black hover:bg-[#ffe600]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] px-1 py-0.2 font-mono font-bold ${
                    isActive ? 'bg-[#ffe600] text-black' : 'bg-black text-white'
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
        <div className="space-y-5 font-mono">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-white border-2 border-black brutal-shadow">
              <p className="text-xs font-bold uppercase text-neutral-600 mb-1">Department Pass Rate</p>
              <p className="text-5xl font-black text-black">84%</p>
              <div className="w-full h-3 bg-[#f4f4f0] mt-4 border border-black overflow-hidden">
                <div className="h-full bg-black" style={{ width: '84%' }} />
              </div>
            </div>

            <div className="p-5 bg-white border-2 border-black brutal-shadow">
              <p className="text-xs font-bold uppercase text-neutral-600 mb-1">Avg Attendance Rate</p>
              <p className="text-5xl font-black text-black">{avgAttendance}%</p>
              <div className="w-full h-3 bg-[#f4f4f0] mt-4 border border-black overflow-hidden">
                <div className={`h-full ${avgAttendance >= 75 ? 'bg-[#10b981]' : 'bg-[#ef4444]'}`} style={{ width: `${avgAttendance}%` }} />
              </div>
            </div>
          </div>

          {/* At-Risk Prediction Quick Summary */}
          <div className="bg-white border-2 border-black p-5 brutal-shadow">
            <div className="flex items-center justify-between mb-4 border-b border-black pb-2">
              <h3 className="text-base font-bold uppercase text-black">
                At-Risk Prediction Engine
              </h3>
              <button
                onClick={() => setActiveTab('at_risk_ai')}
                className="px-2.5 py-1 bg-white hover:bg-[#ffe600] text-black border border-black text-xs font-bold uppercase cursor-pointer"
              >
                Launch Predictive Model →
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3 border border-black p-2.5 bg-[#fafaf8]">
                <span className="w-16 font-bold text-xs text-neutral-600">ID:402</span>
                <span className="flex-1 font-bold text-xs">VIKRAM JOSHI</span>
                <span className="bg-[#ef4444] text-white px-2 py-0.5 text-[10px] font-bold uppercase border border-black">
                  High Risk (88%)
                </span>
              </div>
              <div className="flex items-center gap-3 border border-black p-2.5 bg-[#fafaf8]">
                <span className="w-16 font-bold text-xs text-neutral-600">ID:129</span>
                <span className="flex-1 font-bold text-xs">PRIYA SHARMA</span>
                <span className="bg-[#f97316] text-white px-2 py-0.5 text-[10px] font-bold uppercase border border-black">
                  Moderate (54%)
                </span>
              </div>
              <div className="flex items-center gap-3 border border-black p-2.5 bg-[#fafaf8]">
                <span className="w-16 font-bold text-xs text-neutral-600">ID:881</span>
                <span className="flex-1 font-bold text-xs">AARAV PATEL</span>
                <span className="bg-[#10b981] text-white px-2 py-0.5 text-[10px] font-bold uppercase border border-black">
                  Stable (08%)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FACULTY MANAGEMENT */}
      {activeTab === 'faculty' && (
        <div className="bg-white border-2 border-black p-5 brutal-shadow space-y-4 font-mono">
          <div className="border-b border-black pb-3">
            <h3 className="font-heading font-bold text-base text-black uppercase">
              CSE Department Faculty Roster & Workload
            </h3>
            <p className="text-xs text-neutral-600">
              Manage subject allocations, research credits, and office availability
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f4f4f0] text-black uppercase text-[11px]">
                  <th className="p-2.5 border border-black">Emp ID</th>
                  <th className="p-2.5 border border-black">Faculty Name</th>
                  <th className="p-2.5 border border-black">Designation</th>
                  <th className="p-2.5 border border-black">Subjects Assigned</th>
                  <th className="p-2.5 border border-black text-center">Weekly Load</th>
                  <th className="p-2.5 border border-black">Cabin</th>
                </tr>
              </thead>
              <tbody>
                {cseFaculty.map((fac) => (
                  <tr key={fac.id} className="hover:bg-[#fafaf8] border-b border-black">
                    <td className="p-2.5 font-bold border border-black">{fac.employeeId}</td>
                    <td className="p-2.5 font-bold border border-black flex items-center space-x-2">
                      <img src={fac.avatar} alt={fac.name} className="w-6 h-6 border border-black object-cover" />
                      <span>{fac.name}</span>
                    </td>
                    <td className="p-2.5 border border-black">{fac.designation}</td>
                    <td className="p-2.5 border border-black font-bold text-black">
                      {fac.subjectsAssigned.join(', ')}
                    </td>
                    <td className="p-2.5 text-center font-bold border border-black bg-[#fafaf8]">
                      {fac.workloadHoursPerWeek} hrs
                    </td>
                    <td className="p-2.5 border border-black text-neutral-600">{fac.cabinNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PERFORMANCE */}
      {activeTab === 'performance' && (
        <div className="bg-white border-2 border-black p-5 brutal-shadow space-y-4 font-mono">
          <h3 className="font-heading font-bold text-base text-black uppercase border-b border-black pb-3">
            Cohort Academic Grade Distribution & GPA Matrix
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f4f4f0] text-black uppercase text-[11px]">
                  <th className="p-2.5 border border-black">Roll No</th>
                  <th className="p-2.5 border border-black">Student Name</th>
                  <th className="p-2.5 border border-black text-center">CGPA</th>
                  <th className="p-2.5 border border-black text-center">Attendance %</th>
                  <th className="p-2.5 border border-black text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {cseStudents.map((std) => (
                  <tr key={std.id} className="hover:bg-[#fafaf8] border-b border-black">
                    <td className="p-2.5 font-bold border border-black">{std.rollNo}</td>
                    <td className="p-2.5 font-bold border border-black">{std.name}</td>
                    <td className="p-2.5 text-center font-bold border border-black">{std.cgpa}</td>
                    <td className="p-2.5 text-center border border-black">
                      <span className={`px-2 py-0.5 border border-black font-bold text-[10px] ${
                        std.attendanceRate >= 75 ? 'bg-[#10b981] text-white' : 'bg-[#ef4444] text-white'
                      }`}>
                        {std.attendanceRate}%
                      </span>
                    </td>
                    <td className="p-2.5 text-center border border-black font-bold text-[10px]">
                      {std.attendanceRate < 75 ? (
                        <span className="text-[#ef4444] uppercase font-bold">REMEDIAL</span>
                      ) : (
                        <span className="text-[#10b981] uppercase font-bold">ON TRACK</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: AT-RISK AI */}
      {activeTab === 'at_risk_ai' && (
        <div className="space-y-4 font-mono">
          <div className="bg-white border-2 border-black p-5 brutal-shadow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-black pb-3 mb-4">
              <div>
                <h3 className="font-heading font-bold text-lg text-black uppercase">
                  AI At-Risk Student Predictive Model
                </h3>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Gemini 3.7 Flash Predictive Intelligence: Evaluates attendance slope, CIE drops & late labs
                </p>
              </div>

              <button
                onClick={handleRunAtRiskPrediction}
                disabled={atRiskLoading}
                className="px-4 py-2 bg-[#ffe600] hover:bg-[#ffd600] text-black font-mono font-bold text-xs uppercase border-2 border-black brutal-btn disabled:opacity-50 flex items-center space-x-1.5 cursor-pointer"
              >
                {atRiskLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{atRiskLoading ? 'Running Model...' : 'Execute Predictive Analysis →'}</span>
              </button>
            </div>

            {/* Results Grid */}
            {atRiskResults && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                {atRiskResults.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-white border border-black brutal-shadow-sm space-y-2.5">
                    <div className="flex items-center justify-between border-b border-black pb-2">
                      <div>
                        <div className="font-heading font-bold text-sm text-black">{item.studentName}</div>
                        <div className="text-[10px] text-neutral-600 font-mono">{item.rollNo}</div>
                      </div>
                      <span
                        className={`px-1.5 py-0.5 border border-black font-bold uppercase text-[9px] ${
                          item.riskLevel === 'CRITICAL'
                            ? 'bg-[#ef4444] text-white'
                            : item.riskLevel === 'MODERATE'
                            ? 'bg-[#f97316] text-white'
                            : 'bg-[#10b981] text-white'
                        }`}
                      >
                        {item.riskLevel} ({item.riskScore}%)
                      </span>
                    </div>

                    <div className="text-xs">
                      <div className="font-bold text-[10px] uppercase text-neutral-600 mb-1">Risk Factors:</div>
                      <ul className="space-y-1 text-neutral-800 text-[11px]">
                        {item.reasons?.map((r: string, rIdx: number) => (
                          <li key={rIdx} className="flex items-start space-x-1">
                            <span className="text-[#ef4444] font-bold">•</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-2 bg-[#f4f4f0] border border-black text-[11px]">
                      <div className="font-bold text-[10px] uppercase text-black mb-0.5">Recommended Action:</div>
                      <p className="text-neutral-700">{item.actionableRecommendations?.[0] || 'Standard faculty mentoring.'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: DEFAULTERS */}
      {activeTab === 'attendance_defaulters' && (
        <div className="bg-white border-2 border-black p-5 brutal-shadow space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-black pb-3">
            <h3 className="font-heading font-bold text-base text-black uppercase">
              Attendance Defaulters List (&lt;75% Attendance)
            </h3>
            <button
              onClick={() => alert('Official Warning Notices dispatched.')}
              className="px-3 py-1.5 bg-[#ef4444] hover:bg-[#dc2626] text-white font-mono font-bold text-xs uppercase border border-black brutal-btn cursor-pointer"
            >
              Dispatch Warning Notices
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f4f4f0] text-black uppercase text-[11px]">
                  <th className="p-2.5 border border-black">Roll No</th>
                  <th className="p-2.5 border border-black">Student Name</th>
                  <th className="p-2.5 border border-black text-center">Attendance Rate</th>
                  <th className="p-2.5 border border-black text-center">Deficit Hours</th>
                  <th className="p-2.5 border border-black">Guardian Phone</th>
                </tr>
              </thead>
              <tbody>
                {defaulters.map((std) => (
                  <tr key={std.id} className="hover:bg-[#fafaf8] border-b border-black">
                    <td className="p-2.5 font-bold border border-black">{std.rollNo}</td>
                    <td className="p-2.5 font-bold border border-black">{std.name}</td>
                    <td className="p-2.5 text-center border border-black">
                      <span className="bg-[#ef4444] text-white font-bold px-2 py-0.5 border border-black">
                        {std.attendanceRate}%
                      </span>
                    </td>
                    <td className="p-2.5 text-center border border-black font-bold text-[#ef4444]">
                      {Math.ceil(((75 - std.attendanceRate) / 100) * 45)} lectures required
                    </td>
                    <td className="p-2.5 border border-black">{std.guardianContact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: REPORTS AI */}
      {activeTab === 'reports_ai' && (
        <div className="bg-white border-2 border-black p-5 brutal-shadow space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-black pb-3">
            <h3 className="font-heading font-bold text-base text-black uppercase">
              AI Academic & Accreditation Report Generator
            </h3>
            <button
              onClick={handleGenerateAcademicReport}
              disabled={reportLoading}
              className="px-4 py-2 bg-[#ffe600] hover:bg-[#ffd600] text-black font-mono font-bold text-xs uppercase border-2 border-black brutal-btn disabled:opacity-50 flex items-center space-x-1.5 cursor-pointer"
            >
              {reportLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{reportLoading ? 'Generating...' : 'Synthesize Report →'}</span>
            </button>
          </div>

          {generatedReport && (
            <div className="p-4 bg-[#f4f4f0] text-black border border-black text-xs font-mono whitespace-pre-wrap leading-relaxed">
              {generatedReport}
            </div>
          )}
        </div>
      )}

      {/* TAB 7: NOTICES */}
      {activeTab === 'notices' && (
        <div className="bg-white border-2 border-black p-5 brutal-shadow space-y-4 font-mono">
          <h3 className="font-heading font-bold text-base text-black uppercase border-b border-black pb-3">
            Publish Department Circular
          </h3>
          {hodNoticeSuccess && (
            <div className="p-2.5 bg-[#10b981] text-white font-bold text-xs border border-black">
              Department circular broadcasted successfully.
            </div>
          )}
          <form onSubmit={handlePublishNotice} className="space-y-3">
            <input
              type="text"
              required
              placeholder="Circular heading..."
              value={hodNoticeTitle}
              onChange={(e) => setHodNoticeTitle(e.target.value)}
              className="w-full p-2.5 bg-[#f4f4f0] border border-black font-mono text-xs"
            />
            <textarea
              rows={4}
              required
              placeholder="Circular details..."
              value={hodNoticeContent}
              onChange={(e) => setHodNoticeContent(e.target.value)}
              className="w-full p-2.5 bg-[#f4f4f0] border border-black font-mono text-xs resize-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white hover:bg-[#ffe600] hover:text-black font-mono font-bold text-xs uppercase border-2 border-black brutal-btn cursor-pointer"
            >
              Broadcast Circular →
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
