import React, { useState } from "react";
import axios from "axios";

const ProductForm = () => {
  const [product, setProduct] = useState({
    name: "",
    deskripsi: "",
    quantity: 0, // Initialize as integer
    price: 0, // Initialize as integer
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "quantity" || name === "price") {
      // Convert value to integer before updating state
      const parsedValue = parseInt(value);
      setProduct({
        ...product,
        [name]: isNaN(parsedValue) ? 0 : parsedValue, // Handle invalid input
      });
    } else {
      setProduct({
        ...product,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:3000/products`,
        product
      );

      if (response.status === 200) {
        alert("Data berhasil dikirim");
        history.back();
      } else {
        console.error(`Error: ${response.status}`);
        alert("Terjadi kesalahan saat mengirim data");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mengirim data");
    }
  };

  return (
    <>
      <h1 className="text-black text-4xl font-bold mb-3">add product</h1>
      <form onSubmit={handleSubmit}>
        <div className="py-2">
          <label className="text-black font-bold text-2xl mb-3">
            produk name
          </label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <div className="py-2">
          <label className="text-black font-bold text-2xl mb-3">
            Deskripsi
          </label>
          <textarea
            name="deskripsi"
            value={product.deskripsi}
            onChange={handleChange}
            className="textarea textarea-bordered w-full max-w-xs"
          />
        </div>
        <div className="py-2">
          <label className="text-black font-bold text-2xl mb-3">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <div className="py-2">
          <label className="text-black font-bold text-2xl mb-3">Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <div className="py-3">
          <label className="text-black font-bold text-2xl mb-3">Image</label>
          <input
            type="text"
            name="image"
            value={product.image}
            onChange={handleChange}
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <div className="text-center">
          <button type="submit" className="w-full btn btn-neutral bg-red-600">
            ADD Product
          </button>
        </div>
      </form>
    </>
  );
};

export default ProductForm;
