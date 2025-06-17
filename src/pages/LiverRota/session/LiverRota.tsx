import { AddMoreIcon2, ExportIcon, FilterIcon } from '@/assets/icons';
import { Box, Button, Flex, Pagination, Tabbar, TabItem } from '@/atoms';
import React, { useEffect } from 'react';
import QS from 'query-string';
import { createSearchParams, useNavigate } from 'react-router-dom';
import PageSizeOptions from '@/data/pageSizeOptions.json';
import LiverRotaTable from '../LiverRotaTable';
import { useLiverRota } from '../LiverRotaContext';

const ROTA_TABS = [
  {
    label: 'Zone Rota',
    hash: '#zonerota'
  },
  {
    label: 'Government Rota',
    hash: '#govrota'
  }
];

const LiverRota = () => {
  const parsedQS = QS.parse(location.search);
  const navigate = useNavigate();
  const currentPageSize = parsedQS.perPage ? Number(parsedQS.perPage) : 10;
  const totalPages = Math.ceil(10 / currentPageSize);

  const {
    state: { listRota },
    action: { getAll }
  } = useLiverRota();
  console.log(listRota, 'listRotalistRotalistRota');

  useEffect(() => {
    getAll();
  }, []);
  const statusFilter = {
    '#zonerota': 'zonerota',
    '#govrota': 'govrota'
  };
  useEffect(() => {
    const newLocation = {
      ...location
    };
    let searchParams = {
      ...parsedQS,
      ...(statusFilter['#zonerota'] && { 'filter[status]': statusFilter['#zonerota'] })
    };

    if (location.hash.trim().length === 0) {
      newLocation.hash = '#zonerota';
    }
    if (!parsedQS.page) {
      searchParams = { ...searchParams, page: '1', perPage: '10' };
    }
    if (!parsedQS.perPage) {
      searchParams = { ...searchParams, perPage: '10' };
    }
    console.log(searchParams, 'searchParams');

    newLocation.search = QS.stringify(searchParams);
    navigate(newLocation, { replace: true });
  }, []);
  const handleTabChange = (hash: string) => {
    console.log('hash', hash);
  };
  const renderTable = () => {
    switch (location.hash) {
      case '#zonerota':
        return <LiverRotaTable list={listRota} />;
      case '#govrota':
        return <LiverRotaTable list={listRota} isGovRota={true} />;

      default:
        return;
    }
  };

  return (
    <Box mt={2} className="">
      <Flex flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
        <Tabbar
          value={location.hash}
          className="items-center"
          onChange={(_, newValue) =>
            navigate({ hash: newValue, search: createSearchParams({ page: '1', perPage: '10' }).toString() })
          }
        >
          {ROTA_TABS.map((item) => (
            <TabItem
              key={item.hash}
              disableRipple
              value={item.hash}
              iconPosition="end"
              label={item.label}
              onClick={() => {
                handleTabChange(item.hash);
              }}
              style={{
                // padding: 0,
                fontSize: '16px',
                position: 'relative',
                left: -12,
                fontWeight: 500,
                color: location.hash === item.hash ? '#C967A2' : '#A1999F',
                marginRight: '-12px',
                // // paddingBottom: '10px',
                textDecoration: location.hash === item.hash ? 'underline' : 'none',
                // borderBottom: location.hash === item.hash ? '2px solid #C967A2' : '',
                textUnderlineOffset: 10,
                textTransform: 'capitalize'
              }}
            />
          ))}
        </Tabbar>

        <Flex justifyContent={'center'} alignItems={'center'} gap={'20px'}>
          <Button className="gap-2" variant="contained">
            <AddMoreIcon2 />
            Add Hospital
          </Button>
          <FilterIcon className="cursor-pointer" />
          <ExportIcon className="cursor-pointer" />
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
        </Flex>
      </Flex>
      <Box className="">{renderTable()}</Box>
      {/* <LiverRotaTable /> */}
    </Box>
  );
};

export default LiverRota;
