import api from './api';

export const userService = {
  getUserProfile: async (token) => {
    const response = await api.get('/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getVolunteerProfile: async (token) => {
    const response = await api.get('/api/volunteer/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
