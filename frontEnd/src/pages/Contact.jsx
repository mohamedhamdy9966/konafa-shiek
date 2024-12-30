import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsLetterBox from "../components/NewsLetterBox";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1="Contact" text2="Us" />
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        <img
          className="w-full md:max-w-[480px]"
          src={assets.contact_img}
          alt="Contact Us Illustration"
        />

        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-gray-600">Our Store</p>

          <address className="not-italic text-gray-500">
            123 Main Street, Suite 456 <br />
            Springfield, Anywhere <br />
            (123) 456-7890
          </address>

          <p className="font-semibold text-xl text-gray-600">Careers</p>

          <button
            className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500"
            aria-label="Learn more about working with us"
          >
            Work With Us
          </button>
        </div>
      </div>

      <NewsLetterBox />
    </div>
  );
};

export default Contact;
