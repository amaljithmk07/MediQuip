'use client';
import React, { useRef } from 'react';

import { useRouter as useNavigate } from 'next/navigation';
import { useParams } from 'next/navigation';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Base_URL from '../Constant/constant';
const Editproduct = () => {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('Token') : null;
  const ref = useRef();
  const { id } = useParams();
  const [products, setProducts] = useState({
    name: '',
    image: '',
    description: '',
    available_qty: '',
    category: '',
    sub_category: '',
    email: '',
    purchased_date: '',
    pin_code: '',
    phone_number: '',
    address: '',
    pin_code: '',
    condition: '',
    transferType: '',
    estimatedValue: '',
    recoveryAmount: '',
  });
  useEffect(() => {
    axios
      // .get(`http://localhost:2222/api/user/viewone/${id}`)
      .get(`${Base_URL}/api/user/viewone/${id}`)
      .then((data) => {
        console.log(data.data.data);
        setProducts(data.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const editHandler = (event) => {
    const { name, value } = event.target;
    setProducts({ ...products, [name]: value });
  };

  const handlePhoto = (e) => {
    const { name } = e.target;
    // console.log(name);
    setProducts({ ...products, [name]: e.target.files[0] });
  };
  // console.log("new:", products);
  const navigate = useNavigate();

  //////////////////////////////////

  const productSubmit = async (id) => {
    const formData = new FormData();
    formData.append('image', products.image);
    formData.append('name', products.name);
    formData.append('description', products.description);
    formData.append('available_qty', products.available_qty);
    formData.append('category', products.category);
    formData.append('sub_category', products.sub_category);
    formData.append('email', products.email);
    formData.append('purchased_date', products.purchased_date);
    formData.append('phone_number', products.phone_number);
    formData.append('address', products.address);
    formData.append('pin_code', products.pin_code);
    formData.append('condition', products.condition || 'Good');
    formData.append('transferType', products.transferType || 'FREE');
    if (products.transferType === 'RECOVERY') {
      formData.append('estimatedValue', products.estimatedValue);
      formData.append('recoveryAmount', products.recoveryAmount);
    }
    try {
      await axios
        // .put(`http://localhost:2222/api/user/edit-product/${id}`, formData, {
        .put(`${Base_URL}/api/user/edit-product/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((data) => {
          navigate.push('/user/viewproduct');
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full  mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-premium shadow-soft border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">UPDATE EQUIPMENT DETAILS</h2>
        <div>
          <form
            action=""
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            // onSubmit={() => productSubmit(products._id)}
            encType="multipart/form-data"
          >
            <div className="flex flex-col gap-4">
              <div className="edit-image-sec">
                <input type="file" id="file-upload" name="image" onChange={handlePhoto} hidden />
                <label htmlFor="file-upload">
                  <img src={products.image} alt="" id="edit-product-add" />
                </label>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Equipment Name *"
                  name="name"
                  value={products.name}
                  className="input mb-4"
                  onChange={editHandler}
                />
                <select
                  onChange={editHandler}
                  // id=""
                  className="input mb-4"
                  name="available_qty"
                  placeholder="Available Qty"
                >
                  <option disabled={true} value="" selected>
                    {products.available_qty}{' '}
                  </option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <input
                  type="text"
                  placeholder="Description (e.g., used for 2 months, excellent condition) *"
                  name="description"
                  value={products.description}
                  className="input mb-4"
                  onChange={editHandler}
                />
                <select
                  onChange={editHandler}
                  className="input mb-4"
                  name="condition"
                  value={products.condition || ''}
                >
                  <option disabled={true} value="">
                    Equipment Condition *
                  </option>
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
                <select
                  onChange={editHandler}
                  className="input mb-4"
                  name="transferType"
                  value={products.transferType || ''}
                >
                  <option disabled={true} value="">
                    Transfer Type *
                  </option>
                  <option value="FREE">Free Transfer (Donation)</option>
                  <option value="RECOVERY">Cost Recovery Transfer</option>
                </select>

                {products.transferType === 'RECOVERY' && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                      type="number"
                      placeholder="Estimated Market Value (₹) *"
                      name="estimatedValue"
                      value={products.estimatedValue || ''}
                      className="input"
                      onChange={editHandler}
                    />
                    <input
                      type="number"
                      placeholder="Recovery Amount (₹) *"
                      name="recoveryAmount"
                      value={products.recoveryAmount || ''}
                      className="input"
                      onChange={editHandler}
                    />
                  </div>
                )}

                <select
                  onChange={editHandler}
                  className="input mb-4"
                  name="category"
                  placeholder="Category"

                  // defaultChecked="Category"
                >
                  {/* <option value="" selected>Category</option> */}
                  <option disabled={true} value="" selected>
                    {products.category}
                  </option>

                  <option value="Beds"> Beds</option>
                  <option value="Wheel chair"> Wheel chair</option>
                  <option value="Oxygen Concentrators">Oxygen Concentrators</option>
                  <option value="Walking Aids"> Walking Aids</option>
                  <option value="Patient Lift"> Patient Lift</option>
                </select>
                <select onChange={editHandler} className="input mb-4" name="sub_category">
                  <option disabled={true} value="" selected>
                    {products.sub_category}{' '}
                  </option>

                  {products.category == 'Beds' ? (
                    <>
                      <option value="Adjustable Beds">Adjustable Beds</option>
                      <option value="Mattresses"> Mattresses</option>
                      <option value="Home Care Beds"> Home Care Beds</option>
                    </>
                  ) : (
                    ''
                  )}
                  {products.category == 'Wheel chair' ? (
                    <>
                      <option value="Manual Wheel chair">Manual Wheel chair</option>
                      <option value="Power Wheel chair"> Power Wheel chair</option>
                      <option value="Standard"> Standard</option>
                      <option value="Light Weight">Light Weight</option>
                      <option value="Cushions And Accessories"> Cushions And Accessories</option>
                      <option value="Batteries And Chargers"> Batteries And Chargers</option>
                      <option value="Wheels"> Wheels</option>
                    </>
                  ) : (
                    ''
                  )}
                  {products.category == 'Oxygen Concentrators' ? (
                    <>
                      <option value="Stationary Units"> Stationary Units</option>
                      <option value="Portable Units"> Portable Units</option>
                    </>
                  ) : (
                    ''
                  )}

                  {products.category == 'Walking Aids' ? (
                    <>
                      <option value="Walkers"> Walkers</option>
                      <option value="Rollator"> Rollator</option>
                      <option value="Knee Roller"> Knee Roller</option>
                      <option value="Upright Walker"> Upright Walker</option>
                    </>
                  ) : (
                    ''
                  )}
                  {products.category == 'Patient Lift' ? (
                    <>
                      <option value="Male"> Manual Lift</option>
                      <option value="Male"> Power Lift</option>
                      <option value="Male"> Stand-up Lift</option>
                      <option value="Male"> Heavy Duty Lift</option>
                    </>
                  ) : (
                    ''
                  )}
                </select>
                <input
                  type="text"
                  placeholder="dd/mm/yyyy"
                  name="purchased_date"
                  ref={ref}
                  className="input mb-4"
                  value={products.purchased_date}
                  onchange={(e) => console.log(e.target.value)}
                  onfocus={() => (ref.current.type = 'date')}
                  onblur={() => (ref.current.type = 'date')}
                  onChange={editHandler}
                />
                {/* <input
                      type="date"
                      label="Date"
                      name="purchased_date"
                      className="input mb-4"
                      value={products.purchased_date}
                      onChange={editHandler}
                    /> */}
                <input
                  type="number"
                  placeholder="Phone Number"
                  className="input mb-4"
                  value={products.phone_number}
                  name="phone_number"
                  onChange={editHandler}
                />
                <input
                  type="text"
                  placeholder="Address"
                  className="input mb-4"
                  value={products.address}
                  name="address"
                  onChange={editHandler}
                />
                <input
                  type="text"
                  placeholder="Email Address *"
                  value={products.email}
                  className="input mb-4"
                  name="email"
                  onChange={editHandler}
                />
                <input
                  type="number"
                  placeholder="Pin code"
                  value={products.pin_code}
                  className="input mb-4"
                  name="pin_code"
                  onChange={editHandler}
                />
                <input
                  type="button"
                  value={'UPDATE EQUIPMENT'}
                  className="btn btn-primary w-full mt-2"
                  onClick={() => productSubmit(products._id)}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Editproduct;
