import React from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { assets } from "../assets/assets";

const Slider = () => {
  const carouselOptions = {
    loop: true,
    margin: 10,
    nav: true,
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 3 },
    },
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <OwlCarousel className="owl-theme" {...carouselOptions}>
        <div className="item">
          <img src={assets.slider_1} alt="Item 1" />
        </div>
        <div className="item">
          <img src={assets.slider_2} alt="Item 2" />
        </div>
        <div className="item">
          <img src={assets.slider_3} alt="Item 3" />
        </div>
      </OwlCarousel>
    </div>
  );
};

export default Slider;
