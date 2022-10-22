import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyChgJhOZKh6pc5EEi7LV_AoqAfxkjpqpJ4",
  authDomain: "product-manager-1903f.firebaseapp.com",
  databaseURL: "https://product-manager-1903f-default-rtdb.firebaseio.com",
  projectId: "product-manager-1903f",
  storageBucket: "product-manager-1903f.appspot.com",
  messagingSenderId: "993965020756",
  appId: "1:993965020756:web:f89ab50f886edfba8dffc1",
  measurementId: "G-9RYXF9WDZH",
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
