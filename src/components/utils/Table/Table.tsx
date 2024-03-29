import React, { useEffect, useMemo, useState } from "react";
import "./Table.scss";
import { Button } from "../Button/Button";
import { BiSortDown, BiSortAlt2, BiSortUp } from "react-icons/bi";
import { createDate, isDate } from "../../../helpers/date";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  Row,
} from "@tanstack/react-table";

interface Props<T> {
  data: T[];
  cols: ColumnDef<T>[];
  onDelete: (data: T) => void;
  onEditCell: (data: T) => void;
}

function Table<T>(props: Props<T>) {
  // pegnate
  const [page, setPage] = useState({
    start: 0,
    end: 5,
    pegnate: 5,
  });
  const pegnate = (e) => {
    const { value } = e.target;
    const start = 0;
    const end = value;
    console.log(value, start, end);
    setPage((prev) => ({ ...prev, start, end }));
  };

  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    setData(props.data.slice(page.start, page.end));
  }, [props.data, page]);

  const columns = useMemo<ColumnDef<T>[]>(() => props.cols, []);
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  const deleteHandler = (data: Row<T>) => {
    props.onDelete(data.original);
  };

  const editHandler = (data: Row<T>) => {
    props.onEditCell(data.original);
  };
  return (
    // apply the table props
    <>
      <table className="table">
        <thead className="table-head">
          {
            // Loop over the header rows
            table.getHeaderGroups().map((headerGroup) => (
              // Apply the header row props
              <tr className="table-head-row" key={headerGroup.id}>
                {
                  // Loop over the headers in each row
                  headerGroup.headers.map((header) => (
                    // Apply the header cell props
                    <th className="table-head-row__cell" key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <button
                        {...{
                          onClick: header.column.getToggleSortingHandler(),
                          className: "sort-btn",
                        }}
                        data-active={!!header.column.getIsSorted()}
                      >
                        {{
                          asc: <BiSortUp />,
                          desc: <BiSortDown />,
                          false: <BiSortAlt2 />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </button>
                    </th>
                  ))
                }
                <th className="table-head-row__cell">Actions</th>
              </tr>
            ))
          }
        </thead>
        {/* Apply the table body props */}
        <tbody className="table-body">
          {
            // Loop over the table rows
            table.getRowModel().rows.map((row) => {
              // Prepare the row for display
              return (
                // Apply the row props
                <tr className="table-body-row" key={row.id}>
                  {
                    // Loop over the rows cells
                    row.getVisibleCells().map((cell) => {
                      // Apply the cell props
                      return (
                        <td className="table-body-row__cell" key={cell.id}>
                          {isDate(cell.column.id)
                            ? createDate(new Date(cell.getValue() as number))
                            : flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
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
      <div className="table-controls">
        <p>
          Showing {+page.start + 1} to {+Math.min(page.end, props.data.length)}{" "}
          of {+props.data.length} entries
        </p>
        <div className="table-controls__actions">
          <div className="pegination">
            Show
            <select name="query" id="query" onChange={pegnate}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            entries
          </div>
          <Button
            backgroundColor="white"
            disabled={page.start === 0}
            onClick={() =>
              setPage((prev) => ({
                ...prev,
                start: prev.start - prev.pegnate,
                end: prev.start,
              }))
            }
          >
            Previous
          </Button>
          <p>{page.end / page.pegnate}</p>
          <Button
            backgroundColor="white"
            disabled={page.end > data.length}
            onClick={() =>
              setPage((prev) => ({
                ...prev,
                start: prev.end,
                end: prev.end + prev.pegnate,
              }))
            }
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}

export default Table;
