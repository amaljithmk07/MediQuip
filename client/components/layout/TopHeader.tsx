'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { Search, Bell, Settings } from 'lucide-react';
import { Input } from '../ui/Input';

const TopHeader = () => {
  const pathname = usePathname();

  // Create a simple breadcrumb from the pathname
  const formatPathname = () => {
    if (pathname === '/') return 'Dashboard';
    const parts = pathname.split('/').filter(Boolean);
    return parts
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).replace('-', ' '))
      .join(' / ');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
      {/* Breadcrumbs */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 font-sans tracking-tight">
          {formatPathname()}
        </h2>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        <div className="relative hidden md:block w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-9 h-9 bg-slate-50 border-slate-200 text-sm focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-4 text-slate-500 border-l border-slate-200 pl-6">
          <button className="hover:text-primary transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-danger rounded-full border-2 border-white"></span>
          </button>
          <button className="hover:text-primary transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
