import { ActionIcon, Box, Image, ScrollArea, Tooltip, Text } from '@mantine/core'
import classes from './Layout.module.css'
import { IconAB2, IconChartDonut, IconTargetArrow } from '@tabler/icons-react'
import { IconUsers } from '@tabler/icons-react'
import { IconSettings2 } from '@tabler/icons-react'
import { COLORS } from '../../constants/colors'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { IconChartDonutFilled } from '@tabler/icons-react'
import { IconLoadBalancer } from '@tabler/icons-react'

const nav = [
  {
    title: 'Settings',
    nav: 'settings',
    icon: IconSettings2
  }
]

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
      <Box className={classes.flexLayout}>
        <Box className={classes.navbarList}>
          <Box mb={8}>
            <Tooltip label={'Dashboard'} withArrow position='right' offset={14}>
              <Box>
              <ActionIcon
                variant={
                  location?.pathname?.split('/')?.[1] !== ''
                    ? 'transparent'
                    : 'white'
                }
                size={50}
                onClick={() => navigate('/')}
              >
                <IconChartDonut
                  // color={
                  //   location?.pathname?.split('/')?.[1] !== ''
                  //     ? COLORS.white
                  //     : COLORS.green
                  // }
                />
              </ActionIcon>
              <Text size='xs'>Dashboard</Text>
              </Box>
            </Tooltip>
          </Box>
          {nav.map(item => (
            <Box key={item.title}>
              <Tooltip
                label={item.title}
                withArrow
                position='right'
                offset={14}
              >
                <ActionIcon
                  variant={
                    location?.pathname?.split('/')?.[1] === item.nav
                      ? 'white'
                      : 'transparent'
                  }
                  size={50}
                  onClick={() =>
                    navigate(item.query ? `${item.nav}${item.query}` : item.nav)
                  }
                >
                  <item.icon
                    // color={
                    //   location?.pathname?.split('/')?.[1] === item.nav
                    //     ? COLORS.green
                    //     : COLORS.white
                    // }
                  />
                </ActionIcon>
              </Tooltip>
            </Box>
          ))}
        </Box>
      </Box>
  )
}

export default Navbar
