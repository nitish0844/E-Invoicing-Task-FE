/* eslint-disable react/prop-types */
import { Drawer, Text } from '@mantine/core'

const DrawerComp = ({ opened, onClose, title, children, ...props }) => {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={600} size='20px'>
          {title}
        </Text>
      }
      position={'right'}
      overlayProps={{ backgroundOpacity: 0.2, blur: 2 }}
      {...props}
    >
      {children}
    </Drawer>
  )
}

export default DrawerComp
