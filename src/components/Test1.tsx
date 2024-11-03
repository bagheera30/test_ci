import React, { useState, useEffect } from "react";
import axios from "axios";

import Counter from "./counter";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  quantity: number;
}

const ProductDetail = ({ match }: { match: { params: { id: string } } }) => {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get<Product>(
        `/api/products/${match.params.id}`
      );
      setProduct(data);
    };

    fetchProduct();
  }, [match]);

  const addToCart = () => {
    let cart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : {};
    let id = product?.id.toString();
    if (id) {
      cart[id] = cart[id] ? cart[id] : 0;
      let qty = cart[id] + parseInt(product?.quantity.toString());
      cart[id] = qty;
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  };

  if (!product) return null;

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <img src={product.image} alt={product.name} className="img-fluid" />
        </div>
        <div className="col-md-6">
          <h1>{product.name}</h1>
          <h2>Rp. {product.price}</h2>
          <h3>Detail Produk</h3>
          <hr />
          <p>{product.description}</p>
          <Counter quantity={product.quantity} />
          <hr />
          <div className="d-flex justify-content-between">
            <button className="btn btn-primary" onClick={addToCart}>
              Masukan Keranjang
            </button>
            <a
              href="https://api.whatsapp.com/send/?phone=6289632126428&text&type=phone_number&app_absent=0"
              className="btn btn-success"
            >
              Hubungi Penjual
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
