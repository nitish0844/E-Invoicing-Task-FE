/* eslint-disable react/prop-types */
import React from 'react'
import { Box, FileInput, Flex, Image, Text } from '@mantine/core'
import { COLORS } from '../../../constants/colors'
import { useMutation } from '@tanstack/react-query'
import { IconPhotoUp } from '@tabler/icons-react'
import { fileUploadAPI } from '../../../services/common.service'
import { displayNotification } from '../../notifications/displayNotification'

const ImageUploadInput = ({
  placeholder,
  label,
  value,
  setValue,
  isRequired,
  tableName,
  ...props
}) => {
  const fileUploadMutation = useMutation({
    mutationKey: ['uploadImage'],
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
      console.log(data);
      setValue(data?.[0].uploaded_url);
      displayNotification({
        message: 'Image uploaded successfully',
        variant: 'success',
      })
    },
    onError: (error) => {
      displayNotification({
        message: error?.response?.data?.message || 'Unable to upload image. Try again later.',
        variant: 'error',
      })
    },
  })
  return (
    <Flex>
      <FileInput
        flex={1}
        label={label}
        accept="image/png,image/jpeg"
        // value={value}
        onChange={(file) => {
          if(file) {
            fileUploadMutation.mutate(file)
          }
        }}
        leftSectionPointerEvents="none"
        leftSection={<IconPhotoUp size={16} />}
        withAsterisk={isRequired}
        placeholder={placeholder}
        clearable
        {...props}
      />
      {value ? (
        <Box w={50} ml={'xs'}>
          <Text size='sm'>Preview</Text>
          <Image
            src={value}
            alt="Uploaded image"
            radius="xs"
            height={36}
            fit={'contain'}
            // withPlaceholder
          />
        </Box>
      ) : null}
    </Flex>
  )
}

export default ImageUploadInput
