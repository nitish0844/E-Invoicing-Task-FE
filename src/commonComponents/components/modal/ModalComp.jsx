/* eslint-disable react/prop-types */
import { Modal, Text } from '@mantine/core'

const ModalComp = ({ opened, onClose, title, children, ...props }) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3
      }}
      transitionProps={{ transition: 'fade', duration: 300 }}
      title={
        <Text size='20px' fw={500}>
          {title}
        </Text>
      }
      {...props}
    >
      {children}
    </Modal>
  )
}

export default ModalComp
