"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter as useNavigate } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from "react-hot-toast";
import Base_URL from "../Constant/constant";

const NewProductList = () => {
  const navigate = useNavigate();
  const [product, setproduct] = useState([]);
  
  const token = typeof window !== 'undefined' ? sessionStorage.getItem("Token") : null;
  const role = typeof window !== 'undefined' ? sessionStorage.getItem("Role") : null;
  
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
          return datas.product_status == "";
        });
        setproduct(DATA);
      })
      .catch((err) => {
        console.error(err);
        if (err.response?.status == 401) {
          toast.error("Session Time Out", { position: "top-center" });
          setTimeout(() => {
            sessionStorage.clear();
            navigate.push("/login");
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
        toast.success("Product Approved!", { position: "top-center" });
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
        toast.error("Product Rejected!", { position: "top-center" });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="volunteer-pro-approve-main-body">
      <Toaster />
      <div className="volunteer-pro-approve-content-body">
        <div className="volunteer-pro-approve-cards-body">
          <div className="volunteer-pro-approve-cards-heading">
            NEW ARRIVALS{" "}
          </div>

          {product.length > 0 ? (
            <>
              {product.map((item) => (
                <div className="volunteer-pro-approve-card" key={item._id}>
                  <div className="volunteer-pro-approve-card-image-sec">
                    <img
                      src={item.image}
                      alt=""
                      className="volunteer-pro-approve-card-image"
                    />
                  </div>
                  <div className="volunteer-pro-approve-card-details">
                    <h3 className="volunteer-pro-approve-card-details-h3">
                      {item.name}
                    </h3>
                    <h4 className="volunteer-pro-approve-card-details-h4">
                      {item.available_qty}
                    </h4>
                    <h4 className="volunteer-pro-approve-card-details-h4">
                      {item.category}
                    </h4>
                    <h4 className="volunteer-pro-approve-card-details-h4">
                      {item.sub_category}
                    </h4>
                    <h4 className="volunteer-pro-approve-card-details-h4">
                      {item.description}
                    </h4>
                  </div>
                  <div className="volunteer-pro-approve-card-buttons">
                    <button
                      className="volunteer-pro-approve"
                      onClick={() => productApprove(item._id)}
                    >
                      Approve
                    </button>

                    <button className="volunteer-pro-approve-item" onClick={() => productReject(item._id)}>
                      <img
                        src="https://res.cloudinary.com/dqc2xhnac/image/upload/v1708583150/Med-equip/tbypsdgwgnzvnbthgdfd.png"
                        alt=""
                        className="volunteer-pro-approve-logo"
                      />
                    </button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <img
              src="https://res.cloudinary.com/dqc2xhnac/image/upload/v1708583164/Med-equip/zqcstw2436ip6awww37z.png"
              alt=""
              className="user-no-data"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NewProductList;
