import { Box, Pagination, SWitch, Text } from '@/atoms';
import React, { useEffect, useState } from 'react';
import { useWaitingList } from './WaitingListContext';
import QS from 'query-string';
// import { FilterOption } from '../approvals/apprvals-recreate/section/SubContent';
import { useLocation, useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';
import PageSizeOptions from '@/data/pageSizeOptions.json';
import WaitListTopBar from './section/WaitListTopBar';
import CommonTable from './section/commontable/index';
import LoadingSmall from '../components/LoadingSmall';
// import RecipientFilter from '../recipients/section/RecipientFilter';

interface CommonWaitingListProps {}
const CommonWaitingList: React.FC<CommonWaitingListProps> = ({}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const parsedQS = QS.parse(location.search);

  const {
    state,
    actions: { getCommonWaitingList }
  } = useWaitingList();
  const { commonList, count, loading } = state || {};

  useEffect(() => {
    getCommonWaitingList(parsedQS);
  }, [location.search]);

  useEffect(() => {
    const newLocation = {
      ...location
    };
    let searchParams = {
      ...parsedQS
    };
    if (location.hash.trim().length === 0) {
      newLocation.hash = '#common';
    }
    if (!parsedQS.page) {
      searchParams = { ...searchParams, page: '1', perPage: '10' };
    }
    if (!parsedQS.perPage) {
      searchParams = { ...searchParams, perPage: '10' };
    }
    newLocation.search = QS.stringify(searchParams);
    navigate(newLocation, { replace: true });
  }, []);
  // Local state to manage visibility of data
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  // Update API call and track filter/search changes
  useEffect(() => {
    const hasFilters = location.search.includes('filter') || (parsedQS?.q && parsedQS.q?.trim() !== '');
    setIsFilterApplied(!!hasFilters);

    if (hasFilters) {
      getCommonWaitingList(parsedQS);
    }
  }, [location.search]);

  const currentPageSize = parsedQS.perPage ? Number(parsedQS.perPage) : 10;
  const totalPages = Math.ceil(count / currentPageSize);
  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen w-full">
        <LoadingSmall />
      </Box>
    );
  }
  return (
    <Box>
      <Box className="common-waitlist-title-page">
        <Text className="text-[#804595] !text-[14px] md:!text-[19px] !font-[600] flex items-center gap-2 ">
          Common Wait List
          <Text className="flex items-center gap-2">
            Eng <SWitch isPurple={true} /> த
          </Text>
        </Text>
        <Pagination
          totalPages={isFilterApplied ? totalPages : 0}
          onPageSizeChanged={(perPage: string) => {
            navigate({ ...location, search: createSearchParams({ ...parsedQS, perPage, page: '1' }).toString() });
          }}
          page={(parsedQS && Number(parsedQS.page)) || 1}
          onChange={(_, page) => {
            navigate({
              ...location,
              search: createSearchParams({ ...parsedQS, page: page.toString() }).toString()
            });
          }}
          currentPageSize={(parsedQS && Number(parsedQS.perPage)) || 10}
          pageSizeOptions={PageSizeOptions}
        />
      </Box>
      <Box className="mt-[14px] md:mt-[28px]">
        <WaitListTopBar totalCount={count} />
        <Box className="mt-[14px] md:mt-[28px]">
          <CommonTable list={isFilterApplied ? commonList : []} isFilterApplied={isFilterApplied} />
        </Box>
      </Box>
    </Box>
  );
};

export default CommonWaitingList;
