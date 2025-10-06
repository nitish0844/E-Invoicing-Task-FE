import { ActionIcon, Anchor, Badge, Button, Image, Menu, Text } from '@mantine/core'
import {
  IconEye,
  IconFile,
  IconFileFilled,
  IconMenu,
  IconPaperclip
} from '@tabler/icons-react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const journeyStatus = {
  open: { color: 'blue' },
  closed: { color: 'gray' },
  cancelled: { color: 'red', width: 60 },
  'partially open': { color: 'blue', width: 80 },
  'auto cancelled': { color: 'red.7', width: 100 },
  "Paid": { color: 'green' },
  "Draft": { color: 'gray' },
  "Pending Finance Review": { color: 'orange', width: 150 },
}

const valueTypesMap = new Map()

const DocumentLink = ({ link, alt }) => {
  return (
    <Anchor href={link} target='_blank' alt={alt} title={link}>
      <Badge size='sm' variant='light' leftSection={<IconEye size={12} />}>
        View
      </Badge>
    </Anchor>
  )
}

const DocumentPreview = ({ link, alt }) => {
  return (
    <Anchor href={link} target='_blank' alt={alt} title={link}>
      {/* <Badge size='sm' variant='light' leftSection={<IconFile size={12} />}>
      </Badge> */}
      <ActionIcon
        variant='transparent'
        size={'sm'}
        style={{
          border: '1px solid #00000012'
        }}
        radius={'50%'}
      >
        <IconFileFilled size={24} />
      </ActionIcon>
    </Anchor>
  )
}

