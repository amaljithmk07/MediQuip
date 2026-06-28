"use client";
import { useEffect } from "react";
import { useRouter as useNavigate } from "next/navigation";

export default function RootRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem("Token") : null;
    const role = typeof window !== 'undefined' ? sessionStorage.getItem("Role") : null;

    if (!token || !role) {
      navigate.push("/login");
    } else {
      // Redirect based on role if needed, or default to a common dashboard page
      if (role === "1") {
        navigate.push("/admin/new-product");
      } else if (role === "2") {
        navigate.push("/user/dashboard");
      } else if (role === "3") {
        navigate.push("/volunteer/new-product-list");
      } else {
        navigate.push("/profile");
      }
    }
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center bg-base-surface">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}
