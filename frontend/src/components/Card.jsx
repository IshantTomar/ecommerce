import React from 'react';

const Card = ({ product }) => {
  return (
    <div className="bg-gray-900 border border-indigo-900 rounded-lg shadow-md p-4 w-72 transform transition-transform duration-300 hover:scale-105">
      {/* Image */}
      <img
        src={product.imageThumbnailUrl}
        alt={product.name}
        className="w-full h-40 object-cover rounded-md mb-3"
      />

      {/* Product Name */}
      <h2 className="text-lg font-semibold text-white mb-1">{product.name}</h2>

      {/* Seller */}
      <p className="text-sm text-gray-400 mb-2">By {product.userId.username}</p>

      {/* Description */}
      <p className="text-sm text-gray-400 mb-2 line-clamp-2">{product.description}</p>

      {/* Price */}
      <p className="text-indigo-400 font-bold text-lg">₹{product.price}</p>

      {/* Stock */}
      <p className="text-sm text-gray-400">In Stock: {product.stock}</p>
    </div>
  );
};

export default Card;
