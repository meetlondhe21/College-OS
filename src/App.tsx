import React, { useState } from 'react';
import { CollegeProvider, useCollege } from './context/CollegeContext';
import { Header } from './components/common/Header';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { SpatialCanvas3D } from './components/common/SpatialCanvas3D';
import { SpatialLogin } from './components/auth/SpatialLogin';
import { StudentPortal } from './components/student/StudentPortal';
import { FacultyPortal } from './components/faculty/FacultyPortal';
import { HODPortal } from './components/hod/HODPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { Command, Boxes, LogIn, Sparkles, Compass } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentRole, isAuthenticated, setIsSearchOpen, setIsAuthenticated } = useCollege();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  return (
    <div className="min-h-screen text-slate-100 font-sans flex flex-col antialiased relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* 3D WebGL Three.js Holographic Canvas (Spatial Horizon) */}
      <SpatialCanvas3D />

      {/* Atmospheric Spatial Glow Filters */}
      <div 
        className="spatial-orb w-[500px] h-[500px] -top-32 -left-32 bg-indigo-600/20"
        style={{ animationDuration: '14s' }}
      />
      <div 
        className="spatial-orb w-[600px] h-[600px] top-1/4 -right-48 bg-purple-600/15" 
        style={{ animationDuration: '18s', animationDelay: '-4s' }}
      />
      <div 
        className="spatial-orb w-[450px] h-[450px] bottom-10 left-1/3 bg-cyan-600/15" 
        style={{ animationDuration: '16s', animationDelay: '-8s' }}
      />

      {/* Global Spatial Glass Header (Shown when logged in) */}
      {isAuthenticated ? (
        <Header onOpenNotifications={() => setIsNotificationOpen(true)} />
      ) : (
        <header className="sticky top-3 z-40 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="spatial-glass border border-white/20 p-3 shadow-2xl backdrop-blur-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[1.5px] shadow-lg shadow-indigo-500/30">
                <div className="w-full h-full bg-slate-950/80 rounded-[10px] flex items-center justify-center text-indigo-400">
                  <Compass className="w-5 h-5 animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-base font-extrabold text-white">College Spatial OS</h1>
                <p className="text-[11px] text-slate-400">3D Holographic Academic Campus</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="hidden sm:inline text-xs text-indigo-300 font-mono bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/30">
                Zero-Trust Secure Node
              </span>
            </div>
          </div>
        </header>
      )}

      {/* Main 3D Spatial Canvas Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {!isAuthenticated ? (
          <SpatialLogin />
        ) : (
          <div className="spatial-canvas-container transition-all duration-500">
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

      {/* Spatial 3D Floating Dock (Bottom) */}
      <footer className="sticky bottom-4 z-40 max-w-4xl mx-auto w-[92%]">
        <div className="spatial-glass border border-white/20 px-5 py-2.5 flex items-center justify-between text-xs shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 text-indigo-400">
              <Boxes className="w-4 h-4 text-indigo-400 animate-spin" style={{ animationDuration: '20s' }} />
              <span className="font-bold text-white tracking-tight">College Spatial OS</span>
            </div>
            <span className="text-white/20 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline text-[11px]">3D WebGL Engine Active</span>
          </div>

          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="spatial-btn flex items-center space-x-1.5 px-3 py-1 text-slate-200 hover:text-white text-[11px] font-medium"
              >
                <Command className="w-3.5 h-3.5 text-indigo-400" />
                <span>Spatial Jump (⌘K)</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthenticated(true)}
                className="spatial-btn-primary flex items-center space-x-1.5 px-3 py-1 text-white text-[11px] font-semibold"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Quick Enter</span>
              </button>
            )}

            <div className="hidden sm:flex items-center space-x-1.5 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 text-[11px]">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="font-semibold">3D Sync Online</span>
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
