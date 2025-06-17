/* eslint-disable no-unused-vars */
import { Box, Flex, Grid, Pagination, Tabbar, TabItem } from '@/atoms';
import React, { useEffect } from 'react';
import PageSizeOptions from '@/data/pageSizeOptions.json';
import HospitalListDashboard from './section/HospitalListDashboard';
// import HospitalTable from './section/HospitalTable';
import HospitalTable from './section/hospital-table';
import QS from 'query-string';
import { useLocation, useNavigate, createSearchParams } from 'react-router-dom';
import { Maximize } from '@/assets/icons';
import { useToggle } from '@/hooks/useToggle';
import { useHospitals } from './hospitalListContext';
import { useOGLicense } from './organContext';
import OrganTable from './section/organ-table';
import CustomSearch from '../components/CustomSearch';

const TAB_LIST = [
  {
    label: 'Hospital List',
    hash: '#hospital'
  },
  {
    label: 'Organ Licence List',
    hash: '#organ'
  }
];

const Dashboard: React.FC = () => {
  const location = useLocation();
  console.log('location ', location);
  const navigate = useNavigate();
  const [showMetrics, setShowMetrics] = useToggle(true);

  const parsedQS = QS.parse(location.search);
  const {
    actions: { getAll: getAllHospital },
    state: { list: hospitalList, count: totalCount }
  } = useHospitals();
  const {
    actions: { getAll: getAllOGLicenses },
    state: { list: oGLicenseList, count: organCount }
  } = useOGLicense();

  useEffect(() => {
    const newLocation = {
      ...location
    };
    let searchParams = {
      ...parsedQS
    };
    if (location.hash.trim().length === 0) {
      newLocation.hash = '#hospital';
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
    if (location.hash === '#hospital') {
      getAllHospital(parsedQS);
    } else if (location.hash === '#organ') {
      getAllOGLicenses(parsedQS);
    }
  }, [location.search, location.hash]);

  const renderTable = () => {
    switch (location.hash) {
      case '#hospital':
        return <HospitalTable list={hospitalList} />;
      case '#organ':
        return <OrganTable list={oGLicenseList} totalCount={organCount} />;
      default:
        return;
    }
  };

  const currentPageSize = parsedQS.perPage ? Number(parsedQS.perPage) : 10;
  const count = location.hash === '#hospital' ? totalCount : organCount;
  const totalPages = Math.ceil(count / currentPageSize);

  return (
    <Grid gridTemplateRows={'auto 1fr'} className="w-[inherit] h-[inherit] py-[28px] px-[10px] md:px-[40px]">
      <Box>
        {showMetrics && (
          <Flex className="justify-between items-center">
            <HospitalListDashboard hash={location.hash} />
          </Flex>
        )}
        <Box className="tab-pagination-block">
          <Tabbar
            value={location.hash}
            className="items-center h-[10px] md:h-full"
            onChange={(_, newValue) =>
              navigate({ hash: newValue, search: createSearchParams({ page: '1', perPage: '10' }).toString() })
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
                      className="h-4 md:h-5"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowMetrics();
                      }}
                    />
                  ) : undefined
                }
                label={item.label}
                className="textResponse"
                style={{
                  padding: 0,
                  fontWeight: location.hash === item.hash ? 600 : 500,
                  color: location.hash === item.hash ? '#C967A2' : '#A1999F',
                  marginRight: '15px',
                  paddingBottom: '10px',
                  fontSize:"15px",
                  textDecoration: location.hash === item.hash ? 'underline' : 'none',
                  textTransform: 'initial',
                  textUnderlineOffset: 10
                }}
              />
            ))}
          </Tabbar>
          <Box className="flex flex-col lg:flex-row items-start lg:items-center justify-center gap-[20px]">
            <Box className="hidden lg:block">
              <CustomSearch className="hospital-list-search" />
            </Box>
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
      </Box>
      <Box className="mt-2 ">{renderTable()}</Box>
    </Grid>
  );
};

export default Dashboard;
