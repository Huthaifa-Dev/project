import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: 0,
  name: "user",
  role: "user",
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLogin: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.role = action.payload.role;
    },
    userLogout: () => {
      return initialState;
    },
  },
});

export const { userLogin, userLogout } = userSlice.actions;
