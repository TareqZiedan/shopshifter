import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
};

interface AuthState {
  isLoggedIn: boolean;
  user: string | null;
  cart: CartItem[];
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  cart: [],
};

// Debounce implementation for saveToCache
let saveTimeout: NodeJS.Timeout | null = null;
const DEBOUNCE_DELAY = 1000; // 1 second delay

const saveToCache = (state: AuthState) => {
  if (typeof window === "undefined") return;

  // Capture values immediately and create clean copies
  const user = state.user;
  const cart = state.cart.map((item) => ({
    id: item.id,
    title: item.title,
    price: item.price,
    image: item.image,
    quantity: item.quantity,
  }));

  // Clear any existing timeout
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  // Set new timeout
  saveTimeout = setTimeout(() => {
    try {
      if (user) {
        localStorage.setItem("user", user);
        localStorage.setItem(`cart_${user}`, JSON.stringify(cart));
      }
    } catch (error) {
      console.error("Error saving user data to cache:", error);
    }
  }, DEBOUNCE_DELAY);
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.isLoggedIn = true;
      state.user = action.payload;
      // Load existing cart for the user if available
      if (typeof window !== "undefined") {
        try {
          const cachedCart = localStorage.getItem(`cart_${action.payload}`);
          state.cart = cachedCart ? JSON.parse(cachedCart) : [];
        } catch (error) {
          console.error("Error loading cart during login:", error);
          state.cart = [];
        }
      }
      saveToCache(state);
    },
    logout: (state) => {
      // Save cart data before logging out
      if (typeof window !== "undefined" && state.user) {
        try {
          localStorage.setItem(
            `cart_${state.user}`,
            JSON.stringify(state.cart),
          );
        } catch (error) {
          console.error("Error saving cart during logout:", error);
        }
      }
      state.isLoggedIn = false;
      state.user = null;
      state.cart = [];
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("user");
        } catch (error) {
          console.error("Error clearing user cache:", error);
        }
      }
    },
    loadUser: (state) => {
      if (typeof window === "undefined") return;

      try {
        const user = localStorage.getItem("user");
        if (user) {
          const cachedCart = localStorage.getItem(`cart_${user}`);
          state.isLoggedIn = true;
          state.user = user;
          state.cart = cachedCart ? JSON.parse(cachedCart) : [];
        }
      } catch (error) {
        console.error("Error loading user from cache:", error);
      }
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.cart.find(
        (item) => item.id === action.payload.id,
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.cart.push(action.payload);
      }
      saveToCache(state);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.cart = state.cart.filter((item) => item.id !== action.payload);
      saveToCache(state);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>,
    ) => {
      const item = state.cart.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
      saveToCache(state);
    },
    clearCart: (state) => {
      state.cart = [];
      saveToCache(state);
    },
  },
});

export const {
  login,
  logout,
  loadUser,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} = authSlice.actions;
export default authSlice.reducer;
