'use client';
import toast from 'react-hot-toast';
import React, { useState } from 'react';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '../../features/auth/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Mail, Lock, HeartPulse, Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Base_URL from '../Constant/constant';
import { useRouter as useNavigate } from 'next/navigation';
function LoginPage() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading } = useAuth();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    if (!credentials.email || !credentials.password) {
      toast.error('Please enter a valid email and password.', { position: 'top-center' });
      return;
    }
    await login(credentials);
  };

  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const res = await axios.post(
        `${Base_URL}/api/auth/google`,
        {
          token: credentialResponse.credential,
        },
        { withCredentials: true }
      ); // Important for cookies!

      if (res.data.success) {
        toast.success('Successfully logged in with Google!');
        sessionStorage.setItem('Role', res.data.userRole);
        sessionStorage.setItem('uuid', res.data.loginId);

        // Redirect based on role
        if (res.data.userRole == 1) {
          navigate.push('/admin/new-product');
        } else if (res.data.userRole == 2) {
          navigate.push('/user/dashboard');
        } else if (res.data.userRole == 3) {
          navigate.push('/volunteer/new-product-list');
        }
      }
    } catch (error) {
      toast.error('Google login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-slate-50">
      <Toaster />

      {/* Left Panel: Brand & Trust Indicators (Minimal Flat Design) */}
      <div className="hidden lg:flex flex-col w-1/2 bg-slate-900 justify-center items-center p-12 text-center relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center">
          <img
            src="/logo.png"
            alt="Med.Equip"
            className="mb-10 h-20 object-contain brightness-0 invert opacity-90"
          />

          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
            Access trusted medical <br /> equipment network
          </h1>
          <p className="text-slate-400 text-lg max-w-md mb-12">
            Join the platform connecting donors, volunteers, and those in need of reliable medical
            equipment.
          </p>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 relative bg-slate-50">
        <div className="lg:hidden mb-8 flex flex-col items-center">
          <img src="/logo.png" alt="Med.Equip" className="mb-4 h-14 object-contain" />
        </div>

        <Card className="w-full max-w-md animate-fade-in border-slate-200">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-display">Sign in to MediQuip</CardTitle>
            <CardDescription>
              Access your dashboard to manage medical equipment requests and donations.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Google OAuth Login Button */}
            <div className="flex justify-center mb-6">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('Google Sign-In failed')}
                useOneTap
              />
            </div>

            <div className="relative flex py-2 items-center mb-6">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">
                Or continue with email
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              {/* Email Input */}
              <div className="relative group">
                <div className="absolute z-100 inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Mail size={18} className='text-slate-400'/>
                </div>
                <Input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  className="pl-10"
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 z-6 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock size={18} className='text-slate-400'/>
                </div>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="pl-10 pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              <div className="flex justify-end">
                <Link
                  href="#"
                  className="text-sm font-medium text-slate-500 hover:text-primary transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full h-12 text-base mt-2"
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center border-t border-slate-100 pt-6">
            <p className="text-slate-600 text-sm">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="font-semibold text-primary hover:text-primaryDark transition-colors"
              >
                Create Account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default LoginPage;
