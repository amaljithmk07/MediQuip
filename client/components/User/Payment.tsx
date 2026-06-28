"use client";
import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import upiqr from "upiqr";
import Base_URL from "../Constant/constant";

const Payment = () => {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem("Token") : null;

  const [price, setprice] = useState({ name: '', phone: '', amount: '' });
  const [qr, setqr] = useState('');
  const [loading, setLoading] = useState(false);

  const paymentInput = (e) => {
    const { name, value } = e.target;
    setprice({ ...price, [name]: value });
  };

  const qrGenerate = (e) => {
    e.preventDefault();
    
    let { name, phone, amount } = price;
    let amountverify = String(amount).match(/^(?!0)([0-9]{1,4})$/);

    if (!name) {
      toast.error("Please Enter Name");
      return;
    } else if (!phone) {
      toast.error("Please Enter Phone Number");
      return;
    } else if (!amount) {
      toast.error("Please Enter amount");
      return;
    } else if (!amountverify) {
      toast.error("Please Enter Valid Amount (Max 4 digits)");
      return;
    }

    setLoading(true);
    
    upiqr({
      payeeVPA: "8086171296@paytm",
      payeeName: "Amaljith",
      amount: amount,
    })
      .then((upi) => {
        setqr(upi.qr);
        toast.success("QR Code Generated");
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const paymentSubmit = (e) => {
    e.preventDefault();
    if(!qr) {
       toast.error("Please generate QR code first");
       return;
    }
    axios
      .post(`${Base_URL}/api/user/donation`, price, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((data) => {
        toast.success("Payment Recorded Successfully");
        setqr("");
        setprice({ name: '', phone: '', amount: '' });
      })
      .catch((err) => {
        console.error(err);
        toast.error("Payment recording failed");
      });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <Toaster />
      
      {/* Ambient background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col md:flex-row animate-fade-in-up">
        
        {/* Left Side - Details */}
        <div className="w-full md:w-1/2 p-10 md:p-12 border-b md:border-b-0 md:border-r border-white/10">
          <div className="mb-10">
            <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-teal-500/30">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-display font-bold text-white mb-2">Make a Donation</h2>
            <p className="text-slate-400 text-sm leading-relaxed">Your contribution helps us provide essential medical equipment to those in need. Secure UPI payment.</p>
          </div>

          <form onSubmit={qrGenerate} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={price.name}
                onChange={paymentInput}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
              <input
                type="number"
                name="phone"
                value={price.phone}
                onChange={paymentInput}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                placeholder="9876543210"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Donation Amount (₹)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">₹</span>
                <input
                  type="number"
                  name="amount"
                  value={price.amount}
                  onChange={paymentInput}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-mono text-lg"
                  placeholder="0.00"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-4 px-4 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 uppercase tracking-wider text-sm disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Secure QR'}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-4 text-slate-500 text-xs">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              256-bit Encryption
            </div>
            <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Trusted UPI
            </div>
          </div>
        </div>

        {/* Right Side - QR Code & Payment Confirmation */}
        <div className="w-full md:w-1/2 bg-slate-800/50 p-10 md:p-12 flex flex-col items-center justify-center relative">
          
          <div className="w-full max-w-sm flex flex-col items-center">
            
            <div className="bg-white p-6 rounded-3xl shadow-xl w-64 h-64 flex items-center justify-center mb-8 border-4 border-slate-700/50 relative overflow-hidden group">
              {qr ? (
                <img src={qr} alt="UPI QR Code" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <div className="text-center opacity-40 flex flex-col items-center">
                  <svg className="w-16 h-16 text-slate-800 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                  <span className="text-slate-800 font-bold text-sm uppercase tracking-widest">Awaiting QR</span>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-2 mb-8 h-8">
              {qr && (
                <img
                  src="https://res.cloudinary.com/dqc2xhnac/image/upload/v1708583159/Med-equip/av61ce3jrha40rjqlywk.png"
                  alt="Payment Options"
                  className="h-full object-contain filter brightness-0 invert opacity-60"
                />
              )}
            </div>

            <button 
              onClick={paymentSubmit}
              disabled={!qr}
              className={`w-full font-bold py-4 px-4 rounded-xl shadow-lg transition-all uppercase tracking-wider text-sm flex items-center justify-center gap-2
                ${qr ? 'bg-emerald-500 hover:bg-emerald-400 text-white transform hover:-translate-y-0.5' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Confirm Payment Sent
            </button>
            <p className="text-slate-500 text-xs text-center mt-4">
              Please scan the QR and complete the transaction on your device before clicking confirm.
            </p>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Payment;
