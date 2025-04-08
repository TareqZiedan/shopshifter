"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
};

const Products = () => {
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data: Product[] = await response.json();
        setFetchedProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="mx-auto flex max-w-[1200px] justify-center">
      <section className="mx-auto grid grid-cols-1 gap-16 p-8 md:grid-cols-4">
        {fetchedProducts.map((product) => (
          <article
            key={product.id}
            className="cursor-pointer rounded-md border-2 border-gray-200 text-center transition-transform hover:scale-105"
          >
            <Image
              src={product.image}
              alt={product.title}
              width={250}
              height={250}
              quality={100}
              className="h-[250px] w-[250px] object-contain"
            />
            <h2 className="my-1 font-semibold">{product.title}</h2>
            <p className="my-1 line-clamp-3 text-sm text-gray-600">
              {product.description}
            </p>
            <div className="my-1 font-bold">${product.price}</div>
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
