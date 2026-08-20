import React, { useState } from 'react';
import { CollegeProvider, useCollege } from './context/CollegeContext';
import { Header } from './components/common/Header';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { BrutalistAuth } from './components/auth/BrutalistAuth';
import { StudentPortal } from './components/student/StudentPortal';
import { FacultyPortal } from './components/faculty/FacultyPortal';
import { HODPortal } from './components/hod/HODPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { Command, BookOpen, CheckCircle2, ShieldCheck } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentRole, isAuthenticated, setIsSearchOpen } = useCollege();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  return (
    <div className="min-h-screen text-black font-sans flex flex-col antialiased relative selection:bg-[#ffea00] selection:text-black">
      {/* Top Header Navigation */}
      {isAuthenticated ? (
        <Header onOpenNotifications={() => setIsNotificationOpen(true)} />
      ) : (
        <header className="sticky top-3 z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="brutal-card p-3 sm:p-4 bg-white border-2 border-black shadow-[4px_4px_0px_#000000] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#ffea00] border-2 border-black rounded-lg flex items-center justify-center shadow-[2px_2px_0px_#000000] shrink-0">
                <BookOpen className="w-5 h-5 text-black" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight text-black">
                    College OS
                  </h1>
                  <span className="bg-black text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                    GATEWAY
                  </span>
                </div>
                <p className="text-[11px] text-neutral-600 font-bold">
                  Autonomous Campus Management & AI System
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-extrabold bg-[#a3e635] text-black px-2.5 py-1 rounded border-2 border-black shadow-[1px_1px_0px_#000000] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-black" />
                <span>SECURE AUTH GATEWAY</span>
              </span>
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {!isAuthenticated ? (
          <BrutalistAuth />
        ) : (
          <div className="transition-all duration-300">
            {currentRole === 'student' && <StudentPortal />}
            {currentRole === 'faculty' && <FacultyPortal />}
            {currentRole === 'hod' && <HODPortal />}
            {currentRole === 'admin' && <AdminPortal />}
          </div>
        )}
      </main>

      {/* Global Command Palette / Search Modal */}
      <GlobalSearchModal />

      {/* Global Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      {/* Bottom Brutalist Status Footer */}
      <footer className="sticky bottom-4 z-40 max-w-4xl mx-auto w-[94%]">
        <div className="brutal-card bg-white border-2 border-black px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs shadow-[4px_4px_0px_#000000]">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#a3e635] border border-black" />
              <span className="font-black uppercase tracking-wider text-black text-[11px]">
                COLLEGE OS 2026-27
              </span>
            </div>
            <span className="text-neutral-400 hidden sm:inline font-bold">|</span>
            <span className="text-neutral-600 hidden sm:inline text-[11px] font-bold">
              Autonomous Academic Node
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {isAuthenticated && (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="brutal-btn flex items-center space-x-1.5 px-3 py-1 text-black text-[11px] font-bold bg-[#ffea00]"
              >
                <Command className="w-3.5 h-3.5 text-black" />
                <span>Command Jump (⌘K)</span>
              </button>
            )}

            <div className="flex items-center space-x-1 text-[11px] font-mono font-bold text-black bg-neutral-100 px-2 py-0.5 rounded border border-black">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>SYSTEM READY</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <CollegeProvider>
      <MainLayout />
    </CollegeProvider>
  );
}
