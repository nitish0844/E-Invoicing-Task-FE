import dayjs from 'dayjs'

/**
 * Date mapper utility function.
 * @function
 * @param {string} key - Type of date to return.
 * @returns {string} Date string.
 * @example
 * dateMapper('MTD_START') // '2023-03-01'
 * dateMapper('YTD_START') // '2023-01-01'
 * dateMapper('TODAY') // '2023-03-23'
 */
export const dateMapper = key => {
  const now = new Date()

  switch (key) {
    case 'MTD_START':
      return dayjs().startOf('month').format('YYYY-MM-DD') // Start of month
    case 'MTD_END':
      return dayjs().endOf('month').format('YYYY-MM-DD') // End of month
    case 'YTD_START':
      return new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0] // Start of year
    case 'TODAY':
      return now.toISOString().split('T')[0] // Today's date
    default:
      return key // If it's already a date string
  }
}
