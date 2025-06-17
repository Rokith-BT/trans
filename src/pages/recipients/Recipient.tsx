import { AddMoreIcon2, ExportIcon } from '@/assets/icons';
import { Box, Flex, Pagination, Tabbar, TabItem, Text } from '@/atoms';
import PageSizeOptions from '@/data/pageSizeOptions.json';
import React, { useEffect, useState } from 'react';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import QS from 'query-string';
import type { Recipient } from '@/types/recipient';
import { FilterIcon } from '@/assets/icons/Filter';
import { useRecipient } from './RecipientContext';
import AddRecipientDialog from './section/AddRecipientDialog';
import RecipientTable from './section/RecipientTable';
import { FilterOption } from '../approvals/apprvals-recreate/section/SubContent';
import { useMasterData } from '../settings/setups/masterCotext';
import { HospitalNames, Organ, Zone } from '@/types/common.type';
import CustomSearch from '../components/CustomSearch';
import { Chip, MenuItem, Select } from '@mui/material';
import ALFBoxModal from '../alf/alfComponent/ALFBoxModal';
import ClockALFIcon from '@/assets/icons/ClockALFIcon';
import VerifyAlFIcon from '@/assets/icons/VerifyAlFIcon';
import AlfDeleteIcon from '@/assets/icons/AlfDeleteIcon';
import { GenericFilter } from '../components/GenericFilter';
import RecipientVerifyIcon from '@/assets/icons/VerifyRecipientIcon';
import HeartBeatIcon from '@/assets/icons/HeartBeat';
import InactiveIcon from '@/assets/icons/InactiveIcon';
import DraftIcon from '@/assets/icons/DraftIcon';
import ChangeReqIcon from '@/assets/icons/ChangeReqIcon';
import { useWindowType } from '@/hooks/useWindowType';
import { usePermissions } from '@/hooks/usePremission';
import { useRole } from '@/hooks/useRole';
import LoadingSmall from '../components/LoadingSmall';
// import { Chip } from '@mui/material';

const TAB_LIST = [
  {
    label: 'Recipient List',
    hash: '#recipients'
  },
  {
    label: 'Pending Approval',
    hash: '#pending-approval'
  },
  {
    label: 'Drafts',
    hash: '#drafts'
  },
  {
    label: 'Deleted List',
    hash: '#deleted'
  },
  {
    label: 'Inactive List',
    hash: '#inactive'
  },
  {
    label: 'Unpaid List',
    hash: '#unpaid'
  }
];

interface RecipientProps {
  onChange?: () => void;
}

