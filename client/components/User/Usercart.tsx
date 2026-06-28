"use client";
import React, { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter as useNavigate } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from "react-redux";
import {
  cartView,
  cartdelete,
  decrementqty,
  incrementqty,
} from "../../redux/reducer/CartSlice";

const Usercart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch() as any;
  
  const token = typeof window !== 'undefined' ? sessionStorage.getItem("Token") : null;
  const login_id = typeof window !== 'undefined' ? sessionStorage.getItem("LoginId") : null;

  const cartitems = useSelector((state: any) => state.content.cartitems);

  useEffect(() => {
    dispatch(cartView());
  }, [dispatch]);

  const isEmpty = !cartitems || cartitems.length === 0 || cartitems[0] == null;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-display font-bold text-slate-800">Your Equipment Cart</h1>
          {!isEmpty && (
            <span className="text-sm font-medium text-slate-500 bg-white px-4 py-1.5 rounded-full shadow-sm border border-slate-200">
              {cartitems.length} {cartitems.length === 1 ? 'Item' : 'Items'}
            </span>
          )}
        </div>

        {isEmpty ? (
          <div className="bg-white rounded-3xl shadow-soft border border-slate-100 p-16 flex flex-col items-center justify-center text-center animate-fade-in-up">
            <img
              src="https://res.cloudinary.com/dqc2xhnac/image/upload/v1708583149/Med-equip/yipwefyjgikkea58zb6w.png"
              alt="Empty Cart"
              className="w-48 h-48 object-contain mb-8 opacity-70"
            />
            <h2 className="text-2xl font-bold text-slate-700 mb-4">Your cart is empty</h2>
            <p className="text-slate-500 mb-8 max-w-md">Looks like you haven't added any medical equipment to your cart yet. Browse our available products to get started.</p>
            <Link href="/" className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5">
              Browse Equipment
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start animate-fade-in-up">
            
            {/* Left Column: Cart Table */}
            <div className="w-full lg:w-2/3 bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="py-4 px-6 font-semibold text-slate-600 text-sm uppercase tracking-wider">Product</th>
                      <th className="py-4 px-6 font-semibold text-slate-600 text-sm uppercase tracking-wider text-center">Status</th>
                      <th className="py-4 px-6 font-semibold text-slate-600 text-sm uppercase tracking-wider text-center">Quantity</th>
                      <th className="py-4 px-6 font-semibold text-slate-600 text-sm uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {cartitems.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                        
                        {/* Product Info */}
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-16 bg-slate-50 rounded-xl border border-slate-100 p-2 flex-shrink-0">
                              <img src={item.image} alt={item.name} className="h-full w-full object-contain mix-blend-multiply" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 line-clamp-1 group-hover:text-teal-600 transition-colors">{item.name}</div>
                              <div className="text-xs text-slate-500 mt-1">{item.category} &bull; {item.sub_category}</div>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-5 px-6 text-center align-middle">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            Available: {item.available_qty}
                          </span>
                        </td>

                        {/* Quantity Selector */}
                        <td className="py-5 px-6 text-center align-middle">
                          <div className="inline-flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1">
                            <button
                              onClick={(e) => { e.preventDefault(); dispatch(decrementqty(item._id, item)); }}
                              className="w-8 h-8 rounded-md flex items-center justify-center text-slate-500 hover:bg-white hover:text-teal-600 hover:shadow-sm transition-all"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                            </button>
                            <span className="w-8 text-center font-semibold text-slate-700">{item.cart_qty}</span>
                            <button
                              onClick={(e) => { e.preventDefault(); dispatch(incrementqty(item._id, item)); }}
                              className="w-8 h-8 rounded-md flex items-center justify-center text-slate-500 hover:bg-white hover:text-teal-600 hover:shadow-sm transition-all"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                            </button>
                          </div>
                        </td>

                        {/* Action */}
                        <td className="py-5 px-6 text-right align-middle">
                          <button
                            onClick={() => dispatch(cartdelete(item._id))}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center justify-center"
                            title="Remove item"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                        
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Sticky Summary */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-3xl shadow-glass border border-slate-100 p-8 sticky top-24">
                <h3 className="text-xl font-bold text-slate-800 mb-6 font-display">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-slate-600">
                    <span>Total Items</span>
                    <span className="font-semibold text-slate-800">{cartitems.length}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Estimated Delivery</span>
                    <span className="font-semibold text-slate-800">2-4 Business Days</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Status</span>
                    <span className="text-emerald-600 font-medium">Ready for request</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6 mb-8">
                  <div className="bg-teal-50 rounded-xl p-4 flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs text-teal-800 leading-relaxed">
                      By proceeding, you agree that you are requesting these medical items for legitimate use.
                    </p>
                  </div>
                </div>

                <Link href="/user/order-place" className="block w-full text-center bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-4 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5">
                  Proceed to Checkout
                </Link>
                
                <div className="mt-4 text-center">
                  <Link href="/" className="text-sm font-medium text-slate-500 hover:text-teal-600 transition-colors">
                    Continue Browsing
                  </Link>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Usercart;
