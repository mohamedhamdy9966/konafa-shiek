import { useState, useEffect } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsLetterBox from "../components/NewsLetterBox";

const Delivery = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800); // Simulating a smooth loading effect
  }, []);

  return (
    <div>
      {/* Delivery Services Section */}
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1="خدمات" text2="التوصيل" />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16">
        {loading ? (
          <div className="w-full md:max-w-[450px] h-64 bg-gray-300 animate-pulse rounded"></div>
        ) : (
          <img
            src={assets.delivery_img}
            alt="Delivery in progress"
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
                نحن نقدم خدمات توصيل سريعة وموثوقة لتوصيل طلباتك إلى باب منزلك
                في الوقت المناسب وبأفضل جودة.
              </p>
              <p>
                يضمن فريق التوصيل لدينا التعامل بعناية مع كل طلب، مما يعكس
                التزامنا براحة ورضا العملاء في كل مرة.
              </p>
              <b className="text-gray-800">
                مع كنافة شيك، تجربة الكنافة لا تكتمل إلا بوصولها إليك ساخنة
                وطازجة في أسرع وقت ممكن.
              </b>
              <p>
                تتبع طلبك بسهولة، واستمتع بخدمة توصيل تغطي معظم مناطق المملكة.
                نحن هنا لجعل تجربتك أكثر سلاسة وراحة.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Why Our Delivery Service Section */}
      <div>
        <Title text1="لماذا" text2="خدمة توصيلنا مميزة" />
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
                    ? "سرعة التوصيل"
                    : index === 1
                    ? "تتبع مباشر"
                    : "سلامة المنتجات"}
                </b>
                <p className="text-gray-600">
                  {index === 0
                    ? "نصل إليك في الوقت المحدد، ونحرص على أن تصل الكنافة طازجة وساخنة."
                    : index === 1
                    ? "يمكنك متابعة حالة طلبك لحظة بلحظة بسهولة عبر تطبيقنا."
                    : "نهتم بتغليف الطلبات وحمايتها أثناء النقل لضمان جودتها."}
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

export default Delivery;
