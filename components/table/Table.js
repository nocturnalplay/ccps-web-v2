import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import Link from "next/link";
import EditIcon from "@mui/icons-material/Edit";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";

export default function DataGridTable(props) {
  const { col, row, current } = props;
  let columns = col.filter((a) => a.name !== "ID");

  columns = columns.map((a, i) => ({
    field: a.table_name,
    headerName: a.name,
    width: 100,
  }));

  columns.unshift({
    field: "sno",
    headerName: "S NO",
    width: 20,
  });
  const customecol = [
    {
      field: "Fullview",
      minWidth: 120,
      renderCell: (params) => (
        <div>
          <div>
            <Link href={`/ccps/${current}/update/${params.row["id"]}`} passHref>
              <IconButton aria-label="edit">
                <EditIcon />
              </IconButton>
            </Link>
            <Link href={`/ccps/${current}/${params.row["id"]}`} passHref>
              <IconButton aria-label="view">
                <LaunchOutlinedIcon />
              </IconButton>
            </Link>
          </div>
        </div>
      ),
    },
  ];
  customecol.map((a) => columns.unshift(a));
  return (
    <DataGrid
      rows={!row ? [] : row.map((a, i) => ({ ...a, sno: i + 1 }))}
      columns={columns}
      components={{
        Toolbar: GridToolbar,
      }}
    />
  );
}
