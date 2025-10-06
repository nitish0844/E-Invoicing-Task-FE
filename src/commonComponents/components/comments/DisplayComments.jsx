import { useQuery } from '@tanstack/react-query'
import { getCommentsById } from '../../../service/leads/leads.service'
import { Box, Flex, Group, Loader, ScrollArea, Text } from '@mantine/core'
import { IconCloud } from '@tabler/icons-react'
import { COLORS } from '../../../constants/colors'
import ContentView from '../../body/ContentView'
import ScheduleCard from '../../scheduleCard/ScheduleCard'
import dayjs from 'dayjs'

const DisplayComments = ({ id }) => {
  const getCommentsQuery = useQuery({
    queryKey: ['comments query', id],
    queryFn: () => getCommentsById({ id })
  })

  return (
    <>
      <Group gap={6} mb={'lg'}>
        <IconCloud strokeWidth={1.5} size={16} color={COLORS.green} />
        <Text size='16px' c={COLORS.green} fw={500}>
          Comment
        </Text>
        {getCommentsQuery?.isRefetching ? (
          <Loader size={'xs'} type='dots' />
        ) : null}
      </Group>
      <Box h={400}>
        <ContentView>
          <ScrollArea h={400} type='y'>
            {getCommentsQuery?.data?.data &&
            !getCommentsQuery?.isLoading &&
            Object.keys(getCommentsQuery?.data?.data)?.length ? (
              Object.entries(getCommentsQuery?.data?.data)?.map(
                ([key, value], index) => (
                  <Box key={index}>
                    <Flex
                      align={'center'}
                      wrap={'nowrap'}
                      bg={'#DFDFDF40'}
                      w={'100%'}
                      justify={'space-between'}
                      px={'md'}
                      py={8}
                      style={{ borderBottom: '1px solid #e3e3e3' }}
                    >
                      <Text size='14px' c={COLORS.green}>
                        {dayjs(key).format('DD MMM')}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {dayjs(key).format('dddd')}
                      </Text>
                    </Flex>
                    {value?.map((message, i) => (
                      <ScheduleCard
                        key={i}
                        message={{
                          company: message?.title,
                          message: message?.message,
                          time: dayjs(message?.sender_id?.created_date).format(
                            'hh:mm A'
                          )
                        }}
                        icon={false}
                      />
                    ))}
                  </Box>
                )
              )
            ) : (
              <Text c={'dimmed'} mt={170} ta={'center'}>
                No Data Found
              </Text>
            )}
          </ScrollArea>
        </ContentView>
      </Box>
    </>
  )
}

export default DisplayComments
