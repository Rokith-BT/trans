/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { FormControl, InputLabel, Select, OutlinedInput, Box, Chip, MenuItem, styled } from '@mui/material';
import { Controller } from 'react-hook-form';

const StyledMenuItem = styled(MenuItem)(() => ({
  backgroundColor: 'white',
  border: `2px #804595 solid`,
  margin: '10px',
  borderRadius: '16px'
}));

interface DepartmentSelectProps {
  selectOptions: string[];
  options: [];
  // eslint-disable-next-line no-unused-vars
  handleChange: (value: string[]) => void;
  // eslint-disable-next-line no-unused-vars
  handleDelete: (value: string) => void;
  label: string;
  disable?: boolean;
  isSetup?: boolean;
  error?: string;
}
export const DepartmentSelect: React.FC<DepartmentSelectProps> = ({
  label,
  selectOptions,
  options,
  disable = false,
  handleChange,
  handleDelete,
  isSetup = false,
  error
}) => {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: isSetup ? '50%' : '90vw'
      }
    },
    MenuListProps: {
      sx: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
      }
    }
  };
  return (
    <FormControl sx={{ width: '100%', m: 0 }}>
      <InputLabel id="option-label" className="bg-[white] z-50 !pr-[10px]">
        {label} <span className="text-red-500">*</span>
      </InputLabel>
      <Select
        labelId="option-label"
        id="option-chip"
        multiple
        value={selectOptions}
        fullWidth
        onChange={(e) => {
          const value = e.target.value as string[];
          handleChange(value);
        }}
        input={<OutlinedInput id="select-multiple-chip" label="Department" disabled={disable} />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.6 }}>
            {(selected as string[]).map((value) => (
              <Chip
                key={value}
                label={value}
                onClick={() => handleDelete(value)}
                style={{
                  backgroundColor: 'transparent',
                  color: 'black',
                  border: disable ? '1px solid grey' : '2px #804595 solid',
                  borderRadius: '8px'
                }}
                className="!pr-5"
              />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {options.map((name) => (
          <StyledMenuItem
            key={name}
            value={name}
            style={{
              backgroundColor: selectOptions.includes(name) ? '#804595' : undefined,
              color: selectOptions.includes(name) ? 'white' : undefined
            }}
          >
            <span>{name}</span>
          </StyledMenuItem>
        ))}
      </Select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </FormControl>
  );
};

interface CustomFormChipProps {
  name: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  options: [];
  disable?: boolean;
  isSetup?: boolean;
}

export const CustomFormChip: React.FC<CustomFormChipProps> = ({
  name,
  control,
  options,
  disable,
  label,
  isSetup = false
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        // const selectedNames = (field.value || []).map((item: string) => item?.name);
        // const isNotApplicable = field.value?.includes('Not Applicable');
        return (
          <Box>
            <DepartmentSelect
              label={label}
              isSetup={isSetup}
              selectOptions={field.value || []}
              options={options}
              handleChange={(value) => {
                // field.onChange(value);
                // setSelectOptions(value);
                const isNotApplicableSelected = value.includes('Not Applicable');

                let newValue = value;

                if (isNotApplicableSelected) {
                  // Only keep 'Not Applicable'
                  newValue = ['Not Applicable'];
                } else {
                  // Remove 'Not Applicable' from list if others are selected
                  newValue = value.filter((item) => item !== 'Not Applicable');
                }

                field.onChange(newValue);
              }}
              // handleDelete={(org) => {
              //   const newValues = field.value.filter((item: string) => item !== org);
              //   field.onChange(newValues);
              //   // setSelectOptions(newValues);
              // }}
              handleDelete={(org) => {
                const newValues = field.value.filter((item: string) => item !== org);
                field.onChange(newValues);
              }}
              disable={disable}
            />
            {error && <p className="text-red-500 text-sm">{error.message}</p>}
          </Box>
        );
      }}
    />
  );
};
// interface CustomFormChipProps2<T extends { name: string }> {
//   name: string;
//   label: string;
//   control: any;
//   options: T[];
//   disable?: boolean;
//   isSetup?: boolean;
// }

// export const CustomFormChip2 = <T extends { name: string }>({
//   name,
//   control,
//   options,
//   disable,
//   label,
//   isSetup = false
// }: CustomFormChipProps2<T>) => {
//   return (
//     <Controller
//       name={name}
//       control={control}
//       render={({ field, fieldState: { error } }) => {
//         const selectedNames = (field.value || []).map((item: T) => item.name);

//         return (
//           <Box>
//             <DepartmentSelect
//               label={label}
//               isSetup={isSetup}
//               selectOptions={selectedNames || []}
//               options={options.map((o) => o.name)}
//               handleChange={(names) => {
//                 const selectedObjects = names
//                   .map((name) => options.find((opt) => opt.name === name))
//                   .filter(Boolean) as T[];

//                 field.onChange(selectedObjects);
//               }}
//               handleDelete={(name) => {
//                 const updated = (field.value || []).filter((item: T) => item.name !== name);
//                 field.onChange(updated);
//               }}
//               disable={disable}
//             />
//             {error && <p className="text-red-500 text-sm">{error.message}</p>}
//           </Box>
//         );
//       }}
//     />
//   );
// };
