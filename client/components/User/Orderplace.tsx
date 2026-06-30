'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter as useNavigate } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { cartView } from '../../redux/reducer/CartSlice';
import Base_URL from '../Constant/constant';

const Orderplace = () => {
  const navigate = useNavigate();
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('Token') : null;
  const login_id = typeof window !== 'undefined' ? sessionStorage.getItem('LoginId') : null;

  const [profile, setProfile] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch() as any;
  const cartitems = useSelector((state: any) => state.content.cartitems);

  useEffect(() => {
    dispatch(cartView());

    axios
      .get(`${Base_URL}/api/user/orderplace-address`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((data) => {
        setProfile(data.data.data !== 'No data' ? data.data.data : null);
      })
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 401) {
          toast.error('Session Time Out', { position: 'top-center' });
          setTimeout(() => {
            sessionStorage.clear();
            navigate.push('/login');
          }, 2000);
        }
      });
  }, [dispatch, token, navigate]);

  const orderplace = () => {
    if (!agreed) {
      toast.error('You must confirm medical responsibility to proceed', { position: 'top-center' });
      return;
    }

    if (cartitems && cartitems.length !== 0) {
      Swal.fire({
        title: 'Confirm Request',
        text: 'You are about to request these medical supplies. Are you sure?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#0d9488', // teal-600
        cancelButtonColor: '#94a3b8', // slate-400
        confirmButtonText: 'Yes, Place Request',
        customClass: {
          popup: 'rounded-2xl',
          confirmButton: 'rounded-xl',
          cancelButton: 'rounded-xl',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          setLoading(true);
          axios
            .post(`${Base_URL}/api/user/orderplace/${login_id}`, cartitems, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((data) => {
              Swal.fire({
                title: 'Request Submitted!',
                text: 'Your medical equipment request has been sent for approval.',
                icon: 'success',
                confirmButtonColor: '#0d9488',
                customClass: { popup: 'rounded-2xl', confirmButton: 'rounded-xl' },
              });
              navigate.push('/user/order-summary');
            })
            .catch((err) => {
              console.error(err);
              toast.error('Failed to place order');
              setLoading(false);
            });
        }
      });
    } else {
      toast.error('Your cart is empty');
      navigate.push('/');
    }
  };

  const addressChange = () => {
    sessionStorage.setItem('item', cartitems.length);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-display font-bold text-slate-800 mb-8">Secure Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8 items-start animate-fade-in-up">
          {/* Left Column: Delivery Details */}
          <div className="w-full lg:w-3/5 space-y-6">
            {/* Delivery Address Card */}
            <div className="bg-white rounded-3xl shadow-soft border border-slate-100 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full -mr-8 -mt-8 z-0"></div>

              <div className="relative z-10 flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Delivery Address
                </h2>
                <Link
                  onClick={addressChange}
                  href="/user/address"
                  className="text-sm font-bold text-primary hover:text-primaryDark transition-colors bg-primarySoft/30 px-4 py-2 rounded-xl"
                >
                  Edit
                </Link>
              </div>

              {profile ? (
                <div className="relative z-10 space-y-4">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <p className="font-bold text-slate-800 text-lg mb-1">{profile.name}</p>
                    <p className="text-slate-600 mb-3">
                      {profile.address}, {profile.district}, {profile.state} - {profile.pin_code}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <svg
                          className="w-4 h-4 text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>{' '}
                        {profile.alternate_phone || 'N/A'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <svg
                          className="w-4 h-4 text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>{' '}
                        {profile.email || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 bg-amber-50 text-amber-800 p-5 rounded-2xl border border-amber-200 flex items-start gap-3">
                  <svg
                    className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <div>
                    <h3 className="font-bold">Missing Address</h3>
                    <p className="text-sm mt-1 opacity-80">
                      Please add your delivery address before proceeding.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Warning / Medical Notice */}
            <div className="bg-emerald-50 rounded-3xl shadow-soft border border-emerald-100 p-6 flex gap-4 items-start">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-emerald-200">
                <svg
                  className="w-6 h-6 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-900 mb-1">
                  Medical Equipment Notice
                </h3>
                <p className="text-sm text-emerald-700 leading-relaxed">
                  The items requested are provided through donations. By proceeding, you acknowledge
                  that you are requesting these for legitimate medical needs.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout */}
          <div className="w-full lg:w-2/5">
            <div className="bg-white rounded-3xl shadow-glass border border-slate-100 p-8 sticky top-24">
              <h2 className="text-xl font-bold text-slate-800 mb-6 font-display">
                Request Summary
              </h2>

              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {cartitems && cartitems.length > 0 ? (
                  cartitems.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-700 line-clamp-1 text-sm">
                          {item.name}
                        </span>
                        <span className="text-xs text-slate-500">{item.category}</span>
                      </div>
                      <span className="text-sm font-medium bg-slate-100 px-2 py-1 rounded text-slate-600 whitespace-nowrap ml-4">
                        Qty: {item.cart_qty}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 italic">No items in cart</p>
                )}
              </div>

              {/* Responsibility Checkbox */}
              <div className="border-t border-slate-100 pt-6 mb-8">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-1">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={agreed}
                      onChange={() => setAgreed(!agreed)}
                    />
                    <div
                      className={`w-5 h-5 rounded border ${agreed ? 'bg-primary border-primary' : 'bg-white border-slate-300'} transition-colors flex items-center justify-center`}
                    >
                      {agreed && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors select-none leading-relaxed">
                    I confirm that I take responsibility for these items and need them for medical
                    purposes.
                  </span>
                </label>
              </div>

              <button
                onClick={orderplace}
                disabled={!profile || loading}
                className="btn btn-primary w-full py-4 px-4 shadow-premium uppercase tracking-wider text-sm"
              >
                {loading ? 'Processing...' : 'Confirm Request'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orderplace;
