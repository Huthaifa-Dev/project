import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Product } from "../../types";
import axios from "axios";
import { RootState } from "..";
import { createDate } from "../../helpers/date";

const PRODUCTS_URL = "https://fts-product-manager-data.herokuapp.com/products";

interface STATE {
  products: Product[];
  status: "idle" | "loading" | "failed";
}

const initialState: STATE = {
  products: [],
  status: "idle",
};
// const createdData = (data: { name: string }) => ({
//   id: data.name,
//   name: data.name,
//   description: "",
//   createdAt: Date.now(),
//   updatedAt: Date.now(),
// });

export const getProducts = createAsyncThunk(
  "categories/getProducts",
  async () => {
    try {
      const response = await axios.get(PRODUCTS_URL);
      return [...response.data];
    } catch (error) {
      console.log(error);
      return initialState;
    }
  }
);
export const sortProducts = createAsyncThunk(
  "categories/sortProducts",
  async (data: { id: string }) => {
    try {
      let sortString = "?_sort=";
      if (data.id.includes("Dec")) {
        sortString += data.id.replace("Dec", "") + "&_order=desc";
      } else {
        sortString += data.id.replace("Dec", "");
      }
      const response = await axios.get(`${PRODUCTS_URL}${sortString}`);
      return [...response.data];
    } catch (error) {
      console.log(error);
      return initialState;
    }
  }
);
export const deleteProduct = createAsyncThunk(
  "categories/deleteProduct",
  async (data: { body: string }) => {
    try {
      const response = await axios.delete(`${PRODUCTS_URL}/${data.body}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const editProductData = createAsyncThunk(
  "categories/editProduct",
  async (data: { id: string; newName: string }) => {
    try {
      const category = await axios.get(`${PRODUCTS_URL}/${data.id}`);
      category.data.name = data.newName;
      category.data.id = data.newName;
      category.data.updatedAt = Date.now();
      const response = await axios.put(
        `${PRODUCTS_URL}/${data.id}`,
        category.data
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const addProduct = createAsyncThunk(
  "categories/addProduct",
  async (data: { name: string }) => {
    try {
      //   const category = createdData(data);
      //   const response = await axios.post(`${CATEGORIES_URL}`, category);
      //   return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const productSilice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.products = action.payload as Product[];
    });
    builder.addCase(getProducts.rejected, (state, action) => {
      state.products = initialState.products;
      state.status = initialState.status;
    });
    builder.addCase(sortProducts.fulfilled, (state, action) => {
      state.products = action.payload as Product[];
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.products = state.products.filter(
        (c) => c.id !== action.meta.arg.body
      );
    });
  },
});

export const selectProducts = (state: RootState) => state.products.products;

// export default categorySlice.reducer;
