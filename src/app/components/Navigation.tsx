"use client";

import React, { useState, useRef, useEffect } from "react";
import type { KeyboardEvent } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import type { RootState } from "../redux/store";
import { logout } from "../redux/slices/authSlice";
// TODO: REMOVE LOCAL CACHE LOGIC WHEN USING REAL API (DO NOT DELETE THIS COMMENT)
import { deleteCachedUser } from "../auth/page";
import LoadingModal from "./LoadingModal";

// ProfileMenu component for dropdown logic and accessibility
const ProfileMenu = ({
  user,
  onLogout,
}: {
  user: string | null;
  onLogout: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  // Close dropdown on outside click or escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    // Use a non-any type for keyboard event
    const handleEscape = (event: Event) => {
      if (event instanceof KeyboardEvent && event.key === "Escape") {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  // Keyboard navigation for dropdown
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      setOpen((prev) => !prev);
    } else if (e.key === "ArrowDown" && open) {
      const firstItem = menuRef.current?.querySelector<HTMLElement>("a,button");
      firstItem?.focus();
    }
  };

  const handleLinkClick = (href: string) => {
    setIsRedirecting(true);
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      {isRedirecting && <LoadingModal />}
      <div className="relative" ref={menuRef}>
        <button
          ref={buttonRef}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
          aria-label="Profile menu"
          aria-haspopup="true"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={handleKeyDown}
        >
          {/* Placeholder for avatar, fallback to icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6 text-gray-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75V19.5z"
            />
          </svg>
        </button>
        {open && (
          <div
            className="ring-opacity-5 absolute right-0 z-50 mt-2 w-40 rounded-md bg-white py-2 shadow-lg ring-1 ring-black"
            role="menu"
            aria-label="Profile dropdown"
          >
            <div
              className="border-b px-4 py-2 text-sm text-gray-700"
              tabIndex={-1}
            >
              {user ? user : "Profile"}
            </div>
            <Link
              href="/cart"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 md:hidden"
              tabIndex={0}
              role="menuitem"
              onClick={() => handleLinkClick("/cart")}
            >
              Cart
            </Link>
            {/* TODO: REMOVE LOCAL CACHE LOGIC WHEN USING REAL API (DO NOT DELETE THIS COMMENT)
                TEMP: Delete Profile button for demo/testing */}
            <button
              className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
              tabIndex={0}
              role="menuitem"
              onClick={() => {
                if (user) deleteCachedUser(user);
                onLogout();
                setOpen(false);
              }}
            >
              Delete Profile
            </button>
            <button
              className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
              tabIndex={0}
              role="menuitem"
              onClick={() => {
                onLogout();
                setOpen(false);
              }}
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </>
  );
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const Navigation = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.auth.user);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [cartAnimation, setCartAnimation] = useState(false);

  // Responsive nav state (for mobile, optional)
  const [mobileOpen, setMobileOpen] = useState(false);

  // Reset isRedirecting after navigation
  useEffect(() => {
    if (isRedirecting) {
      const timer = setTimeout(() => setIsRedirecting(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isRedirecting]);

  const handleLogout = () => {
    dispatch(logout());
    setIsRedirecting(true);
  };

  const handleNavigation = (href: string) => {
    setIsRedirecting(true);
    router.push(href);
  };

  // Trigger cart animation when items change
  useEffect(() => {
    setCartAnimation(true);
    const timer = setTimeout(() => setCartAnimation(false), 1000);
    return () => clearTimeout(timer);
  }, [cartItems]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {isRedirecting && <LoadingModal />}
      <nav
        className="w-full bg-white py-4 shadow-sm"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between px-4">
          <Link
            href="/"
            className="block"
            tabIndex={0}
            aria-label="ShopShifter home"
            onClick={() => handleNavigation("/")}
          >
            <div className="cursor-pointer text-xl font-bold text-gray-800">
              ShopShifter
            </div>
          </Link>
          {/* Hamburger for mobile (optional, can be styled further) */}
          <button
            className="ml-2 rounded p-2 focus:ring focus:outline-none md:hidden"
            aria-label="Open navigation menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <ul
            className={`flex-col items-center gap-8 md:flex md:flex-row ${mobileOpen ? "flex" : "hidden"} absolute top-16 left-0 z-40 w-full bg-white md:static md:z-auto md:flex md:w-auto md:bg-transparent`}
          >
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`font-medium no-underline transition-colors duration-200 hover:text-blue-600 ${pathname === link.href ? "text-blue-600" : "text-gray-700"}`}
                  aria-current={pathname === link.href ? "page" : undefined}
                  tabIndex={0}
                  onClick={() => handleNavigation(link.href)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {/* Show signup link only if not logged in */}
            {!isLoggedIn && (
              <li>
                <Link
                  href="/auth?mode=signup"
                  className="font-medium text-blue-600 no-underline transition-colors duration-200 hover:text-blue-800"
                  tabIndex={0}
                  onClick={() => handleNavigation("/auth?mode=signup")}
                >
                  Sign Up
                </Link>
              </li>
            )}
            {/* Cart icon - only show when logged in */}
            {isLoggedIn && (
              <li className="relative">
                <Link
                  href="/cart"
                  className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
                  aria-label="Shopping cart"
                  onClick={() => handleNavigation("/cart")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`h-6 w-6 text-gray-600 transition-transform duration-300 ${cartAnimation ? "scale-110" : ""}`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </li>
            )}
            {/* Profile icon and dropdown */}
            <li className="relative">
              {!isLoggedIn ? (
                <Link
                  href="/auth"
                  title="Profile"
                  tabIndex={0}
                  aria-label="Go to authentication page"
                  onClick={() => handleNavigation("/auth")}
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6 text-gray-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75V19.5z"
                      />
                    </svg>
                  </span>
                </Link>
              ) : (
                <ProfileMenu user={user} onLogout={handleLogout} />
              )}
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
