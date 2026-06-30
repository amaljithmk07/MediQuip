'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter as useNavigate } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import Base_URL from '../Constant/constant';

const Ordersummary = () => {
  const navigate = useNavigate();
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('Token') : null;
  const login_id = typeof window !== 'undefined' ? sessionStorage.getItem('LoginId') : null;

  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Profile
    axios
      .get(`${Base_URL}/api/user/profile-address`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((data) => {
        if (data.data.data && data.data.data.length > 0) {
          setProfile(data.data.data[0]);
        }
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          toast.error('Session Time Out');
          setTimeout(() => {
            sessionStorage.clear();
            navigate.push('/login');
          }, 2000);
        }
      });

    // Fetch Orders
    if (login_id) {
      axios
        .get(`${Base_URL}/api/user/ordersummary/${login_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((data) => {
          setOrders(data.data.data || []);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          if (err.response?.status === 401) {
            setTimeout(() => {
              sessionStorage.clear();
              navigate.push('/login');
            }, 2000);
          }
        });
    } else {
      setLoading(false);
    }
  }, [token, login_id, navigate]);

  const getStatusIndex = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'delivered') return 4;
    if (s === 'assigned' || s === 'out for delivery') return 3;
    if (s === 'approved' || s === 'processing') return 2;
    return 1; // Pending / Ordered
  };

  const getStatusColor = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'delivered') return 'bg-emerald-500 text-white';
    if (s === 'assigned' || s === 'approved' || s === 'processing') return 'bg-blue-500 text-white';
    return 'bg-amber-500 text-white'; // Pending
  };

  return (
    <div className="w-full  mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Toaster />
      <div className="w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-800">Order History</h1>
            <p className="text-slate-500 mt-2">
              Track the status of your requested medical equipment.
            </p>
          </div>
          <Link
            href="/user/viewproduct"
            className="text-teal-600 font-bold hover:text-teal-700 transition-colors hidden sm:block"
          >
            &larr; Request more items
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-soft border border-slate-100 p-16 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-12 h-12 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-700 mb-2">No active requests</h2>
            <p className="text-slate-500 mb-8 max-w-md">
              You haven't requested any medical equipment yet.
            </p>
            <Link
              href="/"
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5"
            >
              Browse Equipment
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order, index) => {
              const currentStep = getStatusIndex(order.orderstatus);
              const statusColor = getStatusColor(order.orderstatus);

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Order Header */}
                  <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">{order.name}</h3>
                      <p className="text-sm text-slate-500">
                        {order.category} &bull; Qty: {order.cart_qty}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${statusColor}`}
                      >
                        {order.orderstatus || 'Pending'}
                      </span>
                      <Link
                        href={`/volunteer/view-details/${order._id}`}
                        className="text-sm font-semibold text-teal-600 hover:text-teal-700 bg-white border border-slate-200 hover:border-teal-200 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>

                  {/* Timeline Tracker */}
                  <div className="p-8">
                    <div className="relative">
                      {/* Connecting Line Background */}
                      <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 sm:top-5 sm:bottom-auto sm:w-full sm:h-1 sm:-translate-x-1/2 bg-slate-200 rounded"></div>

                      {/* Active Connecting Line */}
                      <div
                        className="absolute left-4 sm:left-1/2 top-0 sm:top-5 sm:h-1 sm:-translate-x-1/2 bg-teal-500 rounded transition-all duration-1000 ease-out hidden sm:block"
                        style={{ width: `${(currentStep - 1) * 33.33}%` }}
                      ></div>

                      <div className="relative flex flex-col sm:flex-row justify-between gap-8 sm:gap-0">
                        {/* Step 1: Requested */}
                        <div className="flex sm:flex-col items-center gap-4 sm:gap-2 relative z-10 w-full sm:w-1/4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${currentStep >= 1 ? 'bg-teal-500 border-teal-500 text-white shadow-md' : 'bg-white border-slate-300 text-slate-400'}`}
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                              />
                            </svg>
                          </div>
                          <div className="sm:text-center">
                            <p
                              className={`font-bold text-sm ${currentStep >= 1 ? 'text-slate-800' : 'text-slate-500'}`}
                            >
                              Requested
                            </p>
                            <p className="text-xs text-slate-400 sm:mt-1">Request received</p>
                          </div>
                        </div>

                        {/* Step 2: Approved */}
                        <div className="flex sm:flex-col items-center gap-4 sm:gap-2 relative z-10 w-full sm:w-1/4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${currentStep >= 2 ? 'bg-teal-500 border-teal-500 text-white shadow-md' : 'bg-white border-slate-300 text-slate-400'}`}
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div className="sm:text-center">
                            <p
                              className={`font-bold text-sm ${currentStep >= 2 ? 'text-slate-800' : 'text-slate-500'}`}
                            >
                              Approved
                            </p>
                            <p className="text-xs text-slate-400 sm:mt-1">Verified need</p>
                          </div>
                        </div>

                        {/* Step 3: Assigned */}
                        <div className="flex sm:flex-col items-center gap-4 sm:gap-2 relative z-10 w-full sm:w-1/4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${currentStep >= 3 ? 'bg-teal-500 border-teal-500 text-white shadow-md' : 'bg-white border-slate-300 text-slate-400'}`}
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                          </div>
                          <div className="sm:text-center">
                            <p
                              className={`font-bold text-sm ${currentStep >= 3 ? 'text-slate-800' : 'text-slate-500'}`}
                            >
                              Assigned
                            </p>
                            <p className="text-xs text-slate-400 sm:mt-1">Volunteer matched</p>
                          </div>
                        </div>

                        {/* Step 4: Delivered */}
                        <div className="flex sm:flex-col items-center gap-4 sm:gap-2 relative z-10 w-full sm:w-1/4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${currentStep >= 4 ? 'bg-emerald-500 border-emerald-500 text-white shadow-md' : 'bg-white border-slate-300 text-slate-400'}`}
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <div className="sm:text-center">
                            <p
                              className={`font-bold text-sm ${currentStep >= 4 ? 'text-slate-800' : 'text-slate-500'}`}
                            >
                              Delivered
                            </p>
                            <p className="text-xs text-slate-400 sm:mt-1">Handed over</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Ordersummary;
