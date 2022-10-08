import { Category, Product } from "../../types";
import { Column, Row, useTable } from "react-table";
import { useMemo } from "react";
import { nanoid } from "@reduxjs/toolkit";
import "./Table.scss";
import { Button } from "../../components/utils/Button/Button";
type Props = {
  data: Category[];
  cols: Column<Category>[];
};

const Table = (props: Props) => {
  console.log(props.data);
  const data = useMemo(() => props.data, [props.data]);
  const Cols: () => Column<Category>[] = () => props.cols;
  const columns = useMemo(Cols, []);
  const tableInstance = useTable({ columns, data });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const deleteHandler = (data: Row<Category>) => {
    console.log(data.original);
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
                        {
                          // Render the cell contents
                          cell.render("Cell")
                        }
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
                  <Button backgroundColor="white">✏️</Button>
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
