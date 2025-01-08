import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const BestSeller = () => {
  const { products } = useContext(ShopContext);

  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      // Check for bestSeller field explicitly as boolean
      const bestProduct = products.filter((item) => {
        return item.bestSeller === true;  // Ensure we check the exact boolean value
      });
      setBestSeller(bestProduct.slice(0, 5));
    }
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1="الأفضل" text2="مبيعا" />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          أهلاً بكم في كنافة شِيك – وجهتكم الأولى لألذ الحلويات الشرقية في
          القصيم! استمتعوا بمذاق الكنافة الأصيلة التي تجمع بين التراث والجودة
          العالية. نقدم تشكيلة متنوعة من الكنافة التقليدية والحديثة التي تناسب
          جميع المناسبات، وكل ذلك محضر بأفضل المكونات الطازجة. دللوا أنفسكم
          بأطيب الحلويات الشرقية واستمتعوا بتجربة فريدة مع كنافة شِيك!{" "}
        </p>
      </div>
      {bestSeller.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {bestSeller.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              image={item.image || []}
              name={item.name || "Konafa-Shiek"}
              sizes={item.sizes || {}}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-8">
          <p>Not Available</p>
        </div>
      )}
    </div>
  );
};

export default BestSeller;
