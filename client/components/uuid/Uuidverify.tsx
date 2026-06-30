'use client';
import React, { useEffect, useState } from 'react';
import { useRouter as useNavigate } from 'next/navigation';
import api from '../../services/api';
import Loading from '../uuid-Animations/Loading';
import Verify from '../uuid-Animations/Verify';
import Wrong from '../uuid-Animations/Wrong';
import Base_URL from '../Constant/constant';

const Uuidverify = () => {
  const [wrong, setWrong] = useState(null);
  const navigate = useNavigate();
  const [letter, setLetter] = useState({});
  const [loadingText, setloadingText] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const verify = (event) => {
    const { name, value } = event.target;
    setloadingText(value);
    setLetter({ [name]: value });
    setWrong(null); // Reset state on typing
  };

  const token = typeof window !== 'undefined' ? sessionStorage.getItem('Token') : null;

  const handleClick = () => {
    if (!letter.user_id || letter.user_id.length !== 4) return;
    setIsVerifying(true);

    api
      .post(`/api/auth/uuidverify`, letter)
      .then((data) => {
        setIsVerifying(false);
        setWrong(true);
        if (data.status === 200) {
          sessionStorage.setItem('uuid', data.data.uuid);
          setTimeout(() => {
            navigate.push('/user/addproduct');
          }, 1500);
        }
      })
      .catch((err) => {
        console.error(err);
        setIsVerifying(false);
        setWrong(false);
        setTimeout(() => {
          setWrong(null);
        }, 2000);
      });
  };

  return (
    <div className="h-lvh flex items-center justify-center bg-bg px-4 relative overflow-hidden">
      <div className="w-full max-w-md bg-card/80 backdrop-blur-xl border border-border/50 p-10 rounded-premium shadow-2xl relative z-10 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primarySoft to-white rounded-premium shadow-inner flex items-center justify-center mx-auto mb-6 border border-primary/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <svg
              className="w-10 h-10 text-primary drop-shadow-sm"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-display font-bold text-text tracking-tight">Security Check</h2>
          <p className="text-muted text-sm mt-3 font-medium">Enter your 4-digit secret UUID key</p>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <input
              type="text"
              name="user_id"
              maxLength={4}
              placeholder="••••"
              onChange={verify}
              className="w-full bg-white/50 border-2 border-border/80 text-text text-center text-4xl tracking-[0.5em] py-5 rounded-saas focus:outline-none focus:ring-4 focus:ring-primarySoft focus:border-primary transition-all font-mono placeholder:tracking-normal placeholder:text-slate-300 shadow-sm"
            />
          </div>

          <button
            onClick={handleClick}
            disabled={isVerifying || loadingText.length !== 4}
            className="btn btn-primary w-full py-4 text-sm font-semibold shadow-premium"
          >
            {isVerifying ? 'Authenticating...' : 'Verify Identity'}
          </button>
        </div>

        {(!loadingText || loadingText.length === 0) && (
          <div className="mt-8 pt-6 border-t border-border/50 text-xs font-medium text-muted flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Find your UUID in your Profile Dashboard
          </div>
        )}
      </div>
    </div>
  );
};

export default Uuidverify;
