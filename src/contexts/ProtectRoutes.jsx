import { useEffect } from "react";
import { useAuth } from "./FakeAuthContext";
import { useNavigate } from "react-router-dom";

function ProtectRoutes({ children }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (!isAuthenticated) navigate("/");
    },
    [isAuthenticated, navigate]
  );

  return isAuthenticated && children;
}

export default ProtectRoutes;
