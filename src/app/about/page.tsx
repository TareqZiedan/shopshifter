"use client";

export default function About() {
  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold">About ShopShifter</h1>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Our Story</h2>
          <p className="mb-4 text-gray-700">
            ShopShifter was founded with a simple mission: to make online
            shopping more convenient and enjoyable. We believe in providing a
            seamless shopping experience with a carefully curated selection of
            products.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Our Values</h2>
          <ul className="list-inside list-disc space-y-2 text-gray-700">
            <li>
              Quality First: We only offer products that meet our high standards
            </li>
            <li>Customer Satisfaction: Your happiness is our top priority</li>
            <li>Innovation: We continuously improve our platform</li>
            <li>Transparency: Clear pricing and honest product descriptions</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Our Team</h2>
          <p className="text-gray-700">
            We are a dedicated team of professionals passionate about e-commerce
            and customer service. Our diverse backgrounds and expertise allow us
            to provide the best shopping experience possible.
          </p>
        </section>
      </div>
    </main>
  );
}
