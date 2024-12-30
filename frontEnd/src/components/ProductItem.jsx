import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ProductItem = ({ id, image, name, sizes}) => {
  const { currency } = useContext(ShopContext);
  // use Object.entries if sizes is an object because sizes is passed as object but we also map it to display
  const sizeEntries = sizes ? Object.entries(sizes) : [];
  const firstEnabledSize = sizeEntries.find(([, value]) => value.enabled);
  return (
    <Link className="text-gray-700 cursor-pointer" to={`/product/${id}`}>
      <div className="overflow-hidden">
        <img
          className="hover:scale-110 transition ease-in-out"
          src={image.length > 0 ? image[0] : "../assets/konafa_1.png"}
          alt={name || "Konafa-Shiek"}
        />
      </div>
      <p className="pt-3 pb-1 text-sm">{name}</p>
      <p className="text-sm font-medium">
        {currency}
        {firstEnabledSize ? firstEnabledSize[1].price : `${" "}السعر حسب الحجم  ${" "}`}
      </p>
    </Link>
  );
};

ProductItem.propTypes = {
  id: PropTypes.string.isRequired,
  image: PropTypes.arrayOf(PropTypes.string).isRequired,
  name: PropTypes.string.isRequired,
  sizes: PropTypes.object,
};

export default ProductItem;
