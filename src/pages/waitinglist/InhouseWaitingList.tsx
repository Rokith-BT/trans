import { Box, Button, Pagination, Tabbar, TabItem, Text } from '@/atoms';
import React, { useEffect, useState } from 'react';
import WaitListTopBar from './section/WaitListTopBar';
import { useLocation, useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';
import QS from 'query-string';
import { FilterIcon } from '@/assets/icons/Filter';
import { AddMoreIcon2, ExportIcon } from '@/assets/icons';
import { useWaitingList } from './WaitingListContext';
import RecipientFilter from '../recipients/section/RecipientFilter';
import { useMasterData } from '../settings/setups/masterCotext';
import { Age, Status, Zone } from '@/types/common.type';
import { FilterOption } from '../approvals/apprvals-recreate/section/SubContent';
import PageSizeOptions from '@/data/pageSizeOptions.json';
import InhouseApprovalDialog from './section/InhouseApprovalDialog';
// import InhouseTable from './section/inhousetable';
import { useRole } from '@/hooks/useRole';
import { usePermissions } from '@/hooks/usePremission';
import LoadingSmall from '../components/LoadingSmall';
import InhouseTable from './section/inhousetable';

const Tab_List = [
  { label: 'Current List', hash: '#currentlist' },
  { label: 'Final List', hash: '#finallist' }
];

const InhouseWaitingList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const parsedQS = QS.parse(location.search);
  const {
    state: { genders, zones, bloodGroup, age, recipientStatus }
  } = useMasterData();

  const zoneoptions = zones.map((z: Zone) => ({
    label: z.name,
    value: z.name.toLowerCase()
  }));
  const ageOptions = age.map((a: Age) => ({
    label: a.name,
    value: a.id
  }));
  const statusOptions = recipientStatus.map((s: Status) => ({
    label: s.name,
    value: s.name
  }));

  const {
    state,
    actions: { getInHouseList }
  } = useWaitingList();
  const [openFilter, setOpenFilter] = useState(false);
  const { roleID, isSuperAdmin } = useRole();
  const { canUpdate } = usePermissions(14, roleID);
  const [hospitalFilters, setHospitalFilters] = useState<FilterOption[]>([]);

  const { inHouseList, count, loading } = state || {};
  useEffect(() => {
    getInHouseList(parsedQS);
    const newLocation = {
      ...location
    };
    let searchParams = {
      ...parsedQS
    };
    if (location.hash.trim().length === 0) {
      newLocation.hash = '#currentlist';
    }
    if (!parsedQS.page) {
      searchParams = { ...searchParams, page: '1', perPage: '10' };
    }
    if (!parsedQS.perPage) {
      searchParams = { ...searchParams, perPage: '10' };
    }
    newLocation.search = QS.stringify(searchParams);
    navigate(newLocation);
  }, []);
  const renderTable = () => {
    switch (location.hash) {
      case '#currentlist':
        return <InhouseTable list={inHouseList} canUpdate={canUpdate} />;
      case '#finallist':
        return <InhouseTable isInhouseFinal={true} list={inHouseList} />;
      default:
        return;
    }
  };
  useEffect(() => {
    getInHouseList(parsedQS);
  }, [location.search, location.hash]);
  useEffect(() => {
    const newLocation = {
      ...location
    };
    let searchParams = {
      ...parsedQS
    };
    if (location.hash.trim().length === 0) {
      newLocation.hash = '#currentlist';
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
  const currentPageSize = parsedQS.perPage ? Number(parsedQS.perPage) : 10;
  const totalPages = Math.ceil(count / currentPageSize);
  //for filter
  const filterMapping: Record<string, FilterOption[]> = {
    '#currentlist': [
      { key: 'Zone', label: 'Zone', options: zoneoptions },
      { key: 'Gender', label: 'Gender', options: genders },
      { key: 'BloodGroup', label: 'Blood Group', options: bloodGroup },
      { key: 'Age', label: 'Age', options: ageOptions },
      { key: 'status', label: 'Patient Status', options: statusOptions },
      { key: 'Date', label: 'Register Date', fieldType: 'date', options: [] }
    ]
  };
  useEffect(() => {
    setHospitalFilters(filterMapping['#currentlist']);
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
  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen w-full">
        <LoadingSmall />
      </Box>
    );
  }
  return (
    <Box>
      <Box className="inhouse-waitlist-container">
        <Text className="inhouse-title">Inhouse Waiting List</Text>
        {isSuperAdmin && (
          <Button variant="contained" className="inhouse-approval-button" onClick={() => setOpenApproveDialog(true)}>
            <AddMoreIcon2 /> Inhouse Approval
          </Button>
        )}
      </Box>
      <Box className="!z-[999]">
        <WaitListTopBar totalCount={count} isInhouse={true} />
      </Box>
      <Box className="inhouse-tab-page-filter-container">
        <Tabbar
          value={location.hash}
          className="items-center !z-[10]"
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
              label={item.label}
              className="!text-[12px] md:!text-[16px]"
              style={{
                padding: 0,
                fontWeight: location.hash === item.hash ? 600 : 500,
                fontSize: '13px',
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
        <Box className="flex gap-4 items-center">
          <FilterIcon onClick={() => setOpenFilter(true)} className="cursor-pointer" />
          <ExportIcon />
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
      <Box>{renderTable()}</Box>
      {hospitalFilters?.length > 0 ? (
        <RecipientFilter
          open={openFilter}
          onClose={() => {
            setOpenFilter(false);
          }}
          onApply={handleApplyFilters}
          filters={hospitalFilters}
        />
      ) : (
        <Text>loading ...</Text>
      )}
      <InhouseApprovalDialog open={openApproveDialog} onClose={() => setOpenApproveDialog(false)} />
    </Box>
  );
};

export default InhouseWaitingList;
