import { nanoid } from "@reduxjs/toolkit";
import { Product } from "../types";

export const createProduct = (data: Product): Product => {
  const newTax = ((data.price / data.rawPrice - 1) * 100).toFixed(2);
  const codeArr = data.code.split("-");
  const newCode =
    codeArr[0].toUpperCase() + "-" + codeArr[1] + "-" + codeArr[2];
  //   const newDate = data.expire ? new Date(data.expire).getTime() : 0;
  const newProduct = {
    ...data,
    code: newCode,
    id: nanoid(),
    tax: parseInt(newTax),
    // expire: newDate,
  };
  return newProduct;
};
