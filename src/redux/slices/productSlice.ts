import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Product } from "../../types";
import axios from "axios";
import { RootState } from "..";
import { createDate } from "../../helpers/date";
import { createProduct } from "../../helpers/product";

const PRODUCTS_URL = "https://fts-product-manager-data.herokuapp.com/products";

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
  async (data: { id: string; newProduct: Partial<Product> }) => {
    try {
      const product = await axios.get(`${PRODUCTS_URL}/${data.id}`);
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

      const response = await axios.put(
        `${PRODUCTS_URL}/${data.id}`,
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
      const response = await axios.post(`${PRODUCTS_URL}`, product);
      return response.data;
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
    builder.addCase(sortProducts.fulfilled, (state, action) => {
      state.products = action.payload as Product[];
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.products = state.products.filter(
        (c) => c.id !== action.meta.arg.body
      );
    });
    builder.addCase(addProductData.fulfilled, (state, action) => {
      state.products = [...state.products, action.payload as Product];
    });
    builder.addCase(editProductData.fulfilled, (state, action) => {
      state.products = state.products.map((c) => {
        if (+c.id === +action.meta.arg.id) {
          return action.payload as Product;
        }
        return c;
      });
    });
  },
});

export const selectProducts = (state: RootState) => state.products.products;
export const selectProductById = (state: RootState, id: string) => {
  return state.products.products.find((p) => {
    return +p.id === +id;
  });
};
