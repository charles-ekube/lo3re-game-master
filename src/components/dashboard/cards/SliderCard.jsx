import React from "react";
import Text from "../../../utils/CustomText";
import CustomButtonII from "../../../utils/CustomButtonII";
import cardStyles from "../../../assets/styles/cardStyles.module.css";

const SliderCard = ({ src, title, subTitle, btnText }) => {
  return (
    <div className={`${cardStyles.sliderCardContainer}`}>
      <img src={src} alt="sliderCardImage" />
      <div className={`${cardStyles.sliderCardContent}`}>
        <Text tag={"h3"}>{title}</Text>
        <Text className={"my-1 fs-14"} tag={"p"}>
          {subTitle}
        </Text>
        <CustomButtonII
          variant={"light"}
          text={btnText}
          className="btnSm radius99"
        />
      </div>
    </div>
  );
};

export default SliderCard;
