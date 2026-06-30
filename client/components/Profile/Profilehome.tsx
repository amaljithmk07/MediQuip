'use client';
import React, { useEffect, useState } from 'react';
import { useRouter as useNavigate } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { userService } from '../../services/user.service';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { User, Phone, Mail, Award, Clock } from 'lucide-react';
import Loader from '../loader/Loader';

const Profilehome = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const token = typeof window !== 'undefined' ? sessionStorage.getItem('Token') : null;
  const role = typeof window !== 'undefined' ? sessionStorage.getItem('Role') : null;

  useEffect(() => {
    fetchProfile();
  }, [role, token]);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      let data;
      if (role == '3') {
        data = await userService.getVolunteerProfile(token);
      } else {
        data = await userService.getUserProfile(token);
      }
      setProfile(data.data[0]);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        toast.error('Session Time Out');
        setTimeout(() => {
          sessionStorage.clear();
          navigate.push('/login');
        }, 2000);
      } else {
        toast.error('Failed to load profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateUpdate = () => {
    if (role == '2') {
      navigate.push('/userprofileupdate');
    } else {
      navigate.push('/volunteerprofileupdate');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader load={isLoading} />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="w-full min-h-screen py-12 animate-fade-in">
      <Toaster />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center animate-fade-in-up">
          <h1 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primaryDark to-primary">My Profile</h1>
          <p className="text-muted mt-3 text-base">
            Manage your personal information and account details.
          </p>
        </div>

        <div className="card max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {/* Premium Hero Banner */}
          <div className="h-40 bg-primary-gradient relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl mix-blend-overlay"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          </div>
          
          <div className="px-8 pb-10 relative">
            {/* Avatar Section */}
            <div className="flex flex-col items-center -mt-20 mb-8 pb-8 border-b border-border/50">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-white shadow-premium relative bg-white">
                <img
                  src={
                    profile.image ||
                    'https://res.cloudinary.com/dqc2xhnac/image/upload/v1708583159/Med-equip/p3sq9ishi7myfxij6wxy.png'
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-display font-bold text-text">{profile.name}</h2>
              <span className="inline-block mt-2 px-4 py-1.5 rounded-full bg-primarySoft text-primaryDark text-xs font-bold uppercase tracking-widest shadow-sm">
                {role == '3' ? 'Volunteer Account' : 'User Account'}
              </span>
            </div>

            <div className="space-y-6 max-w-lg mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-base-muted uppercase tracking-wider flex items-center gap-1.5">
                    <User size={14} /> Full Name
                  </label>
                  <Input
                    type="text"
                    value={profile.name || ''}
                    readOnly
                    className="bg-slate-50 border-transparent text-slate-800 cursor-default"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-base-muted uppercase tracking-wider flex items-center gap-1.5">
                    <Mail size={14} /> Email Address
                  </label>
                  <Input
                    type="text"
                    value={profile.email || ''}
                    readOnly
                    className="bg-slate-50 border-transparent text-slate-800 cursor-default"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-base-muted uppercase tracking-wider flex items-center gap-1.5">
                    <Phone size={14} /> Phone Number
                  </label>
                  <Input
                    type="text"
                    value={profile.phone_number || ''}
                    readOnly
                    className="bg-slate-50 border-transparent text-slate-800 cursor-default"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-base-muted uppercase tracking-wider flex items-center gap-1.5">
                    <Clock size={14} /> Age
                  </label>
                  <Input
                    type="text"
                    value={profile.age || ''}
                    readOnly
                    className="bg-slate-50 border-transparent text-slate-800 cursor-default"
                  />
                </div>

                {role == '3' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-base-muted uppercase tracking-wider flex items-center gap-1.5">
                        <Award size={14} /> Qualification
                      </label>
                      <Input
                        type="text"
                        value={profile.qualification || ''}
                        disabled
                        className="bg-slate-50 border-transparent text-slate-700"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-base-muted uppercase tracking-wider flex items-center gap-1.5">
                        <User size={14} /> Status
                      </label>
                      <Input
                        type="text"
                        value={profile.status || ''}
                        disabled
                        className="bg-slate-50 border-transparent text-slate-700"
                      />
                    </div>
                  </>
                )}

                {role == '2' && profile.user_id && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-base-muted uppercase tracking-wider flex items-center gap-1.5">
                      <User size={14} /> User ID
                    </label>
                    <Input
                      type="text"
                      value={profile.user_id || ''}
                      readOnly
                      className="bg-slate-50 border-transparent text-slate-800 cursor-default"
                    />
                  </div>
                )}
              </div>

              <div className="pt-8 flex justify-center">
                <Button size="lg" className="px-12 bg-primary-gradient border-none hover:shadow-glow" onClick={handleNavigateUpdate}>
                  Update Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profilehome;
