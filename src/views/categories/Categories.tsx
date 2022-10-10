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
  sortCategories,
} from "../../redux/slices/categorySlice";
import { Category } from "../../types";
import "./Categories.scss";
import Form from "./Form";

const Categories: React.VFC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector(selectCategories);
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
    dispatch(getCategories());
  }, [dispatch]);

  const onSortHandler = (id: string) => {
    toast.promise(dispatch(sortCategories({ id })), {
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
  const filteredCategories = categories.filter((category) =>
    category.id.includes(search)
  );

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
            data={filteredCategories}
            cols={cols}
            onEditCell={handleOpenEditForm}
            onSortHandler={(data: { id: string }) => {
              onSortHandler(data.id);
            }}
          />
        </div>
      </div>
      {form && <Form onClose={handleCloseNewForm} ID={edittingID} />}
    </Horizantal>
  );
};

export default Categories;
