/* eslint-disable react/prop-types */
import { Box } from '@mantine/core'
import React from 'react'

const ContentView = ({ children }) => {
  return (
    <Box
      style={{
        boxShadow: '0.2px 0.2px 2px 0.5px #0000004D',
        width: '100%',
        height: '100%',
        background: '#ffff',
        borderRadius: 8
      }}
    >
      {children}
    </Box>
  )
}

export default ContentView
