import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
const Checkout: React.VFC = () => {
  const carts = useSelector(cartsSelector);
  const dispatch = useDispatch<AppDispatch>();
  const [activeCart, setActiveCart] = useState(carts[0]?.id || "");

  const {
    register,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      subTotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
    },
  });
  const handleCartChange = (e) => {
    setActiveCart(e.target.value);
  };
  const handleAddCart = () => {
    toast.promise(dispatch(addCart(carts?.length)), {
      loading: "Adding new Cart ...",
      success: "Added a new Cart successfully",
      error: "There was an error",
    });
  };
  const handleDeleteCart = () => {
    toast
      .promise(dispatch(deleteCart({ body: activeCart })), {
        loading: `Deleting Cart ${activeCart} ...`,
        success: "Deleted Cart successfully",
        error: "There was an error",
      })
      .then(() => {
        setActiveCart(carts[0]?.id || "");
      });
  };
  const handleDeleteLastCart = () => {
    toast
      .promise(
        dispatch(
          deleteCart({
            body: carts[carts.length - 1].id,
          })
        ),
        {
          loading: `Deleting Cart ${carts.length - 1} ...`,
          success: "Deleted Cart successfully",
          error: "There was an error",
        }
      )
      .then(() => {
        setActiveCart(carts[0]?.id || "");
      });
  };
  const handleSubmitCart = () => {
    console.log("submit");
  };

  const calculateTotal = (total, discount) => {
    // console.log(total, tax, discount);
    const convertedDiscount = discount / 100;
    return total - total * convertedDiscount;
  };
  const calculateDifference = (total, tax?, discount?) => {
    if (tax) {
      const convertedTax = tax / 100;
      return total * convertedTax;
    } else if (discount) {
      const convertedDiscount = discount / 100;
      return total * convertedDiscount;
    }
    return 0;
  };

  // form data for cart
  const tax = watch("tax");
  const discount = watch("discount");
  const selectedCart = carts.find((cart) => cart.id === activeCart);
  const data = selectedCart?.items || [];
  const quantity = data?.reduce((acc, item) => +acc + +item.quantity, 0);
  const subTotal = data?.reduce((acc, item) => {
    return +acc + +item.total;
  }, 0);

  return (
    <div className="checkout">
      <header className="checkout__header">
        <div className="cart-filter">
          {carts.map((cart, index) => {
            return (
              <div key={cart.id} className="cart-filter__item">
                <input
                  name="cart"
                  type="radio"
                  value={cart.id}
                  id={cart.id}
                  onChange={handleCartChange}
                  checked={cart.id === activeCart}
                />
                <label htmlFor={cart.id}>
                  {cart.number}
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
            onClick={handleDeleteLastCart}
          >
            ➖
          </Button>
        </div>
      </header>
      <body className="checkout__body">
        {data && data.length !== 0 ? (
          <Table
            cart={carts.find((cart) => cart.id === activeCart)}
            cols={COLS}
            data={data}
            onDelete={() => {}}
          />
        ) : (
          <div className="checkout__body__empty">No items in cart</div>
        )}
      </body>
      <footer className="checkout__footer">
        <form>
          <div className="checkout__footer--data">
            <div className="checkout__footer--data__item">
              <label htmlFor="subTotal">Sub Total</label>
              <p className="mid">${subTotal}</p>
              <p className="last">{quantity} items</p>
            </div>
            <div className="checkout__footer--data__item">
              <label htmlFor="tax">Tax</label>
              <input type="number" {...register("tax")} />
              <p className="last">${calculateDifference(subTotal, tax, 0)}</p>
            </div>
            <div className="checkout__footer--data__item">
              <label htmlFor="discount">Discount</label>
              <input type="number" {...register("discount")} />
              <p className="last">
                ${calculateDifference(subTotal, 0, discount)}
              </p>
            </div>
            <div className="checkout__footer--data__item">
              <label htmlFor="total">Total</label>
              <p
                className="mid"
                style={{ color: "limegreen", fontWeight: "bold" }}
              >
                ${calculateTotal(subTotal, discount)}
              </p>
            </div>
          </div>
          <div className="checkout__footer--actions">
            <Button className="cancel" onClick={handleDeleteCart}>
              CANCEL
            </Button>
            <Button className="submit" onClick={handleSubmitCart}>
              PAYMENT
            </Button>
          </div>
        </form>
      </footer>
    </div>
  );
};

export default Checkout;
