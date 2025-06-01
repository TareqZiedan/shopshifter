"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/store";
import { addToCart } from "../../redux/slices/authSlice";
import { useRedirect } from "../../hooks/useRedirect";
import { stopLoading } from "../../redux/slices/loadingSlice";
import { useRouter } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: {
    rate: number;
    count: number;
  };
};

export default function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = React.use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const dispatch = useDispatch();
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const { redirect } = useRedirect();
  const { theme } = useTheme();

  // Fetch product and related products
  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        console.log("Fetching product details...");
        const response = await fetch(
          `https://fakestoreapi.com/products/${unwrappedParams.id}`,
        );
        const data: Product = await response.json();
        setProduct(data);
        console.log("Product details fetched successfully");

        // Fetch related products (same category)
        console.log("Fetching related products...");
        const relatedResponse = await fetch(
          `https://fakestoreapi.com/products/category/${data.category}`,
        );
        const relatedData: Product[] = await relatedResponse.json();
        // Filter out current product and limit to 4 related products
        const filteredRelated = relatedData
          .filter((p) => p.id !== data.id)
          .slice(0, 4);
        setRelatedProducts(filteredRelated);
        console.log(
          "Related products fetched successfully:",
          filteredRelated.map((p) => p.id),
        );

        // Prefetch related product pages
        console.log("Starting to prefetch related product pages...");
        for (const relatedProduct of filteredRelated) {
          try {
            await router.prefetch(`/products/${relatedProduct.id}`);
            console.log(
              `Successfully prefetched related product ${relatedProduct.id}`,
            );
          } catch (error) {
            console.error(
              `Failed to prefetch related product ${relatedProduct.id}:`,
              error,
            );
          }
        }
        console.log("Related product prefetching complete");
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product. Please try again later.");
      } finally {
        setLoading(false);
        dispatch(stopLoading());
      }
    };

    fetchProductAndRelated();
  }, [unwrappedParams.id, dispatch, router]);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      redirect("/auth");
      return;
    }

    if (!product) return;

    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: quantity,
      }),
    );
  };

  if (loading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-foreground text-center text-lg">
          Loading product...
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-destructive text-center">
          {error || "Product not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Product Image */}
          <div className="bg-card-background relative aspect-square overflow-hidden rounded-lg p-4 shadow-sm sm:p-6 lg:p-8">
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-card-foreground text-2xl font-bold sm:text-3xl lg:text-4xl">
                {product.title}
              </h1>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                {product.category}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${
                      i < Math.round(product.rating.rate)
                        ? "text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-muted-foreground text-xs sm:text-sm">
                ({product.rating.count} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="text-primary-600 dark:text-primary-400 text-2xl font-bold sm:text-3xl">
              ${product.price.toFixed(2)}
            </div>

            {/* Description */}
            <div className="prose max-w-none">
              <p className="text-muted-foreground text-sm sm:text-base">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <label
                htmlFor="quantity"
                className="text-card-foreground text-sm font-medium sm:text-base"
              >
                Quantity
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(+e.target.value)}
                className="border-border bg-background text-foreground focus:border-primary-500 focus:ring-primary-500 cursor-pointer rounded-md py-1.5 text-center text-sm focus:outline-none sm:text-base"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`w-full cursor-pointer rounded-md px-4 py-3 text-base font-semibold text-white shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none sm:text-lg ${
                theme === "dark"
                  ? "bg-indigo-500 hover:bg-indigo-600"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              Add to Cart
            </button>

            {/* Additional Features */}
            <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
              <div className="flex items-center space-x-2">
                <svg
                  className="h-5 w-5 text-green-500 sm:h-6 sm:w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-muted-foreground text-xs sm:text-sm">
                  Free shipping worldwide
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  className="h-5 w-5 text-green-500 sm:h-6 sm:w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-muted-foreground text-xs sm:text-sm">
                  30-day money-back guarantee
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-card-foreground mb-8 text-2xl font-bold">
              Related Products
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="group bg-card-background cursor-pointer rounded-lg p-4 shadow-sm transition-all hover:scale-105 hover:shadow-md"
                  onClick={() => router.push(`/products/${relatedProduct.id}`)}
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg">
                    <Image
                      src={relatedProduct.image}
                      alt={relatedProduct.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="mt-4 flex h-20 flex-col justify-between">
                    <h3 className="text-card-foreground line-clamp-2 text-sm font-medium">
                      {relatedProduct.title}
                    </h3>
                    <p className="text-primary-600 dark:text-primary-400 text-sm font-semibold">
                      ${relatedProduct.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
