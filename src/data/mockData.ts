import {
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
  DepartmentStats
} from '../types';

export const INITIAL_STUDENTS: StudentProfile[] = [
  {
    id: 'std-1',
    rollNo: '22CS042',
    prn: 'PRN2022014042',
    name: 'Alex Chen',
    email: 'alex.chen@collegeos.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    branch: 'Computer Science & Engineering',
    semester: 5,
    section: 'A',
    batch: '2022-2026',
    guardianContact: '+1 (555) 234-8901',
    bloodGroup: 'O+',
    cgpa: 8.74,
    creditsCompleted: 104,
    totalCredits: 160,
    feeDue: 0,
    feeStatus: 'paid',
    attendanceRate: 88.5,
    address: '42 Campus Vista Blvd, Tech District, CA'
  },
  {
    id: 'std-2',
    rollNo: '22CS015',
    prn: 'PRN2022014015',
    name: 'Priya Sharma',
    email: 'priya.sharma@collegeos.edu',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    branch: 'Computer Science & Engineering',
    semester: 5,
    section: 'A',
    batch: '2022-2026',
    guardianContact: '+1 (555) 345-6789',
    bloodGroup: 'B+',
    cgpa: 9.32,
    creditsCompleted: 104,
    totalCredits: 160,
    feeDue: 15000,
    feeStatus: 'partial',
    attendanceRate: 94.2,
    address: '108 Greenfield Avenue, Silicon Hills, CA'
  },
  {
    id: 'std-3',
    rollNo: '22CS088',
    prn: 'PRN2022014088',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@collegeos.edu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    branch: 'Computer Science & Engineering',
    semester: 5,
    section: 'B',
    batch: '2022-2026',
    guardianContact: '+1 (555) 456-7890',
    bloodGroup: 'A-',
    cgpa: 6.18,
    creditsCompleted: 96,
    totalCredits: 160,
    feeDue: 45000,
    feeStatus: 'pending',
    attendanceRate: 64.0, // Defaulter / At Risk
    address: '15 South Bay Street, Metro City, CA'
  },
  {
    id: 'std-4',
    rollNo: '22IT019',
    prn: 'PRN2022015019',
    name: 'Emily Watson',
    email: 'emily.watson@collegeos.edu',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    branch: 'Information Technology',
    semester: 5,
    section: 'A',
    batch: '2022-2026',
    guardianContact: '+1 (555) 567-8901',
    bloodGroup: 'AB+',
    cgpa: 8.92,
    creditsCompleted: 104,
    totalCredits: 160,
    feeDue: 0,
    feeStatus: 'paid',
    attendanceRate: 91.0,
    address: '88 Oakwood Court, University Park, CA'
  },
  {
    id: 'std-5',
    rollNo: '22CS102',
    prn: 'PRN2022014102',
    name: 'Marcus Brody',
    email: 'marcus.brody@collegeos.edu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    branch: 'Computer Science & Engineering',
    semester: 5,
    section: 'B',
    batch: '2022-2026',
    guardianContact: '+1 (555) 678-9012',
    bloodGroup: 'O-',
    cgpa: 5.85,
    creditsCompleted: 88,
    totalCredits: 160,
    feeDue: 65000,
    feeStatus: 'pending',
    attendanceRate: 58.2, // Critical Risk
    address: '227 Pine Ridge Rd, Riverside, CA'
  },
  {
    id: 'std-6',
    rollNo: '22EC033',
    prn: 'PRN2022016033',
    name: 'Aisha Patel',
    email: 'aisha.patel@collegeos.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    branch: 'Electronics & Communication',
    semester: 5,
    section: 'A',
    batch: '2022-2026',
    guardianContact: '+1 (555) 789-0123',
    bloodGroup: 'A+',
    cgpa: 8.45,
    creditsCompleted: 104,
    totalCredits: 160,
    feeDue: 0,
    feeStatus: 'paid',
    attendanceRate: 86.4,
    address: '67 Maple Leaf Way, Pasadena, CA'
  }
];

