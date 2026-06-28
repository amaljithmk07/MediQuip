"use client";
import React, { useEffect, useState } from "react";
import { Package, HeartPulse, ShoppingCart, ArrowRight } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import Base_URL from "@/components/Constant/constant";
import { useSelector } from "react-redux";

export default function UserDashboard() {
  const [profile, setProfile] = useState<any>({});
  const [orders, setOrders] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const cartitems = useSelector((state: any) => state.content?.cartitems || []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = sessionStorage.getItem("Token");
      const uuid = sessionStorage.getItem("uuid");
      
      try {
        // Fetch profile to get name
        const profileRes = await axios.get(`${Base_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(profileRes.data);

        // Fetch orders if possible
        if (uuid) {
          const ordersRes = await axios.get(`${Base_URL}/api/user/ordersummary/${uuid}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setOrders(ordersRes.data || []);
        }

        // Fetch donations
        const donRes = await axios.get(`${Base_URL}/api/user/donated-products`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDonations(donRes.data || []);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {profile?.name || 'User'}!</h1>
        <p className="text-slate-500 mt-1">Here's an overview of your activity and contributions.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <HeartPulse size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Donations</p>
            <h3 className="text-2xl font-bold text-slate-900">{donations.length}</h3>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Active Orders</p>
            <h3 className="text-2xl font-bold text-slate-900">{orders.length}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <ShoppingCart size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Cart Items</p>
            <h3 className="text-2xl font-bold text-slate-900">{cartitems.length}</h3>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
            <h2 className="font-semibold text-slate-900">Recent Orders</h2>
            <Link href="/user/order-summary" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all</Link>
          </div>
          <div className="p-0">
            {orders.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Package size={32} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 text-sm">No recent orders found.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {orders.slice(0, 5).map((order: any, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-900 font-medium">#{order._id?.substring(0, 8)}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          Pending
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="font-semibold text-slate-900 mb-2">Quick Actions</h2>
          
          <Link href="/uuidverify" className="block w-full">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <HeartPulse size={20} />
                </div>
                <ArrowRight size={18} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
              </div>
              <h3 className="font-semibold text-slate-900">Donate Equipment</h3>
              <p className="text-sm text-slate-500 mt-1">Help others by donating medical supplies.</p>
            </div>
          </Link>

          <Link href="/user/viewproduct" className="block w-full">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                  <Package size={20} />
                </div>
                <ArrowRight size={18} className="text-slate-300 group-hover:text-purple-600 transition-colors" />
              </div>
              <h3 className="font-semibold text-slate-900">Equipment Catalog</h3>
              <p className="text-sm text-slate-500 mt-1">Browse and request available medical equipment.</p>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}
