import React, { useEffect, useState } from 'react';
import { Box, Pagination } from '@/atoms';
import TableContainer from './Tabels';
import { useHospitals } from '@/pages/hospitals/hospitalListContext';
import QS from 'query-string';
import { useLocation, useNavigate } from 'react-router';
import PageSizeOptions from '@/data/pageSizeOptions.json';
import { FilterIcon } from '@/assets/icons/Filter';
import FilterDialog from './FilterApproval';
import { useMasterData } from '@/pages/settings/setups/masterCotext';
import { HospitalType, Organ, Zone } from '@/types/common.type';
import { Chip, MenuItem, Select } from '@mui/material';
import { useRecipient } from '@/pages/recipients/RecipientContext';
import { useALF } from '@/pages/alf/ALFContext';
import CustomSearch from '@/pages/components/CustomSearch';
import { useWindowType } from '@/hooks/useWindowType';

interface SubTabProps {
  subTabs: { label: string; hash: string }[]; // List of subTabs to display
  activeSubTab: string; // Active sub-tab
  // eslint-disable-next-line no-unused-vars
  setActiveSubTab: (hash: string) => void; // Function to update active sub-tab
  activeTab: string;
}

export type FilterOption = {
  key: string; // Unique identifier for the filter
  label: string; // Display name of the filter
  options: { label: string; value: string | number }[]; // Array of options for the filter
  fieldType?: 'select' | 'date' | 'text';
};

