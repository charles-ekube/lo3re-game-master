import React, { useEffect, useState } from "react";
import OverviewEmptyState from "../../components/dashboard/overview/EmptyState";
import { getAuth } from "firebase/auth";
import CardSlider from "../../components/dashboard/overview/CardSlider";
import TopNav from "../../components/dashboard/widgets/TopNav";

const Overview = () => {
  const [lotteries, setLotteries] = useState([]);
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
  return (
    <>
      <TopNav />
      <section className={"overviewContainer"}>
        <div>{lotteries?.length === 0 && <OverviewEmptyState userDetails={userDetails} />}</div>
        <aside className={"asideViewContainer"}>
          <CardSlider />
        </aside>
      </section>
    </>
  );
};

export default Overview;
