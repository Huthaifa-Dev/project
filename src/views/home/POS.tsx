import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../components/utils/Button/Button";
import Modal from "../../components/utils/Modal/Modal";
import { AppDispatch } from "../../redux";
import { selectCategories } from "../../redux/slices/categorySlice";
import { selectProducts } from "../../redux/slices/productSlice";
import { Category, Option } from "../../types";
const POSPage: React.VFC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { register, watch, getValues, setValue } = useForm({
    defaultValues: {
      search: "",
    },
  });
  const [categoryState, setCategoryState] = useState("All");
  const [popUp, setPopUp] = useState(false);

  const categories = useSelector(selectCategories);
  const ALL = {
    value: "🏠",
    label: "All",
  } as Option<Partial<Category>>;
  let products = useSelector(selectProducts);
  products =
    categoryState === "All"
      ? products
      : categoryState !== ""
      ? products.filter((product) => product.category === categoryState)
      : products;
  const categoryOptions: Option<Partial<Category>>[] = [
    ...categories.map((category: Category) => {
      return {
        value: category.id as Partial<Category>,
        label: category.name,
      };
    }),
  ];
  categoryOptions.unshift(ALL);

  const search = watch("search");
  products = products.filter((product) => {
    return product.name.toLowerCase().includes(search.toLowerCase());
  });
  const handleSearchButton = () => {
    if (search.length !== 0) {
      setValue("search", "");
    }
  };
  const handleCategorySearch = (e) => {
    setCategoryState(e.target.value);
  };
  const handleAddProduct = (data: { id: string }) => {
    setPopUp(true);
  };
  const handleClosePopUp = () => {
    setPopUp(false);
  };
  const handleAddToCart = () => {};

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
                      <div className="product-description">{product.name}</div>
                      <Button
                        type="button"
                        backgroundColor="white"
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
          <></>
        </Modal>
      )}
    </>
  );
};

export default POSPage;
