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
  description: string;
  createdAt: number;
  updatedAt: number;
};

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Partial<Category>;
  createdAt: string;
  updatedAt: string;
}
