import {
  ActionIcon,
  AppShell,
  Burger,
  Group,
  ScrollArea,
  Tooltip,
  UnstyledButton,
  Flex,
  Text,
  Menu,
  Image,
  Badge,
  Container,
  Title
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { COLORS } from '../../constants/colors'
import {
  IconChevronDown,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconLogout2,
  IconUserSquareRounded,
  IconTicket,
  IconAnalyze,
  IconReport,
  IconLayoutDashboard
} from '@tabler/icons-react'
import useAuthStore from '../../store/authStore'
import { FileJson } from 'lucide-react'

const ListItem = ({ expand, label, onClick, iconComp, active }) => {

  return (
    <Tooltip
      hidden={expand}
      label={label}
      withArrow
      position='right'
      offset={14}
    >
      <UnstyledButton
        dir='ltr'
        onClick={onClick}
        bg={active ? 'primary.1' : 'white'}
        w={'100%'}
        style={{ borderRadius: 4 }}
      >
        <Group justify='flex-start' gap={'xs'}>
          <Flex align={'center'} dir='row'>
            <ActionIcon variant={'transparent'} size={50}>
              {iconComp}
            </ActionIcon>
            <Text
              size='md'
              hidden={!expand}
              c={active ? 'primary.9' : 'dark.3'}
            >
              {label}
            </Text>
          </Flex>
        </Group>
      </UnstyledButton>
    </Tooltip>
  )
}

const iconProps = {
  strokeWidth: 1.5,
  color: COLORS.primary
}

const links = [
  {
    label: 'Dashboard',
    iconComp: <IconLayoutDashboard {...iconProps} />,
    link: '/',
    path: ''
  },
  {
    label: 'Analyze',
    iconComp: <IconAnalyze {...iconProps} />,
    link: '/analyze',
    path: 'analyze'
  },
  {
    label: 'Reports',
    iconComp: <IconReport {...iconProps} />,
    link: '/reports',
    path: 'reports'
  }
]

const AppShellLayout = () => {
  const [opened, { toggle }] = useDisclosure()
  const [expand, { toggle: toggleExpand }] = useDisclosure()
  const { auth, resetAuth } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()


  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: expand ? 200 : 72,
        breakpoint: 'sm',
        collapsed: { mobile: !opened }
      }}
      padding='md'
    >
      <AppShell.Header>
        <Container size="xl" h="100%" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Flex h="100%" align="center" gap="md">
            <FileJson size={32} color="#228be6" />
            <div>
              <Title order={3}>E-Invoicing Readiness Analyzer</Title>
              <Text size="sm" c="dimmed">GETS v0.1 Gap Analysis Tool</Text>
            </div>
          </Flex>
        </Container>
      </AppShell.Header>

      <AppShell.Navbar>
        {/* Navbar List Items Start */}
        <AppShell.Section
          grow
          my='md'
          component={ScrollArea}
          ta={expand ? 'left' : 'center'}
          p={'xs'}
        >
          {/* {links.map(link => {
            const active = location.pathname?.split('/')?.[1]
            return (
              <ListItem
                expand={expand}
                key={link.label}
                label={link.label}
                iconComp={link.iconComp}
                active={link.path === active}
                onClick={() => navigate(link.link)}
              />
            )
          })} */}

          {links.map((link) => {
            const active = location.pathname?.split('/')?.[1]
            return (
              <ListItem
                expand={expand}
                key={link.label}
                label={link.label}
                iconComp={link.iconComp}
                active={link.path === active}
                onClick={() => {
                  navigate(link.link);
                }}
              />
            );
          })}

          {/* <ListItem
            expand={expand}
            label={'Dashboard'}
            iconComp={<IconChartDonut2 {...iconProps} />}
            active
            onClick={() => navigate('/')}
          />
          <ListItem
            expand={expand}
            label={'Masters'}
            iconComp={<IconDatabaseCog {...iconProps} />}
            active
            onClick={() => navigate('/masters/aircraft')}
          /> */}

        </AppShell.Section>
        {/* Navbar List Items End */}
        {/* Navbar Footer Start */}
        <AppShell.Section ta={expand ? 'left' : 'center'} p={'xs'}>
          <Text ta="center" mt="lg" c={'primary.9'} size="xs">
            V{import.meta.env.VITE_APP_VERSION}
          </Text>
          <ListItem
            expand={expand}
            label={expand ? 'Collapse' : 'Expand'}
            iconComp={
              expand ? (
                <IconLayoutSidebarLeftCollapse {...iconProps} />
              ) : (
                <IconLayoutSidebarLeftExpand {...iconProps} />
              )
            }
            onClick={toggleExpand}
          />
          <ListItem
            expand={expand}
            label={'Logout'}
            iconComp={<IconLogout2 {...iconProps} />}
            onClick={resetAuth}
          />
        </AppShell.Section>
        {/* Navbar Footer End */}
      </AppShell.Navbar>
      <AppShell.Main style={{ alignItems: 'center' }}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}

export default AppShellLayout
