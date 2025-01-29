import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsLetterBox from "../components/NewsLetterBox";

const About = () => {
  return (
    <div>
      {/* About Us Section */}
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1="عن" text2="كنافة شيك" />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          src={assets.about_img}
          alt="Team working together"
          className="w-full md:max-w-[450px]"
        />

        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            نحن فريق مخلص ملتزم بتقديم أفضل الخدمات والمنتجات. بدأت رحلتنا برؤية
            لإحداث فرق في مجال صناعة الحلويات الشرقية خاصة الكنافة , ونواصل
            السعي لتحقيق التميز كل يوم.
          </p>
          <p>
            تشمل قيمنا الأساسية رضا العملاء والابتكار والنزاهة. نحن نؤمن ببناء
            علاقات دائمة مع عملائنا وتقديم جودة لا مثيل لها.
          </p>
          <b className="text-gray-800">
            انضم إلينا بينما نواصل النمو والابتكار و خدمة عملائنا بأفضل كنافة
            شرقية في المملكةز
          </b>
          <p>
            سواء كنت تبحث عن منتجات عالية الجودة أو خدمات موثوقة، فنحن هنا
            لتلبية احتياجاتك. فريقنا مستعد لدعمك في كل خطوة.
          </p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div>
        <Title text1="لماذا" text2="تختار كنافة شيك" />
      </div>

      <div className="flex flex-col md:flex-row text-sm mb-20 gap-6 md:gap-0">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>أجود كنافة </b>
          <p className="text-gray-600">
            نحن نقدم منتجات عالية الجودة يتم الحصول عليها من أفضل الموردين لضمان
            حصولك على قيمة مقابل أموالك.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>أفضل خدمة</b>
          <p className="text-gray-600">
            فريق خدمة العملاء لدينا جاهز دائمًا لمساعدتك وضمان تجربة كنافة شرقية
            لن تنسى.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>الكل يثق في كنافة شيك</b>
          <p className="text-gray-600">
            آلاف العملاء يثقون بنا بسبب موثوقيتنا والتزامنا بالتميز.
          </p>
        </div>
      </div>

      {/* Newsletter Section */}
      <NewsLetterBox />
    </div>
  );
};

export default About;
