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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data: Product[] = await response.json();
        setFetchedProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="mx-auto flex max-w-[1200px] justify-center">
      <section className="mx-auto grid grid-cols-1 gap-16 p-8 md:grid-cols-4">
        {loading && (
          <div className="col-span-full text-center text-lg">
            Loading products...
          </div>
        )}

        {error && (
          <div className="col-span-full text-center text-red-600">{error}</div>
        )}

        {!loading &&
          !error &&
          fetchedProducts.map((product) => (
            <article
              key={product.id}
              className="grid h-full grid-rows-[auto_auto_1fr_auto_auto] rounded-md border-2 border-gray-200 text-center transition-transform hover:scale-105"
            >
              <Image
                src={product.image}
                alt={product.title}
                width={250}
                height={250}
                quality={100}
                className="h-[250px] w-[250px] cursor-pointer object-cover"
              />
              <h2 className="mx-2 my-2 font-semibold">
                {product.title.split(" ").slice(0, 10).join(" ")}
              </h2>

              <p className="mx-2 mb-4 text-sm text-gray-600">
                {product.description.split(" ").slice(0, 10).join(" ")}
              </p>

              <div className="mb-4 font-bold">${product.price}</div>

              <button
                className="mt-auto w-full cursor-pointer bg-[#fff] py-2 text-black transition-colors hover:bg-[#daa520]"
                aria-label={`Add ${product.title} to cart`}
              >
                Add to Cart
              </button>
            </article>
          ))}
      </section>
    </div>
  );
};

export default Products;
