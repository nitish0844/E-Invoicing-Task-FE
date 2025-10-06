/* eslint-disable react/prop-types */
import DateInputComp from '../components/dateInput/DateInputComp'
import SelectWithAPI from '../components/selectWithAPI/SelectWithAPI'
import BooleanComp from '../components/boolean/BooleanComp'
import dayjs from 'dayjs'
import { IconCalendar } from '@tabler/icons-react'
import TextInputComp from '../components/textInput/TextInputComp'
import SelectComp from '../components/select/SelectComp'
import NumberInputComp from '../components/numberInput/NumberInputComp'
import ImageUploadInput from '../components/imageUploadInput/ImageUploadInput'
import FileUploadInput from '../components/fileUploadInput/FileUploadInput'
import MultiSelectComp from '../components/multiSelect/MultiSelectComp'

/**
 * dateValidation is a utility function that takes in an item object which
 * contains a custom validation object, a value object, and a type string.
 * It returns a date object which is used for date input validation.
 *
 * The customValidationObj is expected to have a condition property which
 * can take one of the following values: 'gt', 'gte', 'lt', 'lte'. The condition
 * property is used to determine which date comparison operator to use.
 *
 * The function returns a date object which is calculated based on the condition
 * and the value of the field specified in the customValidationObj.
 *
 * If the condition is 'gt', the function returns a date object which is one day
 * greater than the value of the field specified in the customValidationObj.
 * If the condition is 'gte', the function returns a date object which is equal
 * to the value of the field specified in the customValidationObj.
 * If the condition is 'lt', the function returns a date object which is one day
 * less than the value of the field specified in the customValidationObj.
 * If the condition is 'lte', the function returns a date object which is equal
 * to the value of the field specified in the customValidationObj.
 *
 * If the condition is not one of the above values, the function returns null.
 *
 * @param {object} item - Item object which contains a custom validation object.
 * @param {object} value - Value object which contains the value of the field.
 * @param {string} type - Type string which is used to determine which date
 * comparison operator to use.
 * @returns {Date|null} A date object which is used for date input validation.
 */
const dateValidation = (item, value, type = 'min') => {
  let customValidationObj =
    typeof item?.custom_validation === 'string'
      ? JSON.parse(item?.custom_validation)
      : { ...item?.custom_validation }

  if (customValidationObj?.condition) {
    let obj = {
      min_gt: 'gt',
      max_lt: 'lt',
      min_gte: 'gte',
      max_lte: 'lte'
    }
    customValidationObj.condition =
      obj[`${type}_${customValidationObj?.condition}`]
  }

  switch (customValidationObj?.condition) {
    case 'gt':
      return value?.[customValidationObj?.field]
        ? dayjs(new Date(value?.[customValidationObj?.field]))
            .add(1, 'day')
            .toDate()
        : null
    case 'gte':
      return value?.[customValidationObj?.field]
        ? dayjs(new Date(value?.[customValidationObj?.field]))
            // .add(1, 'day')
            .toDate()
        : null
    case 'lt':
      return value?.[customValidationObj?.field]
        ? dayjs(new Date(value?.[customValidationObj?.field]))
            .subtract(1, 'day')
            .toDate()
        : null
    case 'lte':
      return value?.[customValidationObj?.field]
        ? dayjs(new Date(value?.[customValidationObj?.field]))
            // .subtract(1, 'day')
            .toDate()
        : null
    default:
      return null
  }
}

