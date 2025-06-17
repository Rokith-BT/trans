import { ArrowDown2 } from '@/assets/icons';
import { Box, Text } from '@/atoms';
import { useRole } from '@/hooks/useRole';
import { useWindowType } from '@/hooks/useWindowType';
import React, { useMemo } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

const formatSegment = (segment: string) =>
  segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const ORIGIN_LABELS: Record<string, string> = {
  'waitinglist/transtan': 'Transtan Waiting List',
  'recipients/manage-transfer': 'Transfer Management',
  'alf/alf-doctor': 'ALF Doctor'
};

const BreadScrumb = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isMobile } = useWindowType();

  const { isHospitalAdmin } = useRole();
  console.log('ccc', isHospitalAdmin);

  const { origin, tab, filter, hospitalId, hospitalName } = location.state || {};

  const activeTab = tab || location.hash || '#license';
  const hash = activeTab.startsWith('#') ? activeTab : `#${activeTab}`;

  const page = searchParams.get('page') || '1';
  const perPage = searchParams.get('perPage') || '10';
  const pathSegments = location.pathname.split('/').filter((seg) => seg && !/^\d+$/.test(seg)); // remove numeric segments like IDs
  // const breadcrumbs = useMemo(() => {

  //   if (origin === 'hospitals' && hospitalId && hospitalName) {
  //     const crumbs = [];

  //     if (!isHospitalAdmin) {
  //       crumbs.push({
  //         name: 'Hospitals',
  //         route: `/hospitals${filter || ''}#hospital`
  //       });
  //     }

  //     crumbs.push({
  //       name: hospitalName,
  //       route: `/hospitals/${hospitalId}/dashboard${filter || ''}${tab || '#license'}`
  //     });

  //     crumbs.push({
  //       name: formatSegment(pathSegments[pathSegments.length - 1] || 'View'),
  //       route: location.pathname
  //     });

  //     return crumbs;
  //   }
  // const breadcrumbs = useMemo(() => {
  //   // Custom breadcrumb logic for hospital paths
  //   if (origin === 'hospitals' && hospitalId && hospitalName) {
  //     const crumbs = [];

  //     // Only add "Hospitals" breadcrumb if NOT hospital admin
  //     if (!isHospitalAdmin) {
  //       crumbs.push({
  //         name: 'Hospitals',
  //         route: `/hospitals${filter || ''}#hospital`
  //       });
  //     }

  //     // Add hospital name linking to its dashboard
  //     crumbs.push({
  //       name: hospitalName,
  //       route: `/hospitals/${hospitalId}/dashboard${filter || ''}${hash}`
  //     });

  //     // Add current view as final breadcrumb
  //     crumbs.push({
  //       name: formatSegment(pathSegments[pathSegments.length - 1] || 'View'),
  //       route: location.pathname
  //     });

  //     return crumbs;
  //   }
  const breadcrumbs = useMemo(() => {
    // Case 1: Hospital Admin - render only dashboard-level path
    if (isHospitalAdmin && hospitalName) {
      return [
        {
          name: hospitalName,
          route: `/dashboard${filter || ''}${hash}`
        },
        {
          name: formatSegment(pathSegments[pathSegments.length - 1] || 'View'),
          route: location.pathname
        }
      ];
    }

    // Case 2: Super Admin, coming from Hospitals
    if (origin === 'hospitals' && hospitalId && hospitalName) {
      const crumbs = [];

      // Only add 'Hospitals' if not hospital admin
      if (!isHospitalAdmin) {
        crumbs.push({
          name: 'Hospitals',
          route: `/hospitals${filter || ''}#hospital`
        });
      }

      crumbs.push({
        name: hospitalName,
        route: `/hospitals/${hospitalId}/dashboard${filter || ''}${hash}`
      });

      crumbs.push({
        name: formatSegment(pathSegments[pathSegments.length - 1] || 'View'),
        route: location.pathname
      });

      return crumbs;
    }

    return pathSegments.map((segment, index) => {
      const isFirst = index === 0;
      const labelFromOrigin = origin ? ORIGIN_LABELS[origin] || formatSegment(origin) : formatSegment(segment);

      // const name = isFirst && origin ? formatSegment(origin) : formatSegment(segment);
      const name = isFirst ? labelFromOrigin : formatSegment(segment);

      const route =
        isFirst && origin && filter
          ? `/${origin}${filter}${hash}`
          : isFirst && origin
            ? `/${origin}${hash}`
            : `/${pathSegments.slice(0, index + 1).join('/')}`;

      console.log('bread ', name, route);

      return {
        name,
        route
      };
    });
  }, [location.pathname, page, perPage, tab]);

  return (
    <Box className={`${isMobile ? 'flex items-center gap-x-2 pl-5' : 'flex items-center gap-x-2'}`}>
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return (
          <Box key={crumb.route} className="flex items-center gap-x-2">
            {isLast ? (
              <Text>{crumb.name}</Text>
            ) : (
              <Box>
                <Link to={crumb.route} state={{ origin, tab }}>
                  {crumb.name}
                </Link>
              </Box>
            )}
            {!isLast && <ArrowDown2 color="#fff" className="-rotate-90" />}
          </Box>
        );
      })}
    </Box>
  );
};

