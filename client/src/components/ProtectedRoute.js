import React from "react";
import { Navigate } from "react-router-dom";

const ADMIN_EMAIL = "eshitabhawsar@gmail.com";

const ProtectedRoute = ({ user, adminOnly, children }) => {
  if (!user) return <Navigate to="/" />;
  if (adminOnly && user.email !== ADMIN_EMAIL) {
    return <h2>Access Denied: Admins only.</h2>;
  }
  return children;
};

export default ProtectedRoute;