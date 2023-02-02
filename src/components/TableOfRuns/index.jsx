import React, { useContext } from "react";
import { usePagination, useTable } from "react-table";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { DataContext } from "../../App";
import { COLUMNS } from "../Columns";
import "./index.css";

const TableOfRuns = () => {
  const params = useParams();
  const { group_name, product_name } = params;
  const version_number = params["*"];
  console.log(group_name,product_name,version_number)
  const dataValue = useContext(DataContext);
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => {
    if (
      dataValue.summaryMap
        ?.get(group_name)
        ?.get(product_name)
        ?.get(version_number)["test_list"] !== undefined
    )
      return dataValue.summaryMap
        ?.get(group_name)
        ?.get(product_name)
        ?.get(version_number)["test_list"];
    else return [];
  }, [dataValue, group_name, product_name, version_number]);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state,
    gotoPage,
    pageCount,
    setPageSize,
    prepareRow,
  } = useTable(
    {
      columns,
      data: data,
    },
    usePagination
  );

  const { pageIndex, pageSize } = state;
  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups?.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup?.headers?.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page?.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row?.cells?.map((cell) => {
                  if (cell.column.Header === "Link")
                    return (
                      <td {...cell.getCellProps()}>
                        <a href={cell.value}>{cell.render("Cell")}</a>
                      </td>
                    );
                  else
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination-div">
        <button
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
          className="first-page-btn"
        >
          {"<<"}
        </button>{" "}
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          className="prev-page-btn"
        >
          Previous
        </button>{" "}
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          className="next-page-btn"
        >
          Next
        </button>{" "}
        <button
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
          className="last-page-btn"
        >
          {">>"}
        </button>{" "}
        <span className="pagination-text">
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span className="input-text">
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const pageNumber = e.target.value
                ? Number(e.target.value) - 1
                : 0;
              gotoPage(pageNumber);
            }}
            style={{ width: "50px" }}
          />
        </span>{" "}
        <span className="select-container">
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[10, 25, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </span>
      </div>
    </>
  );
};

export default TableOfRuns;
