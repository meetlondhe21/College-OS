import { db, collection, getDocs, doc, setDoc } from '../lib/firebase';
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
  INITIAL_NOTIFICATIONS
} from '../data/mockData';

export async function initializeFirestoreDatabase() {
  try {
    const studentsSnap = await getDocs(collection(db, 'students'));
    if (studentsSnap.empty) {
      console.log('[FIREBASE] Seeding initial collections to Firestore...');

      // Seed Students
      for (const std of INITIAL_STUDENTS) {
        await setDoc(doc(db, 'students', std.id), std);
      }

      // Seed Faculty
      for (const fac of INITIAL_FACULTY) {
        await setDoc(doc(db, 'faculty', fac.id), fac);
      }

      // Seed Subjects
      for (const sub of INITIAL_SUBJECTS) {
        await setDoc(doc(db, 'subjects', sub.code), sub);
      }

      // Seed Notices
      for (const not of INITIAL_NOTICES) {
        await setDoc(doc(db, 'notices', not.id), not);
      }

      // Seed Timetable
      for (const tt of INITIAL_TIMETABLE) {
        await setDoc(doc(db, 'timetable', tt.id), tt);
      }

      // Seed Classrooms
      for (const cr of INITIAL_CLASSROOMS) {
        await setDoc(doc(db, 'classrooms', cr.id), cr);
      }

      // Seed Assignments
      for (const asg of INITIAL_ASSIGNMENTS) {
        await setDoc(doc(db, 'assignments', asg.id), asg);
      }

      // Seed Fee Ledgers
      for (const [studentId, ledger] of Object.entries(INITIAL_FEE_LEDGERS)) {
        await setDoc(doc(db, 'feeLedgers', studentId), ledger);
      }

      console.log('[FIREBASE] Seeding completed successfully!');
    }
  } catch (error) {
    console.warn('[FIREBASE] Firestore auto-seeding notice:', error);
  }
}
