import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../components/utils/Modal/Modal";
import { AppDispatch } from "../../redux";
import InputMask from "react-input-mask";
import {
  addProductData,
  deleteProduct,
  editProductData,
} from "../../redux/slices/productSlice";
import "./Form.scss";
import { Category, COLORS, Option, Product } from "../../types";
import {
  getCategories,
  selectCategories,
} from "../../redux/slices/categorySlice";

const defaultValues = {
  name: "",
  rawPrice: 0,
  price: 0,
  code: "",
  category: "",
  stack: 0,
  expire: 0,
  description: "",
  color: "",
};

type FormValues = {
  name: string;
  rawPrice: number;
  price: number;
  code: string;
  category: string;
  stack: number;
  expire: number;
  description: string;
  color: string;
};

const Form: React.FC<{ onClose: () => void; ID?: string; DELETE: string }> = ({
  onClose,
  ID,
  DELETE,
}) => {
  const categories = useSelector(selectCategories);
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    getValues,
    control,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues });
  useEffect(() => {
    dispatch(getCategories());
  }, []);
  const submitHandler = (data: Partial<Product>) => {
    if (DELETE) {
      toast.promise(dispatch(deleteProduct({ body: DELETE })).unwrap(), {
        loading: "Deleting...",
        success: <b>{DELETE} Deleted Successfully</b>,
        error: <b>Could not Delete Category.</b>,
      });
    } else if (ID) {
      toast.promise(dispatch(editProductData({ id: ID, newProduct: data })), {
        loading: "Editing...",
        success: "Edited",
        error: "Error",
      });
    } else {
      toast.promise(dispatch(addProductData(data)), {
        loading: "Adding Category...",
        success: <b>Category Added Successfully</b>,
        error: <b>Could not Add Category.</b>,
      });
    }
    onClose();
  };

  const options: Option<Partial<Category>>[] = [
    ...categories.map((category: Category) => {
      return {
        value: category.id as Partial<Category>,
        label: category.name,
      };
    }),
  ];

  return (
    <Modal
      title={DELETE ? "Confirm Delete" : ID ? "Edit Product" : "Create Product"}
      onClose={onClose}
      onSubmit={handleSubmit((data) => {
        submitHandler(data);
      })}
      width={DELETE ? "400px" : "500px"}
    >
      {DELETE ? (
        <p>Are you sure you want to delete {DELETE}?</p>
      ) : (
        <form
          onSubmit={handleSubmit((data) => {
            submitHandler(data as Partial<Product>);
          })}
        >
          <div className="form-group">
            <section>
              <label htmlFor="name">Product Name: </label>
              <div className="form-group-wrapper">
                <input
                  {...register("name", {
                    required: "Product Name is required",
                    minLength: {
                      value: 4,
                      message:
                        "Product Name must be at least 4 characters long",
                    },
                    maxLength: {
                      value: 20,
                      message:
                        "Product Name must be at most 20 characters long",
                    },
                  })}
                  type="text"
                  id="name"
                  className={`form-control ${
                    errors.name ? "form-control--error" : ""
                  }`}
                />
                {errors.name && (
                  <p className="error-message">{errors.name.message}</p>
                )}
              </div>
            </section>
            <section>
              <label htmlFor="rawPrice">Raw Price: </label>
              <div className="form-group-wrapper">
                <input
                  {...register("rawPrice", {
                    required: "Product raw price is required",
                    min: {
                      value: 1,
                      message: "Product raw price must be at least 1$",
                    },
                  })}
                  type="number"
                  id="rawPrice"
                  className={`form-control ${
                    errors.rawPrice ? "form-control--error" : ""
                  }`}
                />
                {errors.rawPrice && (
                  <p className="error-message">{errors.rawPrice.message}</p>
                )}
              </div>
            </section>
            <section>
              <label htmlFor="price">Price: </label>
              <div className="form-group-wrapper">
                <input
                  {...register("price", {
                    required: "Product Name is required",
                    min: {
                      value: getValues("rawPrice") + 1,
                      message: "Product price must be more than raw price",
                    },
                  })}
                  type="number"
                  id="price"
                  className={`form-control ${
                    errors.price ? "form-control--error" : ""
                  }`}
                />
                {errors.price && (
                  <p className="error-message">{errors.price.message}</p>
                )}
              </div>
            </section>
            <section>
              <label htmlFor="code">Code: </label>
              <div className="form-group-wrapper">
                <Controller
                  control={control}
                  name="code"
                  defaultValue={getValues("code")}
                  render={({ field }) => (
                    <InputMask
                      mask="aaaa-aaaa-9999"
                      {...field}
                      className={`form-control ${
                        errors.code ? "form-control--error" : ""
                      }`}
                    />
                  )}
                />
                {errors.code && (
                  <p className="error-message">{errors.code.message}</p>
                )}
              </div>
            </section>
            <section>
              <label htmlFor="color">Choose color to Display in POS: </label>
              <div className="form-group-wrapper">
                <div className="color-picker">
                  {COLORS.map((color, index) => (
                    <div key={color.value} className="color-picker__item">
                      <label
                        htmlFor={color.value}
                        style={{ background: color.value }}
                      >
                        C{index}
                      </label>
                      <input
                        // add ref for color picker from the useForm hook
                        {...register("color")}
                        type="radio"
                        value={color.value}
                        id={color.value}
                      />
                      <div className="dot">☝️</div>
                    </div>
                  ))}
                </div>
                {errors.color && (
                  <p className="error-message">{errors.color.message}</p>
                )}
              </div>
            </section>
            <section>
              <label htmlFor="category">Category: </label>
              <div className="form-group-wrapper">
                <select
                  {...register("category", {
                    required: "Product Category is required",
                  })}
                  className={`form-control ${
                    errors.category ? "form-control--error" : ""
                  }`}
                >
                  {options.map((value) => (
                    <option key={value.value.id} value={value.value.id}>
                      {value.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="error-message">{errors.category.message}</p>
                )}
              </div>
            </section>
            <section>
              <label htmlFor="description">Description: </label>

              <textarea
                {...register("description")}
                id="description"
                style={{ resize: "none" }}
                className={`form-control ${
                  errors.description ? "form-control--error" : ""
                }`}
              />
            </section>
            <section>
              <label htmlFor="stack">Stack Count: </label>

              <input
                {...register("stack")}
                type="number"
                id="stack"
                className={`form-control ${
                  errors.stack ? "form-control--error" : ""
                }`}
              />
            </section>
            <section>
              <label htmlFor="expire">Expiration Date: </label>

              <div className="form-group-wrapper">
                <input
                  {...register("expire", {
                    min: {
                      value: new Date(Date.now()).toUTCString(),
                      message: "Expiration date must be in the future",
                    },
                  })}
                  type="date"
                  id="expire"
                  className={`form-control ${
                    errors.expire ? "form-control--error" : ""
                  }`}
                />
                {errors.expire && (
                  <p className="error-message">{errors.expire.message}</p>
                )}
              </div>
            </section>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default Form;
