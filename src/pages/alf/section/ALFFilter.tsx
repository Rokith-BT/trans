import { AtomDatePicker, Box, Button, CustomDialog, Text } from '@/atoms';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface ALFFilterProps {
  open: boolean;
  onClose: () => void;
}

const alfFilterSchema = z.object({
  alfRegDate: z.string().min(1, 'ALF Reg date is required'),
  alfDeletedDate: z.string().min(1, 'ALF Deleted is required')
});
type ALFFilterType = z.infer<typeof alfFilterSchema>;

const ALFFilter: React.FC<ALFFilterProps> = ({ open, onClose }) => {
  const { control } = useForm<ALFFilterType>({
    resolver: zodResolver(alfFilterSchema),
    defaultValues: {}
  });

  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      <Box>
        <Text className="text-[#804595] !text-[23px] !font-[600]">Smart Filter</Text>
        <Box className="mt-[20px]">
          <Box className="flex flex-col mb-[28px] gap-y-[28px]">
            <AtomDatePicker control={control} name="alfRegDate" label="ALF Reg.Date" placeholder="Select" fullWidth />
          </Box>
          <Box>
            <AtomDatePicker
              control={control}
              name="alfDeletedDate"
              label="ALF Deleted Date"
              placeholder="Select"
              fullWidth
            />
          </Box>
        </Box>
        <Box className="flex items-center justify-between gap-[22px] mt-[60px]">
          <Button variant="outlined" className="w-full" onClick={onClose}>
            Close
          </Button>
          <Button variant="contained" className="w-full">
            Apply Filter
          </Button>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default ALFFilter;
