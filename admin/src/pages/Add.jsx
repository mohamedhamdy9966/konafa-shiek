import { useState } from "react";
import { backendUrl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const handleImageValidation = (file) => {
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type! Only JPEG, JPG, and PNG are allowed.");
      return false;
    }
    if (file.size > 2 * 1024 * 1024) {
      // 2MB limit
      toast.error("File size exceeds 2MB!");
      return false;
    }
    return true;
  };
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Konafa");
  const [bestSeller, setBestSeller] = useState(false);
  const [sizes, setSizes] = useState({
    XS: { enabled: false, price: "", calories: "", offer: "" },
    S: { enabled: false, price: "", calories: "", offer: "" },
    M: { enabled: false, price: "", calories: "", offer: "" },
    L: { enabled: false, price: "", calories: "", offer: "" },
    Pieces_6: { enabled: false, price: "", calories: "", offer: "" },
    Pieces_12: { enabled: false, price: "", calories: "", offer: "" },
    Pieces_18: { enabled: false, price: "", calories: "", offer: "" },
  });

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      // Validate sizes
      const validatedSizes = {};
      let hasEnabledSize = false;

      Object.keys(sizes).forEach((size) => {
        if (sizes[size].enabled) {
          if (!sizes[size].price) {
            throw new Error(`Price for size ${size} is missing.`);
          }
          validatedSizes[size] = {
            enabled: true,
            price: parseFloat(sizes[size].price),
            calories: parseFloat(sizes[size].calories || 0), // Default to 0 if calories are not provided
            offer: parseFloat(sizes[size].offer || 0), // default value if non offer applied
          };
          hasEnabledSize = true;
        } else {
          validatedSizes[size] = {
            enabled: false,
            price: 0,
            calories: 0,
            offer: 0,
          }; // Default for disabled sizes
        }
      });

      if (!hasEnabledSize) {
        throw new Error("At least one size must be enabled.");
      }

      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("sizes", JSON.stringify(validatedSizes));
      formData.append("bestSeller", bestSeller);

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      console.log("Form Data Before Sending:", {
        name,
        description,
        category,
        sizes: validatedSizes,
        bestSeller,
      });

      console.log("Sizes before submission:", validatedSizes);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setSizes({
          XS: { enabled: false, price: "", calories: "", offer: "" },
          S: { enabled: false, price: "", calories: "", offer: "" },
          M: { enabled: false, price: "", calories: "", offer: "" },
          L: { enabled: false, price: "", calories: "", offer: "" },
          Pieces_6: { enabled: false, price: "", calories: "", offer: "" },
          Pieces_12: { enabled: false, price: "", calories: "", offer: "" },
          Pieces_18: { enabled: false, price: "", calories: "", offer: "" },
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3"
    >
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2">
          <label htmlFor="image1">
            <img
              className="w-20"
              src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
              alt="upload"
            />
            <input
              onChange={(e) => {
                const file = e.target.files[0];
                if (file && handleImageValidation(file)) {
                  setImage1(file);
                }
              }}
              type="file"
              id="image1"
              hidden
            />
          </label>
          <label htmlFor="image2">
            <img
              className="w-20"
              src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
              alt="upload"
            />
            <input
              onChange={(e) => {
                const file = e.target.files[0];
                if (file && handleImageValidation(file)) {
                  setImage2(file);
                }
              }}
              type="file"
              id="image2"
              hidden
            />
          </label>
          <label htmlFor="image3">
            <img
              className="w-20"
              src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
              alt="upload"
            />
            <input
              onChange={(e) => {
                const file = e.target.files[0];
                if (file && handleImageValidation(file)) {
                  setImage3(file);
                }
              }}
              type="file"
              id="image3"
              hidden
            />
          </label>
          <label htmlFor="image4">
            <img
              className="w-20"
              src={!image4 ? assets.upload_area : URL.createObjectURL(image4)}
              alt="upload"
            />
            <input
              onChange={(e) => {
                const file = e.target.files[0];
                if (file && handleImageValidation(file)) {
                  setImage4(file);
                }
              }}
              type="file"
              id="image4"
              hidden
            />
          </label>
        </div>
      </div>
      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="w-full max-w-[500px] px-3 py-2"
          placeholder="Name"
          required
        />
      </div>
      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          type="text"
          className="w-full max-w-[500px] px-3 py-2"
          placeholder="Description"
          required
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product Category</p>
          <select
            onChange={(e) => {
              setCategory(e.target.value);
              console.log("Selected Category:", e.target.value); // Debugging log
            }}
            className="w-full px-3 py-2"
          >
            <option value="Konafa">كنافة</option>
            <option value="BentElShn">بنت الصحن</option>
            <option value="KonafaMini">كنافة ميني</option>
            <option value="Services">كنافة شيك</option>
          </select>
        </div>{" "}
      </div>
      <div>
        <p className="mb-2">Sizes and Prices with calories</p>
        <div className="flex flex-col gap-2">
          {Object.keys(sizes).map((size) => (
            <div key={size} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={sizes[size].enabled}
                onChange={() =>
                  setSizes((prev) => ({
                    ...prev,
                    [size]: { ...prev[size], enabled: !prev[size].enabled },
                  }))
                }
              />
              <label>{size}</label>
              {sizes[size].enabled && (
                <>
                  <input
                    onChange={(e) =>
                      setSizes((prev) => ({
                        ...prev,
                        [size]: { ...prev[size], offer: e.target.value },
                      }))
                    }
                    type="number"
                    value={sizes[size].offer || ""}
                    placeholder="السعر قبل العرض"
                    className="px-2 py-1 border"
                  />
                  <input
                    type="number"
                    placeholder="السعر الحقيقي"
                    value={sizes[size].price || ""}
                    onChange={(e) =>
                      setSizes((prev) => ({
                        ...prev,
                        [size]: { ...prev[size], price: e.target.value },
                      }))
                    }
                    className="px-2 py-1 border"
                  />
                  <input
                    onChange={(e) =>
                      setSizes((prev) => ({
                        ...prev,
                        [size]: { ...prev[size], calories: e.target.value },
                      }))
                    }
                    type="number"
                    value={sizes[size].calories || ""}
                    placeholder="السعرات الحرارية"
                    className="px-2 py-1 border"
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <input
          onChange={() => setBestSeller((prev) => !prev)}
          checked={bestSeller}
          type="checkbox"
          id="bestSeller"
        />
        <label className="cursor-pointer" htmlFor="bestSeller">
          Add to bestSeller
        </label>
      </div>
      <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">
        ADD
      </button>
    </form>
  );
};

export default Add;
