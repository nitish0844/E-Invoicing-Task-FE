/* eslint-disable react/prop-types */
import { Button, Grid, Group, Skeleton, Text } from '@mantine/core'
import { COLORS } from '../../constants/colors'
import { FormBuilderFields } from './FormBuilderFields'
import { useEffect, useState } from 'react'

const FormBuilder = ({
  builderData,
  builderDataLoading = false,
  loading,
  onClose,
  span = 4,
  value = {},
  setValue,
  handleSave,
  saveLoading
}) => {
  const [checkError, setCheckError] = useState()

  useEffect(() => {
    if (builderData?.filter(item => !item?.hidden)?.length) {
      builderData
        ?.filter(item => !item?.hidden && item?.interface === 'CHECKBOX')
        ?.map(item => {
          setValue(old => ({
            ...old,
            data: { ...old?.data, [item?.field]: true }
          }))
        })
    }
    if (checkError) {
      setCheckError()
    }
  }, [builderData])

  const handleDataSave = value => {
    let check = false
    builderData
      ?.filter(item => !item?.hidden)
      ?.forEach(item => {
        const originalRegexString = item?.special
        const desiredRegexString = item?.special
          ? new RegExp(originalRegexString.replace(/\\\\/g, '\\'))
          : null
        desiredRegexString && console.log('label', item?.label)
        desiredRegexString &&
          console.log('originalRegexString', originalRegexString)
        desiredRegexString &&
          console.log(
            'originalRegexString',
            new RegExp(originalRegexString.replace(/\\\\/g, '\\'))
          )
        desiredRegexString &&
          console.log(
            'originalRegexString',
            desiredRegexString.test(value?.[item?.field])
          )
        if (
          (item?.is_required &&
            [null, undefined, ''].includes(value?.[item?.field])) ||
          (item?.special &&
            value?.[item?.field] &&
            !desiredRegexString.test(value?.[item?.field]))
        ) {
          check = true
          setCheckError(old => ({
            ...old,
            [item?.field]: item?.special
              ? 'Please Enter Valid Value'
              : 'Please Enter Value'
          }))
        }
      })
    if (!check) {
      setCheckError()
      handleSave(value)
    }
  }

  return (
    <>
      {/* <ScrollArea.Autosize mah={'80vh'}> */}
      <Grid>
        {builderDataLoading ? (
          Array(20)
            .fill(0)
            .map((_, index) => (
              <Grid.Col span={span} key={index}>
                <Skeleton h={40} my={4} />
              </Grid.Col>
            ))
        ) : builderData?.filter(item => !item?.hidden)?.length ? (
          builderData
            ?.filter(item => !item?.hidden)
            ?.map((item, index) => (
              <Grid.Col span={span} key={index}>
                <FormBuilderFields
                  item={item}
                  key={index}
                  value={value}
                  setValue={setValue}
                  checkError={checkError}
                />
              </Grid.Col>
            ))
        ) : (
          <Grid.Col span={12} my={100}>
            <Text c={'dimmed'} size='xs' ta={'center'}>
              No Fields to display!
            </Text>
          </Grid.Col>
        )}
      </Grid>
      {/* </ScrollArea.Autosize> */}
      {builderData?.filter(item => !item?.hidden)?.length ? (
        <Group justify='flex-end' gap={10} mt={'xl'}>
          <Button
            variant='outline'
            color='blue'
            onClick={() => {
              onClose()
              setCheckError()
            }}
          >
            Cancel
          </Button>
          <Button
            color={COLORS.green}
            isLoading={loading}
            onClick={() => handleDataSave(value)}
            loading={saveLoading}
          >
            Submit
          </Button>
        </Group>
      ) : null}
    </>
  )
}

export default FormBuilder
