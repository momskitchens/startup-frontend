import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoadingOverlay } from "./LoadingSpinner";

export default function Protected({
  children,
  authentication = true
}) {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const userAuthStatus = useSelector(state => state.userAuth.status);
  const momAuthStatus = useSelector(state => state.momAuth.status);

  useEffect(() => {
    // Block mom-authenticated users from accessing user routes
    if (momAuthStatus) {
      navigate('/mom/home');
      setLoader(false);
      return;
    }

    // Handle user authentication logic
    if (authentication && !userAuthStatus) {
      // User needs to be logged in but isn't
      navigate("/login");
    } else if (!authentication && userAuthStatus) {
      // User shouldn't be logged in but is
      navigate("/user/home");
    }
    
    setLoader(false);
  }, [navigate, userAuthStatus, momAuthStatus, authentication]);

  return loader ? <LoadingOverlay text="Loading..." /> : <>{children}</>;
}