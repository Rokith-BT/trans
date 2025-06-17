import { Box, Button, Pagination, Tabbar, TabItem, Text } from '@/atoms';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';
import QS from 'query-string';
import { AddMoreIcon2, FilterIcon } from '@/assets/icons';
import PageSizeOptions from '@/data/pageSizeOptions.json';
// import ResourceTable from './section/ResourceTable';
import { useResource } from './ResourceContext';
import { FilterOption, GenericFilter } from '../components/GenericFilter';
import { useMasterData } from '../settings/setups/masterCotext';
import { Role } from '@/types/common.type';
import { HospitalName } from '@/types/recipient';
import CustomSearch from '../components/CustomSearch';
import './Resource.scss';
import ResourceTable from './section/resourcetable/index';
import { usePermissions } from '@/hooks/usePremission';
import { useRole } from '@/hooks/useRole';
import { useWindowType } from '@/hooks/useWindowType';
const Tab_List = [
  { label: 'Resource Management', hash: '#resourcemanagement' },
  { label: 'Hospital Users Management', hash: '#usermanagement' }
];

const Resource = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const parsedQS = QS.parse(location.search);
  const [openFilter, setOpenFilter] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
  const { roleID } = useRole();
  const { isMobile, isTablet, isSmallLaptop } = useWindowType();
  const { canRead, canDelete, canUpdate } = usePermissions(9, roleID);
  //api calls
  const {
    state: { roles, hospitalNames }
  } = useMasterData();
  const {
    state: { list, count, hospitalUsers },
    actions: { getAll, getAllHospitalUsers }
  } = useResource();

  useEffect(() => {
    const newLocation = {
      ...location
    };
    let searchParams = {
      ...parsedQS
    };
    if (location.hash.trim().length === 0) {
      newLocation.hash = '#resourcemanagement';
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
    if (location.hash === '#resourcemanagement') {
      getAll(parsedQS);
    } else if (location.hash === '#usermanagement') {
      getAllHospitalUsers(parsedQS);
    }
  }, [location.search, location.hash]);

  const renderTable = () => {
    switch (location.hash) {
      case '#resourcemanagement':
        return <ResourceTable list={list} canRead={canRead} canDelete={canDelete} canUpdate={canUpdate} />;
      case '#usermanagement':
        return <ResourceTable list={hospitalUsers} isHospitalUser={true} canRead={canRead} canDelete={canDelete} />;
      default:
        return;
    }
  };
  //for filters
  const RolseOptions = roles.map((r: Role) => ({
    label: r.name,
    value: r.name
  }));

  const HospitalNameOptions = hospitalNames.map((h: HospitalName) => ({
    label: h.hospitalName,
    value: h.hospitalName
  }));
  const userFilters: Record<string, FilterOption[]> = {
    '#resourcemanagement': [
      { key: 'role', options: RolseOptions, label: 'Role' },
      { key: 'hospitalname', options: HospitalNameOptions, label: 'Hospital Name' }
    ]
  };
  useEffect(() => {
    setFilterOptions(userFilters['#resourcemanagement']);
  }, [location.hash, openFilter]);

  const handleApplyFilters = (filters: Record<string, string | null>) => {
    const updatedQS = { ...parsedQS };

    Object.entries(filters).forEach(([key, value]) => {
      const filterKey = `filter[${key}]`;
      if (value) {
        updatedQS[filterKey] = value;
      } else {
        delete updatedQS[filterKey];
      }
    });

    navigate({ hash: location.hash, search: QS.stringify(updatedQS, { encode: false }) });
    setOpenFilter(false);
  };

  const currentPageSize = parsedQS.perPage ? Number(parsedQS.perPage) : 10;
  const totalPages = Math.ceil(count / currentPageSize);
  return (
    <Box className={`resource-container`}>
      {isMobile || isTablet || isSmallLaptop ? (
        <Text className="text-[#804595] !font-medium !text-[16px] !mt-1">
          {location.hash === '#resourcemanagement' ? 'Transtan Users' : 'Hospital Users'}
        </Text>
      ) : (
        <Text className="text-[#804595] !font-medium !text-[20px]">
          {location.hash === '#resourcemanagement' ? 'Transtan Users' : 'Hospital Users'}
        </Text>
      )}

      <Box className={`tab-action-container mt-2`}>
        <Tabbar
          value={location.hash}
          className="items-center"
          onChange={(_, newValue) =>
            navigate({ hash: newValue, search: createSearchParams({ page: '1', perPage: '10' }).toString() })
          }
        >
          {Tab_List.map((item) => (
            <TabItem
              key={item.hash}
              disableRipple
              value={item.hash}
              iconPosition="end"
              className="text-[12px] md:text-[16px] textResponse"
              label={item.label}
              style={{
                padding: 0,
                fontWeight: location.hash === item.hash ? 600 : 500,
                fontSize: '16px',
                color: location.hash === item.hash ? '#C967A2' : '#A1999F',
                marginRight: '15px',
                paddingBottom: '0px',
                textDecoration: location.hash === item.hash ? 'underline' : 'none',
                textTransform: 'initial',
                textUnderlineOffset: 10
              }}
            />
          ))}
        </Tabbar>
        <Box className={'add-button'}>
          {location.hash === '#resourcemanagement' && (
            <Button
              className="flex gap-2 h-[35px] textResponse"
              variant="contained"
              onClick={() => navigate('/resource-management/add-transtan-user')}
            >
              <AddMoreIcon2 /> Add user
            </Button>
          )}
        </Box>
      </Box>
      <Box className={'title-search-page'}>
        <Box className={'search-action-page !flex !justify-between'}>
          <Box className="search">
            <CustomSearch />
          </Box>
          <Box className='flex gap-4 items-center'>
            <FilterIcon
              className="hidden sm:block"
              onClick={() => {
                setOpenFilter(true);
              }}
            />
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
      <Box className="add-on">
        <FilterIcon
          className="block sm:hidden"
          onClick={() => {
            setOpenFilter(true);
          }}
        />
        <Box className="add-search">
          <CustomSearch />
        </Box>
        <Box className={'add-button'}>
          {location.hash === '#resourcemanagement' && (
            <Button
              className="flex gap-2"
              variant="contained"
              onClick={() => navigate('/resource-management/add-transtan-user')}
            >
              <AddMoreIcon2 /> Add user
            </Button>
          )}
        </Box>
      </Box>
      <Box className="mt-4">{renderTable()}</Box>
      <GenericFilter
        open={openFilter}
        onClose={() => {
          setOpenFilter(false);
        }}
        filters={filterOptions}
        onApply={handleApplyFilters}
      />
    </Box>
  );
};

export default Resource;