const AttachmentMenu = ({ urls }) => {
  return (
    <Menu
      withArrow
      position='bottom-end'
      shadow='lg'
      styles={{
        itemLabel: {
          color: '#339AF0'
        }
      }}
    >
      <Menu.Target>
        <ActionIcon variant='transparent' size={'sm'} onClick={e => e.stopPropagation()}>
          <IconPaperclip />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {urls.map((url, idx) => (
          <Menu.Item
            key={idx}
            leftSection={<IconFile size={16} color='#339AF0' />}
            onClick={(e) => {
              e.stopPropagation(); // stops row click
              window.open(url, '_blank')
            }}
          >
            {url?.split('/')?.pop()}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  )
}

valueTypesMap.set('attachments', (v, { moduleType, item }) => {
  if (typeof v === 'string') {
    try {
      const parsed = JSON.parse(v)
      if (
        Array.isArray(parsed) &&
        parsed.every(item => typeof item === 'string')
      ) {
        return <AttachmentMenu urls={parsed} />
        // <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        //   {parsed.map((url, idx) => (
        //   ))}
        // </div>
      }
    } catch (err) {
      console.log('parse the string error', err)
    }
  }
})

valueTypesMap.set("datetime_ist", (v, { moduleType }) => {
  if (!v) return '-'
  if (typeof v === 'string') {
    const cleaned = v.replace(/(\.\d{3})\d+/, '$1') // keep only 3 decimals
    return dayjs.utc(cleaned).tz('Asia/Kolkata').format('DD-MM-YYYY HH:mm:ss')
  }

  // If it's already a Date
  if (v instanceof Date) {
    return dayjs.utc(v).tz('Asia/Kolkata').format('DD-MM-YYYY HH:mm:ss')
  }

  return v
})

valueTypesMap.set("datetime_utc_from_ist", (v, { moduleType }) => {
  if (!v) return '-'

  if (typeof v === 'string') {
    // Parse as IST and convert to UTC
    return dayjs.tz(v, 'Asia/Kolkata').utc().format('DD-MM-YYYY HH:mm:ss')
  }

  if (v instanceof Date) {
    return dayjs(v).tz('Asia/Kolkata').utc().format('DD-MM-YYYY HH:mm:ss')
  }

  return v
})

valueTypesMap.set('attachment', (v, { moduleType, item }) => {
  if (typeof v === 'string') {
    try {
      if (v) {
        return (
          <Button
            leftSection={<IconFile size={16} />}
            onClick={(e) => {
              e.stopPropagation()
              window.open(v, '_blank')
            }}
            variant='transparent'
            size='compact-sm'
          >
            {v?.split('/')?.pop()}
          </Button>
        )
        // <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        //   {parsed.map((url, idx) => (
        //   ))}
        // </div>
      }
    } catch (err) {
      console.log('parse the string error', err)
    }
  }
})

valueTypesMap.set('text', (v, { moduleType }) => {
  if (typeof v === 'string') {
    return v
  }

  if (typeof v === 'number') {
    return (
      <p
        style={{
          // textAlign: moduleType === 'report' ? 'right' : 'left',
          width: moduleType === 'report' ? 100 : 'auto'
        }}
      >
        {v}
      </p>
    )
  } else if (typeof v === 'boolean') {
    return Boolean(v) ? (
      <Badge size='sm' variant='light'>
        Yes
      </Badge>
    ) : (
      <Badge size='sm' variant='light' color='red'>
        No
      </Badge>
    )
  } else if (v) {
    return (
      <p
        style={{
          textAlign:
            moduleType === 'report' && ['Yes', 'No']?.includes(v)
              ? 'center'
              : 'left'
        }}
      >
        {v}
      </p>
    )
  } else {
    return '' + (v || '')
  }
})

valueTypesMap.set('date', v => (v ? dayjs(v).format('DD-MMM-YY') : '-'))
valueTypesMap.set('datetime', v =>
  v ? dayjs(v).format('DD-MMM-YYYY hh:mm A') : '-'
)

// eslint-disable-next-line no-extra-boolean-cast
valueTypesMap.set('boolean', v => {
  return Boolean(v) ? (
    <Badge size='sm' variant='light'>
      Yes
    </Badge>
  ) : (
    <Badge size='sm' variant='light' color='red'>
      No
    </Badge>
  )
})
valueTypesMap.set('checkbox', v =>
  Boolean(v) ? (
    <Badge size='sm' variant='light'>
      Yes
    </Badge>
  ) : (
    <Badge size='sm' variant='light' color='red'>
      No
    </Badge>
  )
)
// valueTypesMap.set('time', v =>
//   v ? dayjs(`2001-01-01 ${v}`).format('HH:mm') : '-'
// )

valueTypesMap.set('time', (v, { moduleType }) => {
  if (typeof v === 'string') {
    return dayjs(v).tz('Asia/Kolkata').format('HH:mm'); // or 'hh:mm A' for 12-hour format
  }
});

valueTypesMap.set('FORM_SEARCH', v =>
  typeof v === 'string' ? v?.toUpperCase() : v || '' + (v || '')
)
valueTypesMap.set('image', v =>
  typeof v === 'string' ? (
    <Image
      src={v}
      mah={30}
      alt='Image'
      radius='sm'
      fit='contain'
      fallbackSrc='https://placehold.co/45x30?text=Img'
    />
  ) : (
    v || 'NA'
  )
)
valueTypesMap.set('document', v =>
  typeof v === 'string' ? (
    <DocumentLink link={v} alt={'GRN Document'} />
  ) : (
    v || 'NA'
  )
)

valueTypesMap.set('badge', (v, { moduleType, item }) => {
  const matchedOption = Array.isArray(item?.options)
    ? item.options.find(opt => opt.value?.toLowerCase() === v?.toLowerCase())
    : null;

  const badgeColor = matchedOption?.color || '';
  return (
    typeof v === 'string' ? (
      <Badge size='md' variant='light' color={badgeColor}>
        {v || 'NA'}
      </Badge>
    ) : (
      v || 'NA'
    )
  )
});

valueTypesMap.set('varchar', v => {
  if (journeyStatus[v]) {
    return (
      <Badge
        size='md'
        variant='light'
        color={journeyStatus[v]?.color}
        styles={{
          label: {
            textTransform: 'capitalize',
            width: journeyStatus[v]?.width || 50
          }
        }}
      >
        {v}
      </Badge>
    )
  } else {
    return v;
  }
})

valueTypesMap.set('currency', v => {
  if (v) {
    return (
      <Text size='sm'>
        ₹ {v?.toLocaleString('en-IN')}
      </Text>
    )
  } else {
    return (
      <Text>
        {v || 'NA'}
      </Text>
    )
  }
})

export const VALUE_TYPES = {
  text: 'text',
  date: 'date',
  amount: 'amount',
  datetime: 'datetime',
  time: 'time',
  boolean: 'boolean',
  image: 'image',
  document: 'document',
  checkbox: 'checkbox',
  varchar: 'varchar',
  attachment: 'attachment',
  badge: 'badge',
  timestamp: 'timestamp',
  // form_search: 'form_search',
}

export const changeValueFormat = (value, type = 'text', props = {}) => {
  const t = valueTypesMap.has(type?.toLowerCase())
    ? type?.toLowerCase()
    : 'text'
  
  return valueTypesMap.get(t)(value, props)
}
