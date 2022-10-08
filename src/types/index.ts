export interface User {
  id: number;
  username: string;
  password: string;
  role: string;
  fullName: string;
}

export type Category = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
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
