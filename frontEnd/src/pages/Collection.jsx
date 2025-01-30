import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  const [loading, setLoading] = useState(true); // Added loading state

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    setLoading(true); // Set loading before filtering
    setTimeout(() => {
      let productsCopy = products.slice();

      if (showSearch && search) {
        productsCopy = productsCopy.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (category.length > 0) {
        productsCopy = productsCopy.filter((item) =>
          category.includes(item.category)
        );
      }

      setFilterProducts(productsCopy);
      setLoading(false); // Disable loading after filtering
    }, 500); // Simulating a short delay for a smooth experience
  };

  const sortProduct = () => {
    setLoading(true); // Set loading before sorting
    setTimeout(() => {
      let filterProductsCopy = [...filterProducts];

      switch (sortType) {
        case "low-high":
          filterProductsCopy.sort((a, b) => a.price - b.price);
          break;

        case "high-low":
          filterProductsCopy.sort((a, b) => b.price - a.price);
          break;

        default:
          applyFilter();
          return;
      }

      setFilterProducts(filterProductsCopy);
      setLoading(false); // Disable loading after sorting
    }, 2000);
  };

  useEffect(() => {
    applyFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* filter section */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          Filters
          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt="dropdownIcon"
          />
        </p>
        {/* category filter option */}
        <div
          className={`border rounded border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">Categories</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {["Konafa", "BentElShn", "KonafaMini", "KonafaShiek"].map(
              (categoryName) => (
                <p key={categoryName} className="flex gap-2">
                  <input
                    className="w-3"
                    type="checkbox"
                    value={categoryName}
                    onChange={toggleCategory}
                  />{" "}
                  {categoryName}
                </p>
              )
            )}
          </div>
        </div>
      </div>

      {/* right side */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"جميع"} text2={"الأصناف"} />
          {/* product sort */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relevant">Sort by : Relevant</option>
            <option value="low-high">Sort by : low to high</option>
            <option value="high-low">Sort by : high to low</option>
          </select>
        </div>

        {/* Map products or show skeleton loaders */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {loading
            ? Array(8)
                .fill(null)
                .map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 animate-pulse h-48 rounded-lg"
                  />
                ))
            : filterProducts.map((item, index) => (
                <ProductItem
                  key={index}
                  name={item.name}
                  price={item.price}
                  image={item.image}
                  id={item._id}
                  category={item.category}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
