/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useEffect, useState } from 'react';
// import { Box } from '@/atoms';
// import OrganImageswithSlide from '@/pages/components/OrganImageswithSlide';

// interface Organ {
//   id: number;
//   name: string;
// }

// interface Props {
//   organs: Organ[];
//   column: any;
// }

// export const OrganCellRenderer: React.FC<Props> = ({ organs, column }) => {
//   const [width, setWidth] = useState(column.getActualWidth());

//   useEffect(() => {
//     const handler = (event: any) => {
//       if (event.column === column) {
//         setWidth(column.getActualWidth());
//       }
//     };
//     column.gridApi?.addEventListener('columnResized', handler);
//     return () => column.gridApi?.removeEventListener('columnResized', handler);
//   }, [column]);

//   const organItemWidth = 60; // each organ takes ~60px
//   const visibleCount = Math.max(1, Math.floor(width / organItemWidth));

//   return (
//     <Box className="h-[50px] flex items-center justify-center !w-full">
//       <OrganImageswithSlide Organs={organs} visibleCount={visibleCount} />
//     </Box>
//   );
// };
import React, { useEffect, useState } from 'react';
import { Box } from '@/atoms';
import OrganImageswithSlide from '@/pages/components/OrganImageswithSlide';

interface Organ {
  id: number;
  name: string;
}

interface Props {
  organs: Organ[];
  column: any;
  api: any; // gridApi
}

export const OrganCellRenderer: React.FC<Props> = ({ organs, column, api }) => {
  const [width, setWidth] = useState(column.getActualWidth());

  useEffect(() => {
    const handler = () => {
      const newWidth = column.getActualWidth();
      setWidth(newWidth);
    };

    api?.addEventListener('columnResized', handler);

    return () => {
      api?.removeEventListener('columnResized', handler);
    };
  }, [column, api]);

  const organItemWidth = 60;
  const visibleCount = Math.max(1, Math.floor(width / organItemWidth));

  return (
    <Box className="h-[50px] flex items-center justify-center !w-full pr-5">
      <OrganImageswithSlide Organs={organs} visibleCount={visibleCount} />
    </Box>
  );
};
