import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../components/utils/Button/Button";
import Table from "../../components/utils/Table/Table";
import { AppDispatch } from "../../redux";
import { ColumnDef } from "@tanstack/react-table";
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

  useEffect(() => {
    toast.promise(dispatch(getCategories()), {
      loading: "Loading Categories...",
      success: " Categories Loaded",
      error: " Failed to load Categories",
    });
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
  const handleSearchButton = () => {
    if (search.length !== 0) {
      setValue("search", "");
    }
  };
  const filteredCategories = categories.filter((category) => {
    return category.name.toLowerCase().includes(search.toLowerCase());
  });

  const cols: ColumnDef<Category>[] = [
    {
      header: "Name",
      footer: (props) => props.column.id,
      accessorKey: "name",
    },
    {
      header: "Created At",
      footer: (props) => props.column.id,
      accessorKey: "createdAt",
    },
  ];
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
            cols={cols}
            onDelete={(data) => {}}
            data={filteredCategories}
            onEditCell={handleOpenEditForm}
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