const SubTab: React.FC<SubTabProps> = ({ activeTab, subTabs, activeSubTab, setActiveSubTab }) => {
  const [openFilter, setOpenFilter] = useState(false);
  const { isMobile } = useWindowType();
  const location = useLocation();
  const navigate = useNavigate();
  const { state: master } = useMasterData();
  const { zones, hospitalTypes, organs } = master || {};
  const zonesOptions = zones?.map((zone: Zone) => ({ label: zone.name, value: zone.name }));
  const hospitalTypesOptions = hospitalTypes?.map((type: HospitalType) => ({ label: type.name, value: type.name }));
  const organOptions = organs?.map((organ: Organ) => ({ label: organ.name, value: organ.name }));
  console.log('organOptions ', organOptions);

  const [appliedFilters, setAppliedFilters] = useState<Record<string, string | null>>({});
  const [hospitalFilters, setHospitalFilters] = useState<FilterOption[]>([]);

  const {
    state,
    actions: { getHospitalApprovals, getOrganlApprovals, getUserApproval }
  } = useHospitals();
  const { count, forOrganApprovalCount, hospitalApprovals, organApprovals, userApproval, userApprovalCount } =
    state || {};
  const {
    state: recipientState,
    actions: { getRecipientTransferList, getAll }
  } = useRecipient();
  const {
    state: { alfList },
    actions: { getALFList }
  } = useALF();
  const { count: recipientCount, list, recipientTransfers } = recipientState || {};
  console.log(list, 'listlistlistlistlistlistlistlistlistlistlistlistlistlistlist');
  // useEffect(() => {
  //   getAll({ _all: true });
  // }, []);
  const parsedQS = QS.parse(location.search);
  const roleFilters: Record<string, string> = {
    '#owner': 'Director',
    '#admin': 'Hospital Admin',
    '#doctor': 'SurgeonOrConsultant',
    '#coordi': 'Case Co-ordinators',
    '#alf': 'ALF Doctor'
  };

  useEffect(() => {
    const newLocation = {
      ...location
    };
    let searchParams = {
      ...parsedQS
    };
    if (location.hash.trim().length === 0) {
      newLocation.hash = '#hlist';
    }
    if (!location.hash && !parsedQS.page) {
      const initialHash = subTabs[0]?.hash || '#hlist'; // Default to the first sub-tab
      const initialParams = { ...parsedQS, page: '1', perPage: '10' };
      navigate({ hash: initialHash, search: QS.stringify(initialParams) });
    }
    if (!parsedQS.page) {
      searchParams = { ...searchParams, page: '1', perPage: '10' };
    }
    if (!parsedQS.perPage) {
      searchParams = { ...searchParams, perPage: '10' };
    }
    newLocation.search = QS.stringify(searchParams);
    navigate(newLocation);
    console.log('is this coming again ');
  }, []); // Only run once on component mount

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fetchParams: any = { ...parsedQS, hash: location.hash };
    if (location.hash === '#hlist') {
      getHospitalApprovals(fetchParams);
    }
    if (activeTab === '#user') {
      const role = parsedQS['filter[role]'] || 'Director'; // Default to Director if not specified
      fetchParams['filter[role]'] = role;

      console.log('Fetching user approvals with role:', role);
      getUserApproval(fetchParams);
    } else if (location.hash === '#olist') {
      getOrganlApprovals(fetchParams);
    } else if (location.hash === '#owner') {
      getUserApproval(fetchParams);
    }
    if (location.hash === '#recipientlist' || location.hash === '#cminsurance') {
      getAll(fetchParams);
    }
    if (location.hash === '#recipientstransfer') {
      getRecipientTransferList(fetchParams);
    }
    if (location.hash === '#alfapproval') {
      getALFList(fetchParams);
    }
  }, [location.search, location.hash]);

  const handleSubTabChange = (hash: string) => {
    const isUserTab = activeTab === '#user';
    const isRecipientTab = activeTab === '#recipient';
    const role = isUserTab ? roleFilters[hash] : undefined;

    const recipientFilters: Record<string, { key: string; value: string }> = {
      '#recipientlist': { key: 'filter[status]', value: 'PendingApproval' },
      '#cminsurance': { key: 'filter[cminsurance]', value: 'Applied' },
      '#alfapproval': { key: 'filter[status]', value: 'PendingTranstanReview' }
    };

    // eslint-disable-next-line prefer-const
    let filter: Record<string, string | number> = {
      page: '1'
    };

    // Apply role filter for user tab
    if (isUserTab && role) {
      filter['filter[role]'] = role;
    }

    if (isRecipientTab) {
      if (recipientFilters[hash]) {
        // filter[recipientFilters[hash].key] = recipientFilters[hash].value;
        if (recipientFilters[hash].key === 'filter[status]') {
          filter[recipientFilters[hash].key] = hash === '#alfapproval' ? 'PendingTranstanReview' : 'PendingApproval';
          delete parsedQS['filter[cminsurance]'];
        } else {
          filter[recipientFilters[hash].key] = 'Applied';
          delete parsedQS['filter[status]'];
        }
      } else {
        const updatedQS = { ...parsedQS };
        Object.values(recipientFilters).forEach(({ key }) => {
          delete updatedQS[key];
        });
        navigate({
          hash,
          search: QS.stringify(updatedQS)
        });
        return;
      }
    }

    setActiveSubTab(hash);
    navigate({
      hash,
      search: QS.stringify({
        ...parsedQS,
        ...filter
      })
    });
  };

  useEffect(() => {
    if (location.hash && location.hash !== activeSubTab) {
      setActiveSubTab(location.hash);
    }
  }, [location.hash]);

  const currentPageSize = parsedQS.perPage ? Number(parsedQS.perPage) : 10;
  console.log('activeSubtab ', activeSubTab, forOrganApprovalCount);
  const totalPages =
    activeSubTab === '#hlist'
      ? Math.ceil(count / currentPageSize)
      : activeSubTab === '#olist'
        ? Math.ceil(forOrganApprovalCount / currentPageSize)
        : activeTab === '#recipient'
          ? Math.ceil(recipientCount / currentPageSize)
          : Math.ceil(userApprovalCount / currentPageSize);

  // logics for filter dialog in the table
  const filterMapping: Record<string, FilterOption[]> = {
    '#hlist': [
      { key: 'HospitalType', label: 'Hospital Type', options: hospitalTypesOptions },
      { key: 'Zone', label: 'Zone', options: zonesOptions }
    ],
    '#olist': [{ key: 'Organ', label: 'Organ Type', options: organOptions }]
  };

  useEffect(() => {
    if (activeSubTab === '#hlist') {
      setHospitalFilters(filterMapping['#hlist']);
    } else {
      const currentHash = location.hash || '#hlist';
      const newFilters = filterMapping[currentHash] || [];
      setHospitalFilters(newFilters);
    }
  }, [location.hash, openFilter]);
  // const handleFilterRemove = (filterKey: string) => {
  //   const updatedFilters = { ...appliedFilters };
  //   delete updatedFilters[filterKey];

  //   // Update query string
  //   const updatedQS = { ...parsedQS };
  //   delete updatedQS[`filter[${filterKey}]`];

  //   navigate({ hash: location.hash, search: QS.stringify(updatedQS, { encode: false }) });
  //   setAppliedFilters(updatedFilters);
  // };
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
    setAppliedFilters(filters);
    setOpenFilter(false);
  };
  const handleRemoveFilter = (key: string) => {
    const updatedFilters = { ...appliedFilters };
    delete updatedFilters[key];
    setAppliedFilters(updatedFilters);

    const updatedQS = { ...parsedQS };
    delete updatedQS[`filter[${key}]`];

    navigate({
      hash: location.hash,
      search: QS.stringify(updatedQS, { encode: false })
    });
  };

  return (
    <Box className="mt-4 space-y-4">
      {/* Top Section: Subtabs + Controls */}
      <Box className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        {/* Sub Tabs */}
        {isMobile ? (
          <Select
            value={activeSubTab}
            onChange={(e) => handleSubTabChange(e.target.value)}
            className="h-[40px] !border-[#D876A9] !text-[#D876A9]"
          >
            {subTabs.map((subTab) => (
              <MenuItem key={subTab.hash} value={subTab.hash}>
                {subTab.label}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <Box className="flex flex-wrap sm:flex-nowrap overflow-x-auto sm:overflow-visible gap-3 sm:gap-4">
            {subTabs.map((subTab) => (
              <Box
                key={subTab.hash}
                className={`whitespace-nowrap cursor-pointer border-b-2 textResponse text-md sm:text-base pb-1 ${
                  activeSubTab === subTab.hash ? 'border-[#C967A2] text-[#C967A2]' : 'border-transparent text-gray-500'
                }`}
                onClick={() => handleSubTabChange(subTab.hash)}
              >
                {subTab.label}
              </Box>
            ))}
          </Box>
        )}

        {/* Controls Section */}
        <Box className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end w-full sm:w-auto">
          {/* Search */}
          <CustomSearch name="Search any" />

          {/* Filter Chips */}
          <Box className="flex flex-wrap gap-2">
            {Object.entries(appliedFilters)
              .filter(([, value]) => value)
              .map(([key, value]) => (
                <Chip
                  key={key}
                  label={`${hospitalFilters.find((f) => f.key === key)?.label}: ${value}`}
                  onDelete={() => handleRemoveFilter(key)}
                  color="secondary"
                />
              ))}
          </Box>

          {/* Filter Icon */}
          {(location.hash === '#hlist' || location.hash === '#olist') && (
            <FilterIcon className="cursor-pointer shrink-0" onClick={() => setOpenFilter(true)} />
          )}

          {/* Pagination */}
          <Pagination
            totalPages={totalPages}
            page={(parsedQS && Number(parsedQS.page)) || 1}
            currentPageSize={currentPageSize}
            pageSizeOptions={PageSizeOptions}
            onChange={(_, page) => {
              navigate({ search: QS.stringify({ ...parsedQS, page }), hash: activeSubTab });
            }}
            onPageSizeChanged={(perPage: string) =>
              navigate({ search: QS.stringify({ ...parsedQS, perPage, page: '1' }), hash: activeSubTab })
            }
          />
        </Box>
      </Box>

      {/* Table Section */}
      <Box>
        <TableContainer
          hospitalList={hospitalApprovals}
          organList={organApprovals}
          userList={userApproval}
          recipientList={list}
          activeTab={activeTab}
          activeSubTab={activeSubTab}
          recipientTransferList={recipientTransfers}
          alfApproval={alfList}
          organCount={forOrganApprovalCount}
        />
      </Box>

      {/* Filter Dialog */}
      <FilterDialog
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        filters={hospitalFilters}
        onApply={handleApplyFilters}
      />
    </Box>
  );
};

export default SubTab;
