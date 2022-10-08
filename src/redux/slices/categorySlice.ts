import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Category } from "../../types";
import axios from "axios";
import toast from "react-hot-toast";
import Categories from "../../views/categories/Categories";
import { RootState } from "..";

const CATEGORIES_URL = "http://localhost:3001/categories";

interface STATE {
  categories: Category[];
  status: "idle" | "loading" | "failed";
}

const initialState: STATE = {
  categories: [],
  status: "idle",
};

export const getCategories = createAsyncThunk(
  "categories/getCategories",
  async () => {
    try {
      const response = await axios.get(CATEGORIES_URL);
      return [...response.data];
    } catch (error) {
      console.log(error);
      return initialState;
    }
  }
);

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    addCategory: (state, action) => {
      state.categories.push(action.payload);
    },
    editCategory: (state, action) => {
      const index = state.categories.findIndex(
        (c) => c.id === action.payload.id
      );
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    removeCategory: (state, action) => {
      state.categories = state.categories.filter(
        (c) => c.id !== action.payload.id
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCategories.fulfilled, (state, action) => {
      state.categories = action.payload as Category[];
      console.log(state);
    });
    builder.addCase(getCategories.rejected, (state, action) => {
      state.categories = initialState.categories;
      state.status = initialState.status;
    });
    builder.addCase(getCategories.pending, (state, action) => {});
  },
});

export const selectCategories = (state: RootState) =>
  state.categories.categories;

export const { addCategory, editCategory, removeCategory } =
  categorySlice.actions;
// export default categorySlice.reducer;
