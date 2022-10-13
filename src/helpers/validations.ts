import { Product } from "../types";

export const userValidation = (value: string) => {
  return value.trim().length > 4;
};
export const passwordValidation = (value: string) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{4,}$/;
  return value.trim().length > 4 && regex.test(value);
};

export const searchProducts = (value: Product, search: string) => {
  return (
    value.name.toLowerCase().includes(search.toLowerCase()) ||
    value.code?.toLowerCase().includes(search.toLowerCase()) ||
    value.category.toLowerCase().includes(search.toLowerCase()) ||
    value.description?.toLowerCase().includes(search.toLowerCase()) ||
    value.tax.toString().includes(search.toLowerCase()) ||
    value.price.toString().includes(search.toLowerCase())
  );
};
