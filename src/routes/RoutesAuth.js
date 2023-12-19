// import { onAuthStateChanged } from "firebase/auth";
// import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
// import { auth } from "../firebase";

function RequireAuth({ children }) {
  let location = useLocation();
  const token = localStorage.getItem("accessToken");

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       // Check if the user's token is near expiration
  //       const expirationTime = user.authTime + user.expiresIn * 1000; // Convert seconds to milliseconds
  //       const now = Date.now();

  //       if (now >= expirationTime) {
  //         // User's token is likely expired or about to expire
  //         // You can take appropriate actions here, such as refreshing the token
  //         console.log("User token is expired or about to expire");
  //       } else {
  //         // User's token is still valid
  //         console.log("User token is still valid");
  //       }
  //     } else {
  //       // User is signed out
  //       console.log("User is signed out");
  //     }
  //   });

  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default RequireAuth;
