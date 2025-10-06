import {
  Image,
  Container,
  Title,
  Text,
  Button,
  SimpleGrid,
  Flex
} from '@mantine/core'
import image from './image.svg'
import classes from './NotFound.module.css'
import { useNavigate } from 'react-router-dom'
import { COLORS } from '../../constants/colors'

const NotFoundImage = () => {
  const navigate = useNavigate()
  return (
    <Flex justify={'center'} h={'100vh'} align={'center'}>
      <Container className={classes.root}>
        <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
          <Image src={image.src} className={classes.mobileImage} />
          <div>
            <Title className={classes.title}>Something is not right...</Title>
            <Text c='dimmed' size='lg'>
              Page you are trying to open does not exist. You may have mistyped
              the address, or the page has been moved to another URL. If you
              think this is an error contact support.
            </Text>
            <Button
              variant='outline'
              size='compact-lg'
              mt='xl'
              color={COLORS.green}
              onClick={() => navigate('/')}
              className={classes.control}
            >
              Get back to home page
            </Button>
          </div>
          <Image src={image} className={classes.desktopImage} />
        </SimpleGrid>
      </Container>
    </Flex>
  )
}

export default NotFoundImage
