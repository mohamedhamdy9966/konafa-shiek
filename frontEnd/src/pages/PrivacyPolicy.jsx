import { useState, useEffect } from "react";
import Title from "../components/Title";
import NewsLetterBox from "../components/NewsLetterBox";

const PrivacyPolicy = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {/* Privacy Policy Section */}
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1="سياسة" text2="الخصوصية" />
      </div>

      <div className="my-10 px-4 md:px-10 text-gray-600 text-sm leading-7">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-4 bg-gray-300 animate-pulse rounded w-full"
              ></div>
            ))}
          </div>
        ) : (
          <>
            <p>
              خصوصيتك مهمة بالنسبة لنا. في كنافة شيك، نحن ملتزمون بحماية
              المعلومات التي تزودنا بها عند استخدام تطبيقنا.
            </p>
            <p>
              نقوم بجمع بعض البيانات الأساسية مثل البريد الإلكتروني واسم
              المستخدم فقط لتحسين تجربتك. نحن لا نشارك معلوماتك مع أطراف ثالثة
              دون موافقتك.
            </p>
            <p>
              يتم استخدام المعلومات التي يتم جمعها فقط لتوفير وتحسين خدماتنا،
              مثل إرسال إشعارات بالعروض الجديدة أو تحديثات التطبيق.
            </p>
            <p>
              نحن نستخدم تدابير أمنية لحماية بياناتك ضد الوصول أو التعديل غير
              المصرح به.
            </p>
            <p>
              باستخدامك لتطبيقنا، فإنك توافق على سياسة الخصوصية هذه. قد نقوم
              بتحديث هذه السياسة من وقت لآخر، وسيتم إعلامك بأي تغييرات مهمة.
            </p>
            <b className="text-gray-800">
              إذا كانت لديك أي استفسارات بخصوص خصوصيتك، لا تتردد في التواصل
              معنا.
            </b>
          </>
        )}
      </div>

      {/* Newsletter or Footer */}
      <NewsLetterBox />
    </div>
  );
};

export default PrivacyPolicy;
