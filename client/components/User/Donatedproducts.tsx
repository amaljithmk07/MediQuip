"use client";
import React, { useState, useEffect } from "react";
import { useRouter as useNavigate } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from "react-hot-toast";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Trash2, Edit3, HeartPulse } from "lucide-react";
import Loader from "../loader/Loader";
import { productService } from "../../services/product.service";

const Donatedproducts = () => {
  const navigate = useNavigate();
  const [donatedProduct, setDonatedProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const token = typeof window !== 'undefined' ? sessionStorage.getItem("Token") : null;

  useEffect(() => {
    fetchDonatedProducts();
  }, []);

  const fetchDonatedProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productService.getDonatedProducts(token);
      setDonatedProduct(data.data || []);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        toast.error("Session Time Out");
        setTimeout(() => {
          sessionStorage.clear();
          navigate.push("/login");
        }, 2000);
      } else {
        toast.error("Failed to load donated products");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    try {
      await productService.deleteProduct(id);
      toast.success("Product deleted successfully");
      // Optionally remove from state instead of reload
      setDonatedProduct(donatedProduct.filter(item => item._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="w-full bg-base-surface min-h-screen py-12">
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-base-text font-sans">My Donated Equipment</h1>
            <p className="text-base-muted mt-2 text-sm">Manage the medical equipment you have listed for donation.</p>
          </div>
          <Link href="/uuidverify">
             <Button variant="primary" className="gap-2">
                <HeartPulse size={16} /> Donate New Equipment
             </Button>
          </Link>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <Loader load={isLoading} />
          </div>
        ) : donatedProduct.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {donatedProduct.map((item) => (
              <Card key={item._id} className="flex flex-col overflow-hidden">
                <div className="h-56 bg-white border-b border-base-border relative p-4 flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <Badge variant={item.available_qty > 0 ? "success" : "danger"}>
                      {item.available_qty} In Stock
                    </Badge>
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-grow bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      {item.category}
                    </span>
                    <Badge variant="default" className="text-[10px]">{item.sub_category}</Badge>
                  </div>
                  <h3 className="text-lg font-bold text-base-text mb-2 line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-base-muted line-clamp-2 mt-auto pb-4">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center gap-3 mt-auto border-t border-base-border pt-4">
                    <Link href={`/user/editproduct/${item._id}`} className="flex-1">
                      <Button variant="secondary" className="w-full gap-2">
                        <Edit3 size={16} /> Edit
                      </Button>
                    </Link>
                    <Button variant="danger" className="px-3" onClick={() => deleteHandler(item._id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-base-border shadow-sm">
            <HeartPulse size={48} className="text-base-muted mb-4" />
            <h3 className="text-lg font-bold text-base-text mb-1">No donations yet</h3>
            <p className="text-base-muted text-sm mb-6">You haven't listed any equipment for donation.</p>
            <Link href="/uuidverify">
               <Button>Get Started</Button>
            </Link>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default Donatedproducts;
