import { configureStore } from "@reduxjs/toolkit";
import { Category, User } from "../types";
import { categorySlice } from "./slices/categorySlice";
import { userSlice } from "./slices/userSlice";

// import { rootReducer } from "./rootReducer";

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    categories: categorySlice.reducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
