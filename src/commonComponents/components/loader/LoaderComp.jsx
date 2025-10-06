/* eslint-disable react/prop-types */
import { Skeleton } from '@mantine/core'

const LoaderComp = ({ loading, children, height = 10 }) => {
  return loading ? <Skeleton h={10} my={6} /> : children
}

export default LoaderComp
