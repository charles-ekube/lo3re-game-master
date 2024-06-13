import React from "react";
import { useNavigate } from "react-router-dom";
import Text from "../../../utils/CustomText";
import IconButton from "../buttons/IconButton";

const OverviewEmptyState = ({ userDetails }) => {
  const navigate = useNavigate();

  const linkToAddLottery = () => {
    navigate("/dashboard/lotteries/add");
  };

  return (
    <section className={"overviewEmptyContainer"}>
      <Text tag={"h2"} className={"f26 capitalize"} style={{ color: "#000" }}>
        Welcome, {userDetails?.name} 🎲🎲
      </Text>
      <Text tag={"p"} className={"satoshi-text f16 textCenter"}>
        It seems there are no active lotteries at the moment. But don't worry,
        you're just a step away from excitement!{" "}
      </Text>
      <IconButton text={"Create a lottery"} onClick={linkToAddLottery} />
    </section>
  );
};

export default OverviewEmptyState;
