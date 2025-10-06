/* eslint-disable react/prop-types */
import {
  ActionIcon,
  Anchor,
  Button,
  Grid,
  Group,
  Menu,
  Popover,
  Text,
  Tooltip
} from '@mantine/core'
import React, { useCallback, useState } from 'react'
import HeaderWithSearch from '../headersWithSearch/HeaderWithSearch'
import { COLORS } from '../../../constants/colors'
import {
  IconFilter, IconPlus, IconDownload, IconUpload, IconFileExport,
  IconFileTypeXls, IconFileTypeCsv
} from '@tabler/icons-react'
import FileUpload from '../fileUpload/FileUpload'
import { displayNotification } from '../../notifications/displayNotification'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import FormBuilderModal from '../../formBuilder/FormBuilderModal'
import { getFormBuilderData } from '../../../services/master.service'
import { bulkUploadAPI, exportTableDetails, getFileTemplate } from '../../../services/common.service'
import useAuthStore from '../../../store/authStore'
import { action_name } from '../../../config/userRules'
import { CheckAllowed } from '../../../utils/roleBasedAccess'
import SelectComp from '../select/SelectComp'
import ModalComp from '../modal/ModalComp'

const transformFields = data => {
  return data?.[0]
}

const ActionButton = ({
  title,
  saveLoading,
  tableName,
  onSave,
  pagination,
  setPagination,
  actionName,
  // fileObj,
  // fileExportLoading = false,
  // fileExportQuery,
  // uploadDataQuery,
  builderTitle,
  builderData,
  queryKey,
  addNewComponent,
}) => {
  const { auth } = useAuthStore()
  const [formBuilder, setFormBuilder] = useState({})
  const [fileUploadObj, setFileUploadObj] = useState({})
  const [popoverState, setPopoverState] = useState(false)
  const queryClient = useQueryClient()

  const getDataHeaderQuery = useQuery({
    queryKey: ['formBuilders-fields', tableName],
    queryFn: () => getFormBuilderData({ tableName }),
    select: transformFields
  })
  const downloadTemplateMutation = useQuery({
    queryKey: 'template-' + tableName,
    queryFn: () => getFileTemplate({ tableName, fileName: `${tableName}-template` }),
    enabled: false,
  })

  const uploadDataMutation = useMutation({
    mutationKey: 'upload-data-' + tableName,
    mutationFn: body => bulkUploadAPI({ body, tableName, returnErrorObject: true })
  })

  const exportDataMutation = useMutation({
    mutationKey: 'export-data-' + tableName,
    mutationFn: (filtersForExport) => exportTableDetails(filtersForExport),
    onSuccess: res => {
      if (res?.data?.[0]?.url) {
        window.open(res?.data?.[0]?.url, '_blank')
      } else {
        displayNotification({
          message: 'File Download Failed',
          variant: 'error'
        })
      }
    },
    onError: err => {
      displayNotification({
        message: err?.message || err,
        variant: 'error'
      })
    }
  })

  const handleUpload = data => {
    const formData = new FormData()
    formData.append('file', data?.[0])
    uploadDataMutation.mutate(formData, {
      onSuccess: (res) => {
        displayNotification({
          message: res.message || 'File Uploaded successfully',
          variant: 'success'
        })
        queryClient.invalidateQueries([queryKey])
      },
      onError: res => {
        displayNotification({
          description: res?.message || 'Something went wrong. Please try again later.',
          autoClose: false,
          message: (
            <Button
              variant='white'
              href={res?.data?.[0]?.validation_file_url}
              target='_blank'
              component='a'
              size='compact-sm'
              rightSection={<IconDownload size={16} />}
            >
              Look up issues
            </Button>
          ),
          variant: 'error'
        })
      },
      onSettled: () => {
        setFileUploadObj({})
      }
    })
  }

  const handleFileDownload = () => {
    downloadTemplateMutation.refetch()
  }
  const handleExport = () => {
    exportDataMutation.mutate(pagination)
  }


  return (
    <>
      <Group justify='space-between'
      >
        <HeaderWithSearch
          title={title}
          pagination={pagination}
          setPagination={setPagination}
        />
        <Group gap={14}>
          {getDataHeaderQuery?.data?.filter(
            item =>
              !item?.hidden && item?.interface?.toUpperCase() === 'CHECKBOX'
          )?.length ? (
            <Popover
              // opened={popoverState}
              withArrow
              position='bottom'
              onClose={()=>setPopoverState(false)}
              clickOutsideEvents={['mouseup', 'touchstart']}
              shadow='xl'
            >
              <Popover.Target>
                <Tooltip
                  label={'Filter for Boolean Fields'}
                  withArrow
                  position='top'
                >
                  <ActionIcon
                    variant='outline'
                    color={COLORS.green}
                    size={'30'}
                    // onClick={() => setPopoverState(!popoverState)}
                  >
                    <IconFilter strokeWidth={1.5} />
                  </ActionIcon>
                </Tooltip>
              </Popover.Target>
              <Popover.Dropdown>
                <Text>Filters</Text>
                {builderData
                  ?.filter(
                    item =>
                      !item?.hidden &&
                      item?.interface?.toUpperCase() === 'CHECKBOX'
                  )
                  ?.map(item => (
                    <Grid key={item?.label}>
                      <Grid.Col span={12}>
                        <SelectComp
                          label={item?.label}
                          value={pagination?.filter?.[item?.field]}
                          onChange={e => {
                            setPagination({
                              ...pagination,
                              filter: {
                                ...pagination?.filter,
                                [item?.field]: e
                              }
                            })
                          }}
                          options={[
                            { label: 'Yes', value: 'true' },
                            { label: 'No', value: 'false' }
                          ]}
                        />
                      </Grid.Col>
                    </Grid>
                  ))}
              </Popover.Dropdown>
            </Popover>
          ) : null}
          {
            addNewComponent ? addNewComponent : (
              <Button
                size='xs'
                // variant='outline'
                color={COLORS.green}
                rightSection={<IconPlus size={16} />}
                onClick={() => setFormBuilder({ modal: true })}
              >
                Add New
              </Button>
            )
          }
          <CheckAllowed
            currentUser={auth?.emp_role_id?.role_name}
            action={
              action_name?.[actionName]?.template ||
              action_name?.master?.[`${actionName}_template`]
            }
          >
            <Button
              size='xs'
              variant='outline'
              color={COLORS.green}
              rightSection={<IconDownload size={16} />}
              onClick={handleFileDownload}
            >
              Download Template
            </Button>
          </CheckAllowed>
          <CheckAllowed
            currentUser={auth?.emp_role_id?.role_name}
            action={
              action_name?.[actionName]?.bulk_upload ||
              action_name?.master?.[`${actionName}_bulk_upload`]
            }
          >
            <Button
              size='xs'
              variant='outline'
              color={COLORS.green}
              rightSection={<IconUpload size={16} />}
              onClick={() => setFileUploadObj({ modal: true })}
            >
              Upload Data
            </Button>
          </CheckAllowed>
          <CheckAllowed
            currentUser={auth?.emp_role_id?.role_name}
            action={
              action_name?.[actionName]?.export ||
              action_name?.master?.[`${actionName}_export`]
            }
          >
            <Button
              size='xs'
              variant='outline'
              color={COLORS.green}
              rightSection={<IconFileTypeXls size={16} />}
              loading={exportDataMutation?.isLoading}
              onClick={handleExport}
            >
              Export
            </Button>
          </CheckAllowed>
        </Group>
      </Group>
      <FileUpload
        opened={fileUploadObj?.modal}
        onClose={() => setFileUploadObj({ modal: false })}
        onUpload={handleUpload}
        loading={uploadDataMutation?.isPending}
      />
      <FormBuilderModal
        builderData={getDataHeaderQuery?.data}
        builderDataLoading={getDataHeaderQuery?.isLoading}
        value={formBuilder?.data}
        setValue={setFormBuilder}
        opened={formBuilder?.modal}
        saveLoading={saveLoading}
        handleSave={() => onSave(formBuilder, setFormBuilder)}
        onClose={() => setFormBuilder({ modal: false })}
        title={builderTitle}
        span={6}
      />
      {/* <ModalComp>
        
      </ModalComp> */}
    </>
  )
}

export default ActionButton
