import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux";
import InputMask from "react-input-mask";
import {
  editProductData,
  selectProductById,
} from "../../redux/slices/productSlice";
import "./Form.scss";
import {
  Category,
  COLORS,
  Option,
  Product,
  ProductFormValues,
} from "../../types";
import {
  getCategories,
  selectCategories,
} from "../../redux/slices/categorySlice";

import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/utils/Button/Button";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase";

const ProductsPage: React.VFC = () => {
  const navigate = useNavigate();
  const ID = useParams<{ productId: string }>();
  const product = useSelector((state: RootState) =>
    selectProductById(state, ID.productId || "")
  );

  const categories = useSelector(selectCategories);
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    getValues,
    control,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({ defaultValues: product });
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const options: Option<Partial<Category>>[] = [
    ...categories.map((category: Category) => {
      return {
        value: category.id as Partial<Category>,
        label: category.name,
      };
    }),
  ];
  const submitHandler = (data: ProductFormValues) => {
    if (ID.productId) {
      if (!getValues("image")) {
        toast.promise(
          dispatch(
            editProductData({
              id: ID.productId,
              newProduct: data as Partial<Product>,
            })
          ),
          {
            loading: "Editing...",
            success: "Edited",
            error: "Error",
          }
        );
        navigate("/products");
      } else if (ID.productId) {
        const storageRef = ref(storage, "images/" + getValues("image")[0].name);
        uploadBytes(storageRef, getValues("image")[0]).then((snapshot) => {
          getDownloadURL(storageRef).then((url) => {
            const product: Partial<Product> = {
              ...data,
              image: url,
            };
            toast.promise(
              dispatch(
                editProductData({
                  id: ID.productId as string,
                  newProduct: product,
                })
              ),
              {
                loading: "Editing...",
                success: "Edited",
                error: "Error",
              }
            );
          });
        });
      }

      navigate("/products");
    }
    // onClose();
  };

  return (
    <form
      className="page-form"
      onSubmit={handleSubmit((data) => {
        submitHandler(data);
      })}
    >
      <header>
        <h1>Edit Product : </h1>
        <p className="title">{product?.name}</p>
      </header>
      <div className="form-group">
        <section>
          <label htmlFor="name">Product Name: </label>
          <div className="form-group-wrapper">
            <input
              {...register("name", {
                required: "Product Name is required",
                minLength: {
                  value: 4,
                  message: "Product Name must be at least 4 characters long",
                },
                maxLength: {
                  value: 20,
                  message: "Product Name must be at most 20 characters long",
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
                validate: (value) => {
                  return value >= 0 || "Product price must be more than 0";
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
                required: "Product Price is required",
                validate: (value) => {
                  const rawPrice = watch("rawPrice");
                  if (+value > 0 && +value < +rawPrice) {
                    return "Product price must be more than raw price";
                  }
                  return value >= 0 || "Product price must be more than 0";
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
          <label htmlFor="image">Image: </label>
          <div className="form-group-wrapper">
            <input {...register("image")} type="file" name="image" />
            {errors.image && (
              <p className="error-message">{errors.image.message}</p>
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
          <label htmlFor="stock">Stock Count: </label>

          <input
            {...register("stock")}
            type="number"
            id="stock"
            className={`form-control ${
              errors.stock ? "form-control--error" : ""
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
      <Button primary fullWidth type="submit" backgroundColor="#1f1f1f">
        Submit
      </Button>
    </form>
  );
};

export default ProductsPage;
