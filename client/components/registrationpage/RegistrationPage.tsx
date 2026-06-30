'use client';
import React, { useState } from 'react';
import { useRouter as useNavigate } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Base_URL from '../Constant/constant';

import { GoogleLogin } from '@react-oauth/google';

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [letter, setletter] = useState<any>({});
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const res = await axios.post(
        `${Base_URL}/api/auth/google`,
        {
          token: credentialResponse.credential,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success('Account created securely with Google!');
        sessionStorage.setItem('Role', res.data.userRole);
        sessionStorage.setItem('uuid', res.data.loginId);

        if (res.data.userRole == 1) navigate.push('/admin/new-product');
        else if (res.data.userRole == 2) navigate.push('/user/dashboard');
        else if (res.data.userRole == 3) navigate.push('/volunteer/new-product-list');
      }
    } catch (error) {
      toast.error('Google Registration failed.');
    }
  };

  const letterHandler = (event: any) => {
    const { name, value } = event.target;
    setletter({ ...letter, [name]: value });
  };

  const nextStep = () => {
    if (step === 1) {
      if (!letter.email || !letter.password) {
        toast.error('Please enter a valid email and password.', { position: 'top-center' });
        return;
      }
      let validemail = letter.email.match(/^([a-zA-Z0-9._-]+)@([a-zA-Z]+)\.([a-zA-Z]{2,})$/);
      if (!validemail) {
        toast.error('Please enter a valid email address (e.g., name@organization.com).', {
          position: 'top-center',
        });
        return;
      }
    } else if (step === 2) {
      if (!letter.name || !letter.age || !letter.phone_number) {
        toast.error('Please provide your full name, age, and phone number.', {
          position: 'top-center',
        });
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const createHandler = (event: any) => {
    event.preventDefault();
    setLoading(true);

    axios
      .post(`${Base_URL}/api/register/user`, letter)
      .then((data) => {
        toast.success('Account Created Successfully!', { position: 'top-center' });
        setLoading(false);
        navigate.push('/login');
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        toast.error(err.response?.data?.message || 'Registration failed', {
          position: 'top-center',
        });
      });
  };

  const inputClass =
    'w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primarySoft focus:border-primary transition-all duration-200 shadow-sm';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-medical-50 p-4 py-12">
      <Toaster />
      <div className="w-full max-w-2xl bg-white/70 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-glass border border-slate-100 relative overflow-hidden animate-fade-in-up">
        {/* Decorative background circle */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

        <div className="text-center mb-6 relative z-10">
          <img src="/logo.png" alt="Med.Equip Logo" className="h-14 mx-auto mb-6 object-contain" />
          <h1 className="text-3xl font-display font-bold text-slate-800 mb-2">
            Create your MediQuip Account
          </h1>
          <p className="text-slate-500 mb-6">
            Create an account to start donating or requesting medical equipment.
          </p>

          {/* Google OAuth Register Button */}
          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error('Google Sign-In failed')}
              useOneTap
            />
          </div>
          <div className="relative flex py-2 items-center mb-4">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">Or sign up with email</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex justify-center items-center mb-10 relative z-10 max-w-md mx-auto">
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${step >= 1 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'} transition-colors duration-300`}
          >
            1
          </div>
          <div
            className={`flex-1 h-1 mx-2 rounded ${step >= 2 ? 'bg-primary' : 'bg-slate-200'} transition-colors duration-300`}
          ></div>
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${step >= 2 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'} transition-colors duration-300`}
          >
            2
          </div>
          <div
            className={`flex-1 h-1 mx-2 rounded ${step >= 3 ? 'bg-primary' : 'bg-slate-200'} transition-colors duration-300`}
          ></div>
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${step >= 3 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'} transition-colors duration-300`}
          >
            3
          </div>
        </div>

        <div className="relative z-10 max-w-md mx-auto">
          {step === 1 && (
            <div className="space-y-5 animate-fade-in-right">
              <h3 className="text-xl font-bold text-slate-700 mb-4">Account Details</h3>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={letter.email || ''}
                  onChange={letterHandler}
                  placeholder="name@example.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={letter.password || ''}
                  onChange={letterHandler}
                  placeholder="Create a strong password"
                  className={inputClass}
                />
              </div>
              <button
                onClick={nextStep}
                className="btn btn-primary w-full mt-6 py-3 px-4 shadow-premium"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fade-in-right">
              <h3 className="text-xl font-bold text-slate-700 mb-4">Personal Information</h3>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={letter.name || ''}
                  onChange={letterHandler}
                  placeholder="e.g., John Doe"
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={letter.age || ''}
                    onChange={letterHandler}
                    placeholder="Age"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={letter.phone_number || ''}
                    onChange={letterHandler}
                    placeholder="(555) 123-4567"
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={prevStep}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="btn btn-primary w-2/3 py-3 px-4 shadow-premium"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 text-center animate-fade-in-right">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-emerald-600"
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
              <h3 className="text-xl font-bold text-slate-700">Ready to join?</h3>
              <p className="text-slate-500">
                By creating an account, you agree to our Terms of Service and Privacy Policy.
              </p>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={prevStep}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={createHandler}
                  disabled={loading}
                  className="w-2/3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-slate-600 text-sm">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-bold text-primary hover:text-primaryDark transition-colors"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
