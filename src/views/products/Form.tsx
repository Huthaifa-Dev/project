import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../components/utils/Modal/Modal";
import { AppDispatch } from "../../redux";
import Select from "react-select";
import {
  addProductData,
  deleteProduct,
  editProductData,
} from "../../redux/slices/productSlice";
import "./Form.scss";
import { Category, Option, Product } from "../../types";
import {
  getCategories,
  selectCategories,
} from "../../redux/slices/categorySlice";
const Form: React.FC<{ onClose: () => void; ID?: string; DELETE: string }> = ({
  onClose,
  ID,
  DELETE,
}) => {
  useEffect(() => {
    dispatch(getCategories());
  }, []);
  const categories = useSelector(selectCategories);
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      rawPrice: 0,
      price: 0,
      code: "",
      category: "",
      stack: 0,
      expire: 0,
      description: "",
    },
  });

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

  const options: Option[] = [
    ...categories.map((category: Category) => {
      return {
        value: category.id,
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
                      value: getValues("rawPrice"),
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
                <input
                  {...register("code", {
                    required: "Product Name is required",
                    min: {
                      value: 1,
                      message: "Code length must be at least 1$",
                    },
                  })}
                  type="text"
                  id="code"
                  className={`form-control ${
                    errors.code ? "form-control--error" : ""
                  }`}
                />
                {errors.code && (
                  <p className="error-message">{errors.code.message}</p>
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
                    <option key={value.value} value={value.value}>
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

              <input
                {...register("expire")}
                type="date"
                id="expire"
                className={`form-control ${
                  errors.expire ? "form-control--error" : ""
                }`}
              />
            </section>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default Form;