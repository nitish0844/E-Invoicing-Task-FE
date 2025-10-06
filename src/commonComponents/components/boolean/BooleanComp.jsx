/* eslint-disable react/prop-types */
import { Box, Switch, Text } from '@mantine/core'
import { COLORS } from '../../../constants/colors'

const BooleanComp = ({ value, setValue, label, isRequired = 0 }) => {
  return (
    <Box
      style={{
        marginTop: 10,
        marginLeft: 5
      }}
    >
      <Text size='12px' fw={500}>
        {label}
      </Text>
      <Switch
        mt={4}
        size='md'
        onLabel='Yes'
        offLabel='No'
        checked={value}
        onChange={event => setValue(event.currentTarget.checked)}
      />
    </Box>
  )
}

export default BooleanComp
