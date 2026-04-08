import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import your API function
import { uploadProduct } from '../services/productService';

const UploadProduct = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    productImage: null,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validate = (data) => {
    const newErrors = {};

    if (!data.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!data.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!data.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(data.price) || data.price <= 0) {
      newErrors.price = 'Price must be a valid number';
    }

    if (!data.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!data.stock) {
      newErrors.stock = 'Stock is required';
    } else if (isNaN(data.stock) || data.stock < 0) {
      newErrors.stock = 'Stock must be a valid number';
    }

    if (!data.productImage) {
      newErrors.productImage = 'Product image is required';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));

    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('category', form.category);
      formData.append('stock', form.stock);
      formData.append('productImage', form.productImage);

      await uploadProduct(formData);

      navigate('/');
    } catch (error) {
      const data = error.response?.data;

      if (data?.errors) {
        const newErrors = {};
        data.errors.forEach((err) => {
          newErrors[err.path] = err.msg;
        });
        setErrors(newErrors);
        return;
      }

      setServerError(data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="border-2 border-indigo-900 w-full max-w-md bg-gray-900 rounded-3xl shadow-xl shadow-zinc-950 flex flex-col overflow-hidden">
        <form onSubmit={handleSubmit} className="flex flex-col w-full px-8 pt-8 pb-6">
          <h1 className="text-center text-4xl font-extrabold mb-6">Upload Product</h1>

          {serverError && (
            <p className="pl-4 bg-red-950 text-red-200 text-lg rounded-xl border border-red-400 py-2 mb-4">
              {serverError}
            </p>
          )}

          {/* Name */}
          <input
            name="name"
            placeholder="Product name"
            value={form.name}
            onChange={handleChange}
            className="mt-2 p-2 bg-gray-800 border border-indigo-500 rounded-xl"
          />
          {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}

          {/* Description */}
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="mt-3 p-2 bg-gray-800 border border-indigo-500 rounded-xl"
          />
          {errors.description && <p className="text-red-400 text-sm">{errors.description}</p>}

          {/* Price */}
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="mt-3 p-2 bg-gray-800 border border-indigo-500 rounded-xl"
          />
          {errors.price && <p className="text-red-400 text-sm">{errors.price}</p>}

          {/* Category */}
          <div className="relative mt-3">
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="appearance-none pl-4 pr-10 py-2 bg-gray-800 w-full border border-indigo-500 rounded-xl outline-none focus:border-indigo-400 focus:border-2 transition"
            >
              <option value="" disabled>
                Select category
              </option>
              <option value="food">Food</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="others">Others</option>
            </select>

            {/* Custom arrow */}
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              ▼
            </div>
          </div>

          {errors.category && <p className="text-red-400 text-sm pl-2 mt-1">{errors.category}</p>}

          {/* Stock */}
          <input
            name="stock"
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            className="mt-3 p-2 bg-gray-800 border border-indigo-500 rounded-xl"
          />
          {errors.stock && <p className="text-red-400 text-sm">{errors.stock}</p>}

          {/* Image */}
          <div className="mt-3">
            <label className="block">
              <span className="sr-only">Choose product image</span>

              <input
                type="file"
                name="productImage"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
                id="fileInput"
              />

              <label
                htmlFor="fileInput"
                className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl cursor-pointer transition"
              >
                {form.productImage ? 'Change Image' : 'Choose Image'}
              </label>
            </label>

            {form.productImage && (
              <p className="text-sm text-gray-400 mt-2">Selected: {form.productImage.name}</p>
            )}

            {errors.productImage && (
              <p className="text-red-400 text-sm mt-1">{errors.productImage}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-5 px-5 py-2 rounded-xl ${
              loading ? 'bg-gray-500' : 'bg-indigo-600 hover:bg-indigo-500'
            }`}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadProduct;
