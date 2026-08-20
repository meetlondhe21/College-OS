import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Role,
  StudentProfile,
  FacultyProfile,
  Subject,
  AttendanceRecord,
  MarksRecord,
  Assignment,
  Notice,
  LeaveApplication,
  TimetableSlot,
  Classroom,
  FeeLedger,
  NotificationItem,
  DepartmentStats,
  StudentSubmission
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_FACULTY,
  INITIAL_SUBJECTS,
  INITIAL_ATTENDANCE,
  INITIAL_MARKS,
  INITIAL_ASSIGNMENTS,
  INITIAL_NOTICES,
  INITIAL_LEAVES,
  INITIAL_TIMETABLE,
  INITIAL_CLASSROOMS,
  INITIAL_FEE_LEDGERS,
  INITIAL_NOTIFICATIONS,
  DEPARTMENT_STATS
} from '../data/mockData';
import {
  db,
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from '../lib/firebase';
import { initializeFirestoreDatabase } from '../lib/firestoreService';

interface CollegeContextType {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  currentStudent: StudentProfile;
  setCurrentStudent: (student: StudentProfile) => void;
  currentFaculty: FacultyProfile;
  setCurrentFaculty: (faculty: FacultyProfile) => void;
  
  // Data lists
  students: StudentProfile[];
  faculty: FacultyProfile[];
  subjects: Subject[];
  attendance: AttendanceRecord[];
  marks: MarksRecord[];
  assignments: Assignment[];
  notices: Notice[];
  leaves: LeaveApplication[];
  timetable: TimetableSlot[];
  classrooms: Classroom[];
  feeLedgers: Record<string, FeeLedger>;
  notifications: NotificationItem[];
  departmentStats: DepartmentStats[];
  
  // Actions
  takeAttendance: (records: Omit<AttendanceRecord, 'id'>[]) => void;
  updateMarks: (record: MarksRecord) => void;
  addMarksBatch: (records: MarksRecord[]) => void;
  createAssignment: (assignment: Omit<Assignment, 'id' | 'submissions'>) => void;
  submitAssignment: (assignmentId: string, submission: Omit<StudentSubmission, 'id' | 'status'>) => void;
  gradeSubmission: (assignmentId: string, submissionId: string, score: number, feedback: string) => void;
  createNotice: (notice: Omit<Notice, 'id' | 'date'>) => void;
  deleteNotice: (id: string) => void;
  applyLeave: (leave: Omit<LeaveApplication, 'id' | 'status' | 'appliedAt'>) => void;
  updateLeaveStatus: (leaveId: string, status: 'approved' | 'rejected', comment?: string) => void;
  payFee: (studentId: string, amount: number, method: 'UPI' | 'Net Banking' | 'Credit Card' | 'Debit Card' | 'Cheque', categoryName?: string) => void;
  addStudent: (student: Omit<StudentProfile, 'id'>) => void;
  updateStudent: (student: StudentProfile) => void;
  deleteStudent: (id: string) => void;
  addFaculty: (facultyMember: Omit<FacultyProfile, 'id'>) => void;
  updateFaculty: (facultyMember: FacultyProfile) => void;
  deleteFaculty: (id: string) => void;
  addSubject: (subject: Subject) => void;
  addClassroom: (room: Omit<Classroom, 'id'>) => void;
  addTimetableSlot: (slot: Omit<TimetableSlot, 'id'>) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  resetToDemoData: () => void;
  
  // Database status
  isFirestoreConnected: boolean;

  // Global search & command palette
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Authentication & Session
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  loginAsStudent: (student: StudentProfile) => void;
  loginAsFaculty: (fac: FacultyProfile, role?: Role) => void;
  loginAsRole: (role: Role) => void;
  logout: () => void;
}

const CollegeContext = createContext<CollegeContextType | undefined>(undefined);

export const CollegeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load state from localStorage or fallback to defaults
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(`college_os_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const [currentRole, setCurrentRole] = useState<Role>(() => loadStored<Role>('role', 'student'));
  const [students, setStudents] = useState<StudentProfile[]>(() => loadStored('students', INITIAL_STUDENTS));
  const [faculty, setFaculty] = useState<FacultyProfile[]>(() => loadStored('faculty', INITIAL_FACULTY));
  const [subjects, setSubjects] = useState<Subject[]>(() => loadStored('subjects', INITIAL_SUBJECTS));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => loadStored('attendance', INITIAL_ATTENDANCE));
  const [marks, setMarks] = useState<MarksRecord[]>(() => loadStored('marks', INITIAL_MARKS));
  const [assignments, setAssignments] = useState<Assignment[]>(() => loadStored('assignments', INITIAL_ASSIGNMENTS));
  const [notices, setNotices] = useState<Notice[]>(() => loadStored('notices', INITIAL_NOTICES));
  const [leaves, setLeaves] = useState<LeaveApplication[]>(() => loadStored('leaves', INITIAL_LEAVES));
  const [timetable, setTimetable] = useState<TimetableSlot[]>(() => loadStored('timetable', INITIAL_TIMETABLE));
  const [classrooms, setClassrooms] = useState<Classroom[]>(() => loadStored('classrooms', INITIAL_CLASSROOMS));
  const [feeLedgers, setFeeLedgers] = useState<Record<string, FeeLedger>>(() => loadStored('fees', INITIAL_FEE_LEDGERS));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadStored('notifications', INITIAL_NOTIFICATIONS));
  const [departmentStats] = useState<DepartmentStats[]>(DEPARTMENT_STATS);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean>(true);

  const [currentStudent, setCurrentStudent] = useState<StudentProfile>(() => {
    const saved = loadStored<StudentProfile | null>('currentStudent', null);
    return saved || students[0] || INITIAL_STUDENTS[0];
  });

  const [currentFaculty, setCurrentFaculty] = useState<FacultyProfile>(() => {
    const saved = loadStored<FacultyProfile | null>('currentFaculty', null);
    return saved || faculty[0] || INITIAL_FACULTY[0];
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => loadStored('isAuthenticated', true));

  // Initialize Firestore listeners & seeds on mount
  useEffect(() => {
    initializeFirestoreDatabase().catch(console.warn);

    // Live Snapshot for Students
    const unsubStudents = onSnapshot(
      collection(db, 'students'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: StudentProfile[] = [];
          snapshot.forEach((doc) => list.push(doc.data() as StudentProfile));
          setStudents(list);
          setIsFirestoreConnected(true);
        }
      },
      (err) => {
        console.warn('Firestore student sync fallback to local cache:', err);
      }
    );

    // Live Snapshot for Faculty
    const unsubFaculty = onSnapshot(
      collection(db, 'faculty'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: FacultyProfile[] = [];
          snapshot.forEach((doc) => list.push(doc.data() as FacultyProfile));
          setFaculty(list);
        }
      },
      (err) => console.warn('Firestore faculty sync fallback:', err)
    );

    // Live Snapshot for Notices
    const unsubNotices = onSnapshot(
      collection(db, 'notices'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Notice[] = [];
          snapshot.forEach((doc) => list.push(doc.data() as Notice));
          setNotices(list);
        }
      },
      (err) => console.warn('Firestore notices sync fallback:', err)
    );

    // Live Snapshot for Assignments
    const unsubAssignments = onSnapshot(
      collection(db, 'assignments'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Assignment[] = [];
          snapshot.forEach((doc) => list.push(doc.data() as Assignment));
          setAssignments(list);
        }
      },
      (err) => console.warn('Firestore assignments sync fallback:', err)
    );

    return () => {
      unsubStudents();
      unsubFaculty();
      unsubNotices();
      unsubAssignments();
    };
  }, []);

  const loginAsStudent = (student: StudentProfile) => {
    setCurrentStudent(student);
    setCurrentRole('student');
    setIsAuthenticated(true);
  };

  const loginAsFaculty = (fac: FacultyProfile, role: Role = 'faculty') => {
    setCurrentFaculty(fac);
    setCurrentRole(role);
    setIsAuthenticated(true);
  };

  const loginAsRole = (role: Role) => {
    setCurrentRole(role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('college_os_isAuthenticated', JSON.stringify(isAuthenticated));
      localStorage.setItem('college_os_role', JSON.stringify(currentRole));
      localStorage.setItem('college_os_students', JSON.stringify(students));
      localStorage.setItem('college_os_faculty', JSON.stringify(faculty));
      localStorage.setItem('college_os_subjects', JSON.stringify(subjects));
      localStorage.setItem('college_os_attendance', JSON.stringify(attendance));
      localStorage.setItem('college_os_marks', JSON.stringify(marks));
      localStorage.setItem('college_os_assignments', JSON.stringify(assignments));
      localStorage.setItem('college_os_notices', JSON.stringify(notices));
      localStorage.setItem('college_os_leaves', JSON.stringify(leaves));
      localStorage.setItem('college_os_timetable', JSON.stringify(timetable));
      localStorage.setItem('college_os_classrooms', JSON.stringify(classrooms));
      localStorage.setItem('college_os_fees', JSON.stringify(feeLedgers));
      localStorage.setItem('college_os_notifications', JSON.stringify(notifications));
      localStorage.setItem('college_os_currentStudent', JSON.stringify(currentStudent));
      localStorage.setItem('college_os_currentFaculty', JSON.stringify(currentFaculty));
    } catch (e) {
      console.warn('Storage sync issue:', e);
    }
  }, [
    currentRole,
    students,
    faculty,
    subjects,
    attendance,
    marks,
    assignments,
    notices,
    leaves,
    timetable,
    classrooms,
    feeLedgers,
    notifications,
    currentStudent,
    currentFaculty
  ]);

  // Actions
  const takeAttendance = (records: Omit<AttendanceRecord, 'id'>[]) => {
    const newRecords: AttendanceRecord[] = records.map((r, idx) => ({
      ...r,
      id: `att-${Date.now()}-${idx}`
    }));
    setAttendance((prev) => [...newRecords, ...prev]);

    // Recalculate student attendance rates
    const studentIds = Array.from(new Set(records.map((r) => r.studentId)));
    setStudents((prev) =>
      prev.map((std) => {
        if (!studentIds.includes(std.id)) return std;
        const allStudentRecords = [...newRecords, ...attendance].filter((a) => a.studentId === std.id);
        const presentCount = allStudentRecords.filter((a) => a.status === 'present' || a.status === 'leave').length;
        const rate = allStudentRecords.length > 0 ? Number(((presentCount / allStudentRecords.length) * 100).toFixed(1)) : std.attendanceRate;
        
        const updated = { ...std, attendanceRate: rate };
        // Sync student attendance rate to Firestore
        setDoc(doc(db, 'students', std.id), updated, { merge: true }).catch(console.warn);
        return updated;
      })
    );
  };

  const updateMarks = (record: MarksRecord) => {
    setMarks((prev) => prev.map((m) => (m.id === record.id ? record : m)));
    setDoc(doc(db, 'marks', record.id), record, { merge: true }).catch(console.warn);
  };

  const addMarksBatch = (records: MarksRecord[]) => {
    setMarks((prev) => {
      const updated = [...prev];
      records.forEach((newRec) => {
        const existingIdx = updated.findIndex(
          (m) => m.studentId === newRec.studentId && m.subjectCode === newRec.subjectCode
        );
        if (existingIdx >= 0) {
          updated[existingIdx] = newRec;
        } else {
          updated.push(newRec);
        }
        setDoc(doc(db, 'marks', newRec.id), newRec, { merge: true }).catch(console.warn);
      });
      return updated;
    });
  };

  const createAssignment = (assignment: Omit<Assignment, 'id' | 'submissions'>) => {
    const newAsg: Assignment = {
      ...assignment,
      id: `asg-${Date.now()}`,
      submissions: []
    };
    setAssignments((prev) => [newAsg, ...prev]);
    setDoc(doc(db, 'assignments', newAsg.id), newAsg).catch(console.warn);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'New Assignment Published',
        message: `${newAsg.subjectCode}: ${newAsg.title}`,
        timestamp: 'Just now',
        read: false,
        type: 'info',
        targetRole: 'student'
      },
      ...prev
    ]);
  };

  const submitAssignment = (assignmentId: string, submission: Omit<StudentSubmission, 'id' | 'status'>) => {
    const newSub: StudentSubmission = {
      ...submission,
      id: `sub-${Date.now()}`,
      status: 'submitted'
    };

    setAssignments((prev) =>
      prev.map((asg) => {
        if (asg.id !== assignmentId) return asg;
        const filtered = asg.submissions.filter((s) => s.studentId !== submission.studentId);
        const updated = { ...asg, submissions: [...filtered, newSub] };
        setDoc(doc(db, 'assignments', assignmentId), updated, { merge: true }).catch(console.warn);
        return updated;
      })
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Assignment Submitted',
        message: `Successfully submitted for ${assignmentId}.`,
        timestamp: 'Just now',
        read: false,
        type: 'success',
        targetRole: 'student'
      },
      ...prev
    ]);
  };

  const gradeSubmission = (assignmentId: string, submissionId: string, score: number, feedback: string) => {
    setAssignments((prev) =>
      prev.map((asg) => {
        if (asg.id !== assignmentId) return asg;
        const updated = {
          ...asg,
          submissions: asg.submissions.map((sub) =>
            sub.id === submissionId ? { ...sub, score, feedback, status: 'evaluated' } : sub
          )
        };
        setDoc(doc(db, 'assignments', assignmentId), updated, { merge: true }).catch(console.warn);
        return updated;
      })
    );
  };

  const createNotice = (notice: Omit<Notice, 'id' | 'date'>) => {
    const newNotice: Notice = {
      ...notice,
      id: `not-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setNotices((prev) => [newNotice, ...prev]);
    setDoc(doc(db, 'notices', newNotice.id), newNotice).catch(console.warn);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Notice: ${newNotice.title}`,
        message: newNotice.content.substring(0, 75) + '...',
        timestamp: 'Just now',
        read: false,
        type: newNotice.priority === 'high' ? 'warning' : 'info'
      },
      ...prev
    ]);
  };

  const deleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
    deleteDoc(doc(db, 'notices', id)).catch(console.warn);
  };

  const applyLeave = (leave: Omit<LeaveApplication, 'id' | 'status' | 'appliedAt'>) => {
    const newLeave: LeaveApplication = {
      ...leave,
      id: `lev-${Date.now()}`,
      status: 'pending',
      appliedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setLeaves((prev) => [newLeave, ...prev]);
    setDoc(doc(db, 'leaves', newLeave.id), newLeave).catch(console.warn);
  };

  const updateLeaveStatus = (leaveId: string, status: 'approved' | 'rejected', comment?: string) => {
    setLeaves((prev) =>
      prev.map((l) => {
        if (l.id !== leaveId) return l;
        const updated = {
          ...l,
          status,
          approverComment: comment || (status === 'approved' ? 'Leave sanctioned.' : 'Leave rejected.'),
          reviewedBy: currentFaculty.name || 'Faculty Mentor'
        };
        setDoc(doc(db, 'leaves', leaveId), updated, { merge: true }).catch(console.warn);
        return updated;
      })
    );
  };

  const payFee = (
    studentId: string,
    amount: number,
    method: 'UPI' | 'Net Banking' | 'Credit Card' | 'Debit Card' | 'Cheque',
    categoryName?: string
  ) => {
    setFeeLedgers((prev) => {
      const current = prev[studentId] || {
        studentId,
        totalAmount: 95000,
        paidAmount: 0,
        balanceDue: 95000,
        dueDate: '2026-08-30',
        status: 'pending',
        breakdown: [],
        transactions: []
      };

      const newPaid = current.paidAmount + amount;
      const newBal = Math.max(0, current.totalAmount - newPaid);
      const newStatus = newBal === 0 ? 'paid' : newPaid > 0 ? 'partial' : 'pending';

      const updatedBreakdown = current.breakdown.map((item) => {
        if (categoryName && item.category === categoryName) {
          return { ...item, paid: true };
        }
        return item;
      });

      const newTx = {
        id: `tx-${Date.now()}`,
        studentId,
        amount,
        paymentDate: new Date().toISOString().split('T')[0],
        method,
        receiptNo: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        semester: 5,
        status: 'Success' as const,
        type: 'Tuition Fee' as const
      };

      const updatedLedger = {
        ...current,
        paidAmount: newPaid,
        balanceDue: newBal,
        status: newStatus,
        breakdown: updatedBreakdown,
        transactions: [newTx, ...current.transactions]
      };

      setDoc(doc(db, 'feeLedgers', studentId), updatedLedger).catch(console.warn);

      return {
        ...prev,
        [studentId]: updatedLedger
      };
    });

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const currentBal = s.feeDue - amount;
        const updated = {
          ...s,
          feeDue: Math.max(0, currentBal),
          feeStatus: currentBal <= 0 ? 'paid' as const : 'partial' as const
        };
        setDoc(doc(db, 'students', studentId), updated, { merge: true }).catch(console.warn);
        return updated;
      })
    );
  };

  const addStudent = (student: Omit<StudentProfile, 'id'>) => {
    const newStudent: StudentProfile = {
      ...student,
      id: `std-${Date.now()}`
    };
    setStudents((prev) => [newStudent, ...prev]);
    setDoc(doc(db, 'students', newStudent.id), newStudent).catch(console.warn);
  };

  const updateStudent = (student: StudentProfile) => {
    setStudents((prev) => prev.map((s) => (s.id === student.id ? student : s)));
    setDoc(doc(db, 'students', student.id), student, { merge: true }).catch(console.warn);
    if (currentStudent.id === student.id) {
      setCurrentStudent(student);
    }
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    deleteDoc(doc(db, 'students', id)).catch(console.warn);
  };

  const addFaculty = (facultyMember: Omit<FacultyProfile, 'id'>) => {
    const newFac: FacultyProfile = {
      ...facultyMember,
      id: `fac-${Date.now()}`
    };
    setFaculty((prev) => [newFac, ...prev]);
    setDoc(doc(db, 'faculty', newFac.id), newFac).catch(console.warn);
  };

  const updateFaculty = (facultyMember: FacultyProfile) => {
    setFaculty((prev) => prev.map((f) => (f.id === facultyMember.id ? facultyMember : f)));
    setDoc(doc(db, 'faculty', facultyMember.id), facultyMember, { merge: true }).catch(console.warn);
    if (currentFaculty.id === facultyMember.id) {
      setCurrentFaculty(facultyMember);
    }
  };

  const deleteFaculty = (id: string) => {
    setFaculty((prev) => prev.filter((f) => f.id !== id));
    deleteDoc(doc(db, 'faculty', id)).catch(console.warn);
  };

  const addSubject = (subject: Subject) => {
    setSubjects((prev) => [...prev, subject]);
    setDoc(doc(db, 'subjects', subject.code), subject).catch(console.warn);
  };

  const addClassroom = (room: Omit<Classroom, 'id'>) => {
    const newRoom: Classroom = {
      ...room,
      id: `cr-${Date.now()}`
    };
    setClassrooms((prev) => [...prev, newRoom]);
    setDoc(doc(db, 'classrooms', newRoom.id), newRoom).catch(console.warn);
  };

  const addTimetableSlot = (slot: Omit<TimetableSlot, 'id'>) => {
    const newSlot: TimetableSlot = {
      ...slot,
      id: `tt-${Date.now()}`
    };
    setTimetable((prev) => [...prev, newSlot]);
    setDoc(doc(db, 'timetable', newSlot.id), newSlot).catch(console.warn);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const resetToDemoData = () => {
    localStorage.clear();
    setStudents(INITIAL_STUDENTS);
    setFaculty(INITIAL_FACULTY);
    setSubjects(INITIAL_SUBJECTS);
    setAttendance(INITIAL_ATTENDANCE);
    setMarks(INITIAL_MARKS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setNotices(INITIAL_NOTICES);
    setLeaves(INITIAL_LEAVES);
    setTimetable(INITIAL_TIMETABLE);
    setClassrooms(INITIAL_CLASSROOMS);
    setFeeLedgers(INITIAL_FEE_LEDGERS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentStudent(INITIAL_STUDENTS[0]);
    setCurrentFaculty(INITIAL_FACULTY[0]);
    setCurrentRole('student');
    initializeFirestoreDatabase().catch(console.warn);
  };

  return (
    <CollegeContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentStudent,
        setCurrentStudent,
        currentFaculty,
        setCurrentFaculty,
        students,
        faculty,
        subjects,
        attendance,
        marks,
        assignments,
        notices,
        leaves,
        timetable,
        classrooms,
        feeLedgers,
        notifications,
        departmentStats,
        takeAttendance,
        updateMarks,
        addMarksBatch,
        createAssignment,
        submitAssignment,
        gradeSubmission,
        createNotice,
        deleteNotice,
        applyLeave,
        updateLeaveStatus,
        payFee,
        addStudent,
        updateStudent,
        deleteStudent,
        addFaculty,
        updateFaculty,
        deleteFaculty,
        addSubject,
        addClassroom,
        addTimetableSlot,
        markNotificationRead,
        clearAllNotifications,
        resetToDemoData,
        isFirestoreConnected,
        isSearchOpen,
        setIsSearchOpen,
        isAuthenticated,
        setIsAuthenticated,
        loginAsStudent,
        loginAsFaculty,
        loginAsRole,
        logout
      }}
    >
      {children}
    </CollegeContext.Provider>
  );
};

export const useCollege = () => {
  const context = useContext(CollegeContext);
  if (!context) {
    throw new Error('useCollege must be used within a CollegeProvider');
  }
  return context;
};
