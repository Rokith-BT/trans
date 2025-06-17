import { Box, Button, CustomDialog, Text } from '@/atoms';
import React from 'react';
import { useALF } from '../ALFContext';
import { useNavigate } from 'react-router';

interface ALFExtendProps {
  open: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  alfData: any;
}

const ALFExtendDialog: React.FC<ALFExtendProps> = ({ open, onClose, alfData }) => {
  //   const [reason, setReason] = useState('');
  //   const [validation, setValidation] = useState('');
  const navigate = useNavigate();
  const {
    actions: { extendALF }
  } = useALF();

  const handleSubmit = () => {
    if (alfData?.id) {
      extendALF(alfData?.id, 'reason', () => {
        navigate('/alf');
      });
    }
  };
  return (
    <CustomDialog open={open} onClose={onClose}>
      <Box>
        <Box>
          <Text className="!text-[#A1999F] !mb-4 !text-[16px] !font-[500]">
            Are You Sure, Do You want to{' '}
            <span className="!text-[#67B1C9] !font-[500] !text-[16px]">Extend for 2 days</span>?
          </Text>
          <Text className="!text-[#A1999F] !text-[16px] !font-[500] text-center">
            UID <span className="!text-[#1A0616] !text-[16px] !font-[500]">{alfData?.id}</span>
          </Text>
          <Text className="!text-[#A1999F] !mb-2 !text-[16px] !font-[500] text-center">
            Recipient Name
            <span className="!text-[#1A0616] !text-[16px] !font-[500]"> {alfData?.name}</span>
          </Text>
          {/* <textarea
            onChange={(e) => {
              setReason(e.target.value);
            }}
            placeholder="Reason"
            className="h-18 w-full border-[#804595] border-[2px] mt-6 p-2 rounded-md"
          />
          {validation && <span className="text-[#DA2424] text-sm">{validation}</span>} */}
        </Box>
        <Box mt={3} className="flex items-center justify-center gap-4">
          <Button
            className="w-[140px] h-[40px] flex gap-2 border-[1px] !text-[#DD2323] !border-[#DD2323] !mr-3"
            variant="outlined"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            className="w-[140px] h-[40px] flex gap-2 border-[1px] !text-[white] !bg-[#80C967]"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default ALFExtendDialog;