export const INITIAL_FACULTY: FacultyProfile[] = [
  {
    id: 'fac-1',
    employeeId: 'EMP-CSE-101',
    name: 'Dr. Marcus Vance',
    email: 'marcus.vance@collegeos.edu',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    designation: 'HOD',
    department: 'Computer Science & Engineering',
    qualification: 'Ph.D. in Distributed Systems & AI (Stanford)',
    subjectsAssigned: ['CS-501', 'CS-504'],
    officeHours: 'Mon, Wed 14:00 - 16:00',
    cabinNo: 'CSE-Block-301 (HOD Office)',
    experienceYears: 18,
    workloadHoursPerWeek: 14
  },
  {
    id: 'fac-2',
    employeeId: 'EMP-CSE-108',
    name: 'Prof. Sarah Vance',
    email: 'sarah.vance@collegeos.edu',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    designation: 'Associate Professor',
    department: 'Computer Science & Engineering',
    qualification: 'M.Tech, Ph.D. (Pursuing) in Database Architecture',
    subjectsAssigned: ['CS-502', 'CS-505'],
    officeHours: 'Tue, Thu 10:00 - 12:00',
    cabinNo: 'CSE-Block-214',
    experienceYears: 11,
    workloadHoursPerWeek: 18
  },
  {
    id: 'fac-3',
    employeeId: 'EMP-CSE-115',
    name: 'Dr. Rajesh Rao',
    email: 'rajesh.rao@collegeos.edu',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    designation: 'Professor',
    department: 'Computer Science & Engineering',
    qualification: 'Ph.D. in Computer Networks & Cyber Defense (MIT)',
    subjectsAssigned: ['CS-503', 'CS-506'],
    officeHours: 'Wed, Fri 11:00 - 13:00',
    cabinNo: 'CSE-Block-209',
    experienceYears: 15,
    workloadHoursPerWeek: 16
  },
  {
    id: 'fac-4',
    employeeId: 'EMP-IT-201',
    name: 'Dr. Elena Rostova',
    email: 'elena.rostova@collegeos.edu',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    designation: 'HOD',
    department: 'Information Technology',
    qualification: 'Ph.D. in Cloud Computing & DevOps',
    subjectsAssigned: ['IT-501', 'IT-503'],
    officeHours: 'Mon, Fri 15:00 - 17:00',
    cabinNo: 'IT-Block-401 (HOD Office)',
    experienceYears: 16,
    workloadHoursPerWeek: 14
  }
];

