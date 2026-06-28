import api from './api';

export const productService = {
  getDemoProducts: async () => {
    const response = await api.get('/api/user/demo-view');
    return response.data;
  },
  
  getProducts: async (token) => {
    const response = await api.get('/api/user/view', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  
  addToCart: async (token, item) => {
    const response = await api.post('/api/user/addtocart', item, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  addToWishlist: async (token, id) => {
    const response = await api.put(`/api/user/wishlist/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  removeFromWishlist: async (token, id) => {
    const response = await api.put(`/api/user/wishlist-remove/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getDonatedProducts: async (token) => {
    const response = await api.get('/api/user/donated-products', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/api/user/delete/${id}`);
    return response.data;
  }
};
