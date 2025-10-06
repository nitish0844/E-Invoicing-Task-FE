/* eslint-disable react/prop-types */
import { Box, Flex, Group, Indicator, Text } from '@mantine/core'
import { IconCalendarMonth } from '@tabler/icons-react'
import { COLORS } from '../../../constants/colors'
import ContentView from '../../body/ContentView'
import { Calendar } from '@mantine/dates'
import dayjs from 'dayjs'

const CalendarComp = ({
  value,
  setValue,
  calendarData = {},
  header = true
}) => {
  const handleSelect = date => {
    const isSelected = value.some(s => dayjs(date).isSame(s, 'date'))
    if (isSelected) {
      setValue([])
    } else if (value.length < 3) {
      setValue([date])
    }
  }
  return (
    <>
      {header ? (
        <Group gap={6} mb={'lg'}>
          <IconCalendarMonth strokeWidth={1.5} size={16} color={COLORS.green} />
          <Text size='16px' c={COLORS.green} fw={500}>
            Calendar
          </Text>
        </Group>
      ) : null}
      <Box h={400} w={400}>
        <ContentView>
          <Flex h={400} w={400} justify={'center'} align={'center'}>
            <Calendar
              size='xl'
              // maxLevel='month'
              getDayProps={date => ({
                selected: value?.some(s => dayjs(date)?.isSame(s, 'date')),
                onClick: () => handleSelect(date)
              })}
              c='green'
              renderDay={date => {
                const selectedData =
                  calendarData &&
                  Object.keys(calendarData)?.map(item => {
                    return dayjs(item)?.format('DD MM YYYY')
                  })
                return (
                  <Indicator
                    size={6}
                    color={
                      dayjs(date)?.format('DD MM YYYY') ===
                      dayjs()?.format('DD MM YYYY')
                        ? 'blue'
                        : dayjs(date)?.format('DD MM YYYY') >=
                          dayjs()?.format('DD MM YYYY')
                        ? 'red'
                        : 'green'
                    }
                    offset={-2}
                    disabled={
                      selectedData?.length
                        ? !selectedData?.includes(
                            dayjs(date)?.format('DD MM YYYY')
                          )
                        : true
                    }
                  >
                    <Box
                      px={
                        dayjs(date)?.format('DD MM YYYY') ===
                          dayjs()?.format('DD MM YYYY') && 10
                      }
                      pt={
                        dayjs(date)?.format('DD MM YYYY') ===
                          dayjs()?.format('DD MM YYYY') && 4
                      }
                      pb={
                        dayjs(date)?.format('DD MM YYYY') ===
                          dayjs()?.format('DD MM YYYY') && 2
                      }
                      style={{
                        fontSize: 14,
                        border:
                          dayjs(date)?.format('DD MM YYYY') ===
                          dayjs()?.format('DD MM YYYY')
                            ? `1px solid ${COLORS.darkBlue}`
                            : 'none',
                        borderRadius: 10
                      }}
                    >
                      {date?.getDate()}
                    </Box>
                  </Indicator>
                )
              }}
              styles={{
                // calendarHeader: { display: 'none' },
                weekday: { color: COLORS.green, fontSize: 18 }
              }}
            />
          </Flex>
        </ContentView>
      </Box>
    </>
  )
}

export default CalendarComp
