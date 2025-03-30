import React from "react";
import Link from "next/link";

const Navigation = () => {
  return (
    <nav className="w-full bg-white py-4 shadow-sm">
      <div className="flex items-center justify-between px-4">
        <Link href="/" className="block">
          <div className="cursor-pointer text-xl font-bold text-gray-800">
            ShopShifter
          </div>
        </Link>
        <ul className="flex items-center gap-8">
          <li>
            <Link
              href="/"
              className="font-medium text-gray-700 no-underline transition-colors duration-200 hover:text-blue-600"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/products"
              className="font-medium text-gray-700 no-underline transition-colors duration-200 hover:text-blue-600"
            >
              Products
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="font-medium text-gray-700 no-underline transition-colors duration-200 hover:text-blue-600"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="font-medium text-gray-700 no-underline transition-colors duration-200 hover:text-blue-600"
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
