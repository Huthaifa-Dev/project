import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Column } from "react-table";
import { Button } from "../../components/utils/Button/Button";
import Table from "../../data/tables/ProductsTable";
import { AppDispatch } from "../../redux";
import {
  getProducts,
  selectProducts,
  sortProducts,
} from "../../redux/slices/productSlice";
import { Product } from "../../types";
import "./Products.scss";
import Form from "./Form";

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

const updateData = (data) => {
  return data;
};

const Products: React.VFC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectProducts);
  const [filteredData, setFilteredData] = useState<Product[]>(products);
  const [form, setForm] = React.useState<boolean>(false);
  const [edittingID, setEdittingID] = React.useState<string>("");
  const [deletingID, setDeletingID] = React.useState<string>("");
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
  });
  const { register: registerSearch, handleSubmit: handleSubmitSearch } =
    useForm<FormValues>({
      defaultValues,
    });

  const cols: Column<Product>[] = [
    {
      Header: "Code",
      accessor: "code",
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Category",
      accessor: "category",
    },
    {
      Header: "Product Description",
      accessor: "description",
    },
    {
      Header: "tax(%)",
      accessor: "tax",
    },
    {
      Header: "Price",
      accessor: "price",
    },
  ];
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const onSortHandler = (id: string) => {
    toast.promise(dispatch(sortProducts({ id })), {
      loading: "Sorting...",
      success: "Sorted",
      error: "Error",
    });
  };

  const handleOpenNewForm = () => {
    setForm(true);
  };
  const handleCloseNewForm = () => {
    setForm(false);
    setEdittingID("");
    setDeletingID("");
  };
  const handleOpenEditForm = (data: { id: string }) => {
    setForm(true);
    setEdittingID(data.id);
  };
  const handleOpenDeleteForm = (data: { id: string }) => {
    setForm(true);
    setDeletingID(data.id);
  };
  const handleDateFilter = (data: FormValues) => {
    const { startDate, endDate } = data;
    console.log({ 1: !startDate, 2: !endDate });
    if (!startDate && !endDate) {
      setFilteredData(products);
    }
    setFilteredData(() => {
      return products.filter((product) => {
        //return the product if the expire attribute is grater than startDate
        if (product.expire !== undefined) {
          if (endDate !== 0) {
            // console.log("Expire attribute is set to " + endDate.toString());
            return product.expire > startDate && product.expire < endDate;
          }
          // console.log("Expire attribute is grater than startDate");
          return product.expire > startDate;
        }
        // console.log("Expire attribute is grater than endDate");
        return false;
      });
    });
  };

  const handleSearch = (data: FormValues) => {
    const { search } = data;
    if (search === "") {
      setFilteredData(products);
    }
    setFilteredData(() => {
      return products.filter((product) => {
        return (
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.code.toLowerCase().includes(search.toLowerCase()) ||
          product.category.toLowerCase().includes(search.toLowerCase()) ||
          product.description?.toLowerCase().includes(search.toLowerCase()) ||
          product.tax.toString().includes(search.toLowerCase()) ||
          product.price.toString().includes(search.toLowerCase())
        );
      });
    });
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
                    {...register("startDate", {
                      min: {
                        value: 1,
                        message: "Product raw price must be at least 1$",
                      },
                    })}
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
                        message: "End Date must be more than start day.",
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
                  // backgroundColor="#1f1f1f"
                  onClick={handleSubmit((data) => {
                    handleDateFilter(data);
                  })}
                >
                  Apply Filter
                </Button>
              </div>
              <div className="actions__search">
                <form
                  onSubmit={handleSubmitSearch((data) => {
                    handleSearch(data);
                  })}
                >
                  <label htmlFor="search">Search:</label>
                  <input
                    {...registerSearch("search", {
                      maxLength: {
                        value: 20,
                        message: "Search must be at most 20 characters long",
                      },
                    })}
                    type="text"
                    id="search"
                    className={`form-control`}
                  />
                </form>
              </div>
            </div>
          </div>
          <Table
            data={filteredData}
            cols={cols}
            onEditCell={handleOpenEditForm}
            onSortHandler={(data: { id: string }) => {
              onSortHandler(data.id);
            }}
            onDelete={(data: { id: string }) => {
              handleOpenDeleteForm(data);
            }}
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
