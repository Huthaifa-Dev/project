import { Cart } from "../types";

export const createCart: (data: string) => Cart = (data) => {
  return {
    id: data,
    createdAt: Date.now(),
    items: [],
    total: 0,
  };
};
