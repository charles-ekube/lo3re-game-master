import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import "./styles.css";

// import required modules
import { Pagination, Autoplay } from "swiper/modules";
import SliderCard from "../cards/SliderCard";
import ArtWork from "../../../assets/images/art.svg";

export default function CardSlider() {
  return (
    <>
      <Swiper
        pagination={{
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Pagination, Autoplay]}
        className="mySwiper"
      >
        <SwiperSlide>
          <SliderCard
            src={ArtWork}
            title={"Win 30% EVERYTIME!"}
            subTitle={"Consilio difficultates superare potest esse, immo"}
            btnText={"Visit blog"}
          />
        </SwiperSlide>
        <SwiperSlide>
          <SliderCard
            src={ArtWork}
            title={"Win 30% EVERYTIME!"}
            subTitle={"Consilio difficultates superare potest esse, immo"}
            btnText={"Visit blog"}
          />
        </SwiperSlide>
        <SwiperSlide>
          <SliderCard
            src={ArtWork}
            title={"Win 30% EVERYTIME!"}
            subTitle={"Consilio difficultates superare potest esse, immo"}
            btnText={"Visit blog"}
          />
        </SwiperSlide>
        <SwiperSlide>
          <SliderCard
            src={ArtWork}
            title={"Win 30% EVERYTIME!"}
            subTitle={"Consilio difficultates superare potest esse, immo"}
            btnText={"Visit blog"}
          />
        </SwiperSlide>
        <SwiperSlide>
          <SliderCard
            src={ArtWork}
            title={"Win 30% EVERYTIME!"}
            subTitle={"Consilio difficultates superare potest esse, immo"}
            btnText={"Visit blog"}
          />
        </SwiperSlide>
      </Swiper>
    </>
  );
}
