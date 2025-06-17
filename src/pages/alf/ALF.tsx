import { AddMoreIcon2, CloseCircleIcon, Maximize } from '@/assets/icons';
import { Box, Button, Flex, Pagination, Tabbar, TabItem, Text } from '@/atoms';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';
import QS from 'query-string';
// import ALFDataTable from './section/ALFDataTable';
import PageSizeOptions from '@/data/pageSizeOptions.json';
import ALFBoxModal from './alfComponent/ALFBoxModal';
import ClockALFIcon from '@/assets/icons/ClockALFIcon';
import ArchiveTick from '@/assets/icons/ArchiveTick';
import VerifyAlFIcon from '@/assets/icons/VerifyAlFIcon';
import MarkAsIconAlf from '@/assets/icons/MarkAsIconAlf';
import HealthMoniterIcon from '@/assets/icons/HealthMoniterIcon';
import VerifyALFBatchIcon from '@/assets/icons/VerifyALFBatchIcon';
import AlfDeleteIcon from '@/assets/icons/AlfDeleteIcon';
import ALFTable from './section/ALFTable';
import { useALF } from './ALFContext';
import AddALFDialog from './dialogs/AddALFDialog';
import CustomSearch from '../components/CustomSearch';
import { useWindowType } from '@/hooks/useWindowType';
import { MenuItem, Select } from '@mui/material';
import LoadingSmall from '../components/LoadingSmall';

const TAB_LIST = [
  {
    label: 'ALF Pending',
    hash: '#alfpending'
  },
  {
    label: 'Final Review',
    hash: '#finalreview'
  },
  {
    label: 'Approved',
    hash: '#approved'
  },
  {
    label: 'Utilized',
    hash: '#utilized'
  },
  {
    label: 'Delisted',
    hash: '#delisted'
  },
  {
    label: 'Deleted',
    hash: '#deleted'
  },
  {
    label: 'Rejected',
    hash: '#rejected'
  }
];

