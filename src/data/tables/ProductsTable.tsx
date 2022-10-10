import { Category, Product } from "../../types";
import { Column, Row, useTable } from "react-table";
import { useEffect, useMemo, useReducer, useState } from "react";
import { nanoid } from "@reduxjs/toolkit";
import "./Table.scss";
import { Button } from "../../components/utils/Button/Button";
import { BiSortDown, BiSortAlt2, BiSortUp } from "react-icons/bi";
import { createDate, isDate } from "../../helpers/date";
import { arrayOf } from "prop-types";

type Props = {
  data: Product[];
  cols: Column<Product>[];
  onDelete: (data: { id: string }) => void;
  onEditCell: (data: { id: string }) => void;
  onSortHandler: (data: { id: string }) => void;
};

interface Sorting {
  name: "name" | "nameDec" | "normal";
  price: "price" | "priceDec" | "normal";
  category: "category" | "categoryDec" | "normal";
  tax: "tax" | "taxDec" | "normal";
  description: "description" | "descriptionDec" | "normal";
  code: "code" | "codeDec" | "normal";
}

const initialState: Sorting = {
  name: "normal",
  price: "normal",
  category: "normal",
  tax: "normal",
  description: "normal",
  code: "normal",
};

const sortReducer = (state, action) => {
  switch (action.type) {
    case "name":
      return state.name === "name"
        ? { ...initialState, name: "nameDec" }
        : { ...initialState, name: "name" };

    case "code":
      return state.code === "code"
        ? { ...initialState, code: "codeDec" }
        : { ...initialState, code: "code" };

    case "description":
      return state.description === "description"
        ? { ...initialState, description: "descriptionDec" }
        : { ...initialState, description: "description" };

    case "price":
      return state.price === "price"
        ? { ...initialState, price: "priceDec" }
        : { ...initialState, price: "price" };

    case "tax":
      return state.tax === "tax"
        ? { ...initialState, tax: "taxDec" }
        : { ...initialState, tax: "tax" };
    case "category":
      return state.category === "category"
        ? { ...initialState, category: "categoryDec" }
        : { ...initialState, category: "category" };
    default:
      return state;
  }
};

const Table = (props: Props) => {
  const [state, dispatchSort] = useReducer(sortReducer, initialState);
  const [sortFlag, setSortFlag] = useState("normal");
  useEffect(() => {
    // console.log("setSortFlag", sortFlag);
    const array = Object.entries(state);
    const sortValue = array.find((item) => item[1] !== "normal");
    if (sortValue) {
      props.onSortHandler({ id: sortValue?.[1] as string });
    }
  }, [sortFlag]);

  const data = useMemo(() => props.data, [props.data]);
  const Cols: () => Column<Product>[] = () => props.cols;
  const columns = useMemo(Cols, []);

  const tableInstance = useTable({ columns, data });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const deleteHandler = (data: Row<Category>) => {
    props.onDelete({ id: data.original.id });
  };

  const onSortHandler = (col: string) => {
    dispatchSort({ type: col });
    setSortFlag((prev) => (prev === "normal" ? "sort" : "normal"));
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
                    {
                      <Button
                        onClick={() => {
                          onSortHandler(column.id);
                        }}
                        data-active={
                          state[column.id] === "normal" ? false : true
                        }
                      >
                        {state[column.id] === column.id ? (
                          <BiSortDown />
                        ) : state[column.id] === column.id.concat("Dec") ? (
                          <BiSortUp />
                        ) : (
                          <BiSortAlt2 />
                        )}
                      </Button>
                    }
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
                      //   deleteHandler(row);
                    }}
                  >
                    ❌
                  </Button>
                  <Button
                    backgroundColor="white"
                    onClick={() => {
                      //   editHandler(row);
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
