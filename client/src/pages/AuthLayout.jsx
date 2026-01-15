import React, { useEffect } from "react";
import { FiLoader } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function AuthLayout({ children, authentication = true }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (authentication && !user) {
        navigate("/auth");
      } else if (!authentication && user) {
        navigate("/");
      }
    }
  }, [user, loading, navigate, authentication]);

  return loading ? (
    <div className="flex justify-center items-center h-screen">
      <FiLoader className="animate-spin text-4xl text-emerald-700" />
    </div>
  ) : (
    <>{children}</>
  );
}

export default AuthLayout;
