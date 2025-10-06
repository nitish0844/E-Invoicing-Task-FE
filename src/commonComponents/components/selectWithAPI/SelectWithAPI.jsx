/* eslint-disable react/prop-types */
import React from 'react'
import { Box, Select } from '@mantine/core'
import { COLORS } from '../../../constants/colors'
import { useQuery } from '@tanstack/react-query'
import { getSelectOptionsByTableName } from '../../../services/common.service'

const SelectWithAPI = ({
  placeholder,
  label,
  value,
  itemData,
  setValue,
  isRequired,
  tableName,
  ...props
}) => {
  const [search, setSearch] = React.useState({
    enabled: true,
    text: ''
  });
  const dataQuery = useQuery({
    enabled: search?.enabled,
    queryKey: [`data-select`, tableName, search?.text],
    queryFn: () =>
      getSelectOptionsByTableName({
        tableName,
        filters: itemData?.filters ? itemData?.filters : `{"is_active_eq":true}`,
        search: search?.text
      }),
    select: data => {
      return data?.map(items => {
        const label = JSON.parse(itemData?.display_options)?.map(item => {
          return items?.[item]
        })
        return {
          ...items,
          label: label?.join(' - ')?.toUpperCase(),
          value:
            itemData?.data_type === 'INT'
              ? parseInt(items?.[itemData?.return_value || 'id'])
              : items?.[itemData?.return_value || 'id']
        }
      })
    }
  })
  return (
    <Box>
      <Select
        data={
          dataQuery?.data?.map(item => ({
            ...item,
            value: item?.value?.toString()
          })) || []
        }
        placeholder={placeholder}
        value={value?.toString()}
        onChange={e => {
          setValue(e)
          setSearch({ 
            enabled: false,
            text: ''
          })
        }}
        withAsterisk={isRequired}
        searchable
        searchValue={search?.text}
        clearable
        onSearchChange={e => {
          setSearch({
            enabled: true,
            text: e
          })
        }}
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

export default SelectWithAPI
