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
    <div className="w-full bg-base-surface min-h-screen py-12">
      <Toaster />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-base-text font-sans">My Profile</h1>
          <p className="text-base-muted mt-2 text-sm">
            Manage your personal information and account details.
          </p>
        </div>

        <Card className="overflow-hidden">
          <div className="bg-white p-8">
            <div className="flex flex-col items-center mb-8 pb-8 border-b border-base-border">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-slate-50 shadow-sm">
                <img
                  src={
                    profile.image ||
                    'https://res.cloudinary.com/dqc2xhnac/image/upload/v1708583159/Med-equip/p3sq9ishi7myfxij6wxy.png'
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-bold text-base-text">{profile.name}</h2>
              <span className="text-sm font-medium text-primary mt-1 uppercase tracking-wider">
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
                    disabled
                    className="bg-slate-50 border-transparent text-slate-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-base-muted uppercase tracking-wider flex items-center gap-1.5">
                    <Mail size={14} /> Email Address
                  </label>
                  <Input
                    type="text"
                    value={profile.email || ''}
                    disabled
                    className="bg-slate-50 border-transparent text-slate-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-base-muted uppercase tracking-wider flex items-center gap-1.5">
                    <Phone size={14} /> Phone Number
                  </label>
                  <Input
                    type="text"
                    value={profile.phone_number || ''}
                    disabled
                    className="bg-slate-50 border-transparent text-slate-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-base-muted uppercase tracking-wider flex items-center gap-1.5">
                    <Clock size={14} /> Age
                  </label>
                  <Input
                    type="text"
                    value={profile.age || ''}
                    disabled
                    className="bg-slate-50 border-transparent text-slate-700"
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
                      disabled
                      className="bg-slate-50 border-transparent text-slate-700"
                    />
                  </div>
                )}
              </div>

              <div className="pt-8 flex justify-center">
                <Button size="lg" className="px-12" onClick={handleNavigateUpdate}>
                  Update Profile
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profilehome;
