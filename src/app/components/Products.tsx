"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { addToCart } from "../redux/slices/authSlice";
import { useRedirect } from "../hooks/useRedirect";
import { stopLoading } from "../redux/slices/loadingSlice";
import { useRouter } from "next/navigation";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
};

const Products = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const { redirect } = useRedirect();
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prefetchedProducts, setPrefetchedProducts] = useState<Set<number>>(
    new Set(),
  );

  // Prefetch product detail pages
  useEffect(() => {
    const prefetchProductDetails = async () => {
      console.log("Starting to prefetch product details...");
      for (const product of fetchedProducts) {
        if (!prefetchedProducts.has(product.id)) {
          try {
            console.log(`Prefetching product ${product.id}...`);
            await router.prefetch(`/products/${product.id}`);
            setPrefetchedProducts((prev) => new Set([...prev, product.id]));
            console.log(`Successfully prefetched product ${product.id}`);
          } catch (error) {
            console.error(`Failed to prefetch product ${product.id}:`, error);
          }
        }
      }
      console.log(
        "Prefetching complete. Prefetched products:",
        Array.from(prefetchedProducts),
      );
    };

    if (fetchedProducts.length > 0) {
      prefetchProductDetails();
    }
  }, [fetchedProducts, router, prefetchedProducts]);

  // Prefetch on hover
  const handleProductHover = async (productId: number) => {
    if (!prefetchedProducts.has(productId)) {
      console.log(`Hover prefetching product ${productId}...`);
      try {
        await router.prefetch(`/products/${productId}`);
        setPrefetchedProducts((prev) => new Set([...prev, productId]));
        console.log(`Successfully hover prefetched product ${productId}`);
      } catch (error) {
        console.error(`Failed to hover prefetch product ${productId}:`, error);
      }
    }
  };

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
        dispatch(stopLoading());
      }
    };

    fetchProducts();
  }, [dispatch]);

  const handleAddToCart = (product: Product) => {
    if (!isLoggedIn) {
      redirect("/auth");
      return;
    }

    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      }),
    );
  };

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
              className="flex h-full flex-col justify-between rounded-md border-2 border-gray-200 text-center transition-transform hover:scale-105"
            >
              <div
                className="flex h-full cursor-pointer flex-col justify-between"
                onClick={() => redirect(`/products/${product.id}`)}
                onMouseEnter={() => handleProductHover(product.id)}
              >
                <Image
                  src={product.image}
                  alt={product.title}
                  width={250}
                  height={250}
                  quality={100}
                  className="h-[250px] w-[250px] object-cover"
                />
                <h2 className="mx-2 my-2 font-semibold">
                  {product.title.split(" ").slice(0, 10).join(" ")}
                </h2>

                <p className="mx-2 mb-4 text-sm text-gray-600">
                  {product.description.split(" ").slice(0, 10).join(" ")}
                </p>

                <div className="mb-4 font-bold">${product.price}</div>
              </div>

              <button
                className="w-full cursor-pointer bg-[#fff] py-2 text-black transition-colors hover:bg-[#daa520]"
                aria-label={`Add ${product.title} to cart`}
                onClick={() => handleAddToCart(product)}
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
