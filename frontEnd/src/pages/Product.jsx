import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import { ShopContext } from "../context/ShopContext";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);

  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("S");

  const fetchProductData = async () => {
    products.find((item) => {
      if (item._id === productId) {
        setProductData({ ...item, sizes: new Map(Object.entries(item.sizes)) });
        setImage(item.image[0]);
        setSize("S");
        return null;
      }
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  if (!productData) {
    return <div className="text-center mt-10">Loading product...</div>;
  }

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 flex-col sm:flex-row">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse sm:flex-row gap-3">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full gap-2">
            {productData.image && productData.image.length > 0 ? (
              productData.image.map((item, index) => (
                <img
                  key={index}
                  src={item}
                  alt={`Product ${index}`}
                  onClick={() => setImage(item)}
                  className={`cursor-pointer w-[24%] sm:w-full ${
                    item === image ? "border-2 border-orange-500" : ""
                  }`}
                />
              ))
            ) : (
              <p>No images available</p>
            )}
          </div>
          <div className="flex-1">
            {image ? (
              <img
                src={image}
                alt="Selected product"
                className="w-full h-auto"
              />
            ) : (
              <div>Image not available</div> // Or display a fallback image here
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h2 className="text-2xl font-medium mt-2">{productData.name}</h2>
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={assets.star_icon}
                alt="star"
                className="w-3.5"
              />
            ))}
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.sizes?.get(size)?.price || "0.00"}
          </p>
          <p className="mt-5 text-3xl font-medium">
            {productData.sizes?.get(size)?.calories ? `السعرات الحرارية: ${productData.sizes.get(size).calories} سعرة حرارية` : "السعرات الحرارية غير معروفة"}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          <div className="mt-4">
            <p className="mb-2">Select Size:</p>
            <div className="flex gap-2">
              {/* Ensure sizes is an array before mapping */}
              {[...productData.sizes.entries()].map(([key, value]) => {
                if (value.enabled) {
                  return (
                    <button
                      key={key}
                      onClick={() => setSize(key)}
                      className={`border py-2 px-4 bg-gray-100 ${
                        size === key ? "border-orange-500" : ""
                      }`}
                    >
                      {key}
                    </button>
                  );
                }
                return null;
              })}
            </div>
          </div>
          <div className="mt-4">
            <p className="mb-2">إضافة صوصات منوعة</p>
            <div className="flex gap-2">
            <button className="border py-2 px-4 bg-gray-100">XS</button>
            <button className="border py-2 px-4 bg-gray-100">S</button>
            <button className="border py-2 px-4 bg-gray-100">M</button>
            <button className="border py-2 px-4 bg-gray-100">L</button>
            </div>
          </div>
          <button
            onClick={() => addToCart(productData._id, size)}
            disabled={!size}
            className="mt-5 bg-black text-white px-8 py-3 text-sm active:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {size ? "إضافة إلى سلة مشترياتك" : "Select Size to Add"}
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 space-y-1">
            <p>100% Customer Satisfaction Guarantee</p>
            <p>Free shipping on orders over £50</p>
            <p>30-day return policy</p>
          </div>
        </div>
      </div>

      {/* Description & Reviews */}
      <div className="mt-20">
        <div className="flex">
          <button className="border px-5 py-3 text-sm font-bold">
            Description
          </button>
          <button className="border px-5 py-3 text-sm">Reviews (122)</button>
        </div>
        <div className="border px-6 py-6 text-sm text-gray-500 space-y-4">
          <p>
            {productData.longDescription ||
              `
كنافة شرقية هي حلوى عربية شهية مصنوعة من عجينة الكنافة الرقيقة والهشة المحشوة بالمكسرات والفستق الحلبي. يتم خبز الكنافة في الفرن حتى يصبح لونها ذهبياً مقرمشاً، ثم تُسكب عليها القطر الساخن اللذيذ. تقدم كنافة شرقية عادة مع القشطة أو الآيس كريم، مما يضيف لمسة من الانتعاش والنعومة.
المميزات:
طعم لذيذ: مزيج رائع من المكسرات المحمصة والعجين المقرمش والقطر الحلو.
مكونات طبيعية: مصنوعة من مكونات عالية الجودة وخالية من المواد الحافظة.
مثالية للمناسبات: حلوى مثالية لتقديمها في المناسبات والأعياد.
سهلة التحضير: يمكن تناولها مباشرة بعد الشراء.
اطلب الآن واستمتع بطعم الكنافة الشرقية الأصيلة`}
          </p>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
