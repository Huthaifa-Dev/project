export interface User {
  id: number;
  username: string;
  password: string;
  role: string;
  fullName: string;
}

export type Category = {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
};

export interface Product {
  id: string;
  name: string;
  price: number;
  rawPrice: number;
  tax: number;
  category: string;
  code: string;
  description?: string;
  color?: string;
  image?: string;
  stock?: number;
  expire?: number;
}

export type Option<T> = {
  value: T;
  label: string;
};

export type Color =
  | "red"
  | "green"
  | "blue"
  | "yellow"
  | "orange"
  | "purple"
  | "pink";

export const COLORS: Option<Color>[] = [
  { value: "red", label: "Red" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
  { value: "yellow", label: "Yellow" },
  { value: "orange", label: "Orange" },
  { value: "purple", label: "Purple" },
  { value: "pink", label: "Pink" },
];

export type Cart = {
  id: string;
  createdAt: number;
  items: CartItem[];
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
};
