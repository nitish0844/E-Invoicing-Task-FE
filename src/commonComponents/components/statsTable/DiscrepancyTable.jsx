import {useState } from 'react';
import ReactTable from "../../reactTable/ReactTable";
import { useQuery } from '@tanstack/react-query';
import { getAllData } from '../../../services/common.service';
import dayjs from 'dayjs';
import { createColumnHelper } from '@tanstack/react-table';
/*
meta_data: {
  "error":false,
  "date":"2024-12-14T18:30:00.000Z",
  "PNR":"C882C9",
  "from":"GOX",
  "to":"HYD",
  "flightNo":"IC 0207",
  "seat":"",
  "seq":"0011",
  "firstName":"PENTAFOX",
  "surname":"KAVI",
  "isInfant":true
}
*/


const columnHelper = createColumnHelper();
const columnData = [
  columnHelper.accessor("firstName", {
    id: "firstName",
    cell: (info) => (
      <span>
        {info.row.original.surname + "/" + info.row.original.firstName}
      </span>
    ),
    header: () => "Name",
    enableSorting: false,
  }),
  columnHelper.accessor("seq", {
    id: "seq",
    cell: (info) => (
      <span>
        {info.row.original.seq}
      </span>
    ),
    header: () => "Seq",
    enableSorting: false,
  }),
  columnHelper.accessor("description", {
    id: "description",
    cell: (info) => info.getValue() || "-",
    header: () => "Description",
    enableSorting: false,
  }),
  columnHelper.accessor("pnr", {
    id: "pnr",
    cell: (info) => info.getValue() || "-",
    header: () => "PNR",
    enableSorting: false,
  }),
  columnHelper.accessor("from", {
    id: "from",
    cell: (info) => info.getValue() || "-",
    header: () => "From",
    enableSorting: false,
  }),
  columnHelper.accessor("to", {
    id: "to",
    cell: (info) => info.getValue() || "-",
    header: () => "To",
    enableSorting: false,
  }),
  columnHelper.accessor("flight", {
    id: "flight",
    cell: (info) => info.getValue() || "-",
    header: () => "Flight",
    enableSorting: false,
  }),
  columnHelper.accessor("seat", {
    id: "seat",
    cell: (info) => info.getValue() || "-",
    header: () => "Seat",
    enableSorting: false,
  }),
  columnHelper.accessor("date", {
    id: "date",
    cell: (info) => info.getValue() ? dayjs(info.getValue()).format('DD MMM YYYY') : "-",
    header: () => "Date",
    enableSorting: false,
  }),
];

const DiscrepancyTable = ({ head, sorting, setSorting, discrepancyQuery, discrepancyPagination, setDiscrepancyPagination }) => {
  const handleSorting = (e) => {
    const updatedSorting = e(sorting);
    setSorting(updatedSorting);
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "10px",
        height: "100%",
        marginLeft: '-5px',
      }}
    >
      <div>
        <div
          style={{
            paddingTop: "5px",
            paddingLeft: "5px",
            borderRadius: "10px",
            flexDirection: "row",
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <p style={{ textAlign: "center", color: "#006089", fontSize: "18px", marginLeft: '8px' }}>
            {head}
          </p>
        </div>
        <div style={{ overflowY: "scroll", scrollbarWidth: "none" }}>
          <ReactTable
            rowData={discrepancyQuery?.data?.data}
            columnData={columnData}
            sorting={sorting}
            setSorting={handleSorting}
            alignItems="center"
            topMargin={0}
            useApiPagination
            apiSorting={true}
            allowSorting={true}
            page={discrepancyPagination?.page}
            setPage={(pageNo) => setDiscrepancyPagination({ ...discrepancyPagination, page: pageNo })}
            totalNoOfPages={discrepancyQuery?.data?.metaData?.total_number_of_page}
            totalNoOfRecords={discrepancyQuery?.data?.metaData?.records}
          />
        </div>
      </div>
    </div>
  );
};

export default DiscrepancyTable;
