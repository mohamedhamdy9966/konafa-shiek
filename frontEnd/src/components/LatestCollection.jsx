import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);
  useEffect(()=>{
    setLatestProducts(products.slice(0,5))
  },[products])

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"أجدد"} text2={"الأصناف"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          مرحبا بكم في كنافة شِيك! نقدم لكم أشهى وألذ أنواع الكنافة المحضرة
          بعناية وبأفضل المكونات الطبيعية، لنقدم لكم تجربة حلا لا تُنسى. في قلب
          منطقة القصيم، نجمع بين النكهة الأصيلة والإبداع العصري لتناسب جميع
          الأذواق. سواء كنت تبحث عن الكنافة التقليدية أو الكنافة المبتكرة بلمسة
          عصرية، نحن هنا لنلبي رغبتك. زورونا الآن واستمتعوا بأشهى الحلويات
          الشرقية التي تُحضر بحب وإتقان!{" "}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {latestProducts.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            image={item.image}
            name={item.name || "Konafa-Shiek"}
            sizes={item.sizes || {}}
            category={item.category}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;
