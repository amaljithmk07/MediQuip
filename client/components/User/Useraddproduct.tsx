"use client";
import React, { useState } from "react";

import axios from "axios";
import { useRouter as useNavigate } from 'next/navigation';
import Link from 'next/link';
import { ImagePlus, CheckCircle, ShieldAlert } from 'lucide-react';


import Base_URL from "../Constant/constant";
// import Usernavbar from "../UserNavbar/Usernavbar";

const Useraddproduct = () => {
  const token = (typeof window !== 'undefined' ? sessionStorage.getItem("Token") : null);
  const uuid = (typeof window !== 'undefined' ? sessionStorage.getItem("uuid") : null);
  const role = (typeof window !== 'undefined' ? sessionStorage.getItem("Role") : null);
  console.log(uuid);
  const [products, setProducts] = useState({});
  const navigate = useNavigate();


  //Input handler
  const keyHandler = (event) => {
    const { name, value } = event.target;
    setProducts({ ...products, [name]: value });
  };

  //photo upload

  const handlePhoto = (e) => {
    const { name } = e.target;
    setProducts({ ...products, [name]: e.target.files[0] });
    console.log(e.target.files[0].name);
  };
  console.log(products.image);

  //Products adding section

  const productSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("image", products.image);
    formData.append("name", products.name);
    formData.append("description", products.description);
    formData.append("available_qty", products.available_qty);
    formData.append("category", products.category);
    formData.append("sub_category", products.sub_category);
    formData.append("email", products.email);
    formData.append("purchased_date", products.purchased_date);
    formData.append("phone_number", products.phone_number);
    formData.append("address", products.address);
    formData.append("pin_code", products.pin_code);

    try {
      axios
        // .post(`http://localhost:2222/api/user/add`, formData, {
        .post(`${Base_URL}/api/user/add`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((data) => {
          console.log(data);
          // window.location.reload()
          navigate.push("/user/viewproduct");
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {(uuid !== null || role == "1") && token !== null ? (
        <div className="useraddproduct-main-body">
          {/* <Usernavbar/> */}
          <div className="user-addproduct-body">
            <div className="user-addproduct-sub-body">
              DONATE MEDICAL EQUIPMENT
              <div className="user-addproduct-content">
                <form
                  action=""
                  className="userforminput-field"
                  onSubmit={productSubmit}
                  encType="multipart/formdata"
                >
                  <div className="usercontent-left">
                    <div className="userimage-sec">
                      <input
                        type="file"
                        id="file-upload"
                        name="image"
                        onChange={handlePhoto}
                        hidden
                      />
                      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-8 bg-slate-50 hover:bg-slate-100 transition-colors w-full h-48">
                        <ImagePlus className="w-12 h-12 text-slate-400 mb-4" />
                        <span className="text-sm text-slate-500 font-medium">Click to upload equipment image</span>
                      </label>
                      {products.image ? (
                        <div className="flex items-center gap-2 mt-4 text-sm font-medium text-text bg-white p-3 rounded-lg border border-border shadow-sm">
                          <CheckCircle className="w-5 h-5 text-success" />
                          <span className="truncate">{products.image.name}</span>
                        </div>
                      ) : (
                        <div className="mt-4 text-sm text-muted text-center">No image selected</div>
                      )}
                    </div>
                  </div>
                  <div className="usercontent-right">
                    <div className="userinput-field">
                      <input
                        type="text"
                        placeholder="Equipment Name *"
                        name="name"
                        className="user-product-input"
                        onChange={keyHandler}
                      />
                      <select
                        onChange={keyHandler}
                        // id=""
                        className="user-product-input-dropdown"
                        name="available_qty"
                        placeholder="Category"
                      >
                        <option disabled={true} value="" selected>
                          Available Quantity
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
                        className="user-product-input"
                        onChange={keyHandler}
                      />
                      <select
                        onChange={keyHandler}
                        className="user-product-input-dropdown"
                        name="category"
                        placeholder="Category"

                        // defaultChecked="Category"
                      >
                        {/* <option value="" selected>Category</option> */}
                        <option disabled={true} value="" selected>
                          Category
                        </option>

                        <option value="Beds"> Beds</option>
                        <option value="Wheel chair"> Wheel chair</option>
                        <option value="Oxygen Concentrators">
                          Oxygen Concentrators
                        </option>
                        <option value="Walking Aids"> Walking Aids</option>
                        <option value="Patient Lift"> Patient Lift</option>
                      </select>
                      <select
                        onChange={keyHandler}
                        className="user-product-input-dropdown"
                        name="sub_category"
                      >
                        <option disabled={true} value="" selected>
                          Sub Category
                        </option>
                        {products.category == "Beds" ? (
                          <>
                            <option value="Adjustable Beds">
                              Adjustable Beds
                            </option>
                            <option value="Mattresses"> Mattresses</option>
                            <option value="Home Care Beds">
                              {" "}
                              Home Care Beds
                            </option>
                          </>
                        ) : (
                          ""
                        )}
                        {products.category == "Wheel chair" ? (
                          <>
                            <option value="Manual Wheel chair">
                              Manual Wheel chair
                            </option>
                            <option value="Power Wheel chair">
                              {" "}
                              Power Wheel chair
                            </option>
                            <option value="Standard"> Standard</option>
                            <option value="Light Weight">Light Weight</option>
                            <option value="Cushions And Accessories">
                              {" "}
                              Cushions And Accessories
                            </option>
                            <option value="Batteries And Chargers">
                              {" "}
                              Batteries And Chargers
                            </option>
                            <option value="Wheels"> Wheels</option>
                          </>
                        ) : (
                          ""
                        )}
                        {products.category == "Oxygen Concentrators" ? (
                          <>
                            <option value="Stationary Units">
                              {" "}
                              Stationary Units
                            </option>
                            <option value="Portable Units">
                              {" "}
                              Portable Units
                            </option>
                          </>
                        ) : (
                          ""
                        )}

                        {products.category == "Walking Aids" ? (
                          <>
                            <option value="Walkers"> Walkers</option>
                            <option value="Rollator"> Rollator</option>
                            <option value="Knee Roller"> Knee Roller</option>
                            <option value="Upright Walker">
                              {" "}
                              Upright Walker
                            </option>
                          </>
                        ) : (
                          ""
                        )}
                        {products.category == "Patient Lift" ? (
                          <>
                            <option value="Manual Lift"> Manual Lift</option>
                            <option value="Power Lift"> Power Lift</option>
                            <option value="Stand-up Lift">
                              {" "}
                              Stand-up Lift
                            </option>
                            <option value="Heavy Duty Lift">
                              {" "}
                              Heavy Duty Lift
                            </option>
                          </>
                        ) : (
                          ""
                        )}
                      </select>
                      <input
                        type="text"
                        placeholder="Email Address *"
                        className="user-product-input"
                        name="email"
                        onChange={keyHandler}
                      />
                      <input
                        type="date"
                        placeholder="Purchase date"
                        name="purchased_date"
                        className="user-product-input"
                        onChange={keyHandler}
                      />
                      <input
                        type="number"
                        placeholder="Phone Number"
                        className="user-product-input"
                        name="phone_number"
                        onChange={keyHandler}
                      />
                      <input
                        type="text"
                        placeholder="Address"
                        className="user-product-input"
                        name="address"
                        onChange={keyHandler}
                      />

                      <input
                        type="number"
                        placeholder="Pin code"
                        className="user-product-input"
                        name="pin_code"
                        onChange={keyHandler}
                      />
                      <input
                        type="submit"
                        value={"LIST FOR DONATION"}
                        className="user-product-submit"
                        // onClick={productSubmit}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {token == null ? (
            <div className="min-h-[60vh] flex items-center justify-center p-4">
              <Link href={"/login"} className="flex flex-col items-center justify-center p-12 bg-white rounded-[24px] border border-border shadow-sm hover:shadow-md transition-shadow group max-w-md w-full text-center">
                <ShieldAlert className="w-16 h-16 text-warning mb-6 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-bold text-text mb-3 tracking-tight">Authentication Required</h3>
                <p className="text-muted text-sm font-medium">Please log in to your account to list equipment in the inventory system.</p>
              </Link>
            </div>
          ) : (
            <>
              {uuid == null ? (
                <div className="min-h-[60vh] flex items-center justify-center p-4">
                  <Link href={"/uuidverify"} className="flex flex-col items-center justify-center p-12 bg-white rounded-[24px] border border-border shadow-sm hover:shadow-md transition-shadow group max-w-md w-full text-center">
                    <ShieldAlert className="w-16 h-16 text-warning mb-6 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-2xl font-bold text-text mb-3 tracking-tight">Security Check Required</h3>
                    <p className="text-muted text-sm font-medium">Please verify your UUID key before accessing the equipment inventory.</p>
                  </Link>
                </div>
              ) : (
                <></>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default Useraddproduct;
