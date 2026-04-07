import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { getMyProducts, deleteProduct } from '../services/productService';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getMyProducts(); // call backend route for seller's products
        setProducts(data.products);
      } catch (error) {
        console.error('Failed to fetch your products', error);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      console.error('Delete failed', error);
    }
  };

  return (
    <>
      <Header />
      <div className="p-6">
        <h1 className="text-3xl text-white font-bold mb-6 text-center">Your Products</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-gray-900 border border-indigo-900 rounded-lg p-4 flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              <h2 className="text-lg font-semibold text-white mb-1">{product.name}</h2>
              <p className="text-sm text-gray-400 mb-2">{product.description}</p>
              <p className="text-indigo-400 font-bold text-lg mb-2">₹{product.price}</p>
              <button
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 text-white"
                onClick={() => handleDelete(product._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ManageProducts;
