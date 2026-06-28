'use client';
import React, { useState, useEffect } from 'react';
import { useRouter as useNavigate } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { Search, ShoppingCart, Heart, ShieldCheck, HeartPulse, Package } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import Loader from '../loader/Loader';
import { productService } from '../../services/product.service';

const Viewproduct = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [product, setProduct] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const token = typeof window !== 'undefined' ? sessionStorage.getItem('Token') : null;
  const role = typeof window !== 'undefined' ? sessionStorage.getItem('Role') : null;

  useEffect(() => {
    fetchProducts();
  }, [role, token]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productService.getProducts(token);
      let list = data.data || [];
      if (role == '2') {
        list = list.filter((p) => p.product_status === 'Approved');
      }
      setAllProducts(list);
      setProduct(list);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        toast.error('Session Time Out');
        setTimeout(() => {
          sessionStorage.clear();
          navigate.push('/login');
        }, 3000);
      } else {
        toast.error('Failed to load equipment catalog');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const cartHandler = async (item) => {
    try {
      await productService.addToCart(token, item);
      toast.success('Request initiated successfully!');
      // Optionally sync cart via Redux here if required
    } catch (err) {
      console.error(err);
      toast.error('Failed to initiate request');
    }
  };

  const searchSubmit = () => {
    if (!search.trim()) {
      setProduct(allProducts);
      return;
    }
    const filtered = allProducts.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    setProduct(filtered);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchSubmit();
    }
  };

  const savedItemHandler = async (id, wishlistStatus) => {
    try {
      if (!wishlistStatus) {
        await productService.addToWishlist(token, id);
        updateWishlistLocal(id, 'approved');
        toast.success('Saved to wishlist');
      } else {
        await productService.removeFromWishlist(token, id);
        updateWishlistLocal(id, '');
        toast.success('Removed from wishlist');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update wishlist');
    }
  };

  const updateWishlistLocal = (id, status) => {
    const updated = allProducts.map((p) => (p._id === id ? { ...p, wishlist: status } : p));
    setAllProducts(updated);
    setProduct(updated.filter((p) => product.some((cp) => cp._id === p._id)));
  };

  return (
    <div className="w-full bg-base-surface min-h-screen pb-16 pt-8">
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-base-text font-sans">Equipment Catalog</h1>
            <p className="text-base-muted mt-1 text-sm">
              Browse and request available medical equipment.
            </p>
          </div>
          <div className="flex gap-2 max-w-md w-full">
            <Input
              type="text"
              placeholder="Search equipment by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              className="bg-white"
            />
            <Button onClick={searchSubmit} variant="primary" className="px-5">
              <Search size={18} />
            </Button>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <Loader load={isLoading} />
          </div>
        ) : product.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {product.map((item) => (
              <Card key={item._id} className="flex flex-col overflow-hidden group">
                <div className="h-56 bg-white border-b border-base-border relative p-4 flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <Badge variant={item.available_qty > 0 ? 'success' : 'danger'}>
                      {item.available_qty} In Stock
                    </Badge>
                  </div>
                  <button
                    onClick={() => savedItemHandler(item._id, item.wishlist)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-sm border border-base-border hover:bg-slate-50 transition-colors"
                  >
                    <Heart
                      size={18}
                      className={item.wishlist ? 'fill-danger text-danger' : 'text-base-muted'}
                    />
                  </button>
                </div>

                <div className="p-5 flex flex-col flex-grow bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      {item.category}
                    </span>
                    <Badge variant="default" className="text-[10px]">
                      {item.sub_category}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-base-text mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm text-base-muted line-clamp-2 mt-auto pb-4">
                    {item.description}
                  </p>

                  {role == '2' && (
                    <Button
                      className="w-full gap-2 mt-auto"
                      onClick={() => cartHandler(item)}
                      disabled={item.available_qty === 0}
                    >
                      <ShoppingCart size={16} />
                      {item.available_qty === 0 ? 'Out of Stock' : 'Request Equipment'}
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-base-border shadow-sm">
            <Package size={48} className="text-base-muted mb-4" />
            <h3 className="text-lg font-bold text-base-text mb-1">No equipment found</h3>
            <p className="text-base-muted text-sm">
              Try adjusting your search terms or check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Viewproduct;
