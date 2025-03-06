import { useState, useEffect, useCallback } from 'react'
import { Outlet, useLocation, Navigate } from 'react-router-dom'
import { login, logout } from "./store/userAuthSlice.js"
import { login as  loginMom, logout as logoutMom } from "./store/momAuthSlice.js" // New imports for mom auth
import { useDispatch, useSelector } from 'react-redux'
import authService from './Appwrite/authOtp.js'
import { useCookies } from 'react-cookie'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import LoadingSpinner, { LoadingOverlay, LoadingSkeleton } from './components/LoadingSpinner.jsx';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [cookies, setCookie, removeCookie] = useCookies(['AccessToken', 'RefreshToken', 'MomAccessToken', 'MomRefreshToken']);
  const [isLoading, setIsLoading] = useState(true);
  
  // Determine if we're in the mom view based on the URL path
  const isMomView = location.pathname.startsWith('/mom');

  const refreshAccessTokens = useCallback(async (isMom = false) => {
    try {
      const endpoint = isMom 
        ? `${import.meta.env.VITE_BACKEND_API}/moms/refreshing` 
        : `${import.meta.env.VITE_BACKEND_API}/users/refreshing`;
      
      const refreshResponse = await fetch(endpoint, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!refreshResponse.ok) {
        throw new Error('Token refresh failed');
      }

      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      isMom ? await handleMomLogout() : await handleUserLogout();
      return false;
    }
  }, [setCookie]);

  const handleUserLogout = async () => {
    try {
      dispatch(logout());
      await authService.logout();
      removeCookie('AccessToken', { path: '/' });
      removeCookie('RefreshToken', { path: '/' });
    } catch (error) {
      console.error("User logout error:", error);
    }
  };
  const handleMomLogout = async () => {
    try {
      dispatch(logoutMom());
      await authService.logout();
      removeCookie('AccessToken', { path: '/' });
      removeCookie('RefreshToken', { path: '/' });
    } catch (error) {
      console.error("User logout error:", error);
    }
  };

  const loadUserDetails = useCallback(async () => {
    if (isMomView) return; // Skip if in mom view
    
    try {
      const userData = await fetch(`${import.meta.env.VITE_BACKEND_API}/users/user`, {
        method: 'GET',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!userData.ok) {
        // Only attempt refresh if it's an authentication error
        if (userData.status === 401) {
          const refreshSuccessful = await refreshAccessTokens();
          if (!refreshSuccessful) {
            throw new Error('Authentication failed');
          }
          // Retry the original request after refresh
          return loadUserDetails();
        }
        throw new Error('Failed to fetch user data');
      }

      const data = await userData.json();
      if (data) {
        dispatch(login(data));
      } else {
        await handleUserLogout();
      }
    } catch (error) {
      console.error("Error loading user details:", error);
      await handleUserLogout();
    } finally {
      if (!isMomView) {
        setIsLoading(false);
      }
    }
  }, [dispatch, refreshAccessTokens, isMomView]);

  const loadMomDetails = useCallback(async () => {
    if (!isMomView) return; // Skip if not in mom view
    
    try {
      const momData = await fetch(`${import.meta.env.VITE_BACKEND_API}/moms/current-mom`, {
        method: 'GET',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!momData.ok) {
        // Only attempt refresh if it's an authentication error
        if (momData.status === 401) {
          const refreshSuccessful = await refreshAccessTokens(true);
          if (!refreshSuccessful) {
            throw new Error('Mom authentication failed');
          }
          // Retry the original request after refresh
          return loadMomDetails();
        }
        throw new Error('Failed to fetch mom data');
      }

      const data = await momData.json();
      if (data) {
        dispatch(loginMom(data));
      } else {
        await handleMomLogout();
      }
    } catch (error) {
      console.error("Error loading mom details:", error);
      await handleMomLogout();
    } finally {
      if (isMomView) {
        setIsLoading(false);
      }
    }
  }, [dispatch, refreshAccessTokens, isMomView]);

  useEffect(() => {
    setIsLoading(true);
    if (isMomView) {
      loadMomDetails();
    } else {
      loadUserDetails();
    }
  }, [loadUserDetails, loadMomDetails, isMomView]);

  if (isLoading) {
    return <LoadingOverlay text={isMomView ? "Loading mom profile..." : "Loading your profile..."} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      { <Header />}
      <main className="flex-grow my-20">
        <Outlet />
      </main>
      { <Footer />}
    </div>
  );
}

export default App;