export const INITIAL_SUBJECTS: Subject[] = [
  {
    code: 'CS-501',
    name: 'Design & Analysis of Algorithms',
    credits: 4,
    semester: 5,
    department: 'Computer Science & Engineering',
    facultyId: 'fac-1',
    facultyName: 'Dr. Marcus Vance',
    syllabusModules: [
      { moduleNo: 1, title: 'Asymptotic Analysis & Recurrences', topics: ['Big-O, Omega, Theta', 'Master Theorem', 'Divide & Conquer paradigms'], hours: 10 },
      { moduleNo: 2, title: 'Greedy & Dynamic Programming', topics: ['Huffman Coding', '0/1 Knapsack', 'Bellman-Ford', 'Matrix Chain Multiplication'], hours: 14 },
      { moduleNo: 3, title: 'Graph Algorithms & Flow Networks', topics: ['Dijkstra', 'Floyd-Warshall', 'Max-Flow Min-Cut', 'Ford-Fulkerson'], hours: 12 },
      { moduleNo: 4, title: 'NP-Completeness & Approximation', topics: ['P vs NP', 'Cook-Levin Theorem', 'Vertex Cover', 'Travelling Salesperson'], hours: 10 }
    ],
    totalLectures: 46,
    internalMaxMarks: 40,
    externalMaxMarks: 60
  },
  {
    code: 'CS-502',
    name: 'Database Management Systems',
    credits: 4,
    semester: 5,
    department: 'Computer Science & Engineering',
    facultyId: 'fac-2',
    facultyName: 'Prof. Sarah Vance',
    syllabusModules: [
      { moduleNo: 1, title: 'Relational Model & Algebra', topics: ['ER Diagrams', 'Relational Algebra', 'Tuple Relational Calculus'], hours: 10 },
      { moduleNo: 2, title: 'SQL & Normalization', topics: ['Complex Queries', '1NF to BCNF', 'Lossless Joins', 'Dependency Preservation'], hours: 14 },
      { moduleNo: 3, title: 'Transaction & Concurrency Control', topics: ['ACID Properties', 'Schedules & Serializability', '2PL Protocol', 'Deadlock handling'], hours: 12 },
      { moduleNo: 4, title: 'Indexing & NoSQL Fundamentals', topics: ['B+ Trees', 'Hashing', 'MongoDB Architecture', 'CAP Theorem'], hours: 10 }
    ],
    totalLectures: 44,
    internalMaxMarks: 40,
    externalMaxMarks: 60
  },
  {
    code: 'CS-503',
    name: 'Computer Networks',
    credits: 4,
    semester: 5,
    department: 'Computer Science & Engineering',
    facultyId: 'fac-3',
    facultyName: 'Dr. Rajesh Rao',
    syllabusModules: [
      { moduleNo: 1, title: 'Network Architecture & Physical Layer', topics: ['OSI Model vs TCP/IP', 'Transmission Media', 'Encoding & Modulation'], hours: 8 },
      { moduleNo: 2, title: 'Data Link & Network Layer', topics: ['Error Detection & CRC', 'Sliding Window', 'IPv4/IPv6 Addressing', 'OSPF & BGP Routing'], hours: 14 },
      { moduleNo: 3, title: 'Transport Layer Protocols', topics: ['TCP 3-Way Handshake', 'Congestion Control', 'UDP Sockets', 'Flow Control'], hours: 12 },
      { moduleNo: 4, title: 'Application Layer & Network Security', topics: ['DNS, HTTP/3, TLS', 'Public Key Cryptography', 'Firewalls & IPSec'], hours: 12 }
    ],
    totalLectures: 46,
    internalMaxMarks: 40,
    externalMaxMarks: 60
  },
  {
    code: 'CS-504',
    name: 'Artificial Intelligence & Expert Systems',
    credits: 3,
    semester: 5,
    department: 'Computer Science & Engineering',
    facultyId: 'fac-1',
    facultyName: 'Dr. Marcus Vance',
    syllabusModules: [
      { moduleNo: 1, title: 'Search Strategies', topics: ['A* Search', 'Minimax & Alpha-Beta Pruning', 'Constraint Satisfaction'], hours: 10 },
      { moduleNo: 2, title: 'Knowledge Representation', topics: ['First-Order Logic', 'Ontology', 'Bayesian Inference Networks'], hours: 12 },
      { moduleNo: 3, title: 'Machine Learning Foundations', topics: ['Supervised & Unsupervised Learning', 'Neural Network Architectures'], hours: 14 }
    ],
    totalLectures: 36,
    internalMaxMarks: 40,
    externalMaxMarks: 60
  },
  {
    code: 'CS-505',
    name: 'DBMS & Query Optimization Lab',
    credits: 2,
    semester: 5,
    department: 'Computer Science & Engineering',
    facultyId: 'fac-2',
    facultyName: 'Prof. Sarah Vance',
    syllabusModules: [
      { moduleNo: 1, title: 'PostgreSQL Advanced Procedures', topics: ['Triggers, Stored Procedures, Index Tuning'], hours: 20 },
      { moduleNo: 2, title: 'Full-Stack Data Persistence', topics: ['Drizzle ORM, Connection Pooling, Migrations'], hours: 20 }
    ],
    totalLectures: 30,
    internalMaxMarks: 50,
    externalMaxMarks: 50
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  { id: 'att-1', date: '2026-08-14', subjectCode: 'CS-501', subjectName: 'Design & Analysis of Algorithms', studentId: 'std-1', studentRollNo: '22CS042', studentName: 'Alex Chen', status: 'present', period: '09:00 - 10:00' },
  { id: 'att-2', date: '2026-08-14', subjectCode: 'CS-502', subjectName: 'Database Management Systems', studentId: 'std-1', studentRollNo: '22CS042', studentName: 'Alex Chen', status: 'present', period: '10:00 - 11:00' },
  { id: 'att-3', date: '2026-08-14', subjectCode: 'CS-503', subjectName: 'Computer Networks', studentId: 'std-1', studentRollNo: '22CS042', studentName: 'Alex Chen', status: 'present', period: '11:15 - 12:15' },
  { id: 'att-4', date: '2026-08-14', subjectCode: 'CS-501', subjectName: 'Design & Analysis of Algorithms', studentId: 'std-2', studentRollNo: '22CS015', studentName: 'Priya Sharma', status: 'present', period: '09:00 - 10:00' },
  { id: 'att-5', date: '2026-08-14', subjectCode: 'CS-501', subjectName: 'Design & Analysis of Algorithms', studentId: 'std-3', studentRollNo: '22CS088', studentName: 'Rohan Mehta', status: 'absent', remarks: 'Unexcused absence', period: '09:00 - 10:00' },
  { id: 'att-6', date: '2026-08-14', subjectCode: 'CS-501', subjectName: 'Design & Analysis of Algorithms', studentId: 'std-5', studentRollNo: '22CS102', studentName: 'Marcus Brody', status: 'absent', remarks: 'Chronic absentee', period: '09:00 - 10:00' },
  { id: 'att-7', date: '2026-08-13', subjectCode: 'CS-501', subjectName: 'Design & Analysis of Algorithms', studentId: 'std-1', studentRollNo: '22CS042', studentName: 'Alex Chen', status: 'present', period: '09:00 - 10:00' },
  { id: 'att-8', date: '2026-08-13', subjectCode: 'CS-503', subjectName: 'Computer Networks', studentId: 'std-1', studentRollNo: '22CS042', studentName: 'Alex Chen', status: 'leave', remarks: 'Hackathon OD granted', period: '11:15 - 12:15' },
  { id: 'att-9', date: '2026-08-12', subjectCode: 'CS-502', subjectName: 'Database Management Systems', studentId: 'std-1', studentRollNo: '22CS042', studentName: 'Alex Chen', status: 'present', period: '10:00 - 11:00' }
];

export const INITIAL_MARKS: MarksRecord[] = [
  {
    id: 'mrk-1',
    studentId: 'std-1',
    studentRollNo: '22CS042',
    studentName: 'Alex Chen',
    subjectCode: 'CS-501',
    subjectName: 'Design & Analysis of Algorithms',
    semester: 5,
    internal1: 18,
    internal2: 19,
    assignmentScore: 9,
    external: 44,
    totalMarks: 90,
    grade: 'A+',
    status: 'Pass'
  },
  {
    id: 'mrk-2',
    studentId: 'std-1',
    studentRollNo: '22CS042',
    studentName: 'Alex Chen',
    subjectCode: 'CS-502',
    subjectName: 'Database Management Systems',
    semester: 5,
    internal1: 17,
    internal2: 18,
    assignmentScore: 10,
    external: 42,
    totalMarks: 87,
    grade: 'A',
    status: 'Pass'
  },
  {
    id: 'mrk-3',
    studentId: 'std-1',
    studentRollNo: '22CS042',
    studentName: 'Alex Chen',
    subjectCode: 'CS-503',
    subjectName: 'Computer Networks',
    semester: 5,
    internal1: 16,
    internal2: 17,
    assignmentScore: 8,
    external: 40,
    totalMarks: 81,
    grade: 'A',
    status: 'Pass'
  },
  {
    id: 'mrk-4',
    studentId: 'std-1',
    studentRollNo: '22CS042',
    studentName: 'Alex Chen',
    subjectCode: 'CS-504',
    subjectName: 'Artificial Intelligence & Expert Systems',
    semester: 5,
    internal1: 19,
    internal2: 19,
    assignmentScore: 10,
    external: 46,
    totalMarks: 94,
    grade: 'O (Outstanding)',
    status: 'Pass'
  },
  {
    id: 'mrk-5',
    studentId: 'std-3',
    studentRollNo: '22CS088',
    studentName: 'Rohan Mehta',
    subjectCode: 'CS-501',
    subjectName: 'Design & Analysis of Algorithms',
    semester: 5,
    internal1: 8,
    internal2: 9,
    assignmentScore: 4,
    external: 22,
    totalMarks: 43,
    grade: 'P (Pass)',
    status: 'Pass'
  },
  {
    id: 'mrk-6',
    studentId: 'std-5',
    studentRollNo: '22CS102',
    studentName: 'Marcus Brody',
    subjectCode: 'CS-501',
    subjectName: 'Design & Analysis of Algorithms',
    semester: 5,
    internal1: 6,
    internal2: 5,
    assignmentScore: 3,
    external: 18,
    totalMarks: 32,
    grade: 'F (Fail)',
    status: 'Fail'
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    subjectCode: 'CS-501',
    subjectName: 'Design & Analysis of Algorithms',
    title: 'Assignment 3: Dynamic Programming & Bellman-Ford Optimization',
    description: 'Implement dynamic programming solutions for the 0/1 Knapsack problem and Bellman-Ford shortest path algorithm with negative edge cycle detection. Include runtime complexity graphs and benchmark tests.',
    maxMarks: 20,
    dueDate: '2026-08-25',
    assignedDate: '2026-08-10',
    facultyId: 'fac-1',
    facultyName: 'Dr. Marcus Vance',
    department: 'Computer Science & Engineering',
    semester: 5,
    submissions: [
      {
        id: 'sub-1',
        assignmentId: 'asg-1',
        studentId: 'std-1',
        studentName: 'Alex Chen',
        rollNo: '22CS042',
        submittedAt: '2026-08-13 18:40',
        fileName: 'alex_chen_cs501_assignment3.pdf',
        content: 'Completed all 3 algorithm benchmarks. Included C++ and Python implementations with comparative asymptotic curves.',
        score: 19,
        maxScore: 20,
        feedback: 'Excellent complexity proofs and clean modular code structure.',
        status: 'evaluated'
      },
      {
        id: 'sub-2',
        assignmentId: 'asg-1',
        studentId: 'std-2',
        studentName: 'Priya Sharma',
        rollNo: '22CS015',
        submittedAt: '2026-08-14 11:20',
        fileName: 'priya_sharma_dp_shortest_path.zip',
        content: 'Implemented graph visualizer along with Bellman-Ford matrix computations.',
        score: 20,
        maxScore: 20,
        feedback: 'Phenomenal work on the visualizer extension!',
        status: 'evaluated'
      },
      {
        id: 'sub-3',
        assignmentId: 'asg-1',
        studentId: 'std-3',
        studentName: 'Rohan Mehta',
        rollNo: '22CS088',
        submittedAt: '2026-08-14 23:55',
        fileName: 'rohan_assignment_3.pdf',
        content: 'Partial implementation of knapsack solver.',
        score: 11,
        maxScore: 20,
        feedback: 'Missing negative cycle test suites and runtime asymptotic analysis.',
        status: 'evaluated'
      }
    ]
  },
  {
    id: 'asg-2',
    subjectCode: 'CS-502',
    subjectName: 'Database Management Systems',
    title: 'Assignment 2: Schema Normalization & BCNF Decomposition',
    description: 'Decompose the provided university registration schema into BCNF. Verify lossless join property and functional dependency preservation with formal mathematical proofs.',
    maxMarks: 15,
    dueDate: '2026-08-28',
    assignedDate: '2026-08-12',
    facultyId: 'fac-2',
    facultyName: 'Prof. Sarah Vance',
    department: 'Computer Science & Engineering',
    semester: 5,
    submissions: [
      {
        id: 'sub-4',
        assignmentId: 'asg-2',
        studentId: 'std-1',
        studentName: 'Alex Chen',
        rollNo: '22CS042',
        submittedAt: '2026-08-14 14:15',
        fileName: 'bcnf_decomposition_proofs_alex.pdf',
        content: 'Formal proofs for all 5 relation schemas with closure sets computed.',
        status: 'submitted',
        maxScore: 15
      }
    ]
  },
  {
    id: 'asg-3',
    subjectCode: 'CS-503',
    subjectName: 'Computer Networks',
    title: 'Assignment 2: Wireshark Packet Analysis & TCP Handshake',
    description: 'Capture and inspect TCP packets during a TLS 1.3 handshake session. Extract sequence numbers, window scaling parameters, and compute round-trip delay time.',
    maxMarks: 20,
    dueDate: '2026-09-02',
    assignedDate: '2026-08-15',
    facultyId: 'fac-3',
    facultyName: 'Dr. Rajesh Rao',
    department: 'Computer Science & Engineering',
    semester: 5,
    submissions: []
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'not-1',
    title: 'Mid-Semester Examinations Schedule (Fall 2026)',
    category: 'exam',
    content: 'The Mid-Semester Theory & Practical Examinations for Semesters 3, 5, and 7 will commence from September 14, 2026. Hall tickets will be issued digitally through College OS portal. Strict 75% attendance threshold applies.',
    authorName: 'Office of Controller of Examinations',
    authorRole: 'admin',
    targetAudience: 'all',
    date: '2026-08-14',
    isPinned: true,
    priority: 'high'
  },
  {
    id: 'not-2',
    title: 'Annual Hackathon 2026: Campus Tech Sprint Registration Open',
    category: 'event',
    content: 'Calling all engineering & IT students! The 48-hour National Campus Hackathon will be held on Sept 25-27, 2026. Cash prizes worth $15,000 + incubation opportunities for top 3 teams. Register your team of 4 via portal.',
    authorName: 'Dr. Marcus Vance (HOD CSE)',
    authorRole: 'hod',
    targetAudience: 'students',
    department: 'Computer Science & Engineering',
    date: '2026-08-13',
    isPinned: true,
    priority: 'normal'
  },
  {
    id: 'not-3',
    title: 'Mandatory Faculty Meeting: NAAC & NBA Compliance Review',
    category: 'academic',
    content: 'All departmental faculty members must assemble in Seminar Hall A at 16:00 on Monday for the final outcome-based education (OBE) course file audit and student feedback review.',
    authorName: 'Dean of Academic Affairs',
    authorRole: 'admin',
    targetAudience: 'faculty',
    date: '2026-08-12',
    isPinned: false,
    priority: 'high'
  },
  {
    id: 'not-4',
    title: 'Google & Microsoft Campus Placement Drive Registration',
    category: 'placement',
    content: 'Pre-placement talks and coding evaluation rounds for B.Tech Final and Pre-final Year students will begin on August 30. Ensure your resume and CGPA records are verified in the Student Portal.',
    authorName: 'Corporate Relations & Placement Cell',
    authorRole: 'admin',
    targetAudience: 'students',
    date: '2026-08-11',
    isPinned: false,
    priority: 'normal'
  }
];

export const INITIAL_LEAVES: LeaveApplication[] = [
  {
    id: 'lev-1',
    applicantId: 'std-1',
    applicantName: 'Alex Chen',
    applicantRole: 'student',
    applicantRollNo: '22CS042',
    applicantDepartment: 'Computer Science & Engineering',
    leaveType: 'on_duty',
    startDate: '2026-08-13',
    endDate: '2026-08-13',
    totalDays: 1,
    reason: 'Representing university at State Collegiate ACM-ICPC Coding Round.',
    documentName: 'icpc_invitation_letter.pdf',
    status: 'approved',
    approverComment: 'OD approved with full attendance credit.',
    appliedAt: '2026-08-11 09:30',
    reviewedBy: 'Dr. Marcus Vance'
  },
  {
    id: 'lev-2',
    applicantId: 'std-3',
    applicantName: 'Rohan Mehta',
    applicantRole: 'student',
    applicantRollNo: '22CS088',
    applicantDepartment: 'Computer Science & Engineering',
    leaveType: 'medical',
    startDate: '2026-08-18',
    endDate: '2026-08-20',
    totalDays: 3,
    reason: 'Acute viral fever and physician advised bed rest.',
    documentName: 'medical_certificate.pdf',
    status: 'pending',
    appliedAt: '2026-08-14 16:45'
  }
];

export const INITIAL_TIMETABLE: TimetableSlot[] = [
  // Monday
  { id: 'tt-1', day: 'Monday', timeSlot: '09:00 - 10:00', subjectCode: 'CS-501', subjectName: 'Algorithms', facultyId: 'fac-1', facultyName: 'Dr. Marcus Vance', classroom: 'Room 301', department: 'Computer Science & Engineering', semester: 5, section: 'A', type: 'Lecture' },
  { id: 'tt-2', day: 'Monday', timeSlot: '10:00 - 11:00', subjectCode: 'CS-502', subjectName: 'DBMS', facultyId: 'fac-2', facultyName: 'Prof. Sarah Vance', classroom: 'Room 301', department: 'Computer Science & Engineering', semester: 5, section: 'A', type: 'Lecture' },
  { id: 'tt-3', day: 'Monday', timeSlot: '11:15 - 12:15', subjectCode: 'CS-503', subjectName: 'Networks', facultyId: 'fac-3', facultyName: 'Dr. Rajesh Rao', classroom: 'Room 301', department: 'Computer Science & Engineering', semester: 5, section: 'A', type: 'Lecture' },
  { id: 'tt-4', day: 'Monday', timeSlot: '02:00 - 04:00', subjectCode: 'CS-505', subjectName: 'DBMS Lab', facultyId: 'fac-2', facultyName: 'Prof. Sarah Vance', classroom: 'Lab 4 (DB Lab)', department: 'Computer Science & Engineering', semester: 5, section: 'A', type: 'Lab' },

  // Tuesday
  { id: 'tt-5', day: 'Tuesday', timeSlot: '09:00 - 10:00', subjectCode: 'CS-504', subjectName: 'AI & Expert Sys', facultyId: 'fac-1', facultyName: 'Dr. Marcus Vance', classroom: 'Room 301', department: 'Computer Science & Engineering', semester: 5, section: 'A', type: 'Lecture' },
  { id: 'tt-6', day: 'Tuesday', timeSlot: '10:00 - 11:00', subjectCode: 'CS-501', subjectName: 'Algorithms', facultyId: 'fac-1', facultyName: 'Dr. Marcus Vance', classroom: 'Room 301', department: 'Computer Science & Engineering', semester: 5, section: 'A', type: 'Lecture' },
  { id: 'tt-7', day: 'Tuesday', timeSlot: '11:15 - 12:15', subjectCode: 'CS-502', subjectName: 'DBMS', facultyId: 'fac-2', facultyName: 'Prof. Sarah Vance', classroom: 'Room 301', department: 'Computer Science & Engineering', semester: 5, section: 'A', type: 'Lecture' },
  { id: 'tt-8', day: 'Tuesday', timeSlot: '02:00 - 03:00', subjectCode: 'CS-503', subjectName: 'Networks', facultyId: 'fac-3', facultyName: 'Dr. Rajesh Rao', classroom: 'Room 301', department: 'Computer Science & Engineering', semester: 5, section: 'A', type: 'Lecture' },

  // Wednesday
  { id: 'tt-9', day: 'Wednesday', timeSlot: '09:00 - 10:00', subjectCode: 'CS-503', subjectName: 'Networks', facultyId: 'fac-3', facultyName: 'Dr. Rajesh Rao', classroom: 'Room 301', department: 'Computer Science & Engineering', semester: 5, section: 'A', type: 'Lecture' },
  { id: 'tt-10', day: 'Wednesday', timeSlot: '10:00 - 11:00', subjectCode: 'CS-504', subjectName: 'AI & Expert Sys', facultyId: 'fac-1', facultyName: 'Dr. Marcus Vance', classroom: 'Room 301', department: 'Computer Science & Engineering', semester: 5, section: 'A', type: 'Lecture' },
  { id: 'tt-11', day: 'Wednesday', timeSlot: '11:15 - 12:15', subjectCode: 'CS-501', subjectName: 'Algorithms', facultyId: 'fac-1', facultyName: 'Dr. Marcus Vance', classroom: 'Room 301', department: 'Computer Science & Engineering', semester: 5, section: 'A', type: 'Lecture' },
  { id: 'tt-12', day: 'Wednesday', timeSlot: '02:00 - 04:00', subjectCode: 'CS-501', subjectName: 'Algo Lab', facultyId: 'fac-1', facultyName: 'Dr. Marcus Vance', classroom: 'Lab 2 (Computing)', department: 'Computer Science & Engineering', semester: 5, section: 'A', type: 'Lab' },

  // Thursday
  { id: 'tt-13', day: 'Thursday', timeSlot: '09:00 - 10:00', subjectCode: 'CS-502', subjectName: 'DBMS', facultyId: 'fac-2', facultyName: 'Prof. Sarah Vance', classroom: 'Room 301', department: 'Computer Science & Engineering', semester: 5, section: 'A', type: 'Lecture' },
  { id: 'tt-14', day: 'Thursday', timeSlot: '10:00 - 11:00', subjectCode: 'CS-503', subjectName: 'Networks', facultyId: 'fac-3', facultyName: 'Dr. Rajesh Rao', classroom: 'Room 301', department: 'Computer Science & Engineering', semester: 5, section: 'A', type: 'Lecture' },
  { id: 'tt-15', day: 'Thursday', timeSlot: '11:15 - 12:15', subjectCode: 'CS-504', subjectName: 'AI & Expert Sys', facultyId: 'fac-1', facultyName: 'Dr. Marcus Vance', classroom: 'Room 301', department: 'Computer Science & Engineering', semester: 5, section: 'A', type: 'Lecture' },

  // Friday
  { id: 'tt-16', day: 'Friday', timeSlot: '09:00 - 10:00', subjectCode: 'CS-501', subjectName: 'Algorithms', facultyId: 'fac-1', facultyName: 'Dr. Marcus Vance', classroom: 'Room 301', department: 'Computer Science & Engineering', semester: 5, section: 'A', type: 'Lecture' },
  { id: 'tt-17', day: 'Friday', timeSlot: '10:00 - 11:00', subjectCode: 'CS-502', subjectName: 'DBMS', facultyId: 'fac-2', facultyName: 'Prof. Sarah Vance', classroom: 'Room 301', department: 'Computer Science & Engineering', semester: 5, section: 'A', type: 'Lecture' },
  { id: 'tt-18', day: 'Friday', timeSlot: '11:15 - 12:15', subjectCode: 'CS-503', subjectName: 'Networks', facultyId: 'fac-3', facultyName: 'Dr. Rajesh Rao', classroom: 'Room 301', department: 'Computer Science & Engineering', semester: 5, section: 'A', type: 'Tutorial' }
];

export const INITIAL_CLASSROOMS: Classroom[] = [
  { id: 'cr-1', roomNumber: 'Room 301', building: 'Turing Block', capacity: 70, type: 'Lecture Hall', hasProjector: true, hasAC: true, status: 'Occupied' },
  { id: 'cr-2', roomNumber: 'Room 302', building: 'Turing Block', capacity: 65, type: 'Lecture Hall', hasProjector: true, hasAC: true, status: 'Available' },
  { id: 'cr-3', roomNumber: 'Lab 2 (Computing)', building: 'Ada Lovelace Wing', capacity: 45, type: 'Computer Lab', hasProjector: true, hasAC: true, status: 'Occupied' },
  { id: 'cr-4', roomNumber: 'Lab 4 (DB Lab)', building: 'Ada Lovelace Wing', capacity: 50, type: 'Computer Lab', hasProjector: true, hasAC: true, status: 'Occupied' },
  { id: 'cr-5', roomNumber: 'Seminar Hall A', building: 'Main Administrative Wing', capacity: 250, type: 'Seminar Hall', hasProjector: true, hasAC: true, status: 'Available' }
];

export const INITIAL_FEE_LEDGERS: Record<string, FeeLedger> = {
  'std-1': {
    studentId: 'std-1',
    totalAmount: 95000,
    paidAmount: 95000,
    balanceDue: 0,
    dueDate: '2026-08-30',
    status: 'paid',
    breakdown: [
      { category: 'Tuition Fee (Semester V)', amount: 70000, paid: true },
      { category: 'Computing & Lab Facilities', amount: 15000, paid: true },
      { category: 'Library & Digital Subscription', amount: 5000, paid: true },
      { category: 'Student Activities & Health Insurance', amount: 5000, paid: true }
    ],
    transactions: [
      {
        id: 'tx-101',
        studentId: 'std-1',
        amount: 95000,
        paymentDate: '2026-07-28',
        method: 'UPI',
        receiptNo: 'REC-2026-8941',
        semester: 5,
        status: 'Success',
        type: 'Tuition Fee'
      }
    ]
  },
  'std-2': {
    studentId: 'std-2',
    totalAmount: 95000,
    paidAmount: 80000,
    balanceDue: 15000,
    dueDate: '2026-08-30',
    status: 'partial',
    breakdown: [
      { category: 'Tuition Fee (Semester V)', amount: 70000, paid: true },
      { category: 'Computing & Lab Facilities', amount: 15000, paid: true },
      { category: 'Library & Digital Subscription', amount: 5000, paid: false },
      { category: 'Hostel Maintenance', amount: 5000, paid: false }
    ],
    transactions: [
      {
        id: 'tx-102',
        studentId: 'std-2',
        amount: 80000,
        paymentDate: '2026-08-02',
        method: 'Net Banking',
        receiptNo: 'REC-2026-9023',
        semester: 5,
        status: 'Success',
        type: 'Tuition Fee'
      }
    ]
  },
  'std-3': {
    studentId: 'std-3',
    totalAmount: 95000,
    paidAmount: 50000,
    balanceDue: 45000,
    dueDate: '2026-08-30',
    status: 'pending',
    breakdown: [
      { category: 'Tuition Fee (Semester V)', amount: 70000, paid: false },
      { category: 'Computing & Lab Facilities', amount: 15000, paid: true },
      { category: 'Library & Digital Subscription', amount: 5000, paid: true },
      { category: 'Student Activities & Health Insurance', amount: 5000, paid: false }
    ],
    transactions: [
      {
        id: 'tx-103',
        studentId: 'std-3',
        amount: 50000,
        paymentDate: '2026-07-15',
        method: 'Debit Card',
        receiptNo: 'REC-2026-8712',
        semester: 5,
        status: 'Success',
        type: 'Tuition Fee'
      }
    ]
  }
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Assignment Due Soon',
    message: 'CS-501 Dynamic Programming assignment due in 10 days.',
    timestamp: '10 mins ago',
    read: false,
    type: 'alert',
    targetRole: 'student'
  },
  {
    id: 'notif-2',
    title: 'Leave Request Approved',
    message: 'Your On-Duty leave for ACM-ICPC round has been approved.',
    timestamp: '2 hours ago',
    read: false,
    type: 'success',
    targetRole: 'student'
  },
  {
    id: 'notif-3',
    title: 'Attendance Warning Triggered',
    message: '3 students in CSE Section B dropped below 75% attendance threshold.',
    timestamp: '4 hours ago',
    read: false,
    type: 'warning',
    targetRole: 'faculty'
  },
  {
    id: 'notif-4',
    title: 'Department Audit Ready',
    message: 'AI Report Generator compiled semester V performance metrics.',
    timestamp: 'Yesterday',
    read: true,
    type: 'info',
    targetRole: 'hod'
  }
];

