import { Box, Button, Text } from '@/atoms';
import { Checkbox } from '@mui/material';
import React from 'react';

export interface EventProps {}
const Event: React.FC<EventProps> = () => {
  return (
    <Box p={5}>
      <Text className="!text-[19px] !font-bold text-[#804595]">Event</Text>
      <Box mt={2}>
        <Text className="text-[#1A061699] !text-sm !font-medium">
          Enable Google Calender API? &nbsp;
          <span>
            <Checkbox />
          </span>
        </Text>
      </Box>
      <Box className="absolute bottom-[10%] right-10">
        <Button variant="contained" className="w-[130px] !bg-[#9C539C]">
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default Event;
