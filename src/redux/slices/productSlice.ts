import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Product } from "../../types";
import axios from "axios";
import { RootState } from "..";
import { createProduct } from "../../helpers/product";

const PRODUCTS_URL =
  "https://product-manager-1903f-default-rtdb.firebaseio.com/products";
// const PRODUCTS_URL = "https://fts-product-manager-data.herokuapp.com/products";
// const PRODUCTS_URL = "http://localhost:8000/products";

interface STATE {
  products: Product[];
  status: "idle" | "loading" | "failed";
}

const initialState: STATE = {
  products: [],
  status: "idle",
};

export const getProducts = createAsyncThunk(
  "categories/getProducts",
  async () => {
    try {
      const response = await axios.get(PRODUCTS_URL + ".json");
      const result = Object.keys(response.data).map((key) => {
        const product = response.data[key];
        product.id = key;
        return product;
      });
      return [...result];
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
      const response = await axios.delete(
        `${PRODUCTS_URL}/${data.body}` + ".json"
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const editProductData = createAsyncThunk(
  "categories/editProduct",
  async (data: { id: string; newProduct: Partial<Product> }) => {
    try {
      const product = await axios.get(`${PRODUCTS_URL}/${data.id}` + ".json");
      product.data = { ...data.newProduct };
      if (
        product.data.price !== undefined &&
        product.data.rawPrice !== undefined
      ) {
        product.data.price = data.newProduct.price;
        product.data.rawPrice = data.newProduct.rawPrice;
        const newTax = (
          (product.data.price / product.data.rawPrice - 1) *
          100
        ).toFixed(2);
        product.data.tax = parseInt(newTax);
      }
      console.log(product.data);
      const response = await axios.patch(
        `${PRODUCTS_URL}/${data.id}` + ".json",
        product.data
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const addProductData = createAsyncThunk(
  "categories/addProductData",
  async (data: Partial<Product>) => {
    try {
      const product = createProduct(data as Product);
      await axios.post(`${PRODUCTS_URL}` + ".json", product);
      const response = await axios.get(`${PRODUCTS_URL}` + ".json");
      const result = Object.keys(response.data).map((key) => {
        const product = response.data[key];
        product.id = key;
        return product;
      });
      return [...result];
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
      state.status = "idle";
    });

    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.products = state.products.filter(
        (c) => c.id !== action.meta.arg.body
      );
    });
    builder.addCase(addProductData.fulfilled, (state, action) => {
      state.products = action.payload as Product[];
      state.status = "idle";
    });
    builder.addCase(editProductData.fulfilled, (state, action) => {
      state.products = state.products.map((product) => {
        if (product.id === action.meta.arg.id) {
          return { ...product, ...action.meta.arg.newProduct };
        }
        return product;
      });
    });
  },
});

export const selectProducts = (state: RootState) => state.products.products;
export const selectProductById = (state: RootState, id: string) => {
  return state.products.products.find((p) => {
    return p.id === id;
  });
};
