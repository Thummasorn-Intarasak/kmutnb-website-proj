import { configureStore } from "@reduxjs/toolkit";
import gamesReducer from "./slices/gamesSlice";
import cartReducer from "./slices/cartSlice";
import authReducer from "./slices/authSlice";
import bannerReducer from "./slices/bannerSlice";
import wishlistReducer from "./slices/wishlistSlice";

export const store = configureStore({
  reducer: {
    games: gamesReducer,
    cart: cartReducer,
    auth: authReducer,
    banners: bannerReducer,
    wishlist: wishlistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
