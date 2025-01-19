import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(ShopContext);

  // Check if the token starts with "admin_"
  if (!token || !token.startsWith("admin_")) {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default ProtectedRoute;