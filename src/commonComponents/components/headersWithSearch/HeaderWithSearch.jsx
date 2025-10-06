/* eslint-disable react/prop-types */
import { Group, Text, TextInput } from '@mantine/core'
import { useDebouncedCallback } from '@mantine/hooks'
import { IconX } from '@tabler/icons-react'
import { IconSearch } from '@tabler/icons-react'
import { useEffect, useState } from 'react'

const HeaderWithSearch = ({
  pagination,
  title,
  setPagination,
  withSearch = true
}) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(pagination?.search || '');
  }, [pagination?.search]);

  const changeValue = useDebouncedCallback(() => {
    setPagination({ ...pagination, page: 1, search: value })
  }, 500)

  const handleChange = (e) => {
    setValue(e)
    changeValue()
  }

  return (
    <Group>
      <Text size='24px' fw={500}>
        {title}
      </Text>
      {withSearch ? (
        <TextInput
          size='xs'
          leftSection={<IconSearch size={16} />}
          placeholder='Search'
          // value={pagination?.search}
          value={value}
          onChange={e =>
            handleChange(e?.target.value)
            // setPagination({ ...pagination, search: e.target.value })
          }
          rightSection={
            pagination?.search ? (
              <IconX
                size={12}
                color='#ccc'
                style={{ cursor: 'pointer' }}
                onClick={() => { setPagination({ ...pagination, search: '' }); setValue('') }}
              />
            ) : null
          }
        />
      ) : null}
    </Group>
  )
}

export default HeaderWithSearch
