'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter as useNavigate } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import Base_URL from '../Constant/constant';

const NewProductList = () => {
  const navigate = useNavigate();
  const [product, setproduct] = useState([]);

  const token = typeof window !== 'undefined' ? sessionStorage.getItem('Token') : null;
  const role = typeof window !== 'undefined' ? sessionStorage.getItem('Role') : null;

  useEffect(() => {
    axios
      .get(`${Base_URL}/api/user/view`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((data) => {
        const responseData = data.data?.data || [];
        const DATA = responseData.filter((datas) => {
          return datas.product_status == '';
        });
        setproduct(DATA);
      })
      .catch((err) => {
        console.error(err);
        if (err.response?.status == 401) {
          toast.error('Session Time Out', { position: 'top-center' });
          setTimeout(() => {
            sessionStorage.clear();
            navigate.push('/login');
          }, 3000);
        }
      });
  }, [token, navigate]);

  const productApprove = (id) => {
    axios
      .get(`${Base_URL}/api/volunteer/product-approve/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((data) => {
        const DATA = product.filter((datas) => datas._id !== id);
        setproduct(DATA);
        toast.success('Product Approved!', { position: 'top-center' });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const productReject = (id) => {
    axios
      .get(`${Base_URL}/api/volunteer/product-reject/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((data) => {
        const DATA = product.filter((datas) => datas._id !== id);
        setproduct(DATA);
        toast.error('Product Rejected!', { position: 'top-center' });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="w-full  mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Toaster />
      <div className="bg-white rounded-premium shadow-soft border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">NEW EQUIPMENT</h2>

        {product.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.map((item) => (
              <div className="card flex flex-col" key={item._id}>
                <div className="h-48 bg-slate-50 flex items-center justify-center p-4 border-b border-border">
                  <img
                    src={item.image}
                    alt=""
                    className="max-h-full max-w-full object-contain mix-blend-multiply"
                  />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-slate-800 mb-1">{item.name}</h3>
                  <div className="text-sm text-slate-500 mb-4">
                    {item.category} &bull; {item.sub_category} <br />
                    Available: {item.available_qty}
                  </div>
                  <p className="text-sm text-slate-600 mb-6 line-clamp-2">{item.description}</p>
                  <div className="mt-auto flex items-center gap-3">
                    <button
                      className="btn btn-primary flex-1"
                      onClick={() => productApprove(item._id)}
                    >
                      Approve
                    </button>
                    <button className="btn btn-danger px-4" onClick={() => productReject(item._id)}>
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <img
              src="https://res.cloudinary.com/dqc2xhnac/image/upload/v1708583164/Med-equip/zqcstw2436ip6awww37z.png"
              alt="No Data"
              className="w-48 h-48 object-contain opacity-50 mb-6"
            />
            <h3 className="text-xl font-semibold text-slate-700">No new equipment to approve</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewProductList;
