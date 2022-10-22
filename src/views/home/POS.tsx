import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../components/utils/Button/Button";
import Modal from "../../components/utils/Modal/Modal";
import { AppDispatch } from "../../redux";
import { addProductToCart, cartsSelector } from "../../redux/slices/cartSlice";
import { selectCategories } from "../../redux/slices/categorySlice";
import { selectProducts } from "../../redux/slices/productSlice";
import { Category, Option, Product } from "../../types";

const ALL = {
  value: "🏠",
  label: "All",
} as Option<Partial<Category>>;

const POSPage: React.VFC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { register, watch, getValues, setValue } = useForm({
    defaultValues: {
      search: "",
      cart: "1",
    },
  });
  // page state
  const [categoryState, setCategoryState] = useState("All");
  const [popUp, setPopUp] = useState(false);
  const [addProduct, setAddProduct] = useState("");

  // data selectors
  const carts = useSelector(cartsSelector);
  const categories = useSelector(selectCategories);
  let products = useSelector(selectProducts);

  // products filter by category
  products =
    categoryState === "All"
      ? products
      : categoryState !== ""
      ? products.filter((product) => product.category === categoryState)
      : products;

  // Category filter options
  const categoryOptions: Option<Partial<Category>>[] = [
    ...categories.map((category: Category) => {
      return {
        value: category.name as Partial<Category>,
        label: category.name,
      };
    }),
  ];
  categoryOptions.unshift(ALL);

  // Search for products
  const search = watch("search");
  products = products.filter((product) => {
    return product.name.toLowerCase().includes(search.toLowerCase());
  });

  // Events Handlers
  const handleSearchButton = () => {
    if (search.length !== 0) {
      setValue("search", "");
    }
  };
  const handleCategorySearch = (e) => {
    setCategoryState(e.target.value);
  };
  const handleAddProduct = (data: { id: string }) => {
    setAddProduct(data.id);
    setPopUp(true);
  };
  const handleClosePopUp = () => {
    setAddProduct("");
    setPopUp(false);
  };
  const handleAddToCart = () => {
    const addedProduct = products.find((product) => product.id === addProduct);
    const cart = carts.find((cart) => cart.id === getValues("cart"));
    if (addedProduct && cart) {
      toast.promise(
        dispatch(addProductToCart({ body: addedProduct, cart: cart })),
        {
          loading: "Adding to cart...",
          success: "Added to cart",
          error: "Error",
        }
      );
      setPopUp(false);
    }
  };

  const date = (product: Product) => {
    if (product.expire) {
      return new Date(product.expire).toLocaleDateString();
    }
    return "";
  };
  return (
    <>
      <div className="home">
        <div className="home-container">
          <div className="home-header">
            <div className="category-filter">
              {categoryOptions.map((category) => {
                const checked = categoryState === category.label;
                return (
                  <div
                    key={category.value as string}
                    className="category-filter__item"
                  >
                    <input
                      name="category"
                      type="radio"
                      value={category.label}
                      id={category.value as string}
                      onChange={handleCategorySearch}
                      checked={checked}
                    />
                    <label htmlFor={category.value as string}>
                      {category.value as string}
                    </label>
                  </div>
                );
              })}
            </div>
            <div className="search">
              <input
                {...register("search", {
                  maxLength: {
                    value: 20,
                    message: "Search must be at most 20 characters long",
                  },
                })}
                type="text"
                placeholder="Search"
                id="search"
                className={`form-control`}
              />
              <Button
                type="button"
                onClick={handleSearchButton}
                backgroundColor="white"
              >
                {getValues("search").length === 0 ? "🔍" : "❌"}
              </Button>
            </div>
          </div>
          <div className="products-section">
            <div className="products-section__header">
              <div className="products-section__header__title">Products</div>
            </div>
            <div className="products-section__container">
              <ul className="product-gallery">
                {products.map((product) => (
                  <li className="product-card" key={product.id}>
                    <div
                      className="color"
                      style={{
                        backgroundColor: product.color || "white",
                      }}
                    ></div>
                    <div className="product-card__body">
                      {/* <img /> */}
                      <div className="product-name">{product.name}</div>
                      <div className="product-price">${product.price}</div>
                      {product.expire ? (
                        <div className="product-expire">{date(product)}</div>
                      ) : (
                        ""
                      )}
                      <Button
                        type="button"
                        className="add-to-cart"
                        onClick={() => {
                          handleAddProduct({ id: product.id });
                        }}
                      >
                        ➕
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {popUp && (
        <Modal
          onClose={handleClosePopUp}
          onSubmit={handleAddToCart}
          title="Choose a cart"
        >
          <select
            className="cart-form"
            {...register("cart", {
              required: "Please select a cart",
            })}
          >
            {carts.map((cart) => (
              <option key={cart.id} value={cart.id}>
                Cart {cart.id} created at{" "}
                {new Date(cart.createdAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </option>
            ))}
          </select>
        </Modal>
      )}
    </>
  );
};

export default POSPage;
