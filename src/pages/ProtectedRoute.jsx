import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (!isAuthenticated) navigate("/login", { replace: true });
    },
    [isAuthenticated, navigate]
  );
  return isAuthenticated && children;
}

export default ProtectedRoute;
