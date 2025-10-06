import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { NavLink, Grid } from '@mantine/core'
import {
  IconCategory,
  IconNote,
  IconPlaneDeparture,
  IconPlaneInflight,
  IconUserCog,
  IconUsers,
  IconUsersGroup,
  IconZoomMoney
} from '@tabler/icons-react'

const data = [
  {
    icon: IconPlaneDeparture,
    label: 'Airports',
    description: 'Manage your airports',
    link: '/masters/airports',
    path: 'airports'
  },
  {
    icon: IconUsers,
    label: 'Employees',
    description: 'Manage your employees',
    link: '/masters/employees',
    path: 'employees'
  },
  {
    icon: IconUserCog,
    label: 'Roles',
    description: 'Manage employee roles',
    link: '/masters/roles',
    path: 'roles'
  },
  {
    icon: IconUsersGroup,
    label: 'Groups',
    description: 'Manage role groups',
    link: '/masters/groups',
    path: 'groups'
  }
]

const MastersLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  // const [active, setActive] = React.useState(location.pathname?.split("/").pop() || 0);
  const items = data.map((item, index) => {
    const active = location.pathname?.split('/').pop()
    return (
      <NavLink
        // href="#required-for-focus"
        key={item.path}
        active={item.path === active}
        label={item.label}
        description={item.description}
        // rightSection={item.rightSection}
        leftSection={<item.icon size='1.2rem' stroke={1.5} />}
        onClick={() => {
          // setActive(item.path)
          navigate(item.link)
        }}
        color='blue'
        variant='subtle'
      />
    )
  })
  return (
    <>
      {/* <Title>Masters</Title> */}
      <Grid>
        <Grid.Col span={2}>{items}</Grid.Col>
        <Grid.Col span={10}>
          <Outlet />
        </Grid.Col>
      </Grid>
    </>
  )
}

export default MastersLayout
