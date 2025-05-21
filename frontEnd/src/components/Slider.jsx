import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { assets } from "../assets/assets";

const Slider = () => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <Carousel
        swipeable={true}
        draggable={true}
        showDots={true}
        responsive={responsive}
        ssr={true} 
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={3000}
        keyBoardControl={true}
        customTransition="all .5"
        transitionDuration={500}
        containerClass="carousel-container"
        removeArrowOnDeviceType={["tablet", "mobile"]}
        deviceType="desktop"
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"
      >
        <div className="p-4">
          <img
            src={assets.slider_4}
            alt="Item 3"
            className="w-full h-auto"
          />
        </div>
        <div className="p-4">
          <img
            src={assets.slider_3}
            alt="Item 3"
            className="w-full h-auto"
          />
        </div>
        <div className="p-4">
          <img
            src={assets.slider_5}
            alt="Item 3"
            className="w-full h-auto"
          />
        </div>
        <div className="p-4">
          <img
            src={assets.slider_9}
            alt="Item 3"
            className="w-full h-auto"
          />
        </div>
        <div className="p-4">
          <img
            src={assets.slider_6}
            alt="Item 3"
            className="w-full h-auto"
          />
        </div>
        <div className="p-4">
          <img
            src={assets.slider_2}
            alt="Item 2"
            className="w-full h-auto"
          />
        </div>
        <div className="p-4">
          <img
            src={assets.slider_7}
            alt="Item 3"
            className="w-full h-auto"
          />
        </div>
        <div className="p-4">
          <img
            src={assets.slider_1}
            alt="Item 1"
            className="w-full h-auto"
          />
        </div>
        <div className="p-4">
          <img
            src={assets.slider_8}
            alt="Item 3"
            className="w-full h-auto"
          />
        </div>
      </Carousel>
    </div>
  );
};

export default Slider;
