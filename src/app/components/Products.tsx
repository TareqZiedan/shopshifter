"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { addToCart } from "../redux/slices/authSlice";
import { useRedirect } from "../hooks/useRedirect";
import { stopLoading } from "../redux/slices/loadingSlice";
import { useRouter } from "next/navigation";
import { useTheme } from "../context/ThemeContext";

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
  const { theme } = useTheme();
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
      <section className="mx-auto grid grid-cols-1 gap-8 gap-y-8 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {loading && (
          <div
            className={`col-span-full text-center text-lg ${theme === "dark" ? "text-gray-50" : "text-gray-900"}`}
          >
            Loading products...
          </div>
        )}

        {error && (
          <div className="col-span-full text-center text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          fetchedProducts.map((product) => (
            <article
              key={product.id}
              className={`flex h-full flex-col justify-between rounded-lg border shadow-sm transition-all hover:scale-105 hover:shadow-md ${
                theme === "dark"
                  ? "border-gray-600 bg-gray-800"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div
                className="flex h-full cursor-pointer flex-col justify-between"
                onClick={() => redirect(`/products/${product.id}`)}
                onMouseEnter={() => handleProductHover(product.id)}
              >
                <div
                  className={`relative aspect-square w-full overflow-hidden ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain p-4"
                    priority={product.id <= 4}
                  />
                </div>

                <div className="flex flex-col gap-2 p-4">
                  <div className="h-[3.5rem]">
                    <h2
                      className={`line-clamp-2 font-semibold ${
                        theme === "dark" ? "text-gray-50" : "text-gray-900"
                      }`}
                    >
                      {product.title}
                    </h2>
                  </div>

                  <p
                    className={`line-clamp-3 text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {product.description}
                  </p>

                  <div
                    className={`mt-2 text-lg font-bold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    ${product.price.toFixed(2)}
                  </div>
                </div>
              </div>

              <button
                className={`mt-auto w-full cursor-pointer py-3 text-white transition-colors ${
                  theme === "dark"
                    ? "bg-indigo-500 hover:bg-indigo-600"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
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
