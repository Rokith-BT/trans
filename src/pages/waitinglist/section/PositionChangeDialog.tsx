import { Box, Button, CustomDialog, FormInput, Text } from '@/atoms';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { InhouseWaitingList } from '@/types/waitinglist';
import { useWaitingList } from '../WaitingListContext';
import { useLocation } from 'react-router';
import QS from 'query-string';

interface PositionChangeDialogProps {
  open: boolean;
  onClose: () => void;
  selectedData?: InhouseWaitingList;
}

const PositionChangeScheme = z.object({
  proposedRank: z.number().min(1, 'change order field is required').max(100, 'Enter a valid Value'),
  proposedRankChangeReason: z.string().min(1, 'reason is required')
});
type PositionChangeType = z.infer<typeof PositionChangeScheme>;

const PositionChangeDialog: React.FC<PositionChangeDialogProps> = ({ open, onClose, selectedData }) => {
  const location = useLocation();
  const parsedQs = QS.parse(location.search);
  const {
    actions: { changeProposedReank, getInHouseList }
  } = useWaitingList();
  const { control, handleSubmit, reset } = useForm<PositionChangeType>({
    resolver: zodResolver(PositionChangeScheme),
    defaultValues: {
      proposedRank: 0,
      proposedRankChangeReason: ''
    }
  });
  const recipientId = selectedData?.recipientId ?? 0;
  useEffect(() => {
    if (!open) {
      reset({
        proposedRank: 0,
        proposedRankChangeReason: ''
      });
    }
  }, [!open]);
  const onSubmit = (data: PositionChangeType) => {
    console.log('Position Change Type', data);
    const Payload = {
      proposedRank: Number(data.proposedRank),
      proposedRankChangeReason: data.proposedRankChangeReason
    };
    changeProposedReank(Payload, recipientId);
    getInHouseList(parsedQs);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* {Object.keys(errors).length > 0 && <pre>{JSON.stringify(errors, null, 2)}</pre>} */}
      <CustomDialog open={open} onClose={onClose} maxWidth="xs">
        <Box>
          <Text className="!text-[#804595] !text-[23px] !font-[600]">Position Change Reason</Text>
          <Box className="mt-[16px]">
            <Box>
              <FormInput name="proposedRank" control={control} type="number" label="Change Order" fullWidth required />
            </Box>
            <Box className="mt-[28px]">
              <FormInput
                control={control}
                name="proposedRankChangeReason"
                label="Reason"
                fullWidth
                required
                minRows={4}
                multiline
              />
            </Box>
          </Box>
          <Box className="flex items-center justify-between gap-[22px] mt-[60px]">
            <Button variant="outlined" className="w-full" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" className="w-full" type="submit" onClick={handleSubmit(onSubmit)}>
              Apply
            </Button>
          </Box>
        </Box>
      </CustomDialog>
    </form>
  );
};

export default PositionChangeDialog;
