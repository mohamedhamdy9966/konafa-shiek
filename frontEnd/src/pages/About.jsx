import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsLetterBox from "../components/NewsLetterBox";

const About = () => {
  return (
    <div>
      {/* About Us Section */}
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1="About" text2="Us" />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          src={assets.about_img}
          alt="Team working together"
          className="w-full md:max-w-[450px]"
        />

        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            We are a dedicated team committed to providing the best services and
            products. Our journey began with a vision to make a difference in
            the industry, and we continue to strive for excellence every day.
          </p>
          <p>
            Our core values include customer satisfaction, innovation, and
            integrity. We believe in creating lasting relationships with our
            clients and delivering unparalleled quality.
          </p>
          <b className="text-gray-800">
            Join us as we continue to grow and innovate.
          </b>
          <p>
            Whether you are looking for top-notch products or reliable services,
            we have you covered. Our team is here to support you at every step.
          </p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div>
        <Title text1="Why" text2="Choose Us" />
      </div>

      <div className="flex flex-col md:flex-row text-sm mb-20 gap-6 md:gap-0">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Quality Products</b>
          <p className="text-gray-600">
            We offer high-quality products sourced from the best suppliers to
            ensure you get value for your money.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Exceptional Service</b>
          <p className="text-gray-600">
            Our customer service team is always ready to assist you and ensure a
            smooth shopping experience.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Trusted by Many</b>
          <p className="text-gray-600">
            Thousands of customers trust us for our reliability and dedication
            to excellence.
          </p>
        </div>
      </div>

      {/* Newsletter Section */}
      <NewsLetterBox />
    </div>
  );
};

export default About;