export default BreadScrumb;

// import { ArrowDown2 } from '@/assets/icons';
// import { Box, Text } from '@/atoms';
// import { useWindowType } from '@/hooks/useWindowType';
// import React, { useMemo } from 'react';
// // import { useLocation } from 'react-router-dom';
// import { Link, useSearchParams, useLocation } from 'react-router-dom';

// //for formatting segment
// const formatSegment = (segment: string) => {
//   return segment
//     .split('-')
//     .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(' ');
// };

// const BreadScrumb = () => {
//   const location = useLocation();
//   const [searchParams] = useSearchParams();
//   const { isMobile } = useWindowType();
//   const { origin, tab } = location.state || {};

//   const hash = location.hash || '';

//   console.log('top bread ', origin, tab, searchParams);

//   const breadcrumbs = useMemo(() => {
//     const pathSegments = location.pathname.split('/').filter((seg) => seg && !/^\d+$/.test(seg));

//     return pathSegments.map((segment, index) => {
//       const defaultRoute = `${pathSegments.slice(0, index + 1).join('/')}`;
//       const route = origin && index === 0 ? origin : defaultRoute;
//       const name = origin && index === 0 ? formatSegment(origin) : formatSegment(segment);

//       // Merge current search params
//       const newSearchParams = new URLSearchParams(searchParams);
//       if (origin && index === 0) {
//         newSearchParams.set('origin', origin);
//         newSearchParams.set('tab', tab || '');
//       }

//       const queryString = newSearchParams.toString();
//       const link = `${route}${queryString ? `?${queryString}` : ''}${hash}`;

//       return { name, route: link };
//     });
//   }, [location.pathname, searchParams, location.hash]);

//   console.log('route link', breadcrumbs);

//   return (
//     <Box className={`${isMobile ? 'flex items-center gap-x-2 pl-5' : 'flex items-center gap-x-2'}`}>
//       {breadcrumbs.map((crumb, index) => {
//         const isLastIndex = index === breadcrumbs.length - 1;
//         // const link = origin ? `${crumb.route}?#${tab}` : crumb.route;
//         return (
//           <Box key={crumb.route} className="flex items-center gap-x-2">
//             {isLastIndex ? (
//               <Text>{crumb.name}</Text>
//             ) : (
//               <Box>
//                 <Link to={crumb.route}>{crumb.name}</Link>
//               </Box>
//             )}
//             {!isLastIndex && <ArrowDown2 color="#fff" className="-rotate-90" />}
//           </Box>
//         );
//       })}
//     </Box>
//   );
// };

