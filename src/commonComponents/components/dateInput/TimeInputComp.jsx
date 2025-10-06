/* eslint-disable react/prop-types */
import { ActionIcon, Box, rem } from '@mantine/core'
import { TimeInput } from '@mantine/dates'
import { COLORS } from '../../../constants/colors'
import { IconClock } from '@tabler/icons-react';
import { useRef } from 'react';

const TimeInputComp = ({
  label,
  value,
  showPicker,
  setValue,
  placeholder,
  isRequired = 0,
  ...props
}) => {
  const ref = useRef(null);

  const pickerControl = (
    <ActionIcon variant="subtle" color="gray" onClick={() => ref.current?.showPicker()}>
      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>
  );

  return (
      <TimeInput
        ref={ref}
        label={label}
        value={value}
        placeholder={placeholder}
        withAsterisk={isRequired}
        onChange={setValue}
        rightSection={pickerControl}
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
  )
}

export default TimeInputComp
