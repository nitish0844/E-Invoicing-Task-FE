import React from 'react';
import ReactTable from "../../../commonComponents/reactTable/ReactTable";

const StatsTable = ({ head, rowData, columnData, sorting, setSorting }) => {
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
            rowData={rowData}
            columnData={columnData}
            sorting={sorting}
            setSorting={handleSorting}
            alignItems="center"
            topMargin={0}
            useApiPagination={false}
            apiSorting={false}
            allowSorting={true}
          />
        </div>
      </div>
    </div>
  );
};

export default StatsTable;
