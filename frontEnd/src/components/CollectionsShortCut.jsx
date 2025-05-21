import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const CollectionShortCut = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (products && products.length > 0) {
      // Check for bestSeller field explicitly as boolean
      const bestProduct = products.filter((item) => {
        return item.bestSeller === true;  // Ensure we check the exact boolean value
      });
      setBestSeller(bestProduct.slice(0, 18));
      setLoading(false); // Set loading to false once data is fetched
    }
  }, [products]);

  return (
    <section className="my-10">
      <section className="text-center text-3xl py-8">
        <Title text1="جميع" text2="الأصناف" />
      </section>
      {loading ? (
        // Loading spinner or skeleton loader
        <section className="flex justify-center items-center h-64">
          <section className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></section>
        </section>
      ) : bestSeller.length > 0 ? (
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {bestSeller.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              image={item.image || []}
              name={item.name || "Konafa-Shiek"}
              sizes={item.sizes || {}}
            />
          ))}
        </section>
      ) : (
        <section className="text-center text-gray-500 mt-8">
          <p>Not Available</p>
        </section>
      )}
    </section>
  );
};

export default CollectionShortCut;