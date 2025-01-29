import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-800 py-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 mb-10 text-sm container mx-auto px-5">
        {/* Logo and Description */}
        <div>
          <img
            src={assets.logo}
            className="mb-5 w-32 rounded-md"
            alt="Logo"
          />
          <p className="w-full md:w-2/3 text-gray-600 leading-relaxed">
            كنافة شِيك - نُقدّم لكم أطيب الحلويات الشرقية بأجود المكونات وبنكهات
            لا تُقاوم. زيارتكم تسعدنا دائمًا!{" "}
          </p>
        </div>

        {/* Company Links */}
        <div>
          <p className="text-xl font-medium mb-5">كنافة شيك</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>
              <a href="/" className="hover:text-gray-800">
                الصفحة الرئيسية
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-gray-800">
                عن كنافة شيك
              </a>
            </li>
            <li>
              <a href="/delivery" className="hover:text-gray-800">
                خدمة التوصيل
              </a>
            </li>
            <li>
              <a href="/privacy-policy" className="hover:text-gray-800">
                سياسة الخصوصية
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <p className="text-xl font-medium mb-5">تواصل معنا</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>
              <a href="tel:+966550681549" className="hover:text-gray-800">
                0550681549
              </a>
            </li>
            <li>
              <a href="mailto:support@konafasheek.com" className="hover:text-gray-800">
                support@konafasheek.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-300">
        <p className="py-5 text-sm text-center">
          taxi &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
