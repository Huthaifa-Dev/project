import { Cart } from "../types";

export const createCart: () => Cart = () => {
  return {
    id: "",
    createdAt: Date.now(),
    items: [
      {
        id: "1",
        name: "Product 1",
        price: 100,
        quantity: 1,
        total: 100,
      },
    ],
    total: 0,
  };
};
