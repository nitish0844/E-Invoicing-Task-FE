import { Box, MultiSelect } from '@mantine/core'

const MultiSelectComp = ({
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
      <MultiSelect
        data={options}
        searchable
        withAsterisk={isRequired}
        placeholder={placeholder}
        label={label}
        value={value || []}
        onChange={setValue}
        {...props}
      />
    </Box>
  )
}

export default MultiSelectComp
