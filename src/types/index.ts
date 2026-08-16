export type Role = 'student' | 'faculty' | 'hod' | 'admin';

export interface StudentProfile {
  id: string;
  rollNo: string;
  prn: string;
  name: string;
  email: string;
  avatar: string;
  branch: string;
  semester: number;
  section: string;
  batch: string;
  guardianContact: string;
  bloodGroup: string;
  cgpa: number;
  creditsCompleted: number;
  totalCredits: number;
  feeDue: number;
  feeStatus: 'paid' | 'partial' | 'pending';
  attendanceRate: number;
  address: string;
}

export interface FacultyProfile {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  avatar: string;
  designation: 'Assistant Professor' | 'Associate Professor' | 'Professor' | 'HOD';
  department: string;
  qualification: string;
  subjectsAssigned: string[];
  officeHours: string;
  cabinNo: string;
  experienceYears: number;
  workloadHoursPerWeek: number;
}

export interface Subject {
  code: string;
  name: string;
  credits: number;
  semester: number;
  department: string;
  facultyId: string;
  facultyName: string;
  syllabusModules: {
    moduleNo: number;
    title: string;
    topics: string[];
    hours: number;
  }[];
  totalLectures: number;
  internalMaxMarks: number;
  externalMaxMarks: number;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  subjectCode: string;
  subjectName: string;
  studentId: string;
  studentRollNo: string;
  studentName: string;
  status: 'present' | 'absent' | 'leave';
  remarks?: string;
  period: string;
}

export interface MarksRecord {
  id: string;
  studentId: string;
  studentRollNo: string;
  studentName: string;
  subjectCode: string;
  subjectName: string;
  semester: number;
  internal1: number; // Max 20
  internal2: number; // Max 20
  assignmentScore: number; // Max 10
  external: number; // Max 50
  totalMarks: number; // Max 100
  grade: string;
  status: 'Pass' | 'Fail';
}

export interface StudentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  submittedAt: string;
  fileUrl?: string;
  fileName?: string;
  content?: string;
  score?: number;
  maxScore: number;
  feedback?: string;
  status: 'submitted' | 'evaluated' | 'late' | 'pending';
}

export interface Assignment {
  id: string;
  subjectCode: string;
  subjectName: string;
  title: string;
  description: string;
  maxMarks: number;
  dueDate: string;
  assignedDate: string;
  facultyId: string;
  facultyName: string;
  department: string;
  semester: number;
  submissions: StudentSubmission[];
}

export interface Notice {
  id: string;
  title: string;
  category: 'academic' | 'exam' | 'placement' | 'event' | 'urgent' | 'department';
  content: string;
  authorName: string;
  authorRole: Role;
  targetAudience: 'all' | 'students' | 'faculty' | 'department';
  department?: string;
  date: string;
  isPinned: boolean;
  priority: 'high' | 'normal';
}

export interface LeaveApplication {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantRole: Role;
  applicantRollNo?: string;
  applicantDepartment: string;
  leaveType: 'medical' | 'on_duty' | 'casual' | 'emergency';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  documentName?: string;
  status: 'pending' | 'approved' | 'rejected';
  approverComment?: string;
  appliedAt: string;
  reviewedBy?: string;
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  timeSlot: string; // e.g. "09:00 - 10:00"
  subjectCode: string;
  subjectName: string;
  facultyId: string;
  facultyName: string;
  classroom: string;
  department: string;
  semester: number;
  section: string;
  type: 'Lecture' | 'Lab' | 'Tutorial';
}

export interface Classroom {
  id: string;
  roomNumber: string;
  building: string;
  capacity: number;
  type: 'Lecture Hall' | 'Computer Lab' | 'Electronics Lab' | 'Seminar Hall';
  hasProjector: boolean;
  hasAC: boolean;
  status: 'Available' | 'Occupied' | 'Maintenance';
}

export interface FeeTransaction {
  id: string;
  studentId: string;
  amount: number;
  paymentDate: string;
  method: 'UPI' | 'Net Banking' | 'Credit Card' | 'Debit Card' | 'Cheque';
  receiptNo: string;
  semester: number;
  status: 'Success' | 'Failed' | 'Processing';
  type: 'Tuition Fee' | 'Exam Fee' | 'Library Fee' | 'Hostel Fee';
}

export interface FeeLedger {
  studentId: string;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  dueDate: string;
  status: 'paid' | 'partial' | 'pending';
  breakdown: {
    category: string;
    amount: number;
    paid: boolean;
  }[];
  transactions: FeeTransaction[];
}

export interface AtRiskStudent {
  studentId: string;
  rollNo: string;
  name: string;
  branch: string;
  semester: number;
  attendanceRate: number;
  avgInternalMarks: number;
  cgpa: number;
  riskScore: number; // 0 - 100
  riskLevel: 'Critical' | 'Moderate' | 'Safe';
  primaryRiskFactors: string[];
  recommendedIntervention: string;
  actionTaken?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'alert' | 'info' | 'success' | 'warning';
  targetRole?: Role;
  actionLink?: string;
}

export interface DepartmentStats {
  name: string;
  code: string;
  totalStudents: number;
  totalFaculty: number;
  avgAttendance: number;
  passPercentage: number;
  topPerformingSubject: string;
  atRiskStudentsCount: number;
}
