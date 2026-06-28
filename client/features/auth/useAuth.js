"use client";
import { useState } from 'react';
import { authService } from '../../services/auth.service';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials, onSuccess) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.login(credentials);
      toast.success("Login Successful", { position: "top-center" });
      
      if (typeof window !== 'undefined') {
        sessionStorage.setItem("Token", data.token);
        sessionStorage.setItem("Role", data.userRole);
        sessionStorage.setItem("LoginId", data.loginId);
        
        if (onSuccess) {
          onSuccess(data);
        } else {
          window.location.href = "/";
        }
      }
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      toast.error(errorMessage, { position: "top-center" });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    window.location.href = "/login";
  };

  return {
    login,
    logout,
    isLoading,
    error
  };
};
