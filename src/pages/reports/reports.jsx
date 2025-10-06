import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import Body from "../../commonComponents/body/Body";
import { getAllDataV4, getHeaders } from "../../services/common.service";
import { Grid, Paper, Skeleton, Title } from "@mantine/core";
import ReactTable from "../../commonComponents/reactTable/ReactTable";
import { generateReportHeaders } from "../../utils/table.utils";
import HeaderWithSearch from "../../commonComponents/components/headersWithSearch/HeaderWithSearch";
import AnalyseDrawer from "./AnalyseDrawer";

const source = "report/list";
const Reports = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    search: "",
    source,
  });
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const allRecordsQuery = useQuery({
    queryKey: ["all-records", pagination],
    queryFn: () => getAllDataV4(pagination),
    // select: filterData,
  });

  const handleSorting = e => {
    // find the sorting data in the array from previous state
    const d = e(pagination.sort)
    setPagination(old => ({ ...old, sort: d }))
  }

  const tableHeadersQuery = useQuery({
    queryKey: ['table-headers'],
    queryFn: () => getHeaders({ source: "readiness_report" }),
    select: (data) => {
      return {
        headers: generateReportHeaders(data),
        data: data
      };
    }
  });

  if (allRecordsQuery.isLoading) {
    return (
      <Body>
        <Title>Reports</Title>
        <Grid mt={"md"}>
          {[...Array(5)].map((_, index) => (
            <Grid.Col span={2} key={index}>
              <Paper shadow="sm" p={"sm"}>
                <Skeleton height={36} width={36} circle mb="xs" />
                <Skeleton height={20} width="80%" mb="xs" />
                <Skeleton height={16} width="60%" />
              </Paper>
            </Grid.Col>
          ))}
        </Grid>
      </Body>
    );
  }

  return (
    <Body>
      <HeaderWithSearch
        title="Reports"
        pagination={pagination}
        setPagination={setPagination}
      />
      <ReactTable
        sorting={pagination.sort}
        setSorting={handleSorting}
        editPerPage
        columnData={tableHeadersQuery?.data?.headers}
        loading={allRecordsQuery?.isFetching}
        totalNoOfPages={allRecordsQuery?.data?.metadata?.total_number_of_page}
        totalNoOfRecords={allRecordsQuery?.data?.metadata?.records}
        rowData={allRecordsQuery?.data?.data}
        page={pagination?.page}
        pageSize={pagination?.per_page}
        setPage={page => setPagination({ ...pagination, page })}
        setPageSize={pageSize =>
          setPagination({ ...pagination, per_page: pageSize })
        }
        onRowClick={(row) => {
          setSelectedRowId(row.id); // Pass uploadId
          setDrawerOpened(true); // Open drawer
        }}
      />


      <AnalyseDrawer
        rowId={selectedRowId}
        opened={drawerOpened}
        onClose={() => {
          console.log("Drawer closed");
          setSelectedRowId(null);
          setDrawerOpened(false);
        }}
      />

    </Body>
  );
};

export default Reports;
