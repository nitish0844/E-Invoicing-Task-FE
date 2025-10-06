/* eslint-disable react/prop-types */
import {
  ActionIcon,
  Box,
  Flex,
  Group,
  NumberInput,
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
import { flexRender } from '@tanstack/react-table'
import {
  IconArrowAutofitUp,
  IconChevronsLeft,
  IconDownload,
  IconSortAscending,
  IconSortAscendingSmallBig,
  IconSortDescending,
  IconSortDescendingSmallBig
} from '@tabler/icons-react'
import { IconChevronsRight } from '@tabler/icons-react'
import { IconChevronRight } from '@tabler/icons-react'
import { IconChevronLeft } from '@tabler/icons-react'
import classes from './ReactTable.module.css'
import { COLORS } from '../../constants/colors'
import { useClipboard } from '@mantine/hooks'
import { Tooltip } from '@mantine/core'
import PageSizeSelector from './PageSizeSelector'

const pageSizeOptions = ['10', '15', '20', '25']

const ReactTable = ({
  rowData = [],
  columnData = [],
  onRowClick = () => null,
  search,
  setSearch,
  allowSorting = false,
  loading,
  page,
  setPage,
  pageSize = 10,
  setPageSize,
  useApiPagination = true,
  totalNoOfRecords,
  totalNoOfPages,
  sorting,
  setSorting,
  apiSorting = true,
  isSortingRemoval = false,
  reportName = '',
  editPerPage = false
}) => {
  const [data, setData] = React.useState([])
  const [debounce] = useDebouncedValue(search, 400)
  const clipboard = useClipboard({ timeout: 1500 });

  React.useEffect(() => {
    if (rowData.length) {
      setData([...rowData])
    } else if (data.length) {
      setData([])
    }
  }, [rowData])

  const table = useReactTable({
    data,
    columns: data?.length ? columnData : [],
    state: {
      globalFilter: debounce,
      sorting: sorting,
      pagination: {
        pageIndex: page - 1,
        pageSize
      }
    },
    onGlobalFilterChange: setSearch,
    manualSorting: apiSorting ? true : false,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableSortingRemoval: isSortingRemoval,
    manualPagination: useApiPagination
  })

  if (loading) {
    return (
      <Box
        mt={'lg'}
        style={{
          overflow: 'hidden',
          background: '#fff'
        }}
      >
        <Table
          horizontalSpacing='lg'
          style={{
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}
        >
          <Table.Tbody>
            {Array(10)
              .fill()
              .map((_, rowKey) => (
                <Table.Tr
                  key={`row-${rowKey}`}
                  bg={rowKey % 2 === 0 ? 'gray.0' : 'white'}
                  pl={'xs'}
                  pr={'xs'}
                >
                  {Array(6)
                    .fill()
                    .map((_, cellKey) => (
                      <Table.Td
                        key={`cell-${cellKey}`}
                        // p={'md'}
                        pl={'xs'}
                        pr={'xs'}
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
        style={{
          // border: !loading && data?.length && `1px solid #ccc`,
          // borderRadius: '4px',
          overflow: 'hidden'
        }}
      >
        <Table.ScrollContainer pb={0}>
          <Table
            horizontalSpacing='lg'
            // withColumnBorders
            // withTableBorder
            style={{
              overflowX: 'auto',
              whiteSpace: 'nowrap'
            }}
          >
            <Table.Thead
              mt={5}
              c={'gray.7'}
              style={{
                background: 'rgb(228, 237, 253)'
              }}
            >
              {table?.getHeaderGroups()?.map(headerGroup => (
                <Table.Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header, i) => {
                    return (
                      <Table.Th
                        key={header.id}
                        pl={8}
                        pr={8}
                        colSpan={header.colSpan}
                        // style={{
                        //   cursor: header.column?.getCanSort() && 'pointer',
                        //   minWidth: 'auto',
                        //   maxWidth: 'auto',
                        //   whiteSpace: 'nowrap',
                        //   wordWrap: 'break-word',
                        //   overflow: 'visible',
                        //   textAlign: 'left',
                        //   borderRight: header.column.columnDef.endOfGroup ? '1px solid #ccc' : 'none', // 👈 check key

                        // }}
                        style={{
                          ...(header.column.columnDef.sticky
                            ? {
                              position: 'sticky',
                              zIndex: 2,
                              left: header.column.columnDef.stickyLeft,
                              background: '#e3ecfc',
                              minWidth: header.column.columnDef.size,
                              maxWidth: header.column.columnDef.size,
                            }
                            : {
                              cursor: header.column?.getCanSort() && 'pointer',
                              minWidth: 'auto',
                              maxWidth: 'auto',
                              whiteSpace: 'nowrap',
                              wordWrap: 'break-word',
                              overflow: 'visible',
                              textAlign: 'left',
                              borderRight: header.column.columnDef.endOfGroup ? '1px solid #ccc' : 'none', // 👈 check key
                            }),
                          // ...other styles
                        }}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            onClick={
                              allowSorting || apiSorting
                                ? header.column.getToggleSortingHandler()
                                : undefined
                            }
                            style={{
                              display: 'flex',
                              justifyContent:
                                header.colSpan > 1 ? 'center' : 'flex-start',
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: (
                                <Text display={'inline-block'} pl={'xs'} fw={600}>
                                  ↑
                                </Text>
                              ),
                              desc: (
                                <Text display={'inline-block'} pl={'xs'} fw={600}>
                                  ↓
                                </Text>
                              ),
                            }[header.column.getIsSorted()] ?? null}
                          </div>
                        )}
                      </Table.Th>
                    );
                  })}
                </Table.Tr>
              ))}
            </Table.Thead>
            <Table.Tbody>
              {table.getRowModel().rows.map((row, index) => {
                const isCancelled =
                  row.original?.flt_status?.toLowerCase() === 'cancelled'

                return (
                  <Table.Tr
                    className={classes.tableTr}
                    // bg={index % 2 === 0 ? 'gray.0' : 'white'}
                    bg={isCancelled ? 'rgba(250, 215, 215, 1)' : '#ffffff'}   // 👈 entire row background
                    style={{
                      cursor: typeof onRowClick === 'function' && 'pointer',
                      color: isCancelled ? '#000' : 'inherit', // 👈 keep text readable
                    }}
                    onClick={() => {
                      typeof onRowClick === 'function' && onRowClick(row?.original)
                    }}
                    key={row.id}
                  >
                    {row.getVisibleCells().map(cell => {
                      const isFile = cell.column.columnDef.accessorKey === 'file_url'
                      const cellValue = cell.getValue()

                      const shouldShowZero = cellValue === 0
                      const shouldShowEmpty = cellValue == null
                      let special = cell.column.columnDef.special

                      if (typeof special === 'string') {
                        try {
                          special = JSON.parse(special)
                        } catch (e) {
                          special = {}
                        }
                      }

                      const copyText = special?.copy_text === true

                      return (
                        <Table.Td
                          key={cell.id}
                          pl={8}
                          pr={8}
                          style={{
                            ...(cell.column.columnDef.sticky
                              ? {
                                position: 'sticky',
                                zIndex: 1,
                                left: cell.column.columnDef.stickyLeft,
                                background: isCancelled ? 'rgba(250, 215, 215, 1)' : '#ffffff', // 👈 sticky cells still match row bg
                                minWidth: cell.column.columnDef.size,
                                maxWidth: cell.column.columnDef.size,
                              }
                              : {
                                overflow: 'hidden',
                                borderRight: cell.column.columnDef.endOfGroup
                                  ? '1px solid #ccc'
                                  : 'none',
                              }),
                          }}
                        >
                          {shouldShowZero ? (
                            <p style={{ textAlign: 'left', width: 100 }}>0</p>
                          ) : shouldShowEmpty ? (
                            ''
                          ) : isFile ? (
                            <ActionIcon
                              variant='outline'
                              onClick={() => {
                                window.open(cell.getValue())
                              }}
                            >
                              <IconDownload size={16} />
                            </ActionIcon>
                          ) : copyText ? (
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
                              {String(cell.getValue())
                                .split(',')
                                .map((val, idx, arr) => (
                                  <Tooltip
                                    key={idx}
                                    label={clipboard.copied ? 'Copied' : 'Copy'}
                                    withArrow
                                    position="right"
                                  >
                                    <span
                                      style={{ cursor: 'pointer' }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        clipboard.copy(val.trim()); // copy only this value
                                      }}
                                    >
                                      {val.trim()}
                                      {idx < arr.length - 1 ? ', ' : ''}
                                    </span>
                                  </Tooltip>
                                ))}
                            </div>
                          ) : (
                            flexRender(cell.column.columnDef.cell, cell.getContext())
                          )}
                        </Table.Td>
                      )
                    })}
                  </Table.Tr>
                )
              })}
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
                      <Flex direction={'row'} gap={10} align={'center'}>
                        <Text size='xs' c={'gray.8'}>
                          Page {page} of {totalNoOfPages}
                        </Text>
                        {/* (<Text size='xs' c={'gray.8'}>Rows/page</Text>
                        <Select
                          w={60}
                          size='xs'
                          defaultValue={''+pageSize}
                          value={''+pageSize}
                          onChange={setPageSize}
                          data={pageSizeOptions}
                        />) */}

                        {editPerPage && (
                          <>
                            (
                            <Text size='xs' c={'gray.8'}>Rows per page</Text>
                            <PageSizeSelector
                              pageSize={pageSize}
                              setPageSize={setPageSize}
                              pageSizeOptions={pageSizeOptions}
                            />
                            )
                          </>
                        )}

                        <Text size='xs' c={'gray.8'}>
                          Total of {totalNoOfRecords} Records
                        </Text>
                      </Flex>
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
                      <ActionIcon variant='outline' size={'sm'}>
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
                    <Text size='xs' c={'gray.8'}>
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
    </Box>
  )
}

export default ReactTable
