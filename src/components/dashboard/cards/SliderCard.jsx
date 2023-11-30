import React from "react";
import Text from "../../../utils/CustomText";
import Button from "../../../utils/CustomButton";

const SliderCard = ({ src, title, subTitle, btnText }) => {
  return (
    <div className={"sliderCardContainer"}>
      <img src={src} alt="sliderCardImage" />
      <div className={"sliderCardContent"}>
        <Text tag={"h3"}>{title}</Text>
        <Text className={"my-1 fs-14"} tag={"p"}>
          {subTitle}
        </Text>
        <Button text={btnText} className="swiper-btn" />
      </div>
    </div>
  );
};

export default SliderCard;
