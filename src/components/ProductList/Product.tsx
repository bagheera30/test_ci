import React, { useState, useEffect } from "react";
import axios from "axios";
// import Icon from "astro-icon";
import { FaShoppingCart } from "react-icons/fa";
import { VscAccount } from "react-icons/vsc";

const SearchFilter = () => {
  const rupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  };
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  console.log(
    "🚀 ~ file: Test1.tsx:7 ~ SearchFilter ~ searchTerm:",
    searchTerm
  );

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("http://localhost:3000/products");
      setData(result.data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="navbar bg-[#496b63] bg-opacity-9">
        <div className="flex-1">
          <a href="/" className="btn btn-ghost normal-case text-3xl text-white">
            MultiSellerSquare
          </a>
        </div>
        <div className="flex-none gap-2">
          <div className="form-control w-96">
            <input
              type="text"
              placeholder="Cari..."
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
              className="input input-bordered w-24 md:w-auto"
            />
          </div>
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-24 rounded-full">
              <a href="/cart">
                <FaShoppingCart className="ml-2 mt-2 w-7 h-8" />
              </a>
            </div>
          </label>

          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-24 rounded-full">
                <VscAccount className="ml-2 w-8 h-12" />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <a className="justify-between" href="/login">
                  {" "}
                  login
                </a>
              </li>
              <li>
                <a href="/regiter">Register</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="px-32 py-32 justify-between bg-[#E5E5E5]">
        <div className="bg-[#E5E5E5]">
          <div className="carousel w-full h-96 bg-[#E5E5E5]">
            <div id="slide1" className="carousel-item relative w-full">
              <img
                src="src/img/Untitled design (2).jpg"
                className="w-full h-96"
              />
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href="#slide4" className="btn btn-circle">
                  ❮
                </a>
                <a href="#slide4" className="btn btn-circle">
                  ❯
                </a>
              </div>
            </div>
            <div id="slide4" className="carousel-item relative w-full">
              <img
                src="src/img/Untitled design (2).jpg"
                className="w-full h-96"
              />
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href="#slide1" className="btn btn-circle">
                  ❮
                </a>
                <a href="#slide1" className="btn btn-circle">
                  ❯
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-4 bg-[#E5E5E5] pb-10 pt-10">
        {data
          .filter((val) => {
            if (searchTerm === "") {
              return val;
            } else if (
              val.name.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
              return val;
            }
          })
          .map((val, key) => {
            return (
              <div className="card card-compact shadow-xl py-10  w-auto h-[565px] bg-[#496b63]">
                <figure>
                  <img
                    src={val.image}
                    width={80}
                    height={80}
                    className="rounded h-56 w-52"
                    alt={val.name}
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title text-white">{val.name}</h2>
                  <h2 className="text-white mt-5 text-xl">
                    {" "}
                    {rupiah(val.price)}
                  </h2>
                  <div className="w-[50px]  border-[1px] border-white" />
                  <div className="card-actions justify-end mt-28">
                    <a href={`/Products/${val.id}`}>
                      <button className="btn btn-primary">detail</button>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default SearchFilter;
