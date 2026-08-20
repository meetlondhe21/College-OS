import React, { useState, useEffect } from 'react';
import { useCollege } from '../../context/CollegeContext';
import {
  Search,
  GraduationCap,
  Briefcase,
  BookOpen,
  ArrowRight,
  Sparkles,
  X,
  Bell,
  CheckCircle2
} from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    students,
    faculty,
    subjects,
    notices,
    setCurrentStudent,
    setCurrentFaculty,
    setCurrentRole
  } = useCollege();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(query.toLowerCase()) ||
      s.branch.toLowerCase().includes(query.toLowerCase())
  );

  const filteredFaculty = faculty.filter(
    (f) =>
      f.name.toLowerCase().includes(query.toLowerCase()) ||
      f.employeeId.toLowerCase().includes(query.toLowerCase()) ||
      f.department.toLowerCase().includes(query.toLowerCase()) ||
      f.designation.toLowerCase().includes(query.toLowerCase())
  );

  const filteredSubjects = subjects.filter(
    (sub) =>
      sub.name.toLowerCase().includes(query.toLowerCase()) ||
      sub.code.toLowerCase().includes(query.toLowerCase())
  );

  const filteredNotices = notices.filter(
    (n) =>
      n.title.toLowerCase().includes(query.toLowerCase()) ||
      n.category.toLowerCase().includes(query.toLowerCase()) ||
      n.content.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        className="w-full max-w-2xl brutal-card bg-white p-0 overflow-hidden flex flex-col max-h-[80vh] shadow-[8px_8px_0px_#000000] border-2 border-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div className="p-4 bg-[#ffea00] border-b-2 border-black flex items-center space-x-3">
          <Search className="w-5 h-5 text-black shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students, faculty, courses, or notices (e.g. Algorithms, Alex, CS501)..."
            className="w-full bg-transparent text-black text-sm sm:text-base outline-none placeholder:text-neutral-700 font-bold"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded bg-black text-white hover:bg-neutral-800 cursor-pointer"
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          
          {/* Suggested Quick Jump chips */}
          {!query && (
            <div className="p-3.5 bg-neutral-50 border-2 border-black rounded-lg">
              <div className="text-[11px] font-black uppercase text-black mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>Quick Jump Prompts:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Alex Chen', 'Priya Sharma', 'Dr. Alan Turing', 'Algorithms CS-501', 'Hostel Fee', 'Mid-Term Exam'].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(chip)}
                    className="brutal-btn text-xs px-2.5 py-1 text-black bg-white"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Students Section */}
          {filteredStudents.length > 0 && (
            <div>
              <div className="text-[11px] font-black uppercase text-black mb-2 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-black" />
                <span>Students ({filteredStudents.length})</span>
              </div>
              <div className="space-y-1.5">
                {filteredStudents.slice(0, 3).map((std) => (
                  <div
                    key={std.id}
                    onClick={() => {
                      setCurrentStudent(std);
                      setCurrentRole('student');
                      setIsSearchOpen(false);
                    }}
                    className="p-2.5 rounded-lg border-2 border-black bg-white hover:bg-[#fefce8] flex items-center justify-between cursor-pointer group shadow-[2px_2px_0px_#000000]"
                  >
                    <div className="flex items-center space-x-3">
                      <img src={std.avatar} alt={std.name} className="w-8 h-8 rounded-full object-cover border border-black" />
                      <div>
                        <div className="text-black font-extrabold flex items-center gap-2">
                          <span>{std.name}</span>
                          <span className="text-[10px] font-mono bg-neutral-200 text-black px-1.5 py-0.2 rounded font-bold border border-black">
                            {std.rollNo}
                          </span>
                        </div>
                        <div className="text-neutral-600 text-[11px] font-medium">
                          {std.branch} • Sem {std.semester} (Sec {std.section})
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-extrabold border border-black ${
                        std.attendanceRate >= 75 ? 'bg-[#a3e635] text-black' : 'bg-red-200 text-red-900'
                      }`}>
                        {std.attendanceRate}% Att.
                      </span>
                      <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Faculty Section */}
          {filteredFaculty.length > 0 && (
            <div>
              <div className="text-[11px] font-black uppercase text-black mb-2 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-black" />
                <span>Faculty Members ({filteredFaculty.length})</span>
              </div>
              <div className="space-y-1.5">
                {filteredFaculty.slice(0, 3).map((fac) => (
                  <div
                    key={fac.id}
                    onClick={() => {
                      setCurrentFaculty(fac);
                      setCurrentRole('faculty');
                      setIsSearchOpen(false);
                    }}
                    className="p-2.5 rounded-lg border-2 border-black bg-white hover:bg-[#f0fdf4] flex items-center justify-between cursor-pointer group shadow-[2px_2px_0px_#000000]"
                  >
                    <div className="flex items-center space-x-3">
                      <img src={fac.avatar} alt={fac.name} className="w-8 h-8 rounded-full object-cover border border-black" />
                      <div>
                        <div className="text-black font-extrabold flex items-center gap-2">
                          <span>{fac.name}</span>
                          <span className="text-[10px] font-mono bg-neutral-200 text-black px-1.5 py-0.2 rounded font-bold border border-black">
                            {fac.employeeId}
                          </span>
                        </div>
                        <div className="text-neutral-600 text-[11px] font-medium">
                          {fac.designation} • {fac.department}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subjects Section */}
          {filteredSubjects.length > 0 && (
            <div>
              <div className="text-[11px] font-black uppercase text-black mb-2 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-black" />
                <span>Courses & Syllabus ({filteredSubjects.length})</span>
              </div>
              <div className="space-y-1.5">
                {filteredSubjects.slice(0, 3).map((sub) => (
                  <div
                    key={sub.code}
                    className="p-2.5 rounded-lg border-2 border-black bg-white flex items-center justify-between shadow-[2px_2px_0px_#000000]"
                  >
                    <div>
                      <div className="text-black font-extrabold flex items-center gap-2">
                        <span className="bg-[#ffea00] px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border border-black">
                          {sub.code}
                        </span>
                        <span>{sub.name}</span>
                      </div>
                      <div className="text-neutral-600 text-[11px] font-medium mt-0.5">
                        {sub.credits} Credits • Faculty: {sub.facultyName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notices Section */}
          {filteredNotices.length > 0 && (
            <div>
              <div className="text-[11px] font-black uppercase text-black mb-2 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-black" />
                <span>Notices & Circulars ({filteredNotices.length})</span>
              </div>
              <div className="space-y-1.5">
                {filteredNotices.slice(0, 3).map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-lg border-2 border-black bg-white flex items-center justify-between shadow-[2px_2px_0px_#000000]"
                  >
                    <div>
                      <div className="text-black font-extrabold">{n.title}</div>
                      <div className="text-neutral-600 text-[11px] font-medium">
                        {n.date} • Issued by {n.authorName}
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 text-black border border-black">
                      {n.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {query &&
            filteredStudents.length === 0 &&
            filteredFaculty.length === 0 &&
            filteredSubjects.length === 0 &&
            filteredNotices.length === 0 && (
              <div className="p-8 text-center text-neutral-600 font-bold">
                <p className="text-sm">No records match "{query}"</p>
                <p className="text-xs text-neutral-500 mt-1">Try searching by course name, roll number, or faculty member.</p>
              </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-100 border-t-2 border-black flex items-center justify-between text-xs font-mono font-bold text-neutral-700">
          <div className="flex items-center space-x-2">
            <kbd className="bg-black text-white px-1.5 py-0.5 rounded text-[10px]">ESC</kbd>
            <span>to close</span>
          </div>
          <span>COLLEGE OS QUICK NAV</span>
        </div>
      </div>
    </div>
  );
};