const Recipient: React.FC<RecipientProps> = () => {
  const location = useLocation();
  const { roleID } = useRole();
  const { isMobile, isTablet, isSmallLaptop } = useWindowType();
  const { canCreate } = usePermissions(5, roleID);
  const navigate = useNavigate();
  const [openFilter, setOpenFilter] = useState(false);
  const [addRecipientDialog, setAddRecipientDialog] = useState(false);
  // const [loading, setLoading] = useState(false);
  const {
    state: { genders, zones, organs, cmInsurance, bloodGroup, hospitalNames }
  } = useMasterData();

  const genderOptions = genders;
  const zoneoptions = zones.map((z: Zone) => ({
    label: z.name,
    value: z.name.toLowerCase()
  }));
  const organOptions = organs.map((o: Organ) => ({
    label: o.name,
    value: o.name
  }));

  const cmInsuranceOptions = cmInsurance.map((c: { label: string; value: number }) => ({
    label: c.label,
    value: c.label
  }));
  const bloodGroupOptions = bloodGroup;
  const hospitalNamesOptions = hospitalNames.map((h: HospitalNames) => ({
    label: h.hospitalName,
    value: h.hospitalName
  }));
  //for filter
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string | null>>({});
  const [hospitalFilters, setHospitalFilters] = useState<FilterOption[]>([]);

  const {
    actions: { getAll, getAllRecipientSummary },
    state: { list, count, recipientSummary, loading }
  } = useRecipient();

  const parsedQS = QS.parse(location.search);
  console.log(location.search, 'location.search');

  useEffect(() => {
    getAllRecipientSummary();
  }, []);

  const statusFilters: Record<string, string> = {
    '#drafts': 'Draft',
    '#deleted': 'Deleted',
    '#inactive': 'Inactive',
    '#unpaid': 'Unpaid,PendingApproval',
    '#recipients': 'Active,DocumentVerified',
    '#pending-approval': 'PendingApproval,ChangeRequest'
    // '#document-verified': 'DocumentVerified'
  };
  useEffect(() => {
    const newLocation = {
      ...location
    };
    console.log(newLocation, 'newLocation');

    type SearchParams = {
      [key: string]: string | undefined;
    };
    let searchParams: SearchParams = {
      ...parsedQS,
      ...(statusFilters['#recipients'] && { 'filter[status]': statusFilters['#recipients'] })
    };

    if (location.hash.trim().length === 0) {
      newLocation.hash = '#recipients';
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
      navigate({ search: QS.stringify(parsedQS), hash: '#recipients' }, { replace: true });
      return;
    }
    const hash = location.hash;
    const searchParams = {
      ...parsedQS,
      'filter[status]':
        location.hash === '#recipients'
          ? 'Active,DocumentVerified'
          : location.hash === '#pending-approval'
            ? 'PendingApproval,ChangeRequest'
            : location.hash === '#drafts'
              ? 'Draft'
              : location.hash === '#inactive'
                ? 'Inactive'
                : location.hash === '#deleted'
                  ? 'Deleted'
                  : 'Unpaid,PendingApproval'
    };
    navigate({ search: QS.stringify(searchParams), hash });
    getAll(searchParams);
  }, [location.hash, location.search]);

  //for filters
  const filterMapping: Record<string, FilterOption[]> = {
    '#recipients': [
      { key: 'hospital', label: 'Hospital Name', options: hospitalNamesOptions, fieldType: 'text' },
      // { key: 'status', label: 'Patient Status', options: statusOptions },
      { key: 'Gender', label: 'Gender', options: genderOptions },
      // { key: 'Age', label: 'Age', options: ageOptions },
      { key: 'BloodGroup', label: 'Blood Group', options: bloodGroupOptions },
      { key: 'zone', label: 'Zone', options: zoneoptions },
      { key: 'Organ', label: 'Organ Type', options: organOptions },
      { key: 'CMInsurance', label: 'CM Insurance', options: cmInsuranceOptions }
    ],
    '#pending-approval': [
      { key: 'hospital', label: 'Hospital Name', options: hospitalNamesOptions, fieldType: 'text' },
      // { key: 'status', label: 'Patient Status', options: statusOptions },
      { key: 'Gender', label: 'Gender', options: genderOptions },
      // { key: 'Age', label: 'Age', options: ageOptions },
      { key: 'BloodGroup', label: 'Blood Group', options: bloodGroupOptions },
      { key: 'zone', label: 'Zone', options: zoneoptions },
      { key: 'Organ', label: 'Organ Type', options: organOptions },
      { key: 'CMInsurance', label: 'CM Insurance', options: cmInsuranceOptions }
    ],
    '#drafts': [
      { key: 'hospital', label: 'Hospital Name', options: hospitalNamesOptions },
      // { key: 'status', label: 'Patient Status', options: statusOptions },
      { key: 'Gender', label: 'Gender', options: genderOptions },
      // { key: 'Age', label: 'Age', options: ageOptions },
      { key: 'BloodGroup', label: 'Blood Group', options: bloodGroupOptions },
      { key: 'zone', label: 'Zone', options: zoneoptions },
      { key: 'Organ', label: 'Organ Type', options: organOptions },
      //payment status should have
      { key: 'CMInsurance', label: 'CM Insurance', options: cmInsuranceOptions }
    ],
    '#deleted': [
      { key: 'hospital', label: 'Hospital Name', options: hospitalNamesOptions },
      { key: 'Gender', label: 'Gender', options: genderOptions },
      // { key: 'Age', label: 'Age', options: ageOptions },
      { key: 'BloodGroup', label: 'Blood Group', options: bloodGroupOptions },
      { key: 'zone', label: 'Zone', options: zoneoptions },
      { key: 'Organ', label: 'Organ Type', options: organOptions },
      { key: 'CMInsurance', label: 'CM Insurance', options: cmInsuranceOptions }
    ],
    '#inactive': [
      { key: 'hospital', label: 'Hospital Name', options: hospitalNamesOptions },
      // { key: 'status', label: 'Patient Status', options: statusOptions },
      { key: 'Gender', label: 'Gender', options: genderOptions },
      // { key: 'Age', label: 'Age', options: ageOptions },
      { key: 'BloodGroup', label: 'Blood Group', options: bloodGroupOptions },
      { key: 'zone', label: 'Zone', options: zoneoptions },
      { key: 'Organ', label: 'Organ Type', options: organOptions },
      { key: 'CMInsurance', label: 'CM Insurance', options: cmInsuranceOptions }
    ],
    '#unpaid': [
      { key: 'hospital', label: 'Hospital Name', options: hospitalNamesOptions },
      // { key: 'status', label: 'Patient Status', options: statusOptions },
      { key: 'Gender', label: 'Gender', options: genderOptions },
      // { key: 'Age', label: 'Age', options: ageOptions },
      { key: 'BloodGroup', label: 'Blood Group', options: bloodGroupOptions },
      { key: 'zone', label: 'Zone', options: zoneoptions },
      { key: 'Organ', label: 'Organ Type', options: organOptions },
      { key: 'CMInsurance', label: 'CM Insurance', options: cmInsuranceOptions }
    ]
  };

  useEffect(() => {
    if (location.hash === '#recipients') {
      setHospitalFilters(filterMapping['#recipients']);
    } else {
      const currentHash = location.hash || '#recipients';
      const newFilters = filterMapping[currentHash] || [];
      setHospitalFilters(newFilters);
    }
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
    setAppliedFilters(filters);
    setOpenFilter(false);
  };

  const renderTable = () => {
    switch (location.hash) {
      case '#recipients':
        return <RecipientTable list={list} isCmInsurance={true} />;
      case '#drafts':
        return <RecipientTable list={list} isCmInsurance={true} />;
      case '#deleted':
        return <RecipientTable list={list} />;
      case '#inactive':
        return <RecipientTable list={list} />;
      case '#pending-approval':
        return <RecipientTable list={list} isCmInsurance={true} />;
      case '#unpaid':
        return <RecipientTable list={list} isPaymentStatus={true} isUnpaid={true} />;
      default:
        return;
    }
  };
  const handleTabChange = (hash: string) => {
    setAppliedFilters({});
    let baseParams;
    baseParams = {
      page: '1',
      perPage: parsedQS.perPage || '10', // Keep existing page size
      ...(statusFilters[hash] && { 'filter[status]': statusFilters[hash] })
    };

    if (hash === '#unpaid') {
      baseParams = {
        page: '1',
        perPage: parsedQS.perPage || '10',
        ...(statusFilters[hash] && {
          'filter[paymentstatus]': false,
          'filter[hospitaltype]': 'private',
          'filter[status]': statusFilters[hash]
        })
      };
    }

    // Navigate with clean parameters
    navigate({
      hash,
      search: QS.stringify(baseParams)
    });
  };
  const currentPageSize = parsedQS.perPage ? Number(parsedQS.perPage) : 10;
  const totalPages = Math.ceil(count / currentPageSize);
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
  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen w-full">
        <LoadingSmall />
      </Box>
    );
  }
  return (
    <Box mt={2} className="">
      {isMobile || isTablet || isSmallLaptop ? (
        <Box className="flex justify-between mb-4">
          <Text className="text-[#804595] !font-medium !text-[16px] !mt-1">Manage Recipient</Text>
          <CustomSearch name="Search any" className="h-[36px] rounded-full" />
        </Box>
      ) : (
        <Box className="flex gap-4 justify-between text-[#804595]  ">
          <Text className="gap-5 text-[#804595] !text-[23px] !font-[700] relative  top-1">Manage Recipient</Text>
          <Box className="flex gap-[24px]">
            <Box className="relative">
              <CustomSearch name="Search any" />
            </Box>
            {canCreate && (
              <button
                onClick={() => setAddRecipientDialog(true)}
                className="flex gap-x-3 items-center justify-center h-[36px] w-[183px] custom-btn btn-11 text-nowrap relative py-2.5  p-2 font-medium text-white transition duration-[1000] ease-in-out transform bg-gradient-to-r from-[#D268A8] via-[#D268A8] to-[#E3B2CF] rounded-md shadow-inset-light   hover:opacity-70 focus:outline-none overflow-hidden"
              >
                <AddMoreIcon2 /> Add Recipient
                {/* <div className="dot"></div> */}
                <span className="absolute top-0 left-0 w-8 h-full bg-white opacity-0 animate-shinyBtn"></span>
              </button>
            )}
          </Box>
        </Box>
      )}

      <Box className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl-custom:grid-cols-8 gap-4 mt-4 mb-4">
        <ALFBoxModal
          bgColor={'#FAEBDA'}
          color={'#CD7014'}
          title={'Pending Approval'}
          count={recipientSummary?.totalPendingApprovalRecipients || 0}
          Icon={<ClockALFIcon color="#CD7014" />}
        />
        <ALFBoxModal
          bgColor={'#DCF2F8'}
          color={'#1B98B9'}
          title={'Document Verified'}
          count={recipientSummary?.totalDocumentVerifiedRecipients || 0}
          Icon={<RecipientVerifyIcon />}
        />
        <ALFBoxModal
          bgColor={'#C5F4E680'}
          color={'#2B9650'}
          title={'Active'}
          count={recipientSummary?.totalActiveRecipients || 0}
          Icon={<HeartBeatIcon />}
        />
        <ALFBoxModal
          bgColor={'#F9E0F0'}
          color={'#C272B2'}
          title={'Organs Allocated'}
          count={recipientSummary?.totalOrganAllotedRecipients || 0}
          Icon={<VerifyAlFIcon />}
        />
        <ALFBoxModal
          bgColor={'#FFE1E1'}
          color={'#B9585A'}
          title={'Deleted'}
          count={recipientSummary?.totalDeletedRecipients || 0}
          Icon={<AlfDeleteIcon />}
        />
        <ALFBoxModal
          bgColor={'#EDEDED'}
          color={'#71717A'}
          title={'Inactive'}
          count={recipientSummary?.totalInactiveRecipients || 0}
          Icon={<InactiveIcon />}
        />
        <ALFBoxModal
          bgColor={'#D0DDF980'}
          color={'#3A5A96'}
          title={'Drafts'}
          count={recipientSummary?.totalDraftRecipients || 0}
          Icon={<DraftIcon />}
        />

        <ALFBoxModal
          bgColor={'#D7D2F880'}
          color={'#4E3395'}
          title={'Change Request'}
          count={recipientSummary?.totalChangeRequestRecipients || 0}
          Icon={<ChangeReqIcon />}
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
                <MenuItem className="textResponse !text-[13px]" key={item.hash} value={item.hash}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
            {canCreate && (
              <button
                onClick={() => setAddRecipientDialog(true)}
                className="flex textResponse gap-x-3 items-center justify-center h-[36px] w-[183px] custom-btn btn-11 text-nowrap relative py-2.5  p-2 font-medium text-white transition duration-[1000] ease-in-out transform bg-gradient-to-r from-[#D268A8] via-[#D268A8] to-[#E3B2CF] rounded-md shadow-inset-light   hover:opacity-70 focus:outline-none overflow-hidden"
              >
                <AddMoreIcon2 /> Add Recipient
                <span className="absolute top-0 left-0 w-8 h-full bg-white opacity-0 animate-shinyBtn"></span>
              </button>
            )}
          </Box>
          <Box className="!mx-auto align-middle mt-3 flex justify-between items-center">
            <FilterIcon onClick={() => setOpenFilter(true)} className="cursor-pointer" />
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
        <Box className="w-full">
          <Flex
            flexDirection={{ base: 'column', md: 'row' }}
            alignItems={{ base: 'flex-start', md: 'center' }}
            justifyContent="space-between"
            className="gap-4 flex-wrap"
          >
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
                  label={item.label}
                  onClick={() => {
                    handleTabChange(item.hash);
                  }}
                  className={`relative -left-2 !text-[16px] !font-medium !capitalize !underline-offset-[10px] ${
                    location.hash === item.hash ? '!text-[#C967A2] !underline' : 'text-[#A1999F] !no-underline'
                  }`}
                />
              ))}
            </Tabbar>

            <Flex justifyContent={'center'} alignItems={'center'} gap={'20px'}>
              <Box className="flex">
                {Object.entries(appliedFilters)
                  .filter(([, value]) => value) // Show chips for non-null values only
                  .map(([key, value]) => (
                    <Chip
                      key={key}
                      className="!h-[22px] !w-[100px] !text-[13px] !font-[400] "
                      label={`${hospitalFilters.find((f) => f.key === key)?.label}: ${value}`}
                      onDelete={() => handleRemoveFilter(key)}
                      color="secondary"
                    />
                  ))}
              </Box>
              <FilterIcon onClick={() => setOpenFilter(true)} className="cursor-pointer" />
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
        </Box>
      )}

      <Box className="mb-6 mt-4">{renderTable()}</Box>
      <GenericFilter
        open={openFilter}
        onClose={() => {
          setOpenFilter(false);
        }}
        filters={hospitalFilters}
        onApply={handleApplyFilters}
        isRecipientFilter={true}
      />
      <AddRecipientDialog
        open={addRecipientDialog}
        onClose={() => {
          setAddRecipientDialog(false);
        }}
        onChange={() => {}}
      />
    </Box>
  );
};

export default Recipient;
