/* eslint-disable react/prop-types */
import { Box, Select } from '@mantine/core'
import { COLORS } from '../../../constants/colors'

const SelectComp = ({
  placeholder,
  label,
  value,
  setValue,
  isRequired,
  options = [],
  ...props
}) => {
  return (
    <Box>
      <Select
        data={options}
        placeholder={placeholder}
        value={value}
        onChange={setValue}
        withAsterisk={isRequired}
        comboboxProps={{ withinPortal: false }}
        clearable
        searchable
        label={label}
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

export default SelectComp
