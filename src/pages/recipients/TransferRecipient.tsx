import { RecipientTransferIcon } from '@/assets/icons';
import { Box, Button, Flex, Pagination, Tabbar, TabItem, Text } from '@/atoms';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';
import QS from 'query-string';
import { useRecipient } from './RecipientContext';
import PageSizeOptions from '@/data/pageSizeOptions.json';
import CustomSearch from '../components/CustomSearch';
import TransferTable from './section/TransferTable';
import { useWindowType } from '@/hooks/useWindowType';
import { MenuItem, Select } from '@mui/material';
import LoadingSmall from '../components/LoadingSmall';

const TransferTabs = [
  { label: 'Transfer on Progress', hash: '#progress' },
  { label: 'Transfer Rejected', hash: '#rejected' },
  { label: 'Transfer History', hash: '#history' }
];

const TransferRecipient = () => {
  const { isMobile, isTablet, isSmallLaptop } = useWindowType();
  const navigate = useNavigate();
  const location = useLocation();
  const parsedQS = QS.parse(location.search);
  console.log(location.search, 'location.search');

  const {
    state,
    actions: { getTransferRecipinetList }
  } = useRecipient();
  const { list, count, loading } = state || {};

  useEffect(() => {
    const newLocation = {
      ...location
    };
    let searchParams = {
      ...parsedQS
    };
    if (location.hash.trim().length === 0) {
      newLocation.hash = '#progress';
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
      navigate({ search: QS.stringify(parsedQS), hash: '#progress' }, { replace: true });
      return; // Prevents running the rest of the effect on first load
    }
    const hash = location.hash;
    const searchParams = {
      ...parsedQS,
      'filter[transferstatus]':
        location.hash === '#progress'
          ? 'TransferInitiated,TransferApproved'
          : location.hash === '#history'
            ? 'TransferCompleted'
            : 'TransferRejected',
      page: '1',
      perPage: '10'
    };
    navigate({ search: QS.stringify(searchParams), hash });
    getTransferRecipinetList(searchParams);
  }, [location.hash, location.search]);

  const handleTabChange = () => {};

  const currentPageSize = parsedQS.perPage ? Number(parsedQS.perPage) : 10;
  // const totalCount = location.hash === '#recipients' ? count : 0;
  const totalPages = Math.ceil(count / currentPageSize);
  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen w-full">
        <LoadingSmall />
      </Box>
    );
  }
  return (
    <Box mt={2} mb={4}>
      {isMobile || isTablet || isSmallLaptop ? (
        <Box className="flex justify-between mb-4">
          <Text className="text-[#804595] !font-medium !text-[16px] !mt-1">Recipient Transfer</Text>
          <CustomSearch name="Search any" className="h-[36px] rounded-full" />
        </Box>
      ) : (
        <Box className="flex items-center justify-between">
          <Text className="flex gap-5 text-[#804595] !text-[23px] !font-[700]">Recipient Transfer</Text>
          <Button
            variant="contained"
            onClick={() => {
              navigate('/recipients/manage-transfer/transfer');
            }}
            className="flex gap-2"
          >
            <RecipientTransferIcon color="white" className="rotate-[180deg] !stroke-[white]" /> Transfer Recipient
          </Button>
        </Box>
      )}
      {isMobile || isTablet || isSmallLaptop ? (
        <Box width="100%" order={3} mt={2} mb={2}>
          <Box className="flex justify-between gap-2">
            <Select
              value={location.hash}
              className="h-[35px] textResponse !border-[#D876A9] !text-[#D876A9]"
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
              {TransferTabs.map((item) => (
                <MenuItem key={item.hash} value={item.hash}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
            <Button
              variant="contained"
              onClick={() => {
                navigate('/recipients/manage-transfer/transfer');
              }}
              className="flex gap-2 textResponse"
            >
              <RecipientTransferIcon color="white" className="rotate-[180deg] !stroke-[white]" /> Transfer
            </Button>
          </Box>
          <Flex
            // justifyContent={{ base: 'flex-start', md: 'flex-end' }}
            justifyContent="center"
            alignItems="center"
            width={{ base: '100%', md: 'auto' }}
            gap={4}
            className="!mx-auto align-middle mt-3"
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
      ) : (
        <Box mt={2} className="flex items-center justify-between">
          <Tabbar
            value={location.hash}
            className="items-center"
            onChange={(_, newValue) =>
              navigate({ hash: newValue, search: createSearchParams({ page: '1', perPage: '10' }).toString() })
            }
          >
            {TransferTabs.map((item) => (
              <TabItem
                key={item.hash}
                disableRipple
                value={item.hash}
                iconPosition="end"
                label={item.label}
                onClick={() => {
                  handleTabChange(item.hash);
                }}
                className={`relative -left-2 !text-[16px] !font-medium !mb-4 !capitalize !underline-offset-[10px] ${
                  location.hash === item.hash ? '!text-[#C967A2] !underline' : 'text-[#A1999F] !no-underline'
                }`}
              />
            ))}
          </Tabbar>
          <Box className="flex items-center gap-5">
            <CustomSearch name="Search Any" />
            <Pagination
              totalPages={totalPages}
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
        </Box>
      )}

      <Box>
        <TransferTable list={list} />
      </Box>
    </Box>
  );
};

export default TransferRecipient;
