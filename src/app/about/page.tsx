"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { stopLoading } from "../redux/slices/loadingSlice";

export default function About() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(stopLoading());
  }, [dispatch]);

  return (
    <main className="bg-background min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-foreground mb-6 text-3xl font-bold">
          About ShopShifter
        </h1>

        <section className="bg-card-background mb-8 rounded-lg p-6 shadow-sm">
          <h2 className="text-card-foreground mb-4 text-2xl font-semibold">
            Our Story
          </h2>
          <p className="text-muted-foreground mb-4">
            ShopShifter was founded with a simple mission: to make online
            shopping more convenient and enjoyable. We believe in providing a
            seamless shopping experience with a carefully curated selection of
            products.
          </p>
        </section>

        <section className="bg-card-background mb-8 rounded-lg p-6 shadow-sm">
          <h2 className="text-card-foreground mb-4 text-2xl font-semibold">
            Our Values
          </h2>
          <ul className="text-muted-foreground list-inside list-disc space-y-2">
            <li>
              Quality First: We only offer products that meet our high standards
            </li>
            <li>Customer Satisfaction: Your happiness is our top priority</li>
            <li>Innovation: We continuously improve our platform</li>
            <li>Transparency: Clear pricing and honest product descriptions</li>
          </ul>
        </section>

        <section className="bg-card-background rounded-lg p-6 shadow-sm">
          <h2 className="text-card-foreground mb-4 text-2xl font-semibold">
            Our Team
          </h2>
          <p className="text-muted-foreground">
            We are a dedicated team of professionals passionate about e-commerce
            and customer service. Our diverse backgrounds and expertise allow us
            to provide the best shopping experience possible.
          </p>
        </section>
      </div>
    </main>
  );
}
