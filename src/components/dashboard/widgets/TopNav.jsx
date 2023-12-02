import React, { useEffect, useState } from "react";
import { CiBellOn, CiSearch, CiUser } from "react-icons/ci";
import Text from "../../../utils/CustomText";
import { getAuth } from "firebase/auth";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "../../../redux/features/generalSlice";
import { FiMenu } from "react-icons/fi";

const TopNav = () => {
  const [userDetails, setUserDetails] = useState({});
  const [isScreenWidth1150, setIsScreenWidth1150] = useState(false);
  const dispatch = useDispatch();
  const getUser = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    // console.log(user);
    if (user !== null) {
      // The user object has basic properties such as display name, email, etc.
      const displayName = user.displayName;
      const email = user.email;
      const photoURL = user.photoURL;
      const emailVerified = user.emailVerified;
      setUserDetails(user);
      // console.log(user);

      // The user's ID, unique to the Firebase project. Do NOT use
      // this value to authenticate with your backend server, if
      // you have one. Use User.getToken() instead.
      const uid = user.uid;
    }
  };

  useEffect(() => {
    getUser();
  }, [userDetails]);

  const handleResize = () => {
    if (window.innerWidth < 1150) {
      setIsScreenWidth1150(true);
    } else {
      setIsScreenWidth1150(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
  });

  // Check if displayName is a string and not empty
  // if (
  //   typeof userDetails?.displayName !== "string" ||
  //   userDetails?.displayName.length === 0
  // ) {
  //   return null;
  // }

  // const firstLetter = userDetails?.displayName[0];
  // const lastLetter = userDetails?.displayName[userDetails?.displayName.length - 1];
  const firstLetter = "u";
  const lastLetter = "u";

  return (
    <>
      <nav className="topNavContainer">
        <section className="flexRow gap-1 w-70">
          <div>
            {isScreenWidth1150 && (
              <button
                onClick={() => dispatch(toggleSidebar())}
                className={"btn btn-dark"}
              >
                <FiMenu />
              </button>
            )}
          </div>
          <div className="topNavSearchContainer">
            <CiSearch size={22} />
            <input placeholder="Search everything" />
          </div>
        </section>
        <section className={"topNavUserContainer"}>
          <div className="flexRow alignCenter" style={{ gap: "5px" }}>
            <div className="nameTagContainer">
              <Text
                className={"satoshi-text f14 upper"}
                style={{ color: "rgba(16, 16, 16, 1)" }}
              >
                {firstLetter ? firstLetter : <CiUser size={18} />}
                {lastLetter ? lastLetter : ""}
              </Text>
            </div>
            <Text
              className={"satoshi-text f14 capitalize d-none-md"}
              style={{ color: "rgba(16, 16, 16, 1)" }}
            >
              {userDetails?.displayName ? userDetails?.displayName : "User"}
            </Text>
          </div>
          <CiBellOn size={22} />
        </section>
      </nav>
    </>
  );
};

export default TopNav;
