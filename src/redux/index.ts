import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./slices/cartSlice";
import { categorySlice } from "./slices/categorySlice";
import { productSilice } from "./slices/productSlice";
import { userSlice } from "./slices/userSlice";

// import { rootReducer } from "./rootReducer";

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    categories: categorySlice.reducer,
    products: productSilice.reducer,
    carts: cartSlice.reducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
