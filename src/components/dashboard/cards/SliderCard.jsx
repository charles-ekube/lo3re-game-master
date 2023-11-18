import React from "react";
import Text from "../../../utils/CustomText";
import Button from "../../../utils/CustomButton";

const SliderCard = ({ src, title, subTitle, btnText }) => {
  return (
    <div className={"sliderCardContainer"}>
      <img src={src} alt="sliderCardImage" />
      <div className={"sliderCardContent"}>
        <Text>{title}</Text>
        <Text>{subTitle}</Text>
        <Button text={btnText} />
      </div>
    </div>
  );
};

export default SliderCard;
