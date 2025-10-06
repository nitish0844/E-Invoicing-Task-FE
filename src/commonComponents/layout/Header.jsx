import { ActionIcon, Box, Group, Text, Tooltip } from '@mantine/core'
import classes from './Layout.module.css'
import {
  IconArrowLeft,
} from '@tabler/icons-react'
import { COLORS } from '../../constants/colors'
import { useNavigate } from 'react-router-dom'

const Header = ({ title, code, comp, withBackOption = false }) => {
  const navigate = useNavigate()

  return (
    <Box className={classes.headerRoot} mx={'md'}>
      <Text size='lg' fw={600}>
        {withBackOption ? (
          <Tooltip label={'Click to go back'} withArrow position='right'>
            <ActionIcon
              mr={'md'}
              variant='transparent'
              color={COLORS.green}
              onClick={() => navigate(-1)}
            >
              <IconArrowLeft strokeWidth={1.5} size={25} />
            </ActionIcon>
          </Tooltip>
        ) : null}
        {title}
        {code ? (
          <span style={{ color: COLORS.textColor.gray, fontWeight: 400 }}>
            {' '}
            - ({code})
          </span>
        ) : null}
      </Text>
      <Group gap={30}>
        {comp && comp}
      </Group>
    </Box>
  )
}

export default Header
