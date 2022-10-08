import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../types";

type State = Partial<User>;

const initialState: State = {};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLogin: (state, action) => {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.role = action.payload.role;
    },
    userLogout: () => {
      return initialState;
    },
  },
});

export const selectUser = (state: State) => state;
export const { userLogin, userLogout } = userSlice.actions;
