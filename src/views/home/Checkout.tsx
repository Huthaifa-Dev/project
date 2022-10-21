import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Column } from "react-table";
import { Button } from "../../components/utils/Button/Button";
import { AppDispatch } from "../../redux";
import {
  addCart,
  cartsSelector,
  deleteCart,
} from "../../redux/slices/cartSlice";
import { CartItem } from "../../types";
import "./Checkout.scss";
import Table from "./CheckoutTable";
const Checkout: React.VFC = () => {
  const carts = useSelector(cartsSelector);
  const dispatch = useDispatch<AppDispatch>();
  const [activeCart, setActiveCart] = useState("1");

  const handleCartChange = (e) => {
    setActiveCart(e.target.value);
  };
  const handleAddCart = () => {
    toast.promise(dispatch(addCart({ body: `${carts.length + 1}` })), {
      loading: "Adding new Cart ...",
      success: "Added a new Cart successfully",
      error: "There was an error",
    });
  };
  const handleDeleteCart = () => {
    toast.promise(dispatch(deleteCart({ body: `${carts.length}` })), {
      loading: `Deleting Cart ${carts.length} ...`,
      success: "Deleted Cart successfully",
      error: "There was an error",
    });
  };
  const handleSubmitCart = () => {
    console.log("submit");
  };

  const COLS: Column<CartItem>[] = [
    {
      Header: "Product Name",
      accessor: "name",
    },
    {
      Header: "Price",
      accessor: "price",
    },
    {
      Header: "Quantity",
      accessor: "quantity",
    },
    {
      Header: "Total",
      accessor: "total",
    },
  ];
  // const data: CartItem[] = [
  //   {
  //     id: "1",
  //     name: "Product 1",
  //     price: 100,
  //     quantity: 1,
  //     total: 100,
  //   },
  //   {
  //     id: "2",
  //     name: "Product 2",
  //     price: 200,
  //     quantity: 1,
  //     total: 200,
  //   },
  //   {
  //     id: "2",
  //     name: "Product 2",
  //     price: 200,
  //     quantity: 1,
  //     total: 200,
  //   },
  //   {
  //     id: "2",
  //     name: "Product 2",
  //     price: 200,
  //     quantity: 1,
  //     total: 200,
  //   },
  //   {
  //     id: "2",
  //     name: "Product 2",
  //     price: 200,
  //     quantity: 1,
  //     total: 200,
  //   },
  // ];

  const data = carts.find((cart) => cart.id === activeCart)?.items;
  return (
    <div className="checkout">
      <header className="checkout__header">
        <div className="cart-filter">
          {carts.map((cart) => {
            const checked = activeCart === cart.id;
            return (
              <div key={cart.id} className="cart-filter__item">
                <input
                  name="cart"
                  type="radio"
                  value={cart.id}
                  id={cart.id}
                  onChange={handleCartChange}
                  checked={checked}
                />
                <label htmlFor={cart.id}>
                  {cart.id}
                  <span>
                    {new Date(cart.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </span>
                </label>
              </div>
            );
          })}
          <Button className="cart-filter__action add" onClick={handleAddCart}>
            ➕
          </Button>
          <Button
            className="cart-filter__action delete"
            onClick={handleDeleteCart}
          >
            ➖
          </Button>
        </div>
      </header>
      <body className="checkout__body">
        {data && data.length !== 0 ? (
          <Table cols={COLS} data={data} onDelete={() => {}} />
        ) : (
          <div className="checkout__body__empty">No items in cart</div>
        )}
      </body>
      <footer className="checkout__footer">
        <div className="checkout__footer--data"></div>
        <div className="checkout__footer--actions">
          <Button className="cancel" onClick={handleDeleteCart}>
            CANCEL
          </Button>
          <Button className="submit" onClick={handleSubmitCart}>
            PAYMENT
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Checkout;