export const FormBuilderFields = ({
  value = {},
  setValue,
  item,
  checkError
}) => {
  switch (item?.interface) {
    
    case 'NUMERIC':
      return (
        <NumberInputComp
          label={item?.label}
          value={value?.[item?.field]}
          readOnly={item?.readonly}
          placeholder={item?.placeholder}
          isRequired={item?.readonly ? false : item?.is_required}
          error={checkError?.[item?.field]}
          setValue={e =>
            setValue(old => ({
              ...old,
              data: { ...old?.data, [item?.field]: e }
            }))
          }
        />
      )
    case 'TEXT':
      return (
        <TextInputComp
          label={item?.label}
          value={value?.[item?.field]}
          disabled={item?.readonly}
          readOnly={item?.readonly}
          placeholder={item?.placeholder}
          isRequired={item?.readonly ? false : item?.is_required}
          error={checkError?.[item?.field]}
          setValue={e =>
            setValue(old => ({
              ...old,
              data: { ...old?.data, [item?.field]: e }
            }))
          }
        />
      )
    case 'DATETIME':
      return (
        <DateInputComp
          label={item?.label}
          value={value?.[item?.field] ? new Date(value?.[item?.field]) : null}
          rightSection={!value?.[item?.field] && <IconCalendar size={16} />}
          readOnly={item?.readonly}
          minDate={dateValidation(item, value, 'min')}
          maxDate={dateValidation(item, value, 'max')}
          isRequired={item?.readonly ? false : item?.is_required}
          placeholder={item?.placeholder}
          error={checkError?.[item?.field]}
          setValue={e =>
            setValue(old => ({
              ...old,
              data: {
                ...old?.data,
                [item?.field]: e ? dayjs(e).format('YYYY-MM-DD') : null
              }
            }))
          }
        />
      )
    case 'DATE':
      return (
        <DateInputComp
          label={item?.label}
          value={value?.[item?.field] ? new Date(value?.[item?.field]) : null}
          rightSection={!value?.[item?.field] && <IconCalendar size={16} />}
          isRequired={item?.readonly ? false : item?.is_required}
          readOnly={item?.readonly}
          placeholder={item?.placeholder}
          minDate={dateValidation(item, value, 'min')}
          maxDate={dateValidation(item, value, 'max')}
          error={checkError?.[item?.field]}
          setValue={e =>
            setValue(old => ({
              ...old,
              data: {
                ...old?.data,
                [item?.field]: e ? dayjs(e).format('YYYY-MM-DD') : null
              }
            }))
          }
        />
      )
    case 'DROPDOWN':
      return (
        <SelectComp
          label={item?.label}
          value={value?.[item?.field]}
          error={checkError?.[item?.field]}
          setValue={e => {
            setValue(old => ({
              ...old,
              data: {
                ...old?.data,
                [item?.field]: e
              }
            }))
          }}
          readOnly={item?.readonly}
          placeholder={item?.placeholder}
          isRequired={item?.readonly ? false : item?.is_required}
          options={
            JSON?.parse(item?.options)?.map(val => ({
              label: val,
              value: val
            })) || []
          }
        />
      )
    case 'CHECKBOX':
      return (
        <BooleanComp
          label={item?.label}
          value={value?.[item?.field]}
          readOnly={item?.readonly}
          isRequired={item?.readonly ? false : item?.is_required}
          error={checkError?.[item?.field]}
          setValue={e =>
            setValue(old => ({
              ...old,
              data: { ...old?.data, [item?.field]: e }
            }))
          }
        />
      )
    case 'BOOLEAN':
      return (
        <MultiSelectComp
          label={item?.label}
          value={value?.[item?.field] || []}
          error={checkError?.[item?.field]}
          itemData={item}
          readOnly={item?.readonly}
          placeholder={item?.placeholder}
          options={[
            { label: 'Yes', value: 'true' },
            { label: 'No', value: 'false' }
          ]}
          isRequired={item?.readonly ? false : item?.is_required}
          setValue={v => {
            setValue(old => ({
              ...old,
              data: {
                ...old?.data,
                [item?.field]: v
              }
            }))
          }}
        />
      )
    case 'FORM_SEARCH':
      return (
        <SelectWithAPI
          label={item?.label}
          value={value?.[item?.field]}
          tableName={item?.foreign_key_table}
          error={checkError?.[item?.field]}
          itemData={item}
          readOnly={item?.readonly}
          placeholder={item?.placeholder}
          isRequired={item?.readonly ? false : item?.is_required}
          setValue={(v, obj) => {
            setValue(old => ({
              ...old,
              data: {
                ...old?.data,
                [item?.field]: v
              }
            }))
          }}
        />
      )
    case 'IMAGE':
      return (
        <ImageUploadInput
          label={item?.label}
          value={value?.[item?.field]}
          tableName={item?.foreign_key_table}
          error={checkError?.[item?.field]}
          readOnly={item?.readonly}
          placeholder={item?.placeholder}
          isRequired={item?.readonly ? false : item?.is_required}
          setValue={(v, obj) => {
            setValue(old => ({
              ...old,
              data: {
                ...old?.data,
                [item?.field]: v
              }
            }))
          }}
        />
      )
    case 'DOCUMENT':
      return (
        <FileUploadInput
          label={item?.label}
          value={value?.[item?.field]}
          tableName={item?.foreign_key_table}
          error={checkError?.[item?.field]}
          readOnly={item?.readonly}
          placeholder={item?.placeholder}
          isRequired={item?.readonly ? false : item?.is_required}
          setValue={(v, obj) => {
            setValue(old => ({
              ...old,
              data: {
                ...old?.data,
                [item?.field]: v
              }
            }))
          }}
        />
      )
    default:
      return (
        <TextInputComp
          label={item?.label}
          value={value?.[item?.field]}
          readOnly={item?.readonly}
          isRequired={item?.readonly ? false : item?.is_required}
          placeholder={item?.placeholder}
          error={checkError?.[item?.field]}
          setValue={e =>
            setValue(old => ({
              ...old,
              data: { ...old?.data, [item?.field]: e }
            }))
          }
        />
      )
  }
}
