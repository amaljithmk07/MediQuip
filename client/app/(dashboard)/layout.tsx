import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopHeader from '@/components/layout/TopHeader';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Persistent Sidebar */}
      <Sidebar />

      {/* Main Content Area (offset by sidebar width 256px = 64) */}
      <div className="flex-1 flex flex-col ml-64 min-h-screen">
        <TopHeader />
        <main className="flex-1 p-8">
          <div className="max-w-[1600px] mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
