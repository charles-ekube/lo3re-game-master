import React, { useState } from "react";
import OverviewEmptyState from "../../components/dashboard/overview/EmptyState";
import CardSlider from "../../components/dashboard/overview/CardSlider";
import Text from "../../utils/CustomText";
import ContactCard from "../../components/dashboard/cards/ContactCard";
import Stateful from "../../components/dashboard/overview/Stateful";
import { useFetchProfileQuery } from "../../redux/services/accountApi";

const Overview = () => {
  const [lotteries] = useState([1]);
  const { data: user } = useFetchProfileQuery();

  return (
    <>
      {/* <TopNav /> */}
      <section className={"mainContainer"}>
        <div>
          {lotteries?.length === 0 ? (
            <OverviewEmptyState userDetails={user} />
          ) : (
            <Stateful />
          )}
        </div>
        <aside className={"asideViewContainer"}>
          <CardSlider />
          <div className={"contactCornerContainer"}>
            <Text tag={"p"} className={"f16 satoshi-bold-text"}>
              Customer corner
            </Text>
            <ContactCard />
          </div>
        </aside>
      </section>
    </>
  );
};

export default Overview;
