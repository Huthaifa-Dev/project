import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "..";
import { createCart } from "../../helpers/cart";
import { Cart, CartItem, Product } from "../../types";

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

export const addProductToCart = createAsyncThunk(
  "carts/addProductToCart",
  async (data: { body: Product; cart: Cart }) => {
    try {
      const cartItem: CartItem = {
        id: data.body.id,
        name: data.body.name,
        price: data.body.price,
        quantity: 1,
        total: data.body.price,
      };
      const newItems = data.cart.items.concat(cartItem);
      const newCart = {
        id: data.cart.id,
        createdAt: data.cart.createdAt,
        items: newItems,
        total: data.cart.total + data.body.price,
      };
      const response = await axios.patch(
        `${CARTS_URL}/${data.cart.id}`,
        newCart
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const removeProductFromCart = createAsyncThunk(
  "carts/removeProductFromCart",
  async (data: { body: CartItem; cart: Cart }) => {
    try {
      const newItems = data.cart.items.filter(
        (item) => item.id !== data.body.id
      );
      const newCart = {
        id: data.cart.id,
        createdAt: data.cart.createdAt,
        items: newItems,
        total: data.cart.total - data.body.total,
      };
      // console.log(newCart);
      const response = await axios.patch(
        `${CARTS_URL}/${data.cart.id}`,
        newCart
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const updateProductFromCart = createAsyncThunk(
  "carts/updateProductFromCart",
  async (data: { body: CartItem; cart: Cart }) => {
    try {
      const newItems = data.cart.items.map((item) => {
        if (item.id === data.body.id) {
          return data.body;
        } else {
          return item;
        }
      });
      const newCart = {
        id: data.cart.id,
        createdAt: data.cart.createdAt,
        items: newItems,
        total: data.cart.total + data.body.total,
      };
      // console.log(data, newItems, newCart);
      const response = await axios.patch(
        `${CARTS_URL}/${data.cart.id}`,
        newCart
      );
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
    builder.addCase(addProductToCart.fulfilled, (state, action) => {
      state.carts = state.carts.map((cart) => {
        if (cart.id === action.payload.id) {
          return action.payload;
        }
        return cart;
      });
      state.status = "idle";
    });
    builder.addCase(removeProductFromCart.fulfilled, (state, action) => {
      state.carts = state.carts.map((cart) => {
        if (cart.id === action.payload.id) {
          return action.payload;
        }
        return cart;
      });
      state.status = "idle";
    });
    builder.addCase(updateProductFromCart.fulfilled, (state, action) => {
      state.carts = state.carts.map((cart) => {
        if (cart.id === action.payload.id) {
          return action.payload;
        }
        return cart;
      });
      state.status = "idle";
    });
  },
});

export const cartsSelector = (state: RootState) => state.carts.carts;

export default cartSlice;
