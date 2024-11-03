import React from "react";
import Nav from "./header/Nav.astro";
import { Image } from "astro:assets";

const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(number);
};

const dasbordComponens = (api) => {
  return (
    <>
      <div className="form-control w-96">
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered w-24 md:w-auto"
        />
      </div>

      <h1>a</h1>
      <div className="grid md:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-4 bg-[#E5E5E5] pb-10 pt-10">
        {api &&
          api.data &&
          api.data.map((product) => {
            return (
              <div className="card  shadow-xl py-10  w-auto h-[565px] bg-[#496b63]">
                <figure>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={20}
                    height={20}
                  />
                </figure>
                <div className="card-body">
                  <h1 className="card-title text-white">{product.name}</h1>
                  <h2 className="text-white mt-5"> {rupiah(product.price)}</h2>
                  <div className="w-[50px]  border-[1px] border-white" />
                  <div className="card-actions justify-end mt-28">
                    <a href={`/Products/${product.id}`}>
                      <button className="btn btn-primary">detail</button>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default dasbordComponens;
