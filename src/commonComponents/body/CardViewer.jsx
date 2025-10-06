/* eslint-disable react/prop-types */
import { Box } from '@mantine/core'

const CardViewer = ({ children }) => {
  return <Box style={styles}>{children}</Box>
}

const styles = {
  border: '1.5px solid #00000012',
  boxShadow: '0px 4px 20px 0px #0000001A',
  borderRadius: '16px',
  height: '100%'
}

export default CardViewer
