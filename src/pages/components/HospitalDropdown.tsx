import { Box, Text } from '@/atoms';
import React, { useState } from 'react';
import { useMasterData } from '../settings/setups/masterCotext';
import { ActiveHospital } from '@/types/hospital';
import { truncateTextByLines } from '@/utils/truncateText';

interface HospitalDropdownProps {
  selectedHospital?: string | null;
  // eslint-disable-next-line no-unused-vars
  setSelectedHospital: (hospital: string) => void;
}

const HospitalDropdown: React.FC<HospitalDropdownProps> = ({ selectedHospital, setSelectedHospital }) => {
  const {
    state: { hospitalNames }
  } = useMasterData();

  const [searchTerm, setSearchTerm] = useState('');

  const filteredHospitals = hospitalNames.filter((hospital: ActiveHospital) =>
    hospital.hospitalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box className="relative w-full gap-2">
      <input
        type="text"
        className="w-full sticky top-0 left-0 rounded-lg h-[40px] outline-[#C967A2] border-[1px] border-[#C967A2] text-[#e371cd] indent-3 "
        placeholder="Search Hospital"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
      />
      <Box
        className="absolute w-full bg-white max-h-[240px] overflow-y-auto shadow-md rounded-lg mt-2"
        sx={{
          overflow: 'scroll',
          scrollbarWidth: 'none',
          boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.20)'
        }}
      >
        {filteredHospitals.map((hospital: ActiveHospital, index: number) => {
          const names = hospital?.hospitalName.trim();
          return (
            <Box key={index}>
              <Text
                onClick={() => setSelectedHospital(names)}
                title={names}
                className={`h-full md:h-[48px] cursor-pointer flex items-center pl-[16px] rounded-lg
                ${selectedHospital === names ? 'bg-[#D876A94D] text-[#C967A2]' : 'hover:bg-[#7f7f8236] hover:!text-[#C967A2]'}`}
              >
                {truncateTextByLines(names, 1, 30)}
              </Text>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default HospitalDropdown;
