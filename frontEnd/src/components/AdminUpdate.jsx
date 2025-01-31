import React, { useState } from 'react';
import { toast } from 'react-toastify';

const EditProductForm = ({ product, onUpdate, onCancel, token, backendUrl }) => {
  const [formData, setFormData] = useState({
    ...product,
    newImages: {
      image1: null,
      image2: null,
      image3: null,
      image4: null
    }
  });

  const handleSizeChange = (size, field, value) => {
    setFormData(prev => ({
      ...prev,
      sizes: {
        ...prev.sizes,
        [size]: {
          ...prev.sizes[size],
          [field]: field === 'price' ? parseFloat(value) : value
        }
      }
    }));
  };

  const handleImageChange = (e, imageKey) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        newImages: {
          ...prev.newImages,
          [imageKey]: file
        }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      submitData.append('productId', product._id);
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('sizes', JSON.stringify(formData.sizes));
      submitData.append('bestSeller', formData.bestSeller);

      // Append any new images
      Object.entries(formData.newImages).forEach(([key, file]) => {
        if (file) {
          submitData.append(key, file);
        }
      });

      onUpdate(submitData);
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث المنتج ' + error.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Images Display and Upload */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Product Images</h3>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="space-y-2">
                <div className="h-40 border rounded-lg overflow-hidden">
                  {formData.image?.[num - 1] ? (
                    <img 
                      src={formData.image[num - 1]} 
                      alt={`Product ${num}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      No image
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, `image${num}`)}
                  className="w-full text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Sizes and Prices */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Sizes and Prices</h3>
          <div className="grid gap-4">
            {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
              <div key={size} className="grid grid-cols-3 gap-4 items-center">
                <span className="font-medium">{size}</span>
                <input
                  type="number"
                  value={formData.sizes?.[size]?.price || ''}
                  onChange={(e) => handleSizeChange(size, 'price', e.target.value)}
                  placeholder="Price"
                  className="border rounded p-2"
                  step="0.01"
                />
                <input
                  type="number"
                  value={formData.sizes?.[size]?.stock || ''}
                  onChange={(e) => handleSizeChange(size, 'stock', e.target.value)}
                  placeholder="Stock"
                  className="border rounded p-2"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductForm;