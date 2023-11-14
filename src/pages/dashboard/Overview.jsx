import React, { useState } from "react";
import OverviewEmptyState from "../../components/dashboard/overview/EmptyState";
import TopNav from "../../components/dashboard/widgets/TopNav";

const Overview = () => {
  const [lotteries, setLotteries] = useState([]);

  return (
    <>
      {/* <TopNav /> */}
      <section className={"overviewContainer"}>
        <div>{lotteries?.length === 0 && <OverviewEmptyState />}</div>
        <aside className={"asideViewContainer"}></aside>
      </section>
    </>
  );
};

export default Overview;
