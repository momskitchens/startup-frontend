import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoadingOverlay } from "./LoadingSpinner";

export default function MomProtected({
  children,
  authentication = true
}) {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const userAuthStatus = useSelector(state => state.userAuth.status);
  const momAuthStatus = useSelector(state => state.momAuth.status);

  useEffect(() => {
    // Block user-authenticated users from accessing mom routes
    if (userAuthStatus) {
      navigate('/user/home');
      setLoader(false);
      return;
    }

    // Handle mom authentication logic
    if (authentication && !momAuthStatus) {
      // Mom needs to be logged in but isn't
      navigate("/mom/login");
    } else if (!authentication && momAuthStatus) {
      // Mom shouldn't be logged in but is
      navigate("/mom/home");
    }
    
    setLoader(false);
  }, [navigate, userAuthStatus, momAuthStatus, authentication]);

  return loader ? <LoadingOverlay text="Loading..." /> : <>{children}</>;
}