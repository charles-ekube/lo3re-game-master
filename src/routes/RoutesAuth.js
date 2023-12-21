import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { updateUserDetail } from "../redux/features/generalSlice";

function RequireAuth({ children }) {
  let location = useLocation();
  const token = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Check if the user's token is near expiration
        const expirationTime = user.authTime + user.expiresIn * 1000; // Convert seconds to milliseconds
        const now = Date.now();

        if (now >= expirationTime) {
          // User's token is likely expired or about to expire
          // You can take appropriate actions here, such as refreshing the token
          console.log("User token is expired or about to expire");
          localStorage.removeItem("accessToken");
          dispatch(updateUserDetail({}));
          navigate("/");
        } else {
          // User's token is still valid
          dispatch(updateUserDetail(user));
          console.log("User token is still valid");
        }
      } else {
        // User is signed out
        console.log("User is signed out");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default RequireAuth;
