'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter as useNavigate, useParams } from 'next/navigation';
import Base_URL from '../Constant/constant';

const steps = ['Order Placed', 'Order accepted', 'Delivered'];

const Viewdetails = () => {
  const navigate = useNavigate();
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('Token') : null;
  const role = typeof window !== 'undefined' ? sessionStorage.getItem('Role') : null;
  const [viewdetails, setViewdetails] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const endpoint =
      role == '3' ? `/api/volunteer/view-details/${id}` : `/api/user/view-details/${id}`;

    if (id) {
      axios
        .get(`${Base_URL}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((data) => {
          setViewdetails(data.data.data[0] || {});
        })
        .catch((err) => {
          console.error(err);
          if (err.response?.status == 401) {
            toast.error('Session Time Out', { position: 'top-center' });
            setTimeout(() => {
              sessionStorage.clear();
              navigate.push('/login');
            }, 2000);
          }
        });
    }
  }, [id, role, token, navigate]);

  // Determine active step index
  let activeStep = 1; // Default to Order Placed
  if (viewdetails.orderstatus === 'Order Accepted') activeStep = 2;
  if (viewdetails.orderstatus === 'Delivered') activeStep = 3;

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex justify-center">
      <Toaster />
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-8 pb-4 border-b border-slate-100">
          Workflow Details
        </h1>

        {/* Tracking Workflow Stepper */}
        <div className="mb-12 bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-700 mb-6 uppercase tracking-wider text-center">
            Order Status Workflow
          </h2>
          <div className="flex items-center justify-between relative">
            {/* Connecting line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 z-0 rounded-full"></div>

            {steps.map((label, index) => {
              const stepNumber = index + 1;
              const isCompleted = activeStep >= stepNumber;
              const isCurrent = activeStep === stepNumber;

              return (
                <div key={label} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-all
                    ${isCompleted ? 'bg-primary text-white shadow-primary/30' : 'bg-white text-slate-400 border-2 border-slate-200'}`}
                  >
                    {isCompleted ? (
                      <svg
                        className="w-6 h-6"
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
                    ) : (
                      stepNumber
                    )}
                  </div>
                  <span
                    className={`mt-3 text-sm font-medium ${isCurrent ? 'text-primary font-bold' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800">Product Request</h3>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">ID</span>
                <span className="font-mono text-slate-800">{viewdetails._id || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Product</span>
                <span className="font-medium text-slate-800">{viewdetails.product_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Category</span>
                <span className="text-slate-800">{viewdetails.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Qty</span>
                <span className="text-slate-800 font-bold">{viewdetails.cart_qty}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Description</span>
                <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                  {viewdetails.description || 'No description available.'}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800">Delivery Information</h3>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Recipient</span>
                <span className="font-medium text-slate-800">{viewdetails.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email</span>
                <span className="text-slate-800">{viewdetails.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone</span>
                <span className="text-slate-800">{viewdetails.alternate_phone}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Address</span>
                <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                  {viewdetails.address}
                  <br />
                  {viewdetails.district}, {viewdetails.state} - {viewdetails.pin_code}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viewdetails;
