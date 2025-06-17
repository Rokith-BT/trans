import { OrganSildeArrow } from '@/assets/icons';
import { Box, Text } from '@/atoms';
import { getOrganImage } from '@/utils/organimages';
import React, { useState } from 'react';
import DefaultImg from '@/assets/imgs/heart2.png';

interface Organ {
  id: number;
  name: string;
}
interface OrganImageswithSlideProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Organs: Organ[];
  visibleCount?: number;
}

const OrganImageswithSlide: React.FC<OrganImageswithSlideProps> = ({ Organs, visibleCount = 3 }) => {
  const [startIndex, setStartIndex] = useState(0);
  const totalOrgans = Organs?.length;
  const visibleOrgans = Organs?.slice(startIndex, Math.min(startIndex + visibleCount, totalOrgans));
  const organNames = Organs?.map((organ: Organ) => organ.name.trim()).join(',');
  const showNavigation = totalOrgans > visibleCount;
  const isAtStart = startIndex === 0;
  const isAtEnd = startIndex + visibleCount >= totalOrgans;
  const OrganNamesMap: Record<string, string> = {
    'Heart Valves': 'valves',
    'Dual Lungs': 'lungs',
    'Small Bowel': 'bowel',
    'Abdominal Flap': 'flap'
  };

  return (
    <Box className="flex flex-col items-center justify-center">
      <Box className="flex gap-2 items-center w-full">
        {showNavigation && !isAtStart && (
          <OrganSildeArrow
            className={`rotate-[180deg] z-10 cursor-pointer ${startIndex === 0 ? 'hidden' : ' rounded-full'}`}
            onClick={() => setStartIndex((prev) => Math.max(prev - 1, 0))}
          />
        )}
        <Box className="flex gap-4 w-full items-center  md:justify-between " title={organNames}>
          {visibleOrgans?.map((organ, index) => (
            <Box key={index} className="relative flex flex-col items-center justify-center w-[40px]">
              <img key={index} className="h-[24px]" src={getOrganImage(organ.name) || DefaultImg} alt={organ.name} />
              <Text className="!text-[11px] !font-[400] !text-center">
                {OrganNamesMap[organ.name] || organ.name}&nbsp;{' '}
              </Text>
            </Box>
          ))}
        </Box>
        {showNavigation && !isAtEnd && (
          <OrganSildeArrow
            className={` cursor-pointer z-10 ${startIndex === 0 ? 'opacity-70 cursor-pointer' : 'rounded-full'}`}
            onClick={() => setStartIndex((prev) => Math.min(prev + 1, Organs.length - visibleCount))}
          />
        )}
      </Box>
      <Text className="absolute hidden lg:block top-0 right-3 !text-[11px] !font-[400] text-[gray] ">
        {totalOrgans ?? 0}
      </Text>
      {/* <Text className="!text-[11px]">{truncateTextByLines(organNames, 1, 20)}</Text> */}
    </Box>
  );
};

export default OrganImageswithSlide;
// import { OrganSildeArrow } from '@/assets/icons';
// import { Box, Text } from '@/atoms';
// import { getOrganImage } from '@/utils/organimages';
// import React, { useState } from 'react';
// import DefaultImg from '@/assets/imgs/heart2.png';

// interface Organ {
//   id: number;
//   name: string;
// }

// interface OrganImageswithSlideProps {
//   Organs: Organ[];
//   containerWidth: number; // Add this prop
// }

// const OrganImageswithSlide: React.FC<OrganImageswithSlideProps> = ({ Organs, containerWidth }) => {
//   const [startIndex, setStartIndex] = useState(0);
//   const organItemWidth = 60;
//   const visibleCount = Math.max(1, Math.floor(containerWidth / organItemWidth));

//   const totalOrgans = Organs?.length;
//   const visibleOrgans = Organs?.slice(startIndex, Math.min(startIndex + visibleCount, totalOrgans));
//   const organNames = Organs?.map((organ: Organ) => organ.name.trim()).join(',');
//   const showNavigation = totalOrgans > visibleCount;
//   const isAtStart = startIndex === 0;
//   const isAtEnd = startIndex + visibleCount >= totalOrgans;

//   const OrganNamesMap: Record<string, string> = {
//     'Heart Valves': 'valves',
//     'Dual Lungs': 'lungs',
//     'Small Bowel': 'bowel',
//     'Abdominal Flap': 'flap'
//   };
//   console.log('containerWidth received in OrganImageswithSlide:', containerWidth);

//   return (
//     <Box className="flex flex-col items-center justify-center w-full">
//       <Box className="flex gap-2 items-center w-full">
//         {showNavigation && !isAtStart && (
//           <OrganSildeArrow
//             className="rotate-[180deg] z-10 cursor-pointer rounded-full"
//             onClick={() => setStartIndex((prev) => Math.max(prev - 1, 0))}
//           />
//         )}
//         <Box className="flex gap-4 w-full items-center md:justify-between" title={organNames}>
//           {visibleOrgans?.map((organ, index) => (
//             <Box key={index} className="relative flex flex-col items-center justify-center w-[50px]">
//               <img className="h-[24px]" src={getOrganImage(organ.name) || DefaultImg} alt={organ.name} />
//               <Text className="!text-[11px] !font-[400] !text-center">
//                 {OrganNamesMap[organ.name] || organ.name}&nbsp;
//               </Text>
//             </Box>
//           ))}
//         </Box>
//         {showNavigation && !isAtEnd && (
//           <OrganSildeArrow
//             className="cursor-pointer z-10 rounded-full"
//             onClick={() => setStartIndex((prev) => Math.min(prev + 1, totalOrgans - visibleCount))}
//           />
//         )}
//       </Box>
//       <Text className="absolute top-0 right-3 !text-[11px] !font-[400] text-[gray]">{totalOrgans ?? 0}</Text>
//     </Box>
//   );
// };

// export default OrganImageswithSlide;
