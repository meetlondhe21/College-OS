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
  Boxes
} from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    students,
    faculty,
    circulars,
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
      s.department.toLowerCase().includes(query.toLowerCase())
  );

  const filteredFaculty = faculty.filter(
    (f) =>
      f.name.toLowerCase().includes(query.toLowerCase()) ||
      f.department.toLowerCase().includes(query.toLowerCase()) ||
      f.designation.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCirculars = circulars.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl spatial-glass border border-white/20 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 bg-slate-900/80 border-b border-white/10 flex items-center space-x-3">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Spatial search students, faculty, or campus circulars..."
            className="w-full bg-transparent text-white text-sm sm:text-base outline-none placeholder:text-slate-500 font-sans"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Quick Suggestions */}
          {!query && (
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Spatial Quick Jump
              </div>
              <div className="flex flex-wrap gap-2">
                {['Aarav Sharma', 'Dr. Alan Turing', 'Hostel Mess Fee', 'Mid-Term Schedule'].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(chip)}
                    className="spatial-btn text-[11px] px-3 py-1 text-slate-200 hover:text-white"
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
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-400" /> Students ({filteredStudents.length})
              </div>
              <div className="space-y-1.5">
                {filteredStudents.slice(0, 4).map((std) => (
                  <div
                    key={std.id}
                    onClick={() => {
                      setCurrentStudent(std);
                      setCurrentRole('student');
                      setIsSearchOpen(false);
                    }}
                    className="p-2.5 rounded-xl spatial-card border border-white/10 hover:border-indigo-500/50 flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3">
                      <img src={std.avatar} alt={std.name} className="w-8 h-8 rounded-full object-cover border border-white/30" />
                      <div>
                        <div className="text-white font-semibold flex items-center gap-2">
                          <span>{std.name}</span>
                          <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded">
                            {std.rollNo}
                          </span>
                        </div>
                        <div className="text-slate-400 text-[11px]">
                          {std.department} • Sem {std.semester}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        std.overallAttendance >= 75 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {std.overallAttendance}% Att.
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Faculty Section */}
          {filteredFaculty.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" /> Faculty ({filteredFaculty.length})
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
                    className="p-2.5 rounded-xl spatial-card border border-white/10 hover:border-emerald-500/50 flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3">
                      <img src={fac.avatar} alt={fac.name} className="w-8 h-8 rounded-full object-cover border border-white/30" />
                      <div>
                        <div className="text-white font-semibold">{fac.name}</div>
                        <div className="text-slate-400 text-[11px]">
                          {fac.designation} • {fac.department}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Circulars Section */}
          {filteredCirculars.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" /> Circulars & Notices ({filteredCirculars.length})
              </div>
              <div className="space-y-1.5">
                {filteredCirculars.slice(0, 3).map((c) => (
                  <div
                    key={c.id}
                    className="p-2.5 rounded-xl spatial-card border border-white/10 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-white font-semibold">{c.title}</div>
                      <div className="text-slate-400 text-[11px]">
                        {c.date} • {c.issuedBy}
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                      {c.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {query && filteredStudents.length === 0 && filteredFaculty.length === 0 && filteredCirculars.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              <p className="text-sm">No spatial nodes match "{query}"</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-900/90 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center space-x-2">
            <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white border border-white/10">ESC</kbd>
            <span>to close</span>
          </div>
          <span>Spatial Quick Command</span>
        </div>
      </div>
    </div>
  );
};
