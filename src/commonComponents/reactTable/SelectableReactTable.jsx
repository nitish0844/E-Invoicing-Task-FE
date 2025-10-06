/* eslint-disable react/prop-types */
import {
  ActionIcon,
  Box,
  Checkbox,
  Group,
  Loader,
  Select,
  Skeleton,
  Table,
  Text
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel
} from '@tanstack/react-table'
import React from 'react'
import { COLORS } from '../../constants/colors'
import { flexRender } from '@tanstack/react-table'
import { IconChevronsLeft } from '@tabler/icons-react'
import { IconChevronsRight } from '@tabler/icons-react'
import { IconChevronRight } from '@tabler/icons-react'
import { IconChevronLeft } from '@tabler/icons-react'
import classes from './ReactTable.module.css'
import useSelectedTableRowsStore from '../../store/selectedRowsStore'
import { motion } from 'framer-motion'
import { IconArrowRight } from '@tabler/icons-react'

const SelectableReactTable = ({
  rowData = [],
  columnData = [],
  onRowClick = () => null,
  selectData = [],
  search,
  setSearch,
  allowSorting = false,
  isRowCheck = false,
  isIntermadiate = false,
  loading,
  page,
  handleSelect,
  setPage,
  useApiPagination = true,
  totalNoOfRecords,
  totalNoOfPages,
  sorting,
  setSorting,
  apiSorting = false,
  isSortingRemoval = true,
  transferLoading = false
}) => {
  const [data, setData] = React.useState([])
  const [debounce] = useDebouncedValue(search, 400)
  const [assignedTo, setAssignedTo] = React.useState()

  React.useEffect(() => {
    setData([...rowData])
  }, [rowData])

  const table = useReactTable({
    data,
    columns: data?.length ? columnData : [],
    state: {
      globalFilter: debounce,
      sorting: sorting
    },
    onGlobalFilterChange: setSearch,
    manualSorting: apiSorting ? true : false,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableSortingRemoval: isSortingRemoval
  })

  const {
    selectedRows,
    addToSelectedRows,
    removeFromSelectedRows,
    resetSelectedRows,
    addAllRows
  } = useSelectedTableRowsStore(store => ({
    selectedRows: store.selectedRows,
    addToSelectedRows: store.addToSelectedRows,
    removeFromSelectedRows: store.removeFromSelectedRows,
    resetSelectedRows: store.resetSelectedRows,
    addAllRows: store.addAllRows
  }))

  if (loading) {
    return (
      <Box
        mt={'lg'}
        style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          overflow: 'hidden',
          background: '#fff'
        }}
      >
        <Table horizontalSpacing='lg' withColumnBorders verticalSpacing='sm'>
          <Table.Tbody>
            {Array(10)
              .fill()
              .map((_, rowKey) => (
                <Table.Tr
                  key={`row-${rowKey}`}
                  style={{
                    background:
                      rowKey % 2 === 0
                        ? COLORS.backgroundColors.lightGreen
                        : COLORS.white,
                    color: COLORS.textColor.table
                  }}
                >
                  {Array(6)
                    .fill()
                    .map((_, cellKey) => (
                      <Table.Td
                        key={`cell-${cellKey}`}
                        p={'md'}
                        className={classes.tableTr}
                      >
                        <Skeleton height={20} />
                      </Table.Td>
                    ))}
                </Table.Tr>
              ))}
          </Table.Tbody>
        </Table>
      </Box>
    )
  }

  if (!loading && !data?.length) {
    return (
      <Box mt={'xl'}>
        <Text c={'dimmed'} ta={'center'}>
          No Data to display
        </Text>
      </Box>
    )
  }

  return (
    <Box>
      <Box
        mt={'lg'}
        p={0}
        style={{
          border: !loading && data?.length && '1px solid #ccc',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      >
        <Table.ScrollContainer pb={0}>
          <Table
            horizontalSpacing='lg'
            withColumnBorders
            verticalSpacing='sm'
            style={{
              overflowX: 'auto',
              whiteSpace: 'nowrap'
              // maxWidth: '100vw'
            }}
          >
            <Table.Thead
              mt={5}
              style={{
                backgroundColor: COLORS.backgroundColors.lightGray
              }}
            >
              {table.getHeaderGroups().map(headerGroup => (
                <Table.Tr key={headerGroup.id}>
                  <Table.Th
                    style={{
                      textAlign: 'center'
                    }}
                  >
                    <Checkbox
                      styles={{
                        input: {
                          cursor: 'pointer'
                        }
                      }}
                      checked={isRowCheck()}
                      indeterminate={isIntermadiate()}
                      onChange={() => {
                        if (
                          selectedRows?.data?.length &&
                          (isRowCheck() || isIntermadiate())
                        ) {
                          resetSelectedRows()
                        } else {
                          addAllRows(
                            rowData,
                            rowData?.length + parseInt(selectedRows?.count)
                          )
                        }
                      }}
                    />
                  </Table.Th>
                  {headerGroup.headers.map(header => (
                    <Table.Th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        cursor: header.column?.getCanSort() && 'pointer',
                        textAlign: 'center',
                        color: COLORS.textColor.table
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          onClick={
                            allowSorting
                              ? header.column.getToggleSortingHandler()
                              : undefined
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽'
                          }[header.column.getIsSorted()] ?? null}
                        </div>
                      )}
                    </Table.Th>
                  ))}
                </Table.Tr>
              ))}
            </Table.Thead>
            <Table.Tbody>
              {table.getRowModel().rows.map((row, index) => (
                <Table.Tr
                  className={classes.tableTr}
                  style={{
                    background:
                      index % 2 === 0
                        ? COLORS.backgroundColors.lightGreen
                        : COLORS.white,
                    cursor: typeof onRowClick === 'function' && 'pointer',
                    color: COLORS.textColor.table
                  }}
                  key={row.id}
                >
                  <Table.Td style={{ cursor: 'default' }}>
                    <Checkbox
                      key={row?.original?.id}
                      color={COLORS.green}
                      size='xs'
                      checked={
                        selectedRows?.data?.filter(
                          e => row?.original?.id === e.id
                        )?.length
                      }
                      onChange={e => {
                        // if currentTarget checked is checked then the push will take place else pop
                        if (e.currentTarget.checked) {
                          addToSelectedRows(row?.original)
                        } else {
                          removeFromSelectedRows(row?.original)
                        }
                      }}
                      styles={{
                        input: {
                          cursor: 'pointer'
                        }
                      }}
                    />
                  </Table.Td>
                  {row.getVisibleCells().map(cell => (
                    <Table.Td
                      key={cell.id}
                      style={{ overflow: 'hidden' }}
                      onClick={() => {
                        typeof onRowClick === 'function' &&
                          onRowClick(row?.original)
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Box>
      <Box
        mt='md'
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {useApiPagination ? (
          <>
            {totalNoOfPages ? (
              <>
                <Group justify='space-between'>
                  <Box>
                    {data?.length ? (
                      <Box>
                        <Text size='xs' c={COLORS.textColor.gray}>
                          Total of {totalNoOfRecords} Records
                        </Text>
                      </Box>
                    ) : null}
                  </Box>
                  <Group gap={10}>
                    {page != 1 && (
                      <ActionIcon
                        variant='subtle'
                        size={'sm'}
                        onClick={() => setPage(1)}
                      >
                        <IconChevronsLeft size={16} />
                      </ActionIcon>
                    )}
                    {page != 1 && (
                      <ActionIcon
                        variant='subtle'
                        size={'sm'}
                        onClick={() => setPage(page - 1)}
                      >
                        <IconChevronLeft size={16} />
                      </ActionIcon>
                    )}
                    {page != 1 && (
                      <ActionIcon
                        variant='subtle'
                        size={'sm'}
                        onClick={() => setPage(page - 1)}
                      >
                        <Text size='xs' sx={{ color: 'rgb(0,0,0,0.5)' }}>
                          {page - 1}
                        </Text>
                      </ActionIcon>
                    )}
                    {page >= 1 && (
                      <ActionIcon variant='outline' size={'sm'} color='green.8'>
                        <Text size='xs' sx={{ color: 'rgb(0,0,0,0.5)' }}>
                          {page}
                        </Text>
                      </ActionIcon>
                    )}
                    {totalNoOfPages != 1 && totalNoOfPages != page && (
                      <ActionIcon
                        variant='subtle'
                        size={'sm'}
                        onClick={() => setPage(page + 1)}
                      >
                        <Text size='xs' sx={{ color: 'rgb(0,0,0,0.5)' }}>
                          {page + 1}
                        </Text>
                      </ActionIcon>
                    )}
                    {totalNoOfPages != 1 && totalNoOfPages != page && (
                      <ActionIcon
                        variant='subtle'
                        size={'sm'}
                        onClick={() => setPage(page + 1)}
                      >
                        <IconChevronRight size={16} />
                      </ActionIcon>
                    )}
                    {totalNoOfPages != 1 && totalNoOfPages != page && (
                      <ActionIcon
                        variant='subtle'
                        size={'sm'}
                        onClick={() => setPage(totalNoOfPages)}
                      >
                        <IconChevronsRight size={16} />
                      </ActionIcon>
                    )}
                  </Group>
                </Group>
              </>
            ) : null}
          </>
        ) : (
          <>
            <Group justify='space-between'>
              <Box>
                {data?.length ? (
                  <Box>
                    <Text size='xs' c={COLORS.textColor.gray}>
                      Total of {data?.length} Records
                    </Text>
                  </Box>
                ) : null}
              </Box>
              <Group gap={10}>
                {table.getState().pagination.pageIndex != 0 && (
                  <ActionIcon
                    variant='subtle'
                    size={'sm'}
                    onClick={() => table.setPageIndex(0)}
                  >
                    <IconChevronsLeft size={16} />
                  </ActionIcon>
                )}
                {table.getState().pagination.pageIndex != 0 && (
                  <ActionIcon
                    variant='subtle'
                    size={'sm'}
                    onClick={() => table.previousPage()}
                  >
                    <IconChevronLeft size={16} />
                  </ActionIcon>
                )}
                {table.getState().pagination.pageIndex != 0 && (
                  <ActionIcon
                    variant='subtle'
                    size={'sm'}
                    onClick={() => table.previousPage()}
                  >
                    <Text size='xs' sx={{ color: 'rgb(0,0,0,0.5)' }}>
                      {table.getState().pagination.pageIndex}
                    </Text>
                  </ActionIcon>
                )}
                {table.getState().pagination.pageIndex >= 0 && (
                  <ActionIcon variant='outline' size={'sm'} color='green.8'>
                    <Text size='xs' sx={{ color: 'rgb(0,0,0,0.5)' }}>
                      {table.getState().pagination.pageIndex + 1}
                    </Text>
                  </ActionIcon>
                )}
                {table.getPageCount() != 0 &&
                  table.getPageCount() !=
                    table.getState().pagination.pageIndex + 1 && (
                    <ActionIcon
                      variant='subtle'
                      size={'sm'}
                      onClick={() => table.nextPage()}
                    >
                      <Text size='xs' sx={{ color: 'rgb(0,0,0,0.5)' }}>
                        {table.getState().pagination.pageIndex + 2}
                      </Text>
                    </ActionIcon>
                  )}
                {table.getPageCount() != 0 &&
                  table.getPageCount() !=
                    table.getState().pagination.pageIndex + 1 && (
                    <ActionIcon
                      variant='subtle'
                      size={'sm'}
                      onClick={() => table.nextPage()}
                    >
                      <IconChevronRight size={16} />
                    </ActionIcon>
                  )}
                {table.getPageCount() != 0 &&
                  table.getPageCount() !=
                    table.getState().pagination.pageIndex + 1 && (
                    <ActionIcon
                      variant='subtle'
                      size={'sm'}
                      onClick={() =>
                        table.setPageIndex(table.getPageCount() - 1)
                      }
                    >
                      <IconChevronsRight size={16} />
                    </ActionIcon>
                  )}
              </Group>
            </Group>
          </>
        )}
      </Box>

      {selectedRows?.data?.length ? (
        <motion.div
          className={classes.floating}
          initial={{ opacity: 0, scale: 0.5, bottom: -10 }}
          animate={{ opacity: 1, scale: 1, bottom: 20 }}
          transition={{ type: 'spring', damping: 10, stiffness: 100 }}
        >
          <Box className={classes.mainBoxStyle}>
            <div className={classes.displayText}>
              <Text size={'xs'} className={classes.floatingText}>
                <span className={classes.numberCount}>
                  {selectedRows?.data?.length}
                </span>
                Selected Leads
              </Text>
              <Text size={'xs'} className={classes.floatingText}>
                <Select
                  data={selectData || []}
                  size='xs'
                  onChange={e => setAssignedTo(e)}
                  placeholder='Assign to'
                />
              </Text>
              <Text size={'xs'} className={classes.floatingText}>
                <div className={classes.actionDiv}>
                  {/* <motion.div
                    style={{
                      position: 'absolute',
                      borderRadius: '50px',
                      left: 0,
                      height: '20px',
                      width: '20px',
                      border: '2px dashed #AC9647'
                    }}
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeatDelay: -6,
                      repeat: Infinity
                    }}
                  ></motion.div> */}
                  <div className={classes.actionIcon}>
                    <motion.div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center'
                      }}
                      whileHover={{ scale: 1.2 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 10
                      }}
                      whileTap={{ scale: 0.8 }}
                      onClick={() =>
                        !transferLoading &&
                        handleSelect(selectedRows, assignedTo)
                      }
                    >
                      {transferLoading ? (
                        <Loader size={'xs'} type='dots' color='white' />
                      ) : (
                        <IconArrowRight color={COLORS.white} />
                      )}
                    </motion.div>
                  </div>
                </div>
                Assign Leads
              </Text>
            </div>
          </Box>
        </motion.div>
      ) : null}
    </Box>
  )
}

export default SelectableReactTable
