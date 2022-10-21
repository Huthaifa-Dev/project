import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "..";
import { createCart } from "../../helpers/cart";
import { Cart } from "../../types";

const CARTS_URL = "https://fts-product-manager-data.herokuapp.com/cart";
// const CARTS_URL = "http://localhost:8000/carts";

interface STATE {
  carts: Cart[];
  status: "idle" | "loading" | "failed";
}

const initialState: STATE = {
  carts: [],
  status: "idle",
};
export const getCarts = createAsyncThunk("carts/getCarts", async () => {
  try {
    const response = await axios.get(CARTS_URL);
    return [...response.data];
  } catch (error) {
    console.log(error);
    return initialState;
  }
});

export const updateCart = createAsyncThunk(
  "carts/updateCart",
  async (data: { body: string; id: string }) => {
    try {
      const response = await axios.patch(`${CARTS_URL}/${data.id}`, data.body);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const deleteCart = createAsyncThunk(
  "carts/deleteCart",
  async (data: { body: string }) => {
    try {
      const response = await axios.delete(`${CARTS_URL}/${data.body}`);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const addCart = createAsyncThunk(
  "carts/addCart",
  async (data: { body: string }) => {
    try {
      const cart = createCart(data.body);
      const response = await axios.post(CARTS_URL, cart);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCarts.fulfilled, (state, action) => {
      state.carts = action.payload as Cart[];
      state.status = "idle";
    });
    builder.addCase(addCart.fulfilled, (state, action) => {
      state.carts = [...state.carts, action.payload as Cart];
      state.status = "idle";
    });
    builder.addCase(deleteCart.fulfilled, (state, action) => {
      state.carts.pop();
      state.status = "idle";
    });
  },
});

export const cartsSelector = (state: RootState) => state.carts.carts;

export default cartSlice;
