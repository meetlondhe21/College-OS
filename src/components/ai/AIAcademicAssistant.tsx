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
  Award
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
      text: `Hello **${currentRole === 'student' ? currentStudent?.name || 'Scholar' : currentFaculty?.name || 'Professor'}**! I am **Professor Turing**, your academic AI tutor powered by **Gemini 3.7 Flash**.\n\nI can assist you with:\n- **Algorithmic proofs, recurrences, and asymptotic Big-O bounds**\n- **DBMS normalization decompositions (1NF through BCNF) & SQL optimization**\n- **Computer networks packet flows, OSI vs TCP/IP, and CIDR subnetting**\n- **High-yield exam revision cheat sheets & practice quiz derivations**\n\nSelect a study mode or ask any academic question below!`,
      timestamp: 'Just now',
      sources: ['Autonomous Engineering Curriculum 2026-27', 'NBA Academic Framework']
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
      modifiedQuery = `[MODE: QUIZ & PRACTICE EXAM] Generate 3 conceptual multiple-choice and 1 derivation question on this topic: ${query}. Include detailed answer explanations.`;
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
          studentName: currentRole === 'student' ? currentStudent?.name : currentFaculty?.name
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
        sources: data.sources || ['Autonomous Engineering Syllabus 2026', 'NBA OBE Framework']
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      const fallbackMsg: Message = {
        id: `msg-fallback-${Date.now()}`,
        sender: 'ai',
        text: `### Academic Concept Review [${selectedSubject}]\n\n1. **Core Principle**: Focus on underlying state machines, recurrence relations, and base cases.\n2. **Time Complexity**: Standard optimal bound is $O(V \\log V + E)$ or $O(N \\log N)$.\n3. **Exam Tip**: Write full derivations and state invariant conditions explicitly in final answer sheets.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: ['College OS Academic Repository']
      };
      setMessages((prev) => [...prev, fallbackMsg]);
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
    <div className="brutal-card bg-white overflow-hidden flex flex-col h-[700px] border-2 border-black shadow-[4px_4px_0px_#000000]">
      
      {/* Brutalist Header Toolbar */}
      <div className="p-4 bg-[#ffea00] border-b-2 border-black flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-black border-2 border-black rounded-lg flex items-center justify-center text-[#ffea00] shadow-[2px_2px_0px_#000000] shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-base text-black uppercase tracking-tight">
                Professor Turing
              </span>
              <span className="bg-black text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                GEMINI 3.7 AI
              </span>
            </div>
            <p className="text-xs text-neutral-800 font-bold">
              Autonomous Academic AI Tutor & Problem Solver
            </p>
          </div>
        </div>

        {/* Mode & Subject Context Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-white p-1 rounded-lg border-2 border-black text-xs shadow-[2px_2px_0px_#000000]">
            <button
              onClick={() => setStudyMode('explain')}
              className={`px-2.5 py-1 rounded font-bold transition-all flex items-center gap-1 cursor-pointer ${
                studyMode === 'explain'
                  ? 'bg-black text-white'
                  : 'text-neutral-700 hover:text-black hover:bg-neutral-100'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Explain</span>
            </button>
            <button
              onClick={() => setStudyMode('quiz')}
              className={`px-2.5 py-1 rounded font-bold transition-all flex items-center gap-1 cursor-pointer ${
                studyMode === 'quiz'
                  ? 'bg-black text-white'
                  : 'text-neutral-700 hover:text-black hover:bg-neutral-100'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Quiz</span>
            </button>
            <button
              onClick={() => setStudyMode('code')}
              className={`px-2.5 py-1 rounded font-bold transition-all flex items-center gap-1 cursor-pointer ${
                studyMode === 'code'
                  ? 'bg-black text-white'
                  : 'text-neutral-700 hover:text-black hover:bg-neutral-100'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Code</span>
            </button>
            <button
              onClick={() => setStudyMode('summary')}
              className={`px-2.5 py-1 rounded font-bold transition-all flex items-center gap-1 cursor-pointer ${
                studyMode === 'summary'
                  ? 'bg-black text-white'
                  : 'text-neutral-700 hover:text-black hover:bg-neutral-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Cheat Sheet</span>
            </button>
          </div>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            aria-label="Select Subject Context"
            className="brutal-input text-xs px-3 py-1.5 font-bold cursor-pointer bg-white"
          >
            <option value="CS-501 Design & Analysis of Algorithms">CS-501 Algorithms</option>
            <option value="CS-502 Database Management Systems">CS-502 DBMS</option>
            <option value="CS-503 Computer Networks">CS-503 Networks</option>
            <option value="CS-504 Artificial Intelligence & Expert Systems">CS-504 AI & Systems</option>
            <option value="General University Academics">General Syllabus</option>
          </select>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="bg-neutral-100 border-b-2 border-black p-2.5 overflow-x-auto flex items-center space-x-2 shrink-0">
        <span className="text-xs font-black uppercase text-black shrink-0 px-1 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-black" /> Prompts:
        </span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedSubject(qp.subject);
              handleSend(qp.prompt);
            }}
            disabled={isLoading}
            className="brutal-btn text-xs px-2.5 py-1 text-black bg-white shrink-0 cursor-pointer disabled:opacity-50 font-bold"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#faf8f5]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[88%] sm:max-w-[80%] p-4 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] ${
                m.sender === 'user'
                  ? 'bg-[#ffea00] text-black font-semibold'
                  : 'bg-white text-black'
              }`}
            >
              <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-2 text-xs">
                <span className="font-black uppercase flex items-center gap-1.5 text-black">
                  {m.sender === 'user' ? (
                    <>
                      <User className="w-3.5 h-3.5 text-black" /> You
                    </>
                  ) : (
                    <>
                      <Bot className="w-3.5 h-3.5 text-black" /> Professor Turing
                    </>
                  )}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-neutral-600 text-[11px] font-mono font-bold">
                    {m.timestamp}
                  </span>
                  {m.sender === 'ai' && (
                    <button
                      onClick={() => handleCopy(m.id, m.text)}
                      className="text-black hover:bg-neutral-200 p-1 rounded transition cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === m.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-700 font-bold" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Message Text */}
              <div className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed space-y-2 text-black font-medium">
                {m.text}
              </div>

              {m.sources && m.sources.length > 0 && (
                <div className="mt-3 pt-2 border-t-2 border-black text-[11px] text-neutral-700 font-bold font-mono flex items-center space-x-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-black" />
                  <span>References: {m.sources.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="brutal-card bg-white border-2 border-black p-3.5 flex items-center space-x-3 text-xs text-black font-bold shadow-[3px_3px_0px_#000000]">
              <Loader2 className="w-4 h-4 animate-spin text-black" />
              <span>Analyzing curriculum parameters and synthesizing answer...</span>
            </div>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Input Field Bar */}
      <div className="p-3.5 bg-neutral-100 border-t-2 border-black flex items-center space-x-2">
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
          placeholder="Ask an academic question or concept derivation (e.g., Explain Kruskal's algorithm with complexity)..."
          className="flex-1 brutal-input px-4 py-2.5 text-xs sm:text-sm text-black placeholder:text-neutral-500 font-medium"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="brutal-btn-primary px-5 py-2.5 font-black text-xs uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1.5 cursor-pointer shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>
      </div>
    </div>
  );
};
