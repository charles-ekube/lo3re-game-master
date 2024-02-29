import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { logOutUser, updateUserDetail } from "../redux/features/generalSlice";

function RequireAuth({ children }) {
  let location = useLocation();
  const token = localStorage.getItem("accessToken");
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
          dispatch(updateUserDetail(user));
          console.log("Token valid");
        }
      } else {
        // The user is signed out
        console.log("User signed out");
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, [dispatch, navigate]);

  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default RequireAuth;
