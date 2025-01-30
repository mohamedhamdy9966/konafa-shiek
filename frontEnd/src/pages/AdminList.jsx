import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [editProduct, setEditProduct] = useState(null); // Track the product being edited

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("productId", editProduct._id);
      formData.append("name", editProduct.name);
      formData.append("description", editProduct.description);
      formData.append("category", editProduct.category);
      formData.append("sizes", JSON.stringify(editProduct.sizes));
      formData.append("bestSeller", editProduct.bestSeller);

      // Append new images if they exist
      if (editProduct.image1) formData.append("image1", editProduct.image1);
      if (editProduct.image2) formData.append("image2", editProduct.image2);
      if (editProduct.image3) formData.append("image3", editProduct.image3);
      if (editProduct.image4) formData.append("image4", editProduct.image4);

      const response = await axios.post(
        backendUrl + "/api/product/update",
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
        setEditProduct(null);
        fetchList(); // Refresh the product list
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-2">All Products List</p>
      <div className="flex flex-col gap-2">
        {/* Table Headers */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Images</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Actions</b>
        </div>

        {/* Product List */}
        {list.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
            key={index}
          >
            <img className="w-12" src={item.image[0]} alt="image" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>
              {currency}
              {item.sizes?.M?.price || "N/A"}
            </p>
            <div className="flex gap-2">
              <button
                className="bg-blue-500 text-white px-2 py-1"
                onClick={() => setEditProduct(item)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1"
                onClick={() => removeProduct(item._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg md:max-w-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-lg font-semibold mb-4">Edit Product</h2>

            <form onSubmit={updateProduct} className="space-y-4">
              <input
                type="text"
                value={editProduct.name}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, name: e.target.value })
                }
                className="border p-2 w-full rounded"
                placeholder="Product Name"
              />

              <textarea
                value={editProduct.description}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    description: e.target.value,
                  })
                }
                className="border p-2 w-full rounded"
                placeholder="Product Description"
                rows="3"
              />

              {/* Sizes & Prices */}
              <div className="space-y-2">
                {Object.keys(editProduct.sizes).map((size) => (
                  <div key={size} className="flex items-center gap-2">
                    <label className="w-16 font-medium">{size} Price:</label>
                    <input
                      type="number"
                      value={editProduct.sizes[size].price}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          sizes: {
                            ...editProduct.sizes,
                            [size]: {
                              ...editProduct.sizes[size],
                              price: e.target.value,
                            },
                          },
                        })
                      }
                      className="border p-2 w-full rounded"
                    />
                  </div>
                ))}
              </div>

              {/* Image Uploads */}
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="file"
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      image1: e.target.files[0],
                    })
                  }
                  className="border p-2 w-full rounded"
                />
                <input
                  type="file"
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      image2: e.target.files[0],
                    })
                  }
                  className="border p-2 w-full rounded"
                />
                <input
                  type="file"
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      image3: e.target.files[0],
                    })
                  }
                  className="border p-2 w-full rounded"
                />
                <input
                  type="file"
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      image4: e.target.files[0],
                    })
                  }
                  className="border p-2 w-full rounded"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Update
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  onClick={() => setEditProduct(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default List;
