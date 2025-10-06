import { Box, Flex, rem, Text } from '@mantine/core'
import React from 'react'

export default function DisplayField({
  label,
  value
}) {
  return (
    <Box w={'100%'} maw={400}>
      <Flex direction='column'>
        <Text size={rem(12)} c={'gray.5'} fw={600} m={0}>{label}</Text>
        <Box pb={4} pt={2}>
          <Text>{value}</Text>
        </Box>
      </Flex>
    </Box>
  )
}
