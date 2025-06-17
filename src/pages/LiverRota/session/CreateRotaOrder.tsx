import { Box, Button, CustomDialog,  FormSelect, Text } from '@/atoms';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import data from '@/data/selectData.json';

interface CreateRotaOrderProps {
  open: boolean;
  onClose: () => void;
}

export const CreateRotaSchema = z.object({
  hospital: z.string().min(1, 'Select Hospital'),
  currentRank: z.string().min(1, 'Current Rank is required'),
  zone: z.string().min(1, 'Zone is required')
});
export type CreateRotaType = z.infer<typeof CreateRotaSchema>;

const CreateRotaOrder: React.FC<CreateRotaOrderProps> = ({ open, onClose }) => {
  const { control } = useForm<CreateRotaType>({
    resolver: zodResolver(CreateRotaSchema),
    defaultValues: {
      hospital: '',
      currentRank: '',
      zone: ''
    }
  });
  return (
    <CustomDialog open={open} onClose={onClose}>
      <Box>
        <Text className="!text-[#804595] !text-[23px] !font-[600]">Update Hospital Rota Order</Text>
        <Box>
          <Box className="w-full md:w-[calc(33.33%-40px)] ">
            <FormSelect
              menuOptions={data.numberOption}
              control={control}
              name="hospital"
              label="Donor Name"
              fullWidth
              required
            />
          </Box>
          <Box className="w-full md:w-[calc(33.33%-40px)] ">
            <FormSelect
              menuOptions={data.numberOption}
              control={control}
              name="currentRank"
              label="Donor Name"
              fullWidth
              required
            />
          </Box>
          <Box className="w-full md:w-[calc(33.33%-40px)] ">
            <FormSelect
              menuOptions={data.numberOption}
              control={control}
              name="zone"
              label="Donor Name"
              fullWidth
              required
            />
          </Box>
        </Box>
        <Box className="flex gap-4 items-center justify-center mt-[60px]">
          <Button
            className="w-[140px] h-[40px] flex gap-2 border-[1px] !text-[#D876A9] !border-[#D876A9] !mr-3"
            variant="outlined"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            type="submit"
            className="!w-[140px] h-[40px] flex gap-2 border-[1px] !text-[white] !bg-[#D876A9]"
            variant="contained"
            onClick={onClose}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default CreateRotaOrder;
