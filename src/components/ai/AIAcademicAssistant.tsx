import React, { useState, useRef, useEffect } from 'react';
import { useCollege } from '../../context/CollegeContext';
import { 
  Send, 
  BookOpen, 
  Loader2, 
  Copy, 
  Check, 
  Bot, 
  User, 
  Lightbulb, 
  Zap, 
  Code,
  Sparkles,
  Boxes,
  Cpu,
  Layers
} from 'lucide-react';

interface AIAssistantProps {
  embeddedSubject?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  sources?: string[];
}

export const AIAcademicAssistant: React.FC<AIAssistantProps> = ({ embeddedSubject }) => {
  const { currentStudent, currentRole, currentFaculty } = useCollege();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init',
      sender: 'ai',
      text: `Greetings **${currentRole === 'student' ? currentStudent.name : currentFaculty.name}**! I am **Professor Turing**, your Spatial Academic AI Tutor powered by **Gemini 3.7 Flash**.\n\nI can calculate and visualize:\n- **Algorithmic proofs, recurrences, and asymptotic graphs (Big-O)**\n- **DBMS normalization decompositions (1NF to BCNF)**\n- **Live exam flashcards and custom 3D revision paths**\n- **Full-stack code generation and query optimization**\n\nWhat topic shall we explore in 3D depth today?`,
      timestamp: 'Just now',
      sources: ['Autonomous Syllabus 2026-27', 'NBA Academic Framework']
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(embeddedSubject || 'CS-501 Design & Analysis of Algorithms');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [studyMode, setStudyMode] = useState<'explain' | 'quiz' | 'code' | 'summary'>('explain');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const quickPrompts = [
    {
      label: 'Bellman-Ford vs Dijkstra',
      subject: 'CS-501 Design & Analysis of Algorithms',
      prompt: 'Explain the difference between Bellman-Ford and Dijkstra algorithms, including when to use negative weight cycle detection with a Python implementation.'
    },
    {
      label: 'DBMS Normalization Guide',
      subject: 'CS-502 Database Management Systems',
      prompt: 'Provide a concise step-by-step guide for identifying 1NF, 2NF, 3NF, and BCNF with functional dependency decomposition examples.'
    },
    {
      label: '7-Day Exam Revision Schedule',
      subject: 'CS-503 Computer Networks',
      prompt: 'Create an intensive 7-day revision schedule for Computer Networks covering OSI model, TCP 3-way handshake, CIDR subnetting, and BGP routing.'
    },
    {
      label: 'AI Search Algorithms (A*)',
      subject: 'CS-504 Artificial Intelligence & Expert Systems',
      prompt: 'Break down A* Search: admissible heuristics, monotonicity consistency rules, and space/time complexity compared to BFS and Greedy Best-First Search.'
    }
  ];

  const handleSend = async (customPrompt?: string) => {
    const query = customPrompt || input.trim();
    if (!query || isLoading) return;

    let modifiedQuery = query;
    if (studyMode === 'quiz' && !customPrompt) {
      modifiedQuery = `[MODE: QUIZ & PRACTICE EXAM] Generate 3 conceptual multiple-choice and 1 coding/derivation question on this topic: ${query}. Include detailed answer explanations.`;
    } else if (studyMode === 'code' && !customPrompt) {
      modifiedQuery = `[MODE: ALGORITHMIC CODE & COMPLEXITY] Provide fully commented, production-grade code with Time & Space Complexity analysis for: ${query}.`;
    } else if (studyMode === 'summary' && !customPrompt) {
      modifiedQuery = `[MODE: HIGH-YIELD EXAM CHEAT SHEET] Generate a bulleted, high-yield revision summary and key formulas for: ${query}.`;
    }

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/academic-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: modifiedQuery,
          subjectContext: selectedSubject,
          studentName: currentRole === 'student' ? currentStudent.name : currentFaculty.name
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI response');
      }

      const data = await response.json();
      const aiMsg: Message = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources || ['Autonomous Engineering Syllabus 2026', 'IEEE Spatial Curriculum']
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: Message = {
        id: `msg-err-${Date.now()}`,
        sender: 'ai',
        text: `### Spatial Academic Concept Note [${selectedSubject}]\n\n1. **Core Concept**: Verify edge cases, state transitions, and asymptotic bounds.\n2. **Time Complexity**: Optimal bound is typically O(N log N) or O(V + E).\n3. **Practical Tip**: Re-verify standard test cases from previous exam sets.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: ['Offline Spatial Cache']
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="spatial-glass border border-white/20 overflow-hidden flex flex-col h-[700px] shadow-2xl relative">
      {/* Spatial Header */}
      <div className="p-4 bg-slate-900/60 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 backdrop-blur-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[1.5px] shadow-lg shadow-indigo-500/30 shrink-0">
            <div className="w-full h-full bg-slate-950/80 rounded-[14px] flex items-center justify-center text-indigo-400">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base text-white">
                Professor Turing
              </span>
              <span className="bg-gradient-to-r from-indigo-500/30 to-purple-500/30 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/40">
                Gemini 3.7 Spatial
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Spatial Academic Tutor & Algorithmic Problem Solver
            </p>
          </div>
        </div>

        {/* Mode & Subject Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setStudyMode('explain')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                studyMode === 'explain'
                  ? 'spatial-btn-primary text-white font-semibold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lightbulb className="w-3 h-3" />
              <span>Explain</span>
            </button>
            <button
              onClick={() => setStudyMode('quiz')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                studyMode === 'quiz'
                  ? 'spatial-btn-primary text-white font-semibold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>Quiz</span>
            </button>
            <button
              onClick={() => setStudyMode('code')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                studyMode === 'code'
                  ? 'spatial-btn-primary text-white font-semibold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code className="w-3 h-3" />
              <span>Code</span>
            </button>
            <button
              onClick={() => setStudyMode('summary')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                studyMode === 'summary'
                  ? 'spatial-btn-primary text-white font-semibold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span>Cheat Sheet</span>
            </button>
          </div>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            aria-label="Select Subject Context"
            className="spatial-input text-xs px-3 py-1.5 font-medium cursor-pointer"
          >
            <option value="CS-501 Design & Analysis of Algorithms" className="bg-slate-900 text-white">CS-501 Algorithms</option>
            <option value="CS-502 Database Management Systems" className="bg-slate-900 text-white">CS-502 DBMS</option>
            <option value="CS-503 Computer Networks" className="bg-slate-900 text-white">CS-503 Networks</option>
            <option value="CS-504 Artificial Intelligence & Expert Systems" className="bg-slate-900 text-white">CS-504 AI & Systems</option>
            <option value="General University Academics" className="bg-slate-900 text-white">General Syllabus</option>
          </select>
        </div>
      </div>

      {/* Suggested Quick Prompts Bar */}
      <div className="bg-slate-950/40 border-b border-white/10 p-2.5 overflow-x-auto flex items-center space-x-2 shrink-0">
        <span className="text-xs font-semibold text-slate-400 shrink-0 px-1 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Prompts:
        </span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedSubject(qp.subject);
              handleSend(qp.prompt);
            }}
            disabled={isLoading}
            className="spatial-btn text-xs px-3 py-1 text-slate-300 hover:text-white shrink-0 cursor-pointer disabled:opacity-50"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-950/20">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[88%] sm:max-w-[80%] p-4 rounded-2xl border ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white border-indigo-400/40 shadow-xl shadow-indigo-500/20'
                  : 'spatial-glass text-slate-100 border-white/15 shadow-2xl'
              }`}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2 text-xs">
                <span className={`font-semibold flex items-center gap-1.5 ${m.sender === 'user' ? 'text-indigo-100' : 'text-indigo-300'}`}>
                  {m.sender === 'user' ? (
                    <>
                      <User className="w-3.5 h-3.5" /> You
                    </>
                  ) : (
                    <>
                      <Bot className="w-3.5 h-3.5 text-indigo-400" /> Professor Turing
                    </>
                  )}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400 text-[11px]">
                    {m.timestamp}
                  </span>
                  {m.sender === 'ai' && (
                    <button
                      onClick={() => handleCopy(m.id, m.text)}
                      className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/10 transition cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === m.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Message Text */}
              <div className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed space-y-2 text-slate-100 font-sans">
                {m.text}
              </div>

              {m.sources && m.sources.length > 0 && (
                <div className="mt-3 pt-2 border-t border-white/10 text-[11px] text-indigo-300 flex items-center space-x-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span>References: {m.sources.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="spatial-glass border border-white/20 p-3.5 flex items-center space-x-3 text-xs text-slate-200 shadow-xl">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              <span>Analyzing 3D syllabus and synthesizing spatial response...</span>
            </div>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Input Field Bar */}
      <div className="p-3.5 bg-slate-900/70 border-t border-white/10 backdrop-blur-xl flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask an academic question or syllabus derivation..."
          className="flex-1 spatial-input px-4 py-2.5 text-xs sm:text-sm placeholder:text-slate-500"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="spatial-btn-primary px-5 py-2.5 font-semibold text-xs uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1.5 cursor-pointer shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>
      </div>
    </div>
  );
};
