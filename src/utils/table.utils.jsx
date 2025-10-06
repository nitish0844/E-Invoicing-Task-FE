import { createColumnHelper } from '@tanstack/react-table'
import { changeValueFormat } from './format.utils'

const columnHelper = createColumnHelper()

/*
 * this function is used to generate the headers
 * @props
 * data: contains the array of object with the keys of [name, key, type]
 */

const safeJsonParse = (str, fallback = []) => {
  try {
    return str ? JSON.parse(str) : fallback;
  } catch {
    return fallback;
  }
};

export const generateReportHeaders = (data, moduleType) => {
  return data
    ?.filter(item => !item?.hidden)
    ?.map(item => {
      // console.log('>>>', item, item?.field)
      return columnHelper.accessor(item?.field, {
        header: ({ table }) => (
          <p
            style={{
              textAlign:
                moduleType === 'report' &&
                table.options.data?.some(
                  i => typeof i?.[item?.field] == 'number'
                )
                  ? 'right'
                  : 'left',
              width:
                moduleType === 'report' &&
                table.options.data?.some(
                  i => typeof i?.[item?.field] == 'number'
                ) &&
                100,
              whiteSpace:
                moduleType === 'report' &&
                table.options.data?.some(
                  i => typeof i?.[item?.field] == 'number'
                ) &&
                'wrap'
            }}
          >
            {/* {console.log(
              table.options.data?.some(i => typeof i?.[item?.field] == 'number')
            )} */}
            {item?.label}
          </p>
        ),
        enableSorting: true,
        interface: item?.interface,
        sortingFn: 'NA',
        cell: value => {
          const v =
            typeof value?.getValue() === 'object'
              ? value?.getValue()?.[safeJsonParse(item?.display_options)?.[0]]
              : value?.getValue();
          return changeValueFormat(v, item?.type, { moduleType, item })
        }
      })
    })
}