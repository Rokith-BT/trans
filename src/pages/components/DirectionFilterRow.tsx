// import { TargetIcon } from '@/assets/icons';
import { Box } from '@/atoms';
import { useLocation, useNavigate } from 'react-router';
import QS from 'query-string';

const DIRECTIONS = [
  { label: 'W', value: 'west' },
  { label: 'N', value: 'north' },
  { label: 'S', value: 'south' },
  { label: 'E', value: 'east' }
];

const DirectionFilterRow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const parsedQs = QS.parse(location.search);
  const activeZone = parsedQs['filter[zone]'] || null;

  const handleFilterClick = (key: string, value: string | null) => {
    const queryKey = `filter[${key}]`;
    const newQs = { ...parsedQs };

    if (value === null || parsedQs[queryKey] === value) {
      delete newQs[queryKey]; // Remove filter
    } else {
      newQs[queryKey] = value; // Add filter
    }

    navigate(`?${QS.stringify(newQs)}`);
  };

  return (
    <Box className="flex items-center gap-3 justify-center">
      {DIRECTIONS.map(({ label, value }) => (
        <Box
          key={value}
          onClick={() => handleFilterClick('zone', value)}
          className={`flex items-center justify-center w-[20px] sm:h-[28px] sm:w-[28px] h-[20px] sm:rounded-[8px] rounded-[4px] cursor-pointer shadow-md transition-colors 
            ${activeZone === value ? '!bg-[#C967A2] !text-white' : '!bg-[#D876A94D] !text-[#C967A2]'}`}
        >
          <Box className="text-sm font-medium">{label}</Box>
        </Box>
      ))}
      {/* <TargetIcon onClick={() => handleFilterClick('zone', null)} className="cursor-pointer ml-2" /> */}
    </Box>
  );
};

export default DirectionFilterRow;
