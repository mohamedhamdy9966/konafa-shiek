import { useState, useEffect } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsLetterBox from "../components/NewsLetterBox";

const About = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800); // Simulating a smooth loading effect
  }, []);

  return (
    <div>
      {/* About Us Section */}
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1="عن" text2="كنافة شيك" />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16">
        {loading ? (
          <div className="w-full md:max-w-[450px] h-64 bg-gray-300 animate-pulse rounded"></div>
        ) : (
          <img
            src={assets.about_img}
            alt="Team working together"
            className="w-full md:max-w-[450px]"
          />
        )}

        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          {loading ? (
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 animate-pulse w-3/4 rounded"></div>
              <div className="h-4 bg-gray-300 animate-pulse w-full rounded"></div>
              <div className="h-4 bg-gray-300 animate-pulse w-5/6 rounded"></div>
              <div className="h-4 bg-gray-300 animate-pulse w-2/3 rounded"></div>
            </div>
          ) : (
            <>
              <p>
                نحن فريق مخلص ملتزم بتقديم أفضل الخدمات والمنتجات. بدأت رحلتنا
                برؤية لإحداث فرق في مجال صناعة الحلويات الشرقية خاصة الكنافة ,
                ونواصل السعي لتحقيق التميز كل يوم.
              </p>
              <p>
                تشمل قيمنا الأساسية رضا العملاء والابتكار والنزاهة. نحن نؤمن
                ببناء علاقات دائمة مع عملائنا وتقديم جودة لا مثيل لها.
              </p>
              <b className="text-gray-800">
                انضم إلينا بينما نواصل النمو والابتكار و خدمة عملائنا بأفضل
                كنافة شرقية في المملكة.
              </b>
              <p>
                سواء كنت تبحث عن منتجات عالية الجودة أو خدمات موثوقة، فنحن هنا
                لتلبية احتياجاتك. فريقنا مستعد لدعمك في كل خطوة.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div>
        <Title text1="لماذا" text2="تختار كنافة شيك" />
      </div>

      <div className="flex flex-col md:flex-row text-sm mb-20 gap-6 md:gap-0">
        {[1, 2, 3].map((_, index) => (
          <div
            key={index}
            className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5"
          >
            {loading ? (
              <>
                <div className="h-5 bg-gray-300 animate-pulse w-1/3 rounded"></div>
                <div className="h-4 bg-gray-300 animate-pulse w-5/6 rounded"></div>
                <div className="h-4 bg-gray-300 animate-pulse w-4/5 rounded"></div>
              </>
            ) : (
              <>
                <b>
                  {index === 0
                    ? "أجود كنافة"
                    : index === 1
                    ? "أفضل خدمة"
                    : "الكل يثق في كنافة شيك"}
                </b>
                <p className="text-gray-600">
                  {index === 0
                    ? "نحن نقدم منتجات عالية الجودة يتم الحصول عليها من أفضل الموردين لضمان حصولك على قيمة مقابل أموالك."
                    : index === 1
                    ? "فريق خدمة العملاء لدينا جاهز دائمًا لمساعدتك وضمان تجربة كنافة شرقية لن تنسى."
                    : "آلاف العملاء يثقون بنا بسبب موثوقيتنا والتزامنا بالتميز."}
                </p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Newsletter Section */}
      <NewsLetterBox />
    </div>
  );
};

export default About;
