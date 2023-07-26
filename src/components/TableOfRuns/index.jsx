import React, { useContext } from "react";
import { usePagination, useTable } from "react-table";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { DataContext, LoadingContext } from "../../App";
import { COLUMNS } from "../Columns";
import "./index.css";
import { Circles } from "react-loader-spinner";

const TableOfRuns = () => {
  const params = useParams();
  const loadingValue = useContext(LoadingContext);
  const { group_name, product_name, result_till } = params;
  const result_till_value = result_till
    .substring(5)
    .concat("T00:00:00.000000+00:00");
  const version_number = params["*"];
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
        ?.get(version_number)
        ["test_list"].filter((row_data) => row_data.date >= result_till_value);
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
  if (loadingValue.isLoading === true)
    return (
      <div className="loading-container">
        <Circles
          height="80"
          width="80"
          color="blue"
          ariaLabel="circles-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        ></Circles>
      </div>
    );
  else
    return (
      <>
        <table {...getTableProps()}>
          <thead>
            {headerGroups?.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup?.headers?.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
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
