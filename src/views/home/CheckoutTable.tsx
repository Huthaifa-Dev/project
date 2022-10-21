import { Cart, CartItem, Category } from "../../types";
import { Column, Row, useTable } from "react-table";
import { useMemo } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { Button } from "../../components/utils/Button/Button";
import { createDate, isDate } from "../../helpers/date";
import "./CheckoutTable.scss";
import toast from "react-hot-toast";
import { AppDispatch } from "../../redux";
import { useDispatch } from "react-redux";
import {
  removeProductFromCart,
  updateProductFromCart,
} from "../../redux/slices/cartSlice";
import { useForm } from "react-hook-form";
type Props = {
  data: CartItem[];
  cols: Column<CartItem>[];
  onDelete: (data: { id: string }) => void;
  cart?: Cart;
};

const Table = (props: Props) => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      quantity: 1,
    },
  });

  const dispatch = useDispatch<AppDispatch>();
  const data = useMemo(() => props.data, [props.data]);
  const Cols: () => Column<CartItem>[] = () => props.cols;
  const columns = useMemo(Cols, []);
  const tableInstance = useTable({ columns, data });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;
  const cart = props.cart;
  const deleteHandler = (data: Row<Category>) => {
    props.onDelete({ id: data.original.id });
  };

  const changeLocalQuantity = (ROW: Row<CartItem>) => {
    const product = ROW.original;
    const quantity = ROW.original.quantity;
    if (quantity > 0) {
      data[data.indexOf(product)].quantity = quantity;
    }
  };
  const changeQuantity = (data: CartItem, value: number, sum?: boolean) => {
    let newQuantity = data.quantity;
    if (sum) {
      newQuantity = data.quantity + value;
    } else {
      newQuantity = value;
    }
    const newItem = {
      ...data,
      quantity: newQuantity,
      total: data.price * newQuantity,
    };

    if (cart) {
      if (newItem.quantity > 0) {
        toast.promise(
          dispatch(updateProductFromCart({ body: newItem, cart: cart })),
          {
            loading: "Loading",
            success: "Success",
            error: "Error",
          }
        );
      } else {
        toast.promise(
          dispatch(removeProductFromCart({ body: newItem, cart: cart })),
          {
            loading: "Loading",
            success: "Success",
            error: "Error",
          }
        );
      }
    }
  };

  return (
    // apply the table props
    <>
      <table className="checkoutTable" {...getTableProps()}>
        <thead className="checkoutTable-head">
          {
            // Loop over the header rows
            headerGroups.map((headerGroup) => (
              // Apply the header row props
              <tr
                className="checkoutTable-head-row"
                {...headerGroup.getHeaderGroupProps()}
                key={nanoid()}
              >
                <th className="checkoutTable-head-row__cell delete">Delete</th>

                {
                  // Loop over the headers in each row
                  headerGroup.headers.map((column) => (
                    // Apply the header cell props
                    <th
                      className="checkoutTable-head-row__cell"
                      {...column.getHeaderProps()}
                      key={nanoid()}
                    >
                      {
                        // Render the header
                        column.render("Header")
                      }
                    </th>
                  ))
                }
              </tr>
            ))
          }
        </thead>
        {/* Apply the table body props */}
        <tbody className="checkoutTable-body" {...getTableBodyProps()}>
          {
            // Loop over the table rows
            rows.map((row) => {
              // Prepare the row for display
              prepareRow(row);
              return (
                // Apply the row props
                <tr
                  className="checkoutTable-body-row"
                  {...row.getRowProps()}
                  key={nanoid()}
                >
                  <td className="checkoutTable-body-row__cell delete">
                    Delete
                  </td>
                  {
                    // Loop over the rows cells
                    row.cells.map((cell) => {
                      // Apply the cell props
                      return (
                        <td
                          className="checkoutTable-body-row__cell"
                          {...cell.getCellProps()}
                          key={nanoid()}
                        >
                          {cell.column.id === "quantity" ? (
                            <form
                              className="quantity-actions"
                              //   onSubmit={(e) => {
                              //     e.preventDefault();
                              //     handleSubmit((data) => {
                              //       changeQuantity(row.original, data.quantity);
                              //     });
                              //   }}
                            >
                              <Button
                                className="quantity-actions__button"
                                onClick={() => {
                                  changeQuantity(row.original, 1, true);
                                }}
                              >
                                +
                              </Button>
                              <input
                                //   {...register("quantity")}
                                value={cell.value}
                                onChange={(e) => {
                                  changeQuantity(
                                    row.original,
                                    parseInt(e.target.value)
                                  );
                                }}
                                onBlur={(e) => {
                                  console.log("blur");
                                }}
                                type="number"
                              />
                              <Button
                                className="quantity-actions__button"
                                onClick={() => {
                                  changeQuantity(row.original, -1, true);
                                }}
                              >
                                --
                              </Button>
                            </form>
                          ) : (
                            cell.render("Cell")
                          )}
                        </td>
                      );
                    })
                  }
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </>
  );
};

export default Table;
