import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Column } from "react-table";
import { Button } from "../../components/utils/Button/Button";
import Table from "../../data/tables/CategoriesTable";
import { AppDispatch } from "../../redux";
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
  const [deletingID, setDeletingID] = React.useState<string>("");
  const {
    register,
    watch,
    getValues,
    setValue,
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
      loading: "Loading Categories...",
      success: " Categories Loaded",
      error: " Failed to load Categories",
    });
  }, [dispatch]);

  const onSortHandler = (id: string) => {
    console.log("onSortHandler", id);
    toast.promise(dispatch(sortCategories({ id })), {
      loading: "Sorting...",
      success: "Sorted",
      error: "Error",
    });
  };

  const handleOpenNewForm = () => {
    setForm(true);
  };
  const handleSearchButton = () => {
    const search = getValues("search");
    console.log(search);
    if (search.length !== 0) {
      setValue("search", "");
    }
  };
  const handleCloseNewForm = () => {
    setForm(false);
    setEdittingID("");
    setDeletingID("");
  };
  const handleOpenEditForm = (data: { id: string }) => {
    setForm(true);
    setEdittingID(`${data.id}`);
  };
  const handleOpenDeleteForm = (data: { id: string }) => {
    setForm(true);
    setDeletingID(`${data.id}`);
  };

  const search = watch("search");
  const filteredCategories = categories.filter((category) => {
    return category.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
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
                  {getValues("search").length === 0 ? "🔍" : "❌"}
                </Button>
              </div>
            </div>
          </div>
          <Table
            onDelete={(data: { id: string }) => {
              handleOpenDeleteForm(data);
            }}
            data={filteredCategories}
            cols={cols}
            onEditCell={handleOpenEditForm}
            onSortHandler={(data: { id: string }) => {
              onSortHandler(data.id);
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

export default Categories;
