import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Column } from "react-table";
import { Button } from "../../components/utils/Button/Button";
import Table from "../../data/tables/ProductsTable";
import useInput from "../../hooks/useInput";
import Horizantal from "../../layout/Horizantal";
import { AppDispatch, RootState } from "../../redux";
import {
  getProducts,
  selectProducts,
  sortProducts,
} from "../../redux/slices/productSlice";
import { Product } from "../../types";
import "./Products.scss";
import Form from "./Form";

const Categories: React.VFC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectProducts);
  const [form, setForm] = React.useState<boolean>(false);
  const [edittingID, setEdittingID] = React.useState<string>("");
  const {
    register,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      search: "",
    },
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
  };
  const handleOpenEditForm = (data: { id: string }) => {
    setForm(true);
    setEdittingID(data.id);
  };

  const search = watch("search");
  console.log(search);
  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.code.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase()) ||
      product.description?.toLowerCase().includes(search.toLowerCase()) ||
      product.tax.toString().includes(search.toLowerCase()) ||
      product.price.toString().includes(search.toLowerCase())
    );
  });

  return (
    <Horizantal>
      <div className={`container ${form ? "blur" : ""}`}>
        <div className="content">
          <div className="actions">
            <Button
              primary
              backgroundColor="#1f1f1f"
              onClick={handleOpenNewForm}
            >
              Add Category
            </Button>
            <div className="actions__search">
              <label className="label" htmlFor="search">
                Search:
              </label>
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
            </div>
          </div>
          <Table
            data={filteredProducts}
            cols={cols}
            onEditCell={handleOpenEditForm}
            onSortHandler={(data: { id: string }) => {
              onSortHandler(data.id);
            }}
            onDelete={(data: { id: string }) => {}}
          />
        </div>
      </div>
      {form && <Form onClose={handleCloseNewForm} ID={edittingID} />}
    </Horizantal>
  );
};

export default Categories;
