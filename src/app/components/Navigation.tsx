"use client";

import React, { useState, useRef, useEffect } from "react";
import type { KeyboardEvent } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { usePathname } from "next/navigation";
import type { RootState } from "../redux/store";
import { logout } from "../redux/slices/authSlice";
// TODO: REMOVE LOCAL CACHE LOGIC WHEN USING REAL API (DO NOT DELETE THIS COMMENT)
import { deleteCachedUser } from "../auth/cacheUtils";
import { useRedirect } from "../hooks/useRedirect";
import { stopLoading } from "../redux/slices/loadingSlice";
import { useTheme } from "../context/ThemeContext";

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
  const { redirect } = useRedirect();

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
    setOpen(false);
    redirect(href);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={buttonRef}
        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
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
            className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 md:hidden"
            tabIndex={0}
            role="menuitem"
            onClick={() => handleLinkClick("/cart")}
          >
            Cart
          </Link>
          {/* TODO: REMOVE LOCAL CACHE LOGIC WHEN USING REAL API (DO NOT DELETE THIS COMMENT)
              TEMP: Delete Profile button for demo/testing */}
          <button
            className="block w-full cursor-pointer px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
            tabIndex={0}
            role="menuitem"
            onClick={() => {
              if (user) {
                deleteCachedUser(user);
                onLogout();
                setOpen(false);
              }
            }}
          >
            Delete Profile
          </button>
          <button
            className="block w-full cursor-pointer px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
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
  );
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const Navigation = () => {
  const { theme, toggleTheme } = useTheme();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.auth.user);
  const cartItems = useSelector((state: RootState) => state.auth.cart);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { redirect } = useRedirect();
  const [cartAnimation, setCartAnimation] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      dispatch(stopLoading());
      redirect("/");
      dispatch(logout());
      const timeoutId = setTimeout(() => {
        dispatch(stopLoading());
      }, 1000);
      return timeoutId;
    } catch (error) {
      console.error("Logout failed:", error);
      dispatch(stopLoading());
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const handleNavigation = (href: string) => {
    redirect(href);
  };

  useEffect(() => {
    setCartAnimation(true);
    const timer = setTimeout(() => setCartAnimation(false), 1000);
    return () => clearTimeout(timer);
  }, [cartItems]);

  // Don't render anything until client-side hydration is complete
  if (!isMounted) {
    return null;
  }

  return (
    <nav
      className="sticky top-0 z-50 w-full bg-white py-4 shadow-sm transition-colors dark:bg-gray-900"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="block cursor-pointer"
          tabIndex={0}
          aria-label="ShopShifter home"
          onClick={() => handleNavigation("/")}
        >
          <div className="flex items-center gap-2">
            <svg
              className="h-8 w-8 text-indigo-600 dark:text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <div className="text-xl font-bold text-gray-800 dark:text-white">
              ShopShifter
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          <button
            onClick={toggleTheme}
            className="cursor-pointer rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
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
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
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
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>

          <button
            className="cursor-pointer rounded p-2 focus:ring focus:outline-none md:hidden"
            aria-label="Open navigation menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <svg
              className="h-6 w-6 text-gray-600 dark:text-gray-300"
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
            className={`flex-col items-center gap-8 md:flex md:flex-row ${
              mobileOpen ? "flex" : "hidden"
            } absolute top-16 left-0 z-40 w-full bg-white p-4 shadow-lg md:static md:z-auto md:flex md:w-auto md:bg-transparent md:p-0 md:shadow-none dark:bg-gray-900`}
          >
            {navLinks.map((link) => (
              <li key={link.href} className="w-full md:w-auto">
                <Link
                  href={link.href}
                  className={`block w-full cursor-pointer text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white ${
                    pathname === link.href
                      ? "font-semibold text-indigo-600 dark:text-indigo-400"
                      : ""
                  }`}
                  onClick={() => handleNavigation(link.href)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="w-full md:hidden">
              <button
                onClick={toggleTheme}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100 focus:outline-none dark:text-gray-300 dark:hover:bg-gray-800"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <>
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </li>
          </ul>

          {isLoggedIn ? (
            <>
              <Link
                href="/cart"
                className="relative cursor-pointer"
                onClick={() => handleNavigation("/cart")}
              >
                <svg
                  className={`h-6 w-6 text-gray-600 transition-transform dark:text-gray-300 ${
                    cartAnimation ? "scale-110" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
                    {totalItems}
                  </span>
                )}
              </Link>
              <ProfileMenu user={user} onLogout={handleLogout} />
            </>
          ) : (
            <Link
              href="/auth"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
              onClick={() => handleNavigation("/auth")}
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
