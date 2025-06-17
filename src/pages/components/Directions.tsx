import { TargetIcon } from '@/assets/icons';
import { Box } from '@/atoms';
import { useLocation, useNavigate } from 'react-router';
import QS from 'query-string';
const Directions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const parsedQs = QS.parse(location.search);
  const activeZone = parsedQs['filter[zone]'] || null;

  const handleFilterClick = (key: string, value: string | null) => {
    const queryKey = `filter[${key}]`;
    const newQs = { ...parsedQs };

    if (value === null || parsedQs[queryKey] === value) {
      delete newQs[queryKey]; // Remove filter if already selected
    } else {
      newQs[queryKey] = value; // Add filter
    }
    navigate(`?${QS.stringify(newQs)}`);
    console.log('fff', activeZone);
  };

  return (
    <Box>
      <Box className="flex items-center justify-center relative">
        <Box
          onClick={() => handleFilterClick('zone', 'west')}
          className={`flex items-center justify-center absolute  rounded-[20%] h-[24px] w-[24px] left-[-30px] top-[1px] shadow-lg ${activeZone === 'west' ? '!bg-[#C967A2] !text-[#fff]' : '!bg-[#D876A94D] !text-[#C967A2]'} `}
        >
          <Box className=" font-medium  text-sm cursor-pointer">W</Box>
        </Box>
        <Box
          onClick={() => handleFilterClick('zone', 'north')}
          className={`flex items-center justify-center absolute rounded-[20%] h-[24px] w-[24px] top-[-30px]  left-[-1px] shadow-lg ${activeZone === 'north' ? '!bg-[#C967A2] !text-[#fff]' : '!bg-[#D876A94D] !text-[#C967A2]'}`}
        >
          <Box className=" font-medium text-sm cursor-pointer">N</Box>
        </Box>
        <Box className="flex items-center justify-center">
          <TargetIcon onClick={() => handleFilterClick('zone', null)} />
        </Box>
        <Box
          onClick={() => handleFilterClick('zone', 'south')}
          className={`flex items-center justify-center w-[24px] h-[24px] absolute rounded-[20%]  left-[-0px]  bottom-[-32px] shadow-lg ${activeZone === 'south' ? '!bg-[#C967A2] !text-[#fff]' : '!bg-[#D876A94D] !text-[#C967A2]'}`}
        >
          <Box className=" font-medium text-sm cursor-pointer">S</Box>
        </Box>
        <Box
          //   onClick={() => handleFilterClick('zone', 'east')}
          className={`flex items-center justify-center w-[24px] h-[24px] absolute rounded-[20%]  right-[-30px] top-[-0px] shadow-lg ${activeZone === 'east' ? '!bg-[#C967A2] !text-[#fff]' : '!bg-[#D876A94D] !text-[#C967A2]'}`}
        >
          <Box className="text-[#524e51af] font-medium  text-sm cursor-pointer">E</Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Directions;
