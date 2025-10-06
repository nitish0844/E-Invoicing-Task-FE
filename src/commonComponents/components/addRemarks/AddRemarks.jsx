import {
  Button,
  Card,
  Flex,
  Group,
  Text,
  TextInput,
  Textarea,
  Tooltip
} from '@mantine/core'
import { IconCloudPlus } from '@tabler/icons-react'
import { COLORS } from '../../../constants/colors'
import ModalComp from '../modal/ModalComp'

const AddRemarks = ({ setRemarksObj, remarksObj, onSubmit, loading }) => {
  return (
    <>
      <Tooltip label={'Click to add remarks'} withArrow>
        <Card
          bg={'#8F9592'}
          radius={8}
          style={{ width: '100%', height: '100%', cursor: 'pointer' }}
          onClick={() => setRemarksObj({ modal: true })}
        >
          <Flex
            h={'100%'}
            direction={'column'}
            align={'center'}
            gap={4}
            justify={'center'}
          >
            <IconCloudPlus color={COLORS.white} strokeWidth={2} size={36} />
            <Text fw={500} c={COLORS.white}>
              Add Remarks
            </Text>
          </Flex>
        </Card>
      </Tooltip>
      <ModalComp
        opened={Boolean(remarksObj?.modal)}
        onClose={() => setRemarksObj({ modal: false })}
        title={'Enter Remarks'}
      >
        <TextInput
          label={'Title'}
          placeholder='Please Enter Title'
          value={remarksObj?.value}
          resize='vertical'
          autosize={true}
          minRows={4}
          maxRows={6}
          onChange={e =>
            setRemarksObj(old => ({ ...old, title: e.currentTarget.value }))
          }
        />
        <Textarea
          label={'Remarks'}
          placeholder='Please Enter Remarks'
          value={remarksObj?.value}
          resize='vertical'
          autosize={true}
          minRows={4}
          maxRows={6}
          mt={'md'}
          onChange={e =>
            setRemarksObj(old => ({ ...old, remarks: e?.currentTarget?.value }))
          }
        />
        <Group mt={'md'} justify='right'>
          <Button
            size='xs'
            variant='outline'
            onClick={() => setRemarksObj({ modal: false })}
          >
            Cancel
          </Button>
          <Button
            size='xs'
            color={COLORS.green}
            loading={loading}
            onClick={() =>
              onSubmit({
                message: remarksObj?.remarks,
                title: remarksObj?.title
              })
            }
          >
            Save
          </Button>
        </Group>
      </ModalComp>
    </>
  )
}

export default AddRemarks
