import { nanoid } from "@reduxjs/toolkit";
import { Product } from "../types";

export const createProduct = (data: Product): Product => {
  const newTax = ((data.price / data.rawPrice - 1) * 100).toFixed(2);
  const newProduct = {
    ...data,
    id: nanoid(),
    tax: parseInt(newTax),
  };
  return newProduct;
};
