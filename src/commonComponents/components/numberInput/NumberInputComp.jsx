/* eslint-disable react/prop-types */
import { Box, NumberInput } from '@mantine/core'
import { COLORS } from '../../../constants/colors'

const NumberInputComp = ({
  value,
  setValue,
  placeholder,
  label,
  error,
  isRequired = false,
  ...props
}) => {
  return (
    <Box>
      <NumberInput
        hideControls
        withKeyboardEvents={false}
        placeholder={placeholder}
        label={label}
        value={value}
        withAsterisk={isRequired}
        error={error}
        onChange={e => setValue(e)}
        clampBehavior='strict'
        // styles={{
        //   root: { position: 'relative' },
        //   label: {
        //     top: '12px',
        //     position: 'relative',
        //     left: '10px',
        //     backgroundColor: 'white',
        //     padding: '0px 6px',
        //     lineHeight: '12px',
        //     zIndex: '99',
        //     color: COLORS.textColor.label,
        //     fontSize: '12px'
        //   }
        // }}
        {...props}
      />
    </Box>
  )
}

export default NumberInputComp
