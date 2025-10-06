/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react'
import { Text, Group, Button, rem, useMantineTheme } from '@mantine/core'
import { Dropzone, MIME_TYPES } from '@mantine/dropzone'
import { IconCloudUpload, IconX, IconDownload } from '@tabler/icons-react'
import classes from './FileUpload.module.css'
import ModalComp from '../modal/ModalComp'
import { useState } from 'react'
import { COLORS } from '../../../constants/colors'
import { IconFileInfo } from '@tabler/icons-react'
import { IconCheck } from '@tabler/icons-react'

const FileUpload = ({
  opened,
  onClose,
  title = 'File Upload',
  onUpload,
  loading
}) => {
  const theme = useMantineTheme()
  const openRef = useRef(null)
  const [fileObj, setFileObj] = useState()

  useEffect(() => {
    if (!opened) {
      setFileObj()
    }
  }, [opened])
  return (
    <ModalComp
      opened={opened}
      onClose={() => {
        setFileObj()
        onClose()
      }}
      title={title}
      size={'lg'}
      centered
    >
      <div className={classes.wrapper}>
        <Dropzone
          openRef={openRef}
          onDrop={files => setFileObj(files)}
          onReject={files => console.log('rejected files', files)}
          className={classes.dropzone}
          style={{ borderColor: fileObj && COLORS.green }}
          radius='md'
          accept={[MIME_TYPES.xlsx, MIME_TYPES.xls, MIME_TYPES.csv]}
          maxSize={30 * 1024 ** 2}
        >
          <div style={{ pointerEvents: 'none' }}>
            <Group justify='center'>
              <Dropzone.Accept>
                <IconDownload
                  style={{ width: rem(50), height: rem(50) }}
                  color={theme.colors.blue[6]}
                  stroke={1.5}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX
                  style={{ width: rem(50), height: rem(50) }}
                  color={theme.colors.red[6]}
                  stroke={1.5}
                />
              </Dropzone.Reject>
              <Dropzone.Idle>
                {fileObj ? (
                  <IconCheck
                    style={{ width: rem(50), height: rem(50) }}
                    stroke={1.5}
                    color={COLORS.green}
                  />
                ) : (
                  <IconCloudUpload
                    style={{ width: rem(50), height: rem(50) }}
                    stroke={1.5}
                  />
                )}
              </Dropzone.Idle>
            </Group>

            <Text ta='center' fw={700} fz='lg' mt='xl'>
              <Dropzone.Accept>Drop files here</Dropzone.Accept>
              <Dropzone.Reject>File Not Supported</Dropzone.Reject>
              <Dropzone.Idle>Upload File</Dropzone.Idle>
            </Text>
            {fileObj ? (
              <Group justify='center' gap={6}>
                <IconFileInfo
                  size={12}
                  color='green'
                  style={{ marginTop: 7 }}
                />
                <Text fz='sm' c={COLORS.green} ta='center' mt='xs'>
                  {fileObj?.[0]?.name}
                </Text>
              </Group>
            ) : (
              <Text ta='center' fz='sm' mt='xs' c='dimmed'>
                Drag&apos;n&apos;drop files here to upload. We can accept only{' '}
                <i>.csv</i> or <i>.xlsx</i> formats.
              </Text>
            )}
          </div>
        </Dropzone>

        <Button
          className={classes.control}
          size='md'
          radius='xl'
          color={COLORS.green}
          loading={loading}
          onClick={() => {
            fileObj ? onUpload(fileObj) : openRef.current?.()
          }}
        >
          {fileObj ? 'Upload' : 'Select files'}
        </Button>
      </div>
    </ModalComp>
  )
}

export default FileUpload
