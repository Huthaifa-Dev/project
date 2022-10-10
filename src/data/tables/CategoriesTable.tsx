import { Category, Product } from "../../types";
import { Column, Row, useTable } from "react-table";
import { useMemo, useState } from "react";
import { nanoid } from "@reduxjs/toolkit";
import "./Table.scss";
import { Button } from "../../components/utils/Button/Button";
import { BiSortDown, BiSortAlt2, BiSortUp } from "react-icons/bi";
import {
  addCategoryData,
  deleteCategory,
} from "../../redux/slices/categorySlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux";
import toast from "react-hot-toast";
import { createDate, isDate } from "../../helpers/date";
type Props = {
  data: Category[];
  cols: Column<Category>[];
  onEditCell: (data: { id: string }) => void;
  onSortHandler: (data: { id: string }) => void;
};

type nameSort = "name" | "nameDec" | "normal";
type createdAtSort = "createdAt" | "createdAtDec" | "normal";

const Table = (props: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const [nameCol, setNameCol] = useState<nameSort>("normal");
  const [createdAtCol, setCreatedAtCol] = useState<createdAtSort>("normal");

  const data = useMemo(() => props.data, [props.data]);
  const Cols: () => Column<Category>[] = () => props.cols;
  const columns = useMemo(Cols, []);

  const tableInstance = useTable({ columns, data });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const deleteHandler = (data: Row<Category>) => {
    toast.promise(
      dispatch(deleteCategory({ body: data.original.id })).unwrap(),
      {
        loading: "Deleting...",
        success: <b>{data.original.name} Deleted Successfully</b>,
        error: <b>Could not Delete Category.</b>,
      }
    );
  };

  const onSortHandler = (col: string) => {
    let value = "name";
    if (col === "name") {
      if (nameCol === "name") {
        setNameCol("nameDec");
        value = "nameDec";
      } else {
        setNameCol("name");
        value = "name";
      }
      setCreatedAtCol("normal");
    } else {
      if (createdAtCol === "createdAt") {
        setCreatedAtCol("createdAtDec");
        value = "createdAtDec";
      } else {
        setCreatedAtCol("createdAt");
        value = "createdAt";
      }
      setNameCol("normal");
    }
    props.onSortHandler({ id: value });
  };

  const editHandler = (data: Row<Category>) => {
    props.onEditCell({ id: data.original.id });
  };
  return (
    // apply the table props

    <table className="table" {...getTableProps()}>
      <thead className="table-head">
        {
          // Loop over the header rows
          headerGroups.map((headerGroup) => (
            // Apply the header row props
            <tr
              className="table-head-row"
              {...headerGroup.getHeaderGroupProps()}
              key={nanoid()}
            >
              {
                // Loop over the headers in each row
                headerGroup.headers.map((column) => (
                  // Apply the header cell props
                  <th
                    className="table-head-row__cell"
                    {...column.getHeaderProps()}
                    key={nanoid()}
                  >
                    {
                      // Render the header
                      column.render("Header")
                    }
                    {column.id === "name" && (
                      <Button
                        onClick={() => {
                          onSortHandler(column.id);
                        }}
                        data-active={nameCol === "normal" ? false : true}
                      >
                        {nameCol === "name" ? (
                          <BiSortDown />
                        ) : nameCol === "nameDec" ? (
                          <BiSortUp />
                        ) : (
                          <BiSortAlt2 />
                        )}
                      </Button>
                    )}
                    {column.id === "createdAt" && (
                      <Button
                        onClick={() => {
                          onSortHandler(column.id);
                        }}
                        data-active={createdAtCol === "normal" ? false : true}
                      >
                        {createdAtCol === "createdAt" ? (
                          <BiSortDown />
                        ) : createdAtCol === "createdAtDec" ? (
                          <BiSortUp />
                        ) : (
                          <BiSortAlt2 />
                        )}
                      </Button>
                    )}
                  </th>
                ))
              }
              <th className="table-head-row__cell">Actions</th>
            </tr>
          ))
        }
      </thead>
      {/* Apply the table body props */}
      <tbody className="table-body" {...getTableBodyProps()}>
        {
          // Loop over the table rows
          rows.map((row) => {
            // Prepare the row for display
            prepareRow(row);
            return (
              // Apply the row props
              <tr
                className="table-body-row"
                {...row.getRowProps()}
                key={nanoid()}
              >
                {
                  // Loop over the rows cells
                  row.cells.map((cell) => {
                    // Apply the cell props
                    return (
                      <td
                        className="table-body-row__cell"
                        {...cell.getCellProps()}
                        key={nanoid()}
                      >
                        {isDate(cell.column.id)
                          ? createDate(new Date(cell.value))
                          : cell.render("Cell")}
                      </td>
                    );
                  })
                }
                <td className="table-body-row__cell">
                  <Button
                    backgroundColor="white"
                    onClick={() => {
                      deleteHandler(row);
                    }}
                  >
                    ❌
                  </Button>
                  <Button
                    backgroundColor="white"
                    onClick={() => {
                      editHandler(row);
                    }}
                  >
                    ✏️
                  </Button>
                </td>
              </tr>
            );
          })
        }
      </tbody>
    </table>
  );
};

export default Table;
