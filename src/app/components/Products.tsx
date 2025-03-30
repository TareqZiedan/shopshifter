import React from "react";
import Image from "next/image";

const Storage = [
  {
    serialNumber: 1,
    name: "White Watch",
    image: "/products/product1.jpg",
    alt: "A Beautiful White Watch",
    price: 19.99,
  },
  {
    serialNumber: 2,
    name: "White Watch",
    image: "/products/product2.jpg",
    alt: "A Beautiful White Watch",
    price: 19.99,
  },
  {
    serialNumber: 3,
    name: "White Watch",
    image: "/products/product3.jpg",
    alt: "A Beautiful White Watch",
    price: 19.99,
  },
  {
    serialNumber: 4,
    name: "White Watch",
    image: "/products/product4.jpg",
    alt: "A Beautiful White Watch",
    price: 19.99,
  },
];

const Products = () => {
  return (
    <div className="mx-auto flex max-w-[1200px] justify-center">
      <section className="mx-auto grid grid-cols-1 gap-16 p-8 md:grid-cols-4">
        {Storage.map((product) => (
          <article
            key={product.serialNumber}
            className="cursor-pointer rounded-md border-2 border-gray-200 text-center transition-transform hover:scale-105"
          >
            <Image
              src={product.image}
              alt={product.alt}
              width={200}
              height={200}
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
