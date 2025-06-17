import { Box, CustomDialog, Text } from '@/atoms';
import React, { useEffect } from 'react';
import { CloseCircleIcon, PlayIcon } from '@/assets/icons';
import { useMasterData } from '@/pages/settings/setups/masterCotext';

interface TableImageSliderDialogProps {
  open: boolean;
  onClose: () => void;
  document?: string;
  onNext: () => void;
  onPrevious: () => void;
  currentPosition: number;
  totalItems: number;
}

export const TableImageSliderDialog: React.FC<TableImageSliderDialogProps> = ({
  open,
  onClose,
  document,
  onNext,
  onPrevious,
  currentPosition,
  totalItems
}) => {
  const {
    state: { file },
    action: { getFiles, dispatch }
  } = useMasterData();

  useEffect(() => {
    if (!document || !open) {
      dispatch({ type: 'GETFILES', payload: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document, open]);

  useEffect(() => {
    if (document) {
      getFiles(document);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document, open, currentPosition]);

  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="sm" customWidth="100%">
      <Box px={2} className="relative">
        <Text className="text-[#804595] !mb-[8px] !text-[19px] !font-[600] ">
          CM Insurance Documents ({currentPosition}/{totalItems})
        </Text>
        {/* <Text className="text-[#C967A2] !text-[16px] !font-[500]">{recipient?.organType?.name} </Text> */}
        <Box mt={2} px={1} className="flex items-center justify-center gap-6">
          <Box>
            <PlayIcon onClick={onPrevious} className="h-[28px] w-[28px] cursor-pointer" />
          </Box>
          {document ? (
            <>
              {document?.split('.').pop() === 'pdf' ? (
                <iframe src={file} width="100%" height="500px" title="PDF Viewer"></iframe>
              ) : (
                <img key={file} src={file} alt="" className="w-[90%]" />
              )}
            </>
          ) : (
            <Text>Loading file...</Text>
          )}
          <Box>
            <PlayIcon onClick={onNext} className="h-[28px] w-[28px] rotate-[180deg] cursor-pointer" />
          </Box>
        </Box>
        <Box className="absolute -top-1 -right-1">
          <CloseCircleIcon toolText="" onClick={onClose} className="cursor-pointer " stroke="#A1999F" />
        </Box>
      </Box>
    </CustomDialog>
  );
};
