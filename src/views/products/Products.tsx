import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../components/utils/Button/Button";
import Table from "../../components/utils/Table/Table";
import { AppDispatch } from "../../redux";
import { getProducts, selectProducts } from "../../redux/slices/productSlice";
import { Product } from "../../types";
import "./Products.scss";
import Form from "./Form";
import { searchProducts } from "../../helpers/validations";
import { useNavigate } from "react-router-dom";
const defaultValues = {
  search: "",
  startDate: 0,
  endDate: 0,
};

type FormValues = {
  search: string;
  startDate: number;
  endDate: number;
};

const Products: React.VFC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const products = useSelector(selectProducts);
  const [filteredData, setFilteredData] = useState<Product[]>(products);
  const [form, setForm] = React.useState<boolean>(false);
  const [edittingID, setEdittingID] = React.useState<string>("");
  const [deletingID, setDeletingID] = React.useState<string>("");
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
  });

  const cols: ColumnDef<Product>[] = [
    {
      header: "Code",
      footer: (props) => props.column.id,
      accessorKey: "code",
    },
    {
      header: "Name",
      footer: (props) => props.column.id,
      accessorKey: "name",
    },
    {
      header: "Category",
      footer: (props) => props.column.id,
      accessorKey: "category",
    },
    {
      header: "Product Description",
      footer: (props) => props.column.id,
      accessorKey: "description",
    },
    {
      header: "tax(%)",
      footer: (props) => props.column.id,
      accessorKey: "tax",
    },
    {
      header: "Price",
      footer: (props) => props.column.id,
      accessorKey: "price",
    },
  ];
  useEffect(() => {
    toast.promise(dispatch(getProducts()), {
      loading: "Loading Products...",
      success: " Products Loaded",
      error: " Failed to load Products",
    });
  }, [dispatch]);
  useEffect(() => {
    setFilteredData(products);
  }, [products]);

  const handleOpenNewForm = () => {
    setForm(true);
  };
  const handleCloseNewForm = () => {
    setForm(false);
    setEdittingID("");
    setDeletingID("");
  };
  const handleOpenDeleteForm = (data: { id: string }) => {
    setForm(true);
    setDeletingID(data.id);
  };
  const handleFilter = (data: FormValues) => {
    const { startDate, endDate, search } = data;
    if (search === "" && !startDate && !endDate) {
      setFilteredData(products);
      return;
    }

    setFilteredData(() => {
      return products.filter((product) => {
        //return the product if the expire attribute is grater than startDate
        let flag = true;
        if (product.expire) {
          // if the expire attribute is valid
          if (startDate) {
            // if the expire attribute is grater than startDate
            flag = flag && product.expire > startDate;
            if (endDate) {
              // if the expire attribute is less than endDate
              flag = flag && product.expire < endDate;
            }
          }
        }
        return flag && searchProducts(product, search);
      });
    });
  };

  const handleSearchButton = () => {
    const search = getValues("search");
    if (search.length !== 0) {
      setValue("search", "");
    }
  };
  return (
    <>
      <div className={`container ${form ? "blur" : ""}`}>
        <div className="content">
          <div className="actions">
            <div className="col">
              <Button
                primary
                backgroundColor="#1f1f1f"
                onClick={handleOpenNewForm}
              >
                Add Product
              </Button>
            </div>
            <div className="col">
              <div className="actions__expire">
                <p className="label">Expiration Date:</p>
                <label className="label" htmlFor="startDate">
                  From:
                </label>
                <div className="form-group-wrapper">
                  <input
                    {...register("startDate")}
                    type="date"
                    id="startDate"
                    className={`form-control ${
                      errors.startDate ? "form-control--error" : ""
                    }`}
                  />
                  {errors.startDate && (
                    <p className="error-message">{errors.startDate.message}</p>
                  )}
                </div>
                <label className="label" htmlFor="endDate">
                  To:
                </label>
                <div className="form-group-wrapper">
                  <input
                    {...register("endDate", {
                      min: {
                        value: getValues("startDate"),
                        message: "To > From",
                      },
                    })}
                    type="date"
                    id="endDate"
                    className={`form-control ${
                      errors.endDate ? "form-control--error" : ""
                    }`}
                  />
                  {errors.endDate && (
                    <p className="error-message">{errors.endDate.message}</p>
                  )}
                </div>
                <Button
                  backgroundColor="white"
                  onClick={handleSubmit((data) => {
                    handleFilter(data);
                  })}
                >
                  Apply Filter
                </Button>
              </div>
              <div className="actions__search">
                <label htmlFor="search">Search:</label>
                <div className="actions__search__input">
                  <input
                    {...register("search", {
                      maxLength: {
                        value: 20,
                        message: "Search must be at most 20 characters long",
                      },
                    })}
                    type="text"
                    id="search"
                    className={`form-control`}
                  />
                  <Button
                    type="button"
                    onClick={handleSearchButton}
                    backgroundColor="white"
                  >
                    {watch("search").length === 0 ? "🔍" : "❌"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <Table
            cols={cols}
            data={filteredData}
            onEditCell={(data) => {
              navigate(`/products/${data.id}/edit`);
            }}
            onDelete={handleOpenDeleteForm}
          />
        </div>
      </div>
      {form && (
        <Form
          onClose={handleCloseNewForm}
          ID={edittingID}
          DELETE={deletingID}
        />
      )}
    </>
  );
};

export default Products;
