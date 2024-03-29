import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../components/utils/Modal/Modal";
import { AppDispatch, RootState } from "../../redux";
import InputMask from "react-input-mask";
import {
  addProductData,
  deleteProduct,
  editProductData,
  selectProductById,
  selectProducts,
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
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { storage } from "../../firebase";
const defaultValues = {
  name: "",
  rawPrice: 0,
  price: 0,
  code: "",
  category: "",
  stock: 0,
  expire: 0,
  description: "",
  color: "",
};

const Form: React.FC<{ onClose: () => void; ID?: string; DELETE: string }> = ({
  onClose,
  DELETE,
}) => {
  const categories = useSelector(selectCategories);
  const products = useSelector(selectProducts);
  const product = useSelector((state: RootState) => {
    if (DELETE) {
      return selectProductById(state, DELETE);
    }
  });
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    getValues,
    control,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({ defaultValues });
  useEffect(() => {
    dispatch(getCategories());
  }, []);
  const submitHandler = (data: ProductFormValues) => {
    if (DELETE !== "" && DELETE !== undefined) {
      toast.promise(dispatch(deleteProduct({ body: DELETE })).unwrap(), {
        loading: "Deleting...",
        success: <b>{DELETE} Deleted Successfully</b>,
        error: <b>Could not Delete Category.</b>,
      });
    } else {
      // check if code is unique or not from the products list in the store
      const isCodeUnique = products.find((p) => p.code === data.code);
      if (isCodeUnique) {
        toast.error("Code is not unique");
        return;
      }

      const storageRef = ref(storage, "images/" + getValues("image")[0].name);
      uploadBytes(storageRef, getValues("image")[0]).then((snapshot) => {
        getDownloadURL(storageRef).then((url) => {
          const product: Partial<Product> = {
            ...data,
            image: url,
          };
          toast.promise(dispatch(addProductData(product)), {
            loading: "Adding Category...",
            success: <b>Category Added Successfully</b>,
            error: <b>Could not Add Category.</b>,
          });
        });
      });
    }
    onClose();
  };

  const codeIsUnique = (code: string) => {
    const isCodeUnique = products.find((p) => p.code === code);
    if (isCodeUnique) {
      return false;
    }
    return true;
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
      title={DELETE ? "Confirm Delete" : "Create Product"}
      onClose={onClose}
      onSubmit={handleSubmit((data) => {
        submitHandler(data);
      })}
      width={DELETE ? "400px" : "500px"}
    >
      {DELETE ? (
        <p>Are you sure you want to delete {product?.name}?</p>
      ) : (
        <form
          onSubmit={handleSubmit((data) => {
            submitHandler(data);
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
                    required: "Product Name is required",
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
                      {...register("code", {
                        required: "Product code is required",
                        validate: (value) => {
                          if (value.includes("_")) {
                            return "Code must be 14 characters long";
                          } else if (!codeIsUnique(value)) {
                            return "Code must be unique";
                          } else {
                            return true;
                          }
                        },
                      })}
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
                <input
                  {...register("image", {
                    required: "Product Image is required",
                  })}
                  type="file"
                  name="image"
                />
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
        </form>
      )}
    </Modal>
  );
};

export default Form;
