import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import { ShopContext } from "../context/ShopContext";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("S");
  const [sauceSize, setSauceSize] = useState(0);
  const [selectedSauce, setSelectedSauce] = useState([]);
  const [isSauceSizeSelected, setIsSauceSizeSelected] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchProductData = () => {
      const product = products.find((item) => item._id === productId);
      if (product) {
        setProductData({
          ...product,
          sizes: new Map(Object.entries(product.sizes)),
        });
        setImage(product.image[0]);
        setSize("S");
        setSauceSize(0);
        setSelectedSauce([]);
        setIsSauceSizeSelected(false);
      }
      setTimeout(() => setLoading(false), 1000);
    };

    fetchProductData();
  }, [productId, products]);

  const handleAddToCart = () => {
    addToCart(productData._id, size, sauceSize, selectedSauce);

    // Create toast message with product details
    const sauceSizeText = sauceSize ? ` with ${sauceSize} sauce` : "";
    const selectedSauceText =
      selectedSauce.length > 0 ? ` (${selectedSauce.join(", ")})` : "";

    toast.success(
      `تم إضافة ${productData.name} - الحجم ${size}${sauceSizeText}${selectedSauceText} إلى عربة التسوق الخاصة بك!`,
      {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-8 border-dotted border-t-blue-500 border-green-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleSizeClick = (key) => {
    if (size === key) {
      setSize("");
      setSauceSize(0);
      setSelectedSauce([]);
      setIsSauceSizeSelected(false);
    } else {
      setSize(key);
    }
  };

  const handleSauceSizeClick = (size) => {
    if (sauceSize === size) {
      setSauceSize(0);
      setSelectedSauce([]);
      setIsSauceSizeSelected(false);
    } else {
      setSauceSize(size);
      setIsSauceSizeSelected(true);
    }
  };

  const handleSauceTypeToggle = (sauce) => {
    if (isSauceSizeSelected || productData.category === "KonafaMiniSauce") {
      setSelectedSauce((prev) =>
        prev.includes(sauce)
          ? prev.filter((item) => item !== sauce)
          : [...prev, sauce]
      );
    }
  };

  if (!productData) {
    return <div className="text-center mt-10">Loading product...</div>;
  }

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <ToastContainer />
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
              <div>Image not available</div>
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
          <p className="mt-5 text-sm text-slate-700 font-medium line-through">
            {productData.sizes?.get(size)?.offer
              ? `السعر قبل العرض : ${productData.sizes.get(size).offer} SAR `
              : ""}
          </p>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.sizes?.get(size)?.price !== undefined
              ? (productData.sizes.get(size).price + (sauceSize || 0)).toFixed(
                  2
                )
              : "0.00"}
          </p>
          <p className="mt-5 text-3xl font-medium">
            {productData.sizes?.get(size)?.calories
              ? `السعرات الحرارية: ${
                  productData.sizes.get(size).calories
                } سعرة حرارية`
              : "السعرات الحرارية غير معروفة"}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          <div className="mt-4">
            <p className="mb-2">Select Size:</p>
            <div className="flex gap-2">
              {[...productData.sizes.entries()].map(([key, value]) => {
                if (value.enabled) {
                  return (
                    <button
                      key={key}
                      onClick={() => handleSizeClick(key)}
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
          {productData.category === "BentElShn" ||
          productData.category === "KonafaMiniPlain" ? (
            ""
          ) : productData.category === "KonafaMiniSauce" ? (
            <div className="mt-4">
              <p className="mb-2">نوع الصوص:</p>
              <div className="flex gap-2 flex-col">
                {[
                  "kinder",
                  "pistachio",
                  "nutella",
                  "white-chocolate",
                  "blue-berry",
                ].map((sauce) => (
                  <button
                    key={sauce}
                    onClick={() => handleSauceTypeToggle(sauce)}
                    disabled={
                      !size && productData.category !== "KonafaMiniSauce"
                    }
                    className={`rounded-full border py-2 px-4 bg-gray-300 ${
                      selectedSauce.includes(sauce)
                        ? "border-orange-500 bg-blue-600"
                        : ""
                    } ${!size ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {sauce}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <p className="mb-2">حجم الصوص : </p>
              <span className="text-xs text-red-400">برجاء إختيار حجم صوص مناسب مع حجم الكنافة</span>
              <div className="flex gap-2 flex-col">
                {[4, 5, 10, 15].map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSauceSizeClick(size)}
                    className={`rounded-xl border py-2 px-4 bg-gray-100 ${
                      sauceSize === size ? "border-orange-500" : ""
                    }`}
                  >
                    {size === 4
                      ? "XS"
                      : size === 5
                      ? "S"
                      : size === 10
                      ? "M"
                      : "L"}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <p className="mb-2">نوع الصوص :</p>
                <div className="flex gap-2 flex-col">
                  {[
                    "kinder",
                    "pistachio",
                    "nutella",
                    "white-chocolate",
                    "blue-berry",
                  ].map((sauce) => (
                    <button
                      key={sauce}
                      onClick={() => handleSauceTypeToggle(sauce)}
                      disabled={!isSauceSizeSelected}
                      className={`rounded-full border py-2 px-4 bg-gray-300 ${
                        selectedSauce.includes(sauce)
                          ? "border-orange-500 bg-blue-600"
                          : ""
                      } ${
                        !isSauceSizeSelected
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {sauce}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <button
            onClick={handleAddToCart}
            disabled={!size}
            className="mt-5 bg-black text-white px-8 py-3 text-sm active:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {size ? "إضافة إلى سلة مشترياتك" : "Select Size to Add"}
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 space-y-1">
            <p>100% ضمان خدمة الجودة</p>
            <p>سيتوفر قريبا خدمة التوصيل</p>
            <p>متوفر الدفع عن طريق فيزا او ماستر كارد او مدى</p>
          </div>
        </div>
      </div>

      {/* Description & Reviews */}
      <div className="mt-20">
        <div className="flex">
          <button className="border px-5 py-3 text-sm font-bold">الوصف</button>
          <button className="border px-5 py-3 text-sm">
            اراء العملاء (122)
          </button>
        </div>
        <div className="border px-6 py-6 text-sm text-gray-500 space-y-4">
          <p>
            {productData.longDescription ||
              `
كنافة شرقية هي حلوى عربية شهية مصنوعة من عجينة الكنافة الرقيقة والهشة المحشوة بالمكسرات والفستق الحلبي. يتم خبز الكنافة في الفرن حتى يصبح لونها ذهبياً مقرمشاً، ثم تُسكب عليها القطر الساخن اللذيذ. تقدم كنافة شرقية عادة مع القهوة أو الشاي، مما يضيف لمسة من الانتعاش والنعومة.
المميزات:
طعم لذيذ: مزيج رائع من المكسرات المحمصة والعجين المقرمش والقطر الحلو.
مكونات طبيعية: مصنوعة من مكونات عالية الجودة وخالية من المواد الحافظة.
مثالية للمناسبات: حلوى مثالية لتقديمها في المناسبات والأعياد.
 يمكن تناولها مباشرة بعد الشراء.
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
