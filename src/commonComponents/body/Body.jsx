/* eslint-disable react/prop-types */
import { Box } from '@mantine/core'

const Body = ({ children }) => {
  return (
    <Box maw={1300} m={'auto'}>
      {children}
    </Box>
  )
}

export default Body
