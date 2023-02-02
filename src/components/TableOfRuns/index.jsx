import React, { useContext } from "react";
import { useTable } from "react-table";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { DataContext } from "../../App";
import { COLUMNS } from "../Columns";
import "./index.css";

const TableOfRuns = () => {
  const params = useParams();
  const { group_name, product_name } = params;
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
        ?.get(version_number)["test_list"];
    else return [];
  }, [dataValue, group_name, product_name, version_number]);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: data,
    });

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
          {rows?.map((row) => {
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
    </>
  );
};

export default TableOfRuns;
