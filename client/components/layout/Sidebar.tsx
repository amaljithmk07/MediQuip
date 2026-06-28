"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter as useNavigate } from "next/navigation";
import { 
  Home, ShieldCheck, Package, HeartPulse, ShoppingCart, List, 
  ClipboardCheck, Clock, User, LogOut
} from "lucide-react";
import { useSelector } from "react-redux";

const NavItem = ({ href, icon: Icon, label, badge }: any) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link href={href}>
      <div className={`flex items-center justify-between px-3 py-2 rounded-md mb-1 transition-all duration-150 ${isActive ? 'bg-blue-50 text-blue-600 border-l-2 border-blue-600 font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 border-l-2 border-transparent font-medium'}`}>
        <div className="flex items-center gap-3">
          <Icon size={18} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
          <span className="text-sm">{label}</span>
        </div>
        {badge !== undefined && badge > 0 && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'}`}>
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
    if (typeof window !== "undefined") {
      setRole(sessionStorage.getItem("Role"));
    }
  }, []);

  const cartitems = useSelector((state: any) => state.content?.cartitems || []);

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed top-0 left-0 z-40">
      
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Med.Equip" className="h-8 object-contain" />
         </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        
        <div className="mb-6">
          <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Main</p>
          <NavItem 
            href={
              role === "1" ? "/admin/new-product" : 
              role === "2" ? "/user/dashboard" : 
              role === "3" ? "/volunteer/new-product-list" : 
              "/login"
            } 
            icon={Home} 
            label="Dashboard" 
          />
          <NavItem href="/profile" icon={User} label="My Profile" />
        </div>

        {/* User Role Links */}
        {role === "2" && (
          <>
            <div className="mb-6">
              <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Actions</p>
              <NavItem href="/uuidverify" icon={ShieldCheck} label="Donate Equipment" />
              <NavItem href="/user/viewproduct" icon={Package} label="Equipment Catalog" />
            </div>
            <div className="mb-6">
              <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Activity</p>
              <NavItem href="/user/donated-products" icon={HeartPulse} label="My Donations" />
              <NavItem href="/user/cart" icon={ShoppingCart} label="Cart" badge={cartitems.length} />
              <NavItem href="/user/order-summary" icon={List} label="My Orders" />
            </div>
          </>
        )}

        {/* Admin Role Links */}
        {role === "1" && (
          <div className="mb-6">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Administration</p>
            <NavItem href="/admin/new-product" icon={Package} label="New Arrivals" />
            <NavItem href="/volunteer/request" icon={ClipboardCheck} label="Order Requests" />
            <NavItem href="/volunteer/list" icon={List} label="Volunteers" />
          </div>
        )}

        {/* Volunteer Role Links */}
        {role === "3" && (
          <div className="mb-6">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Volunteer Duties</p>
            <NavItem href="/volunteer/new-product-list" icon={Package} label="Equipment Check" />
            <NavItem href="/volunteer/pending-orders" icon={Clock} label="Pending Orders" />
            <NavItem href="/volunteer/accepted-orders" icon={ClipboardCheck} label="Accepted Orders" />
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
