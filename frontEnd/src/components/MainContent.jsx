import { assets } from "../assets/assets";

const MainContent = () => {
  return (
    <section className="flex flex-col sm:flex-row border border-gray-400">
      {/* MainContent Left Side */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
        <div className="text-[#414141]">
          {/* BestSeller Section */}
          <div className="flex items-center gap-2">
            <span className="w-8 md:w-11 h-[2px] bg-[#414141]"></span>
            <p className="font-medium text-sm md:text-base">الكنافة الأفضل في القصيم</p>
          </div>
          {/* Main Heading */}
          <h2 className="prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed">
          كنافة شيك
          </h2>
          {/* Shop Now Section */}
          <div className="flex items-center gap-2 hover:cursor-pointer hover:text-gray-800 transition">
            <p className="font-semibold text-sm md:text-base">أحلى طعم و أفضل سعر</p>
            <span className="w-8 md:w-11 h-[1px] bg-[#414141]"></span>
          </div>
        </div>
      </div>
      {/* MainContent Right Side */}
      <img
        src={assets.hero}
        className="w-full sm:w-1/2 object-cover"
        alt="Latest goods promotional banner"
      />
    </section>
  );
};

export default MainContent;
