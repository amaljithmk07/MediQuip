'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter as useNavigate } from 'next/navigation';
import {
  Home,
  ShieldCheck,
  Package,
  HeartPulse,
  ShoppingCart,
  List,
  ClipboardCheck,
  Clock,
  User,
  LogOut,
} from 'lucide-react';
import { useSelector } from 'react-redux';

const NavItem = ({ href, icon: Icon, label, badge }: any) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link href={href}>
      <div
        className={`flex items-center justify-between px-3 py-2.5 rounded-xl mb-1.5 transition-all duration-300 ${isActive ? 'bg-primary-gradient text-white shadow-glow font-bold translate-x-1' : 'text-slate-500 hover:bg-white/60 hover:text-slate-800 font-medium hover:translate-x-1'}`}
      >
        <div className="flex items-center gap-3">
          <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
          <span className="text-sm">{label}</span>
        </div>
        {badge !== undefined && badge > 0 && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white backdrop-blur-md' : 'bg-primarySoft text-primaryDark'}`}
          >
            {badge}
          </span>
        )}
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRole(sessionStorage.getItem('Role'));
    }
  }, []);

  const cartitems = useSelector((state: any) => state.content?.cartitems || []);

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 h-screen bg-white/60 backdrop-blur-2xl border-r border-white/60 flex flex-col fixed top-0 left-0 z-40 shadow-glass">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-white/60 bg-white/40">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="MediQuip" className="h-8 object-contain" />
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mb-6">
          <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Main
          </p>
          <NavItem
            href={
              role === '1'
                ? '/admin/new-product'
                : role === '2'
                  ? '/user/dashboard'
                  : role === '3'
                    ? '/volunteer/new-product-list'
                    : '/login'
            }
            icon={Home}
            label="Dashboard"
          />
          <NavItem href="/profile" icon={User} label="My Profile" />
        </div>

        {/* User Role Links */}
        {role === '2' && (
          <>
            <div className="mb-6">
              <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Actions
              </p>
              <NavItem href="/uuidverify" icon={ShieldCheck} label="Donate Equipment" />
              <NavItem href="/user/viewproduct" icon={Package} label="Equipment Catalog" />
            </div>
            <div className="mb-6">
              <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Activity
              </p>
              <NavItem href="/user/donated-products" icon={HeartPulse} label="My Donations" />
              <NavItem
                href="/user/cart"
                icon={ShoppingCart}
                label="My Requests"
                badge={cartitems.length}
              />
              <NavItem href="/user/order-summary" icon={List} label="Request History" />
            </div>
          </>
        )}

        {/* Admin Role Links */}
        {role === '1' && (
          <div className="mb-6">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Administration
            </p>
            <NavItem href="/admin/new-product" icon={Package} label="New Equipment" />
            <NavItem href="/volunteer/request" icon={ClipboardCheck} label="Equipment Requests" />
            <NavItem href="/volunteer/list" icon={List} label="Volunteers" />
          </div>
        )}

        {/* Volunteer Role Links */}
        {role === '3' && (
          <div className="mb-6">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Volunteer Duties
            </p>
            <NavItem href="/volunteer/new-product-list" icon={Package} label="Equipment Check" />
            <NavItem href="/volunteer/pending-orders" icon={Clock} label="Pending Deliveries" />
            <NavItem
              href="/volunteer/accepted-orders"
              icon={ClipboardCheck}
              label="Active Deliveries"
            />
          </div>
        )}
      </div>

      {/* Logout Area */}
      <div className="p-4 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-md transition-colors"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
