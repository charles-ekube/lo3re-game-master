import React from "react";
import Text from "../../../utils/CustomText";
import IconButton from "../buttons/IconButton";

const OverviewEmptyState = ({ userDetails }) => {
  return (
    <section className={"overviewEmptyContainer"}>
      <Text tag={"h2"} className={"f26 capitalize"} style={{ color: "#000" }}>
        Welcome, {userDetails?.displayName} 🎲🎲
      </Text>
      <Text tag={"p"} className={"satoshi-text f16 textCenter"}>
        It seems there are no active lotteries at the moment. But don't worry, you're just a step away from excitement!{" "}
      </Text>
      <IconButton text={"Create a lottery"} />
    </section>
  );
};

export default OverviewEmptyState;
