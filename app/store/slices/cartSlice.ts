import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Game } from "./gamesSlice";

export interface CartItem {
  id: number;
  game: Game;
  quantity: number;
  addedAt: string;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Game>) => {
      const game = action.payload;
      const existingItem = state.items.find((item) => item.game.id === game.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          id: Date.now(), // Simple ID generation
          game,
          quantity: 1,
          addedAt: new Date().toISOString(),
        });
      }

      // Update totals
      state.totalItems = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      state.totalPrice = state.items.reduce(
        (total, item) => total + item.game.price * item.quantity,
        0
      );
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      const gameId = action.payload;
      state.items = state.items.filter((item) => item.game.id !== gameId);

      // Update totals
      state.totalItems = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      state.totalPrice = state.items.reduce(
        (total, item) => total + item.game.price * item.quantity,
        0
      );
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ gameId: number; quantity: number }>
    ) => {
      const { gameId, quantity } = action.payload;
      const item = state.items.find((item) => item.game.id === gameId);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((item) => item.game.id !== gameId);
        } else {
          item.quantity = quantity;
        }

        // Update totals
        state.totalItems = state.items.reduce(
          (total, item) => total + item.quantity,
          0
        );
        state.totalPrice = state.items.reduce(
          (total, item) => total + item.game.price * item.quantity,
          0
        );
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },

    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },

    openCart: (state) => {
      state.isOpen = true;
    },

    closeCart: (state) => {
      state.isOpen = false;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
} = cartSlice.actions;

export default cartSlice.reducer;
