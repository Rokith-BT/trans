import { AddMoreIcon2, ExportIcon } from '@/assets/icons';
import { Box, Button, Pagination, Tabbar, TabItem, Text } from '@/atoms';
import PageSizeOptions from '@/data/pageSizeOptions.json';
// import { useToggle } from '@/hooks/useToggle';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';
import QS from 'query-string';
import CustomSearch from '../components/CustomSearch';
import { FilterIcon } from '@/assets/icons/Filter';
import { useALF } from './ALFContext';
import AddALFDoctorDialog from './dialogs/AddALFDoctorDialog';
import { FilterOption, GenericFilter } from '../components/GenericFilter';
import './ALFDoctor.scss';
import ALFDataTable from './section/alfdoctable';
import LoadingSmall from '../components/LoadingSmall';
import { useWindowType } from '@/hooks/useWindowType';
//alf for docotrs
const TAB_LIST = [
  {
    label: 'Approved',
    hash: '#alfapproved'
  },
  {
    label: 'History',
    hash: '#alfdeleted'
  }
];

const ALFDoctors = () => {
  const location = useLocation();
  const [openFilter, setOpenFilter] = useState(false);
  const [openAddALFDialog, setAddALFDialog] = useState(false);
  const [alfFilter, setAlfFilter] = useState<FilterOption[]>([]);
  const navigate = useNavigate();
  const parsedQS = QS.parse(location.search);
  const { isMobile, isSmallLaptop, isTablet } = useWindowType();
  const {
    state,
    actions: { getAddALFDoctors, getALFDeletedDoctors }
  } = useALF();
  const { list, count, deleteList, loading } = state || {};

  useEffect(() => {
    const newLocation = {
      ...location
    };
    let searchParams = {
      ...parsedQS
    };
    if (location.hash.trim().length === 0) {
      newLocation.hash = '#alfapproved';
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
      navigate({ search: QS.stringify(parsedQS), hash: '#alfapproved' }, { replace: true });
      return;
    }
    const hash = location.hash;
    const searchParams = {
      ...parsedQS,
      'filter[status]': location.hash === '#alfapproved' ? '' : ''
    };
    navigate({ search: QS.stringify(searchParams), hash });
    if (location.hash === '#alfapproved') {
      getAddALFDoctors(parsedQS);
      getALFDeletedDoctors(parsedQS);
    } else if (location.hash === '#alfdeleted') {
      getALFDeletedDoctors(parsedQS);
      getAddALFDoctors(parsedQS);
    }
  }, [location.hash, location.search]);

  const renderTable = () => {
    switch (location.hash) {
      case '#alfapproved':
        return <ALFDataTable list={list} />;
      case '#alfdeleted':
        return <ALFDataTable list={deleteList} isAlfDeleted={true} />;
    }
  };
  const AllConsultants = React.useMemo(() => {
    return [...(list ?? [])];
  }, [list]);

  //for filter
  //  key: string; // Unique identifier for the filter
  // label: string; // Display name of the filter
  // options: { label: string; value: string | number }[]; // Array of options for the filter
  // fieldType?: 'select' | 'date' | 'text';
  const alfFilters: Record<string, FilterOption[]> = {
    '#alfapproved': [{ key: 'alfregistrationdate', label: 'ALF Reg Date', fieldType: 'date', options: [] }],
    '#alfdeleted': [{ key: 'alfdeleteddate', label: 'ALF Deleted Date', fieldType: 'date', options: [] }]
  };

  useEffect(() => {
    if (location.hash === '#alfapproved') setAlfFilter(alfFilters['#alfapproved']);
    if (location.hash === '#alfdeleted') setAlfFilter(alfFilters['#alfdeleted']);
  }, [openFilter]);

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
  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen w-full">
        <LoadingSmall />
      </Box>
    );
  }
  return (
    <Box className="px-[20px] py-[14px] md:px-[40px] md:py-[28px] alf-doctor-container">
      <Box className="title-search-add relative">
        {isMobile || isTablet || isSmallLaptop ? (
          <Text className="text-[#804595] !font-medium !text-[16px] !mt-1">ALF Doctor List</Text>
        ) : (
          <Text className="text-[#804595] !font-medium !text-[20px]">ALF Doctor List</Text>
        )}

        {/* <Text className="text-[#804595] !font-[600] !text-[14px] sm:!text-[16px] md:!text-[19px]">ALF Doctor List</Text> */}
        <Box className="search-add">
          <CustomSearch />
          <Button
            variant="contained"
            className="!bg-[#D876A9] gap-1 h-[35px] textResponse"
            onClick={() => setAddALFDialog(true)}
          >
            <AddMoreIcon2 />
            Add New
          </Button>
        </Box>
      </Box>
      <Box className="action-page-tab">
        <Tabbar
          value={location.hash}
          className="items-center"
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
              className="!text-[12px] md:!text-[14px]"
              label={item.label}
              style={{
                padding: 0,
                fontWeight: location.hash === item.hash ? 600 : 500,
                color: location.hash === item.hash ? '#C967A2' : '#A1999F',
                marginRight: '15px',
                paddingBottom: '10px',
                textDecoration: location.hash === item.hash ? 'underline' : 'none',
                textTransform: 'initial',
                textUnderlineOffset: 10
              }}
            />
          ))}
        </Tabbar>
        <Box className="action-page">
          <Box className="filter-export">
            <FilterIcon onClick={() => setOpenFilter(true)} className="cursor-pointer" />
            <ExportIcon className="cursor-pointer" />
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
      <Box className="add-on">
        <CustomSearch />
        <Button variant="contained" className="!bg-[#D876A9] gap-1 add-button" onClick={() => setAddALFDialog(true)}>
          <AddMoreIcon2 />
          Add New
        </Button>
      </Box>
      <Box>{renderTable()}</Box>
      {/* <ALFFilter open={openFilter} onClose={() => setOpenFilter(false)} /> */}
      <GenericFilter
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        filters={alfFilter}
        onApply={handleApplyFilters}
      />
      <AddALFDoctorDialog
        open={openAddALFDialog}
        onClose={() => setAddALFDialog(false)}
        AllConsultants={AllConsultants}
      />
    </Box>
  );
};

export default ALFDoctors;
