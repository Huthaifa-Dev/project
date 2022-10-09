import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Column } from "react-table";
import { Button } from "../../components/utils/Button/Button";
import Table from "../../data/tables/CategoriesTable";
import useInput from "../../hooks/useInput";
import Horizantal from "../../layout/Horizantal";
import { AppDispatch, RootState } from "../../redux";
import {
  getCategories,
  selectCategories,
} from "../../redux/slices/categorySlice";
import { Category } from "../../types";
import "./Categories.scss";
import Form from "./Form";

const Categories: React.VFC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector(selectCategories);
  const [form, setForm] = React.useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      search: "",
    },
  });

  const cols: Column<Category>[] = [
    {
      Header: "Category Name",
      accessor: "name",
    },
    {
      Header: "Created At",
      accessor: "createdAt",
    },
  ];
  useEffect(() => {
    toast.promise(dispatch(getCategories()), {
      loading: "Fetching...",
      success: <b>Categories Saved Successfully</b>,
      error: <b>Could not save Categories.</b>,
    });
  }, [dispatch]);

  const handleAddCategory = () => {
    setForm(true);
  };
  const handleClose = () => {
    setForm(false);
  };
  console.log(categories);
  return (
    <Horizantal>
      <div className={`container ${form ? "blur" : ""}`}>
        <div className="content">
          <div className="actions">
            <Button
              primary
              backgroundColor="#1f1f1f"
              onClick={handleAddCategory}
            >
              Add Category
            </Button>
            <div className="actions__search">
              <label className="label" htmlFor="search">
                Search:
              </label>
              <input
                {...register("search", {
                  required: "Name is required",
                  minLength: {
                    value: 4,
                    message: "Name must be at least 4 characters long",
                  },
                  maxLength: {
                    value: 20,
                    message: "Name must be at most 20 characters long",
                  },
                })}
                type="text"
                id="name"
                className={`form-control ${
                  errors.search ? "form-control--error" : ""
                }`}
              />
            </div>
          </div>
          <Table data={categories} cols={cols} />
        </div>
      </div>
      {form && <Form onClose={handleClose} />}
    </Horizantal>
  );
};

export default Categories;
