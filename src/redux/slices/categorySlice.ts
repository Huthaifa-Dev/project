import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Category } from "../../types";
import axios from "axios";
import toast from "react-hot-toast";
import Categories from "../../views/categories/Categories";
import { RootState } from "..";
import { createDate } from "../../helpers/date";

const CATEGORIES_URL =
  "https://fts-product-manager-data.herokuapp.com/categories";

interface STATE {
  categories: Category[];
  status: "idle" | "loading" | "failed";
}

const initialState: STATE = {
  categories: [],
  status: "idle",
};
const createdData = (data: { name: string }) => ({
  id: data.name,
  name: data.name,
  description: "",
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

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
export const sortCategories = createAsyncThunk(
  "categories/sortCategories",
  async (data: { id: string }) => {
    try {
      let sortString = "?_sort=";
      if (data.id.includes("Dec")) {
        sortString += data.id.replace("Dec", "") + "&_order=desc";
      } else {
        sortString += data.id.replace("Dec", "");
      }
      const response = await axios.get(`${CATEGORIES_URL}${sortString}`);
      return [...response.data];
    } catch (error) {
      console.log(error);
      return initialState;
    }
  }
);
export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (data: { body: string }) => {
    try {
      const response = await axios.delete(`${CATEGORIES_URL}/${data.body}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const editCategoryData = createAsyncThunk(
  "categories/editCategory",
  async (data: { id: string; newName: string }) => {
    try {
      const category = await axios.get(`${CATEGORIES_URL}/${data.id}`);
      category.data.name = data.newName;
      category.data.id = data.newName;
      category.data.updatedAt = Date.now();
      const response = await axios.put(
        `${CATEGORIES_URL}/${data.id}`,
        category.data
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const addCategoryData = createAsyncThunk(
  "categories/addCategory",
  async (data: { name: string }) => {
    try {
      const category = createdData(data);
      const response = await axios.post(`${CATEGORIES_URL}`, category);
      return response.data;
    } catch (error) {
      console.log(error);
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
    });
    builder.addCase(getCategories.rejected, (state, action) => {
      state.categories = initialState.categories;
      state.status = initialState.status;
    });
    builder.addCase(getCategories.pending, (state, action) => {});

    builder.addCase(sortCategories.fulfilled, (state, action) => {
      state.categories = action.payload as Category[];
    });

    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      state.categories = state.categories.filter(
        (c) => c.id !== action.meta.arg.body
      );
      console.log(state.categories, action.meta.arg.body);
    });
    builder.addCase(addCategoryData.fulfilled, (state, action) => {
      state.categories.push(
        createdData({ name: action.meta.arg.name }) as Category
      );
    });
    builder.addCase(editCategoryData.fulfilled, (state, action) => {
      const index = state.categories.findIndex(
        (c) => c.id === action.meta.arg.id
      );
      if (index !== -1) {
        state.categories[index].name = action.meta.arg.newName;
        state.categories[index].id = action.meta.arg.newName;
        state.categories[index].updatedAt = Date.now();
      }
    });
  },
});

export const selectCategories = (state: RootState) =>
  state.categories.categories;

export const { addCategory, editCategory, removeCategory } =
  categorySlice.actions;
// export default categorySlice.reducer;
