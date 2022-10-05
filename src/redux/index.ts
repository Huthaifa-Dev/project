import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./slices/userSlice";

// import { rootReducer } from "./rootReducer";

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});
export type RootState = {
  user: { id: number; name: string };
};
