'use client';
import React, { useEffect, useState } from 'react';

import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useRouter as useNavigate } from 'next/navigation';

import Base_URL from '../Constant/constant';
// import { useRouter as useNavigate } from 'next/navigation';
import Link from 'next/link';

// import { Toast, ToastContainer } from "react-toastify/dist/components";

const Volunteerlist = () => {
  const navigate = useNavigate();
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('Token') : null;
  const [volunteerlist, SetVolunteerlist] = useState([]);
  useEffect(() => {
    axios
      // .get(`http://localhost:2222/api/volunteer/volunteerlist`, {
      .get(`${Base_URL}/api/volunteer/volunteerlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((data) => {
        console.log(data.data.data);
        SetVolunteerlist(data.data.data);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status == 401) {
          toast.error('Session Time Out', {
            position: 'top-center',
          });
          setTimeout(() => {
            sessionStorage.clear();
            navigate.push('/login');
          }, 2000);
        }
      });
  }, []);
  console.log(volunteerlist);

  return (
    <div className="w-full  mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Toaster />
      <div className="bg-white rounded-premium shadow-soft border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">VOLUNTEERS LIST</h2>
        {volunteerlist.length !== 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {volunteerlist.map((data) => (
              <div className="card flex flex-col items-center p-6 text-center" key={data._id}>
                <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-slate-50 shadow-sm">
                  {data.image !== '' ? (
                    <img
                      src={data.image}
                      alt={data.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src="https://res.cloudinary.com/dqc2xhnac/image/upload/v1708583164/Med-equip/jss7plr1flat4l5j2qub.png"
                      alt={data.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <h3 className="text-lg font-bold text-slate-800">{data.name}</h3>
                  <div className="inline-flex items-center justify-center">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      {data.status}
                    </span>
                  </div>
                  <h3 className="text-sm text-slate-500 mt-2">Age: {data.age}</h3>
                  <h3 className="text-sm text-slate-500 line-clamp-1">{data.qualification}</h3>
                  <h3 className="text-sm font-medium text-slate-700 mt-2">{data.phone_number}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Volunteerlist;
