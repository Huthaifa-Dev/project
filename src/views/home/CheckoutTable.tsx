import { CartItem, Category } from "../../types";
import { Column, Row, useTable } from "react-table";
import { useMemo } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { Button } from "../../components/utils/Button/Button";
import { createDate, isDate } from "../../helpers/date";
import "./CheckoutTable.scss";
type Props = {
  data: CartItem[];
  cols: Column<CartItem>[];
  onDelete: (data: { id: string }) => void;
};

const Table = (props: Props) => {
  const data = useMemo(() => props.data, [props.data]);
  const Cols: () => Column<CartItem>[] = () => props.cols;
  const columns = useMemo(Cols, []);
  const tableInstance = useTable({ columns, data });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const deleteHandler = (data: Row<Category>) => {
    props.onDelete({ id: data.original.id });
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
                <th className="checkoutTable-head-row__cell delete">Delete</th>
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
                            <div className="quantity-actions">
                              <Button className="quantity-actions__button">
                                +
                              </Button>
                              <input type="number" value={cell.value} />
                              <Button className="quantity-actions__button">
                                --
                              </Button>
                            </div>
                          ) : (
                            cell.render("Cell")
                          )}
                        </td>
                      );
                    })
                  }
                  <td className="checkoutTable-body-row__cell delete">
                    Delete
                  </td>
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
