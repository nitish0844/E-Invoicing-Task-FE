import { Combobox, InputBase } from '@mantine/core';
import { useCombobox } from '@mantine/core';
import { useState } from 'react';

const MAX_PAGE_SIZE = 250;
const PageSizeSelector = ({ pageSize, setPageSize, pageSizeOptions }) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [search, setSearch] = useState(''); // only for typing

  const optionStrings = pageSizeOptions.map((item) => String(item));

  // Filter options
  const filteredOptions =
    search.trim() === ''
      ? optionStrings
      : optionStrings.filter((item) =>
        item.includes(search.trim())
      );

  const handleOptionSubmit = (val) => {
    const num = Number(val);

    if (!isNaN(num) && num > 0 && num <= MAX_PAGE_SIZE) {
      setPageSize(num);
      setSearch('');
      combobox.closeDropdown();
    }
  };

  const handleInputChange = (val) => {
    // Only allow digits
    if (/^\d*$/.test(val)) {
      setSearch(val);
    }
  };

  return (
    <Combobox store={combobox} withinPortal={false} onOptionSubmit={handleOptionSubmit}>
      <Combobox.Target>
        <InputBase
          w={60}
          size="xs"
          value={search} // <-- allow empty string
          placeholder={String(pageSize)} // <-- show current pageSize as placeholder
          // onChange={(event) => setSearch(event.currentTarget.value)}
          onChange={(event) => handleInputChange(event.currentTarget.value)}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          rightSection={<Combobox.Chevron />}
          rightSectionPointerEvents="none"
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleOptionSubmit(search);
            }
          }}
          error={
            Number(search) > MAX_PAGE_SIZE
              ? `Maximum allowed value is ${MAX_PAGE_SIZE}`
              : undefined
          }
          errorProps={{
            withAsterisk: true,
          }}
        />
      </Combobox.Target>

      {filteredOptions.length > 0 && (
        <Combobox.Dropdown>
          <Combobox.Options>
            {filteredOptions.map((item) => (
              <Combobox.Option key={item} value={item}>
                {item}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Combobox.Dropdown>
      )}
    </Combobox>
  );
};

export default PageSizeSelector;
