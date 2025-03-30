import React from "react";
import Image from "next/image";
import { products } from "../data/products";

const Products = () => {
  return (
    <div className="mx-auto flex max-w-[1200px] justify-center">
      <section className="mx-auto grid grid-cols-1 gap-16 p-8 md:grid-cols-4">
        {products.map((product) => (
          <article
            key={product.serialNumber}
            className="cursor-pointer rounded-md border-2 border-gray-200 text-center transition-transform hover:scale-105"
          >
            <Image
              src={product.image}
              alt={product.alt}
              width={250}
              height={250}
              quality={100}
              className="h-[250px] w-[250px] object-cover"
            />
            <h2 className="my-1">{product.name}</h2>
            <p className="my-1">{product.alt}</p>
            <div className="my-1">${product.price}</div>
            <button className="w-full cursor-pointer bg-[#fff] py-2 text-center text-black transition-colors hover:bg-[#daa520]">
              Add to Cart
            </button>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Products;
