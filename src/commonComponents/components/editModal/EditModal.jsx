/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { getFormBuilderData } from '../../../services/master.service'
import { IconCheck, IconTrash } from '@tabler/icons-react'
import ModalComp from '../modal/ModalComp'
import { Button, Grid, Group, ScrollArea } from '@mantine/core'
import { FormBuilderFields } from '../../formBuilder/FormBuilderFields'

const EditModal = ({
  saveLoading,
  tableName,
  onSave,
  builderTitle,
  opened,
  size='xl',
  onClose,
  formData,
}) => {
  const [checkError, setCheckError] = useState()
  const [formBuilder, setFormBuilder] = useState({
    edit: true,
    data: formData
  })

  const getDataHeaderQuery = useQuery({
    enabled: opened,
    queryKey: ['formBuilders-fields', tableName],
    queryFn: () => getFormBuilderData({ tableName }),
    select: data => {
      return data?.[0]
    }
  })

  const setDataFields = () => {
    let result = getDataHeaderQuery?.data
      // ?.filter(item => !item?.hidden)
      ?.map(item => ({
        [item?.field]: item?.display_options
          ? formData?.[item?.field]?.[item?.return_value]
          : formData?.[item?.field]
      }))
    const output = result.reduce((acc, obj) => ({ ...acc, ...obj }), {})
    setFormBuilder(old => ({ ...old, data: output }))
  }

  useEffect(() => {
    if (formData && getDataHeaderQuery?.data?.length) {
      setDataFields()
    }
  }, [formData, getDataHeaderQuery?.data])

  function handleSave() {
    onSave(formBuilder?.data)
  }

  return (
    <ModalComp
      opened={opened}
      closeOnClickOutside={false}
      onClose={() => {
        onClose()
        setCheckError()
      }}
      size={size}
      radius={'md'}
      title={builderTitle}
    >
      <ScrollArea.Autosize
        mah={'70vh'}
        mih={120}
        // scrollbars='y'
        // type='always'
        offsetScrollbars
      >
        <Grid>
          {
            getDataHeaderQuery?.data
              ?.filter(item => !item?.hidden)
              ?.map((item, index) => (
                <Grid.Col key={index} span={6}>
                  <FormBuilderFields
                    item={item}
                    key={index}
                    value={formBuilder?.data}
                    setValue={setFormBuilder}
                    checkError={checkError}
                  />
                </Grid.Col>
              ))
          }
        </Grid>
      </ScrollArea.Autosize>
      <Grid>
        <Grid.Col span={12}>
          <Group justify='flex-end' mt={'md'}>
            <Group>
              {/* <Button
                variant='light'
                color={'red'}
                leftSection={<IconTrash strokeWidth={1.5} size={16} />}
                onClick={() => {
                  
                }}
              >
                Delete
              </Button> */}
              <Button
                variant='light'
                color='gray'
                onClick={() => {
                  setFormBuilder({ edit: false })
                  setDataFields()
                  setCheckError()
                  onClose()
                }}
              >
                Cancel
              </Button>
              <Button
                leftSection={<IconCheck size={16} />}
                onClick={() => handleSave(formBuilder.data, setFormBuilder)}
                loading={saveLoading}
              >
                Save
              </Button>
            </Group>
          </Group>
        </Grid.Col>
      </Grid>
    </ModalComp>
  )
}

export default EditModal