const ADDALF = () => {
  const { isMobile, isTablet, isSmallLaptop } = useWindowType();
  const location = useLocation();
  const fromNotificationALFId = location?.state?.alfID;
  const [openAddAlf, setOpenAddAlf] = useState(false);
  const navigate = useNavigate();
  const parsedQS = QS.parse(location.search);
  console.log(parsedQS, 'parsedQS');

  const {
    actions: { getALFList, getALFSummary },
    state: { alfList, count, alfSummary, loading }
  } = useALF();
  useEffect(() => {
    getALFSummary();
  }, [location.hash]);

  useEffect(() => {
    getALFSummary();
  }, []);

  const alfFilters: Record<string, string> = {
    '#alfpending': 'PendingTranstanReview,PendingALFReview',
    '#delisted': 'Delisted',
    '#finalreview': 'FinalReview',
    '#approved': 'Approved',
    '#utilized': 'Utilized',
    '#deleted': 'Deleted',
    '#rejected': 'Rejected,FinalReviewRejected'
  };
  useEffect(() => {
    // getALFList(parsedQS);
    const newLocation = {
      ...location
    };
    type SearchParams = {
      [key: string]: string | undefined;
    };
    let searchParams: SearchParams = {
      ...parsedQS,
      ...(alfFilters['#alfpending'] && { 'filter[status]': alfFilters['#alfpending'] })
    };
    if (location.hash.trim().length === 0) {
      newLocation.hash = '#alfpending';
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

  useEffect(() => {
    if (!location.hash) {
      navigate({ search: QS.stringify(parsedQS), hash: '#alfpending' }, { replace: true });
      return;
    }
    const hash = location.hash;
    const searchParams = {
      ...parsedQS,
      'filter[status]':
        location.hash === '#alfpending'
          ? 'PendingTranstanReview,PendingALFReview'
          : location.hash === '#delisted'
            ? 'Delisted'
            : location.hash === '#finalreview'
              ? 'FinalReview'
              : location.hash === '#approved'
                ? 'Approved'
                : location.hash === '#utilized'
                  ? 'Utilized'
                  : location.hash === '#deleted'
                    ? 'Deleted'
                    : 'Rejected,FinalReviewRejected'
    };
    navigate({ search: QS.stringify(searchParams), hash });
    getALFList(searchParams);
  }, [location.search, location.hash]);

  const handleTabChange = (hash: string) => {
    const baseParams = {
      page: '1',
      perPage: parsedQS.perPage || '10', // Keep existing page size
      ...(alfFilters[hash] && { 'filter[status]': alfFilters[hash] })
    };
    navigate({
      hash,
      search: QS.stringify(baseParams)
    });
  };

  const currentPageSize = parsedQS.perPage ? Number(parsedQS.perPage) : 10;
  const totalPages = Math.ceil(count / currentPageSize);
  console.log('totalcount ', count);
  console.log('total pages ', totalPages);

  const renderTable = () => {
    switch (location.hash) {
      case '#alfpending':
        return <ALFTable list={alfList} alfID={fromNotificationALFId} />;
      case '#finalreview':
        return <ALFTable list={alfList} />;
      case '#approved':
        return <ALFTable list={alfList} />;
      case '#utilized':
        return <ALFTable list={alfList} />;
      case '#delisted':
        return <ALFTable list={alfList} />;
      case '#deleted':
        return <ALFTable list={alfList} />;
      case '#rejected':
        return <ALFTable list={alfList} />;
      default:
        return;
    }
  };
  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen w-full">
        <LoadingSmall />
      </Box>
    );
  }
  return (
    <Box className="px-[20px] py-[20px] md:px-[40px] md:py-[40px] ">
      {isMobile || isTablet || isSmallLaptop ? (
        <Box className="flex justify-between mb-4">
          <Text className="text-[#804595] !font-medium !text-[16px] !mt-1">Urgent Liver Listing</Text>
          <CustomSearch name="Search any" className="h-[36px] rounded-full" />
        </Box>
      ) : (
        <Box className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 relative mb-3">
          <Text className="text-[#804595] !font-medium !text-[20px]">Urgent Liver Listing</Text>
          <Box className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
            <div className="relative w-full">
              <CustomSearch name="Search any" />
            </div>
            <Button
              variant="contained"
              className="!bg-[#D876A9] w-full sm:w-[200px] !sm:text-right h-[40px]"
              onClick={() => setOpenAddAlf(true)}
            >
              <AddMoreIcon2 className="mr-2" /> Add New
            </Button>
          </Box>
        </Box>
      )}

      <Box className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <ALFBoxModal
          bgColor={'#D0DDF980'}
          color={'#3A5A96'}
          title={'Pending TRANSTAN Review'}
          count={alfSummary?.pendingTranstanReview ?? 0}
          Icon={<ClockALFIcon />}
        />
        <ALFBoxModal
          bgColor={'#D7D2F880'}
          color={'#4E3395'}
          title={'Requested ALF Review'}
          count={alfSummary?.pendingALFReview ?? 0}
          Icon={<ArchiveTick />}
        />
        <ALFBoxModal
          bgColor={'#F9E0F0'}
          color={'#C272B2'}
          title={'Final Approval Pending'}
          count={alfSummary?.finalApprovalPending ?? 0}
          Icon={<VerifyAlFIcon />}
        />
        <ALFBoxModal
          bgColor={'#FAEBDA'}
          color={'#CD7014'}
          title={'Delisted'}
          count={alfSummary?.delisted ?? 0}
          Icon={<MarkAsIconAlf />}
        />
        <ALFBoxModal
          bgColor={'#C5F4E680'}
          color={'#2B9650'}
          title={'Utilized'}
          count={alfSummary?.utilized ?? 0}
          Icon={<HealthMoniterIcon />}
        />
        <ALFBoxModal
          bgColor={'#DCF2F8'}
          color={'#1B98B9'}
          title={'Approved'}
          count={alfSummary?.approved ?? 0}
          Icon={<VerifyALFBatchIcon />}
        />
        <ALFBoxModal
          bgColor={'#FFE1E1'}
          color={'#B9585A'}
          title={'Deleted'}
          count={alfSummary?.deleted ?? 0}
          Icon={<AlfDeleteIcon />}
        />
        <ALFBoxModal
          bgColor={'#EDEDED'}
          color={'#71717A'}
          title={'Rejected'}
          count={alfSummary?.rejected ?? 0}
          Icon={<CloseCircleIcon />}
        />
      </Box>
      {isMobile || isTablet || isSmallLaptop ? (
        <Box width="100%" order={3} mt={2} mb={2}>
          <Box className="flex justify-between gap-2">
            <Select
              value={location.hash}
              className="h-[35px] !border-[#D876A9] !text-[#D876A9]"
              onChange={(e) => {
                const newValue = e.target.value;
                navigate({
                  hash: newValue,
                  search: createSearchParams({ page: '1', perPage: '10' }).toString()
                });
                handleTabChange(newValue);
              }}
              fullWidth
            >
              {TAB_LIST.map((item) => (
                <MenuItem key={item.hash} value={item.hash}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
            <Button
              variant="contained"
              className="!bg-[#D876A9] w-full sm:w-[200px] !sm:text-right h-[35px] textResponse"
              onClick={() => setOpenAddAlf(true)}
            >
              <AddMoreIcon2 className="mr-2" /> Add New
            </Button>
          </Box>
          <Box className="!mx-auto align-middle mt-3 flex justify-between items-center">
            <Pagination
              totalPages={totalPages}
              onPageSizeChanged={(perPage: string) => {
                navigate({
                  ...location,
                  search: createSearchParams({ ...parsedQS, perPage, page: '1' }).toString()
                });
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
        </Box>
      ) : (
        <Box className="flex justify-between mt-6 mb-6">
          {/* Tab Bar - will appear first on mobile */}
          <Tabbar
            value={location.hash}
            className="flex flex-wrap items-center gap-2"
            onChange={(_, newValue) =>
              navigate({
                hash: newValue,
                search: createSearchParams({ page: '1', perPage: '10' }).toString()
              })
            }
          >
            {TAB_LIST.map((item) => (
              <TabItem
                key={item.hash}
                disableRipple
                value={item.hash}
                iconPosition="end"
                icon={
                  item.hash === location.hash ? (
                    <Maximize
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    />
                  ) : undefined
                }
                label={item.label}
                onClick={() => handleTabChange(item.hash)}
                style={{
                  padding: 0,
                  fontWeight: 500,
                  color: location.hash === item.hash ? '#C967A2' : '#A1999F',
                  marginRight: '15px',
                  paddingBottom: '10px',
                  textDecoration: location.hash === item.hash ? 'underline' : 'none',
                  textUnderlineOffset: 10,
                  textTransform: 'capitalize',
                  fontSize: '16px'
                }}
              />
            ))}
          </Tabbar>

          {/* Pagination - will appear second on mobile */}
          <Flex
            justifyContent={{ base: 'flex-start', md: 'flex-end' }}
            alignItems="center"
            width={{ base: '100%', md: 'auto' }}
            gap={4}
          >
            <Pagination
              totalPages={totalPages}
              onPageSizeChanged={(perPage: string) => {
                navigate({
                  ...location,
                  search: createSearchParams({ ...parsedQS, perPage, page: '1' }).toString()
                });
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
          </Flex>
        </Box>
      )}

      <Box className="">{renderTable()}</Box>
      <AddALFDialog
        open={openAddAlf}
        onClose={() => {
          setOpenAddAlf(false);
        }}
      />
    </Box>
  );
};

export default ADDALF;
