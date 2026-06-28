import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },
  
  registerUser: async (userData) => {
    const response = await api.post('/api/user/registration', userData);
    return response.data;
  },

  registerVolunteer: async (volunteerData) => {
    const response = await api.post('/api/volunteer/registration', volunteerData);
    return response.data;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('Token');
      sessionStorage.removeItem('Role');
      sessionStorage.removeItem('LoginId');
      sessionStorage.removeItem('uuid');
    }
  }
};
