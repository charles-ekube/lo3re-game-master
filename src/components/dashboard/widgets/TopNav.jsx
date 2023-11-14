import React, { useEffect, useState } from "react";
import { CiBellOn, CiSearch } from "react-icons/ci";
import Text from "../../../utils/CustomText";
import { getAuth } from "firebase/auth";

const TopNav = () => {
  const [userDetails, setUserDetails] = useState({});
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

  // Check if displayName is a string and not empty
  if (typeof userDetails?.displayName !== "string" || userDetails?.displayName.length === 0) {
    return null; // or handle the case when the displayName is not valid
  }

  const firstLetter = userDetails?.displayName[0];
  const lastLetter = userDetails?.displayName[userDetails?.displayName.length - 1];

  return (
    <>
      <nav className="topNavContainer">
        <section>
          <div className="topNavSearchContainer">
            <CiSearch size={22} />
            <input placeholder="Search everything" />
          </div>
        </section>
        <section className={"topNavUserContainer"}>
          <div className="flexRow alignCenter" style={{ gap: "5px" }}>
            <div className="nameTagContainer">
              <Text className={"satoshi-text f14 upper"} style={{ color: "rgba(16, 16, 16, 1)" }}>
                {firstLetter}
                {lastLetter}
              </Text>
            </div>
            <Text className={"satoshi-text f14 capitalize"} style={{ color: "rgba(16, 16, 16, 1)" }}>
              {userDetails?.displayName}
            </Text>
          </div>
          <CiBellOn size={22} />
        </section>
      </nav>
    </>
  );
};

export default TopNav;