export const DEPARTMENT_STATS: DepartmentStats[] = [
  {
    name: 'Computer Science & Engineering',
    code: 'CSE',
    totalStudents: 480,
    totalFaculty: 24,
    avgAttendance: 84.8,
    passPercentage: 92.4,
    topPerformingSubject: 'CS-504 Artificial Intelligence',
    atRiskStudentsCount: 14
  },
  {
    name: 'Information Technology',
    code: 'IT',
    totalStudents: 320,
    totalFaculty: 18,
    avgAttendance: 86.2,
    passPercentage: 94.1,
    topPerformingSubject: 'IT-501 Cloud Computing',
    atRiskStudentsCount: 6
  },
  {
    name: 'Electronics & Communication',
    code: 'ECE',
    totalStudents: 360,
    totalFaculty: 20,
    avgAttendance: 81.5,
    passPercentage: 88.7,
    topPerformingSubject: 'EC-502 Signal Processing',
    atRiskStudentsCount: 18
  },
  {
    name: 'Mechanical Engineering',
    code: 'MECH',
    totalStudents: 290,
    totalFaculty: 16,
    avgAttendance: 79.4,
    passPercentage: 85.2,
    topPerformingSubject: 'ME-503 Thermodynamics',
    atRiskStudentsCount: 22
  }
];
