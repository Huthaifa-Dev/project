import { Cart } from "../types";

export const createCart: (num: number) => Cart = (num) => {
  return {
    id: "",
    createdAt: Date.now(),
    number: num,
    items: [],
    total: 0,
  };
};
