import React from "react";
import Text from "../../../utils/CustomText";
import Button from "../../../utils/CustomButton";
import CustomButtonII from "../../../utils/CustomButtonII";

const SliderCard = ({ src, title, subTitle, btnText }) => {
  return (
    <div className={"sliderCardContainer"}>
      <img src={src} alt="sliderCardImage" />
      <div className={"sliderCardContent"}>
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
