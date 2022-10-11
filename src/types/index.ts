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

export type Option = {
  value: string;
  label: string;
};
