import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Column } from "react-table";
import Table from "../../data/tables/CategoriesTable";
import Horizantal from "../../layout/Horizantal";
import { AppDispatch, RootState } from "../../redux";
import {
  getCategories,
  selectCategories,
} from "../../redux/slices/categorySlice";
import { Category } from "../../types";
import "./Categories.scss";

const Categories: React.VFC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector(selectCategories);
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
  }, []);
  console.log(categories);
  return (
    <Horizantal>
      <div className="container">
        <div className="actions">{/* <Button></Button> */}</div>
        <Table data={categories} cols={cols} />
      </div>
    </Horizantal>
  );
};

export default Categories;
