import React, { useEffect, useState } from "react";
import { CiBellOn, CiSearch, CiUser } from "react-icons/ci";
import Text from "../../../utils/CustomText";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleSidebar,
  updateUserDetail,
} from "../../../redux/features/generalSlice";
import { FiMenu } from "react-icons/fi";
import { auth } from "../../../firebase";

const TopNav = () => {
  const [isScreenWidth1150, setIsScreenWidth1150] = useState(false);
  const showSidebar = useSelector((state) => state.general.showSidebar);
  const userDetails = useSelector((state) => state.general.userDetail);
  const dispatch = useDispatch();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(updateUserDetail(user));
    }
  });

  const handleResize = () => {
    if (window.innerWidth < 1150) {
      setIsScreenWidth1150(true);
    } else {
      setIsScreenWidth1150(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, []);

  // Check if displayName is a string and not empty
  if (
    typeof userDetails?.displayName !== "string" ||
    userDetails?.displayName.length === 0
  ) {
    return null;
  }

  const firstLetter = userDetails?.displayName[0];
  const lastLetter =
    userDetails?.displayName[userDetails?.displayName.length - 1];

  return (
    <>
      <nav className="topNavContainer">
        <section className="flexRow gap-1 w-70 alignCenter">
          <div>
            {isScreenWidth1150 && (
              <button
                onClick={() => dispatch(toggleSidebar(!showSidebar))}
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
