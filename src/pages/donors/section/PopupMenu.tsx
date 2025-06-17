import { CloseCircleIcon } from '@/assets/icons';
import { Box, Button } from '@/atoms';
import { DonorStatusType, PontentialDonor } from '@/types/donor';
import { Dispatch, SetStateAction } from 'react';

interface PopupMenuProps {
  onClose: () => void;
  setOpenReq: Dispatch<SetStateAction<boolean>>;
  setDonorSta: Dispatch<SetStateAction<DonorStatusType | null>>;
  setId: Dispatch<SetStateAction<number>>;
  setDonor: Dispatch<SetStateAction<PontentialDonor | null>>;
  data: PontentialDonor;
  DonorStatuses: DonorStatusType[];
}

export default function PopupMenu({
  onClose,
  setOpenReq,
  setDonorSta,
  setId,
  setDonor,
  data,
  DonorStatuses
}: PopupMenuProps) {
  console.log(DonorStatuses, 'DonorStatuses');

  return (
    <Box
      sx={{
        position: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'end',
        gap: '8px',
        top: '6px',
        right: '2%',
        zIndex: 1000,
        backgroundColor: '#fff',
        borderRadius: '4px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '14px 20px'
      }}
    >
      {DonorStatuses.length &&
        DonorStatuses.map((el: DonorStatusType, i: number) => {
          return (
            <Button
              key={i}
              onClick={() => {
                setOpenReq(true);
                setDonorSta(el);
                setId(data.id);
                setDonor(data);
              }}
              sx={{
                padding: '4px 12px',
                cursor: 'pointer',
                color: '#fff',
                background: '#804595',
                '&:hover': {
                  backgroundColor: '#804595',
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)'
                }
              }}
            >
              {el?.name}
            </Button>
          );
        })}

      <CloseCircleIcon toolText={''} onClick={onClose} />
    </Box>
  );
}
