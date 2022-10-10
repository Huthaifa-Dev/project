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
  description?: string;
  code: string;
  color?: string;
  image?: string;
  category: string;
  stock?: number;
  expire?: number;
  price: number;
  tax: number;
}
