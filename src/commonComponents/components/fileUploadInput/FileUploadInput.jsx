/* eslint-disable react/prop-types */
import React from 'react'
import { Anchor, Box, FileInput, Flex, Text } from '@mantine/core'
import { COLORS } from '../../../constants/colors'
import { useMutation } from '@tanstack/react-query'
import { IconExternalLink, IconUpload } from '@tabler/icons-react'
import { fileUploadAPI } from '../../../services/common.service'
import { displayNotification } from '../../notifications/displayNotification'

const FileUploadInput = ({
  placeholder,
  label,
  value,
  setValue,
  isRequired,
  tableName,
  ...props
}) => {
  const fileUploadMutation = useMutation({
    mutationKey: ['uploadFile'],
    mutationFn: (file) => {
      console.log(file)
      const formData = new FormData()
      formData.append('file', file)
      return fileUploadAPI({
        body: formData,
        tableName
      })
    },
    onSuccess: (data) => {
      setValue(data?.[0].uploaded_url);
      displayNotification({
        message: 'File uploaded successfully',
        variant: 'success',
      })
    },
    onError: (error) => {
      displayNotification({
        message: error?.response?.data?.message || 'Unable to upload File. Try again later.',
        variant: 'error',
      })
    },
  })
  return (
    <Flex>
      <FileInput
        flex={1}
        label={label}
        accept={"image/*, .pdf, application/pdf"}
        // value={value}
        onChange={(file) => {
          if(file) {
            fileUploadMutation.mutate(file)
          }
        }}
        leftSectionPointerEvents="none"
        leftSection={<IconUpload size={16} />}
        withAsterisk={isRequired}
        placeholder={placeholder}
        clearable
        {...props}
      />
      {value ? (
        <Box w={50} ml={'xs'}>
          <Text size='sm'>Preview</Text>
          <Anchor
            height={36}
            href={value}
            target={'_blank'}
            underline='hover'
          >
            <IconExternalLink color={COLORS.primary} size={32} strokeWidth={1.5} />
          </Anchor>
        </Box>
      ) : null}
    </Flex>
  )
}

export default FileUploadInput
