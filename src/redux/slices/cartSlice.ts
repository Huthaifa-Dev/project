import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "..";
import { createCart } from "../../helpers/cart";
import { Cart, CartItem, Product } from "../../types";

const CARTS_URL =
  "https://product-manager-1903f-default-rtdb.firebaseio.com/carts";
// const CARTS_URL = "https://fts-product-manager-data.herokuapp.com/cart";
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
    const response = await axios.get(CARTS_URL + ".json");
    if (response.data === null) return [];
    const result = Object.keys(response?.data)?.map((key) => {
      return {
        ...response.data[key],
        id: key,
      };
    });
    return [...result];
  } catch (error) {
    console.log(error);
    return initialState;
  }
});

export const updateCart = createAsyncThunk(
  "carts/updateCart",
  async (data: { body: string; id: string }) => {
    try {
      const response = await axios.patch(
        `${CARTS_URL}/${data.id}` + ".json",
        data.body
      );
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
      const response = await axios.delete(
        `${CARTS_URL}/${data.body}` + ".json"
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const addCart = createAsyncThunk("carts/addCart", async () => {
  try {
    const cart = createCart();
    cart.items = [];
    await axios.post(CARTS_URL + ".json", cart);
    const response = await axios.get(CARTS_URL + ".json");
    const result = Object.keys(response.data).map((key) => {
      const cart = response.data[key];
      cart.id = key;
      return cart;
    });
    return [...result];
  } catch (error) {
    console.log(error);
  }
});

export const addProductToCart = createAsyncThunk(
  "carts/addProductToCart",
  async (data: { body: Product; cart: Cart }) => {
    try {
      // Add product to cart, if it already exists, increase quantity, else add new item, then update cart in db and return updated cart
      // copy the cart to new object and keep track of types
      const newCart: Cart = {
        ...data.cart,
        items: data.cart.items ? [...data.cart.items] : [],
      };
      // create new cart item from product
      const newCartItem: CartItem = {
        id: data.body.id,
        name: data.body.name,
        price: data.body.price,
        quantity: 1,
        total: data.body.price,
      };
      // check if product already exists in cart
      const productIndex = newCart.items.findIndex((item) => {
        return item.id === newCartItem.id;
      });
      if (productIndex !== -1) {
        // if product exists, increase quantity for the cartItem and update total
        newCartItem.quantity = newCart.items[productIndex].quantity + 1;
        newCartItem.total = newCartItem.quantity * newCartItem.price;
        // replace the old cartItem with the new one
        newCart.items[productIndex] = newCartItem;
      } else {
        // if product does not exist, add new item
        const item: CartItem = {
          id: newCartItem.id,
          name: newCartItem.name,
          price: newCartItem.price,
          quantity: 1,
          total: newCartItem.price,
        };
        newCart.items.push(item);
      }

      // update total
      newCart.total = newCart.items.reduce((acc, item) => acc + item.total, 0);
      // update cart in db
      await axios.put(`${CARTS_URL}/${newCart.id}` + ".json", newCart);
      // return updated carts
      const response = await axios.get(CARTS_URL + ".json");
      const result = Object.keys(response.data).map((key) => {
        const cart = response.data[key];
        return cart;
      });
      return [...result];
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
        `${CARTS_URL}/${data.cart.id}` + ".json",
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
        `${CARTS_URL}/${data.cart.id}` + ".json",
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
      state.carts = action.payload as Cart[];
      state.status = "idle";
    });
    builder.addCase(deleteCart.fulfilled, (state, action) => {
      state.carts.pop();
      state.status = "idle";
    });
    builder.addCase(addProductToCart.fulfilled, (state, action) => {
      state.carts = action.payload as Cart[];
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

export const cartsSelector = (state: RootState) => state.carts.carts || [];

export default cartSlice;
