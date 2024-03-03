import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { logOutUser } from "../redux/features/authSlice";

function RequireAuth({ children }) {
  let location = useLocation();
  const token = useSelector((state) => state.auth.accessToken);
  const iv = localStorage.getItem("iv");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // The user is signed in
        const expirationTime = user?.stsTokenManager?.expirationTime || 0;
        const currentTime = Math.floor(Date.now() / 1000);
        // console.log("xptim", expirationTime);
        // console.log("curti", currentTime);

        if (expirationTime < currentTime) {
          console.log("Token expired");

          // log user out
          dispatch(logOutUser());
        } else {
          console.log("Token valid");
        }
      } else {
        // The user is signed out
        console.log("User signed out");
        // dispatch(setIsTokenLoading(false));
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, [dispatch, navigate]);

  if (!token) {
    if (!iv) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }
    return <Navigate to="/sleep-screen" state={{ from: location }} />;
  }

  return <>{children}</>;
}

export default RequireAuth;