// export default BreadScrumb;
// import { ArrowDown2 } from '@/assets/icons';
// import { Box, Text } from '@/atoms';
// import { useWindowType } from '@/hooks/useWindowType';
// import React, { useMemo } from 'react';
// import { useLocation } from 'react-router';
// import { Link, useSearchParams } from 'react-router-dom';

// // Capitalize words
// const formatSegment = (segment: string) =>
//   segment
//     .split('-')
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(' ');

// const BreadScrumb = () => {
//   const location = useLocation();
//   const [searchParams] = useSearchParams();
//   const { isMobile } = useWindowType();

//   const origin = searchParams.get('origin');
//   const tab = searchParams.get('tab');
//   const hash = location.hash || '';

//   const breadcrumbs = useMemo(() => {
//     const pathSegments = location.pathname.split('/').filter((seg) => seg && !/^\d+$/.test(seg));

//     return pathSegments.map((segment, index) => {
//       const isBasePage = index === 0;
//       const fullPath = `/${pathSegments.slice(0, index + 1).join('/')}`;
//       const name = formatSegment(segment);

//       const params = new URLSearchParams();

//       // Only include origin/tab on non-root pages
//       if (!isBasePage) {
//         if (origin) params.set('origin', origin);
//         if (tab) params.set('tab', tab);
//       }

//       const queryString = params.toString();
//       const route = `${fullPath}${queryString ? `?${queryString}` : ''}${hash}`;

//       return { name, route };
//     });
//   }, [location.pathname, searchParams, location.hash]);

//   return (
//     <Box className={`${isMobile ? 'flex items-center gap-x-2 pl-5' : 'flex items-center gap-x-2'}`}>
//       {breadcrumbs.map((crumb, index) => {
//         const isLastIndex = index === breadcrumbs.length - 1;

//         return (
//           <Box key={crumb.route} className="flex items-center gap-x-2">
//             {isLastIndex ? (
//               <Text>{crumb.name}</Text>
//             ) : (
//               <Box>
//                 <Link to={crumb.route}>{crumb.name}</Link>
//               </Box>
//             )}
//             {!isLastIndex && <ArrowDown2 color="#fff" className="-rotate-90" />}
//           </Box>
//         );
//       })}
//     </Box>
//   );
// };

// export default BreadScrumb;

// // BreadScrumb.tsx
// import { Breadcrumbs, Link, Typography } from '@mui/material';
// import { useLocation, useNavigate } from 'react-router-dom';
// import QS from 'query-string';
// import { getMatchedBreadcrumbLabel } from '@/utils';

// const BreadScrumb = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const qs = QS.parse(location.search);
//   const origin = qs.origin as string;
//   const tab = qs.tab as string;

//   const crumbs: { label: string; path?: string }[] = [];
//   console.log('tab', tab);

//   // Step 1: Handle query-driven breadcrumb
//   if (origin === 'resource-management') {
//     crumbs.push({
//       label: 'Resource Management',
//       path: `/resource-management?tab=${tab || 'resourcemanagement'}#${tab || 'resourcemanagement'}`
//     });
//   }

//   // Step 2: Add dynamic breadcrumb based on pathname
//   const label = getMatchedBreadcrumbLabel(location.pathname);
//   if (label) {
//     crumbs.push({ label });
//   }

//   return (
//     <Breadcrumbs aria-label="breadcrumb">
//       {crumbs.map((crumb, index) =>
//         crumb.path ? (
//           <Link
//             key={index}
//             underline="hover"
//             color="inherit"
//             style={{ cursor: 'pointer' }}
//             onClick={() => crumb.path && navigate(crumb.path)}
//           >
//             {crumb.label}
//           </Link>
//         ) : (
//           <Typography key={index} color="text.primary">
//             {crumb.label}
//           </Typography>
//         )
//       )}
//     </Breadcrumbs>
//   );
// };

// export default BreadScrumb;
