/* eslint-disable react/prop-types */
import { Box } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { COLORS } from '../../../constants/colors'

const DateInputComp = ({
  label,
  value,
  setValue,
  placeholder,
  isRequired = 0,
  ...props
}) => {
  return (
    <Box>
      <DateInput
        label={label}
        valueFormat='DD-MMM-YYYY'
        placeholder={placeholder}
        value={value}
        withAsterisk={isRequired}
        clearable
        onChange={setValue}
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

export default DateInputComp
