import { AutoComplete, Box, Button, Pagination, Text } from '@/atoms';
import React, { useEffect, useState } from 'react';
import HeartImg from '@/assets/imgs/heart.png';
import KidneyImg from '@/assets/imgs/kidney.png';
import LiverImg from '@/assets/imgs/liver.png';
import LungsImg from '@/assets/imgs/lungs.png';
import PancreasImg from '@/assets/imgs/pancreas.png';
import StomachImg from '@/assets/imgs/stomach.png';
import HandImg from '@/assets/imgs/hand.png';
import SmallBowlImg from '@/assets/imgs/intestine.png';
import { PeopleIcon } from '@/assets/icons/PeopleIcon';
import { CloseCircleIcon, ExportIcon, TickCircle } from '@/assets/icons';
import { FilterIcon } from '@/assets/icons/Filter';
import RecipientTable from '../recipients/section/RecipientTable';
import Directions from '../components/Directions';
import SummaryBox from '../components/SummaryBox';
import { useLocation, useNavigate } from 'react-router';
import QS from 'query-string';
import PageSizeOptions from '@/data/pageSizeOptions.json';
import { useWaitingList } from './WaitingListContext';
import { Age, HospitalNames, MultiOrgans, Status, Zone } from '@/types/common.type';
import { useMasterData } from '../settings/setups/masterCotext';
import RecipientFilter from '../recipients/section/RecipientFilter';
import { FilterOption } from '../approvals/apprvals-recreate/section/SubContent';
import { createSearchParams } from 'react-router-dom';
import './WaitingList.scss';
import DirectionFilterRow from '../components/DirectionFilterRow';
import LoadingSmall from '../components/LoadingSmall';

interface WaitingListProps {
  hash?: string;
}

const WaitingList: React.FC<WaitingListProps> = ({ hash }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const parsedQs = QS.parse(location.search);
  const [openFilter, setOpenFilter] = useState(false);
  const [hospitalFilters, setHospitalFilters] = useState<FilterOption[]>([]);

  const [activeTab, setActiveTab] = useState({
    Organ: null,
    Total: null,
    Status: null,
    BloodGroup: null
  });

  const {
    state,
    actions: { getTranstanWaitingList, getSummary }
  } = useWaitingList();
  const { transtan, count, summary, loading } = state || {};

  useEffect(() => {
    const qs = QS.parse(location.search);
    getTranstanWaitingList(qs);
    getSummary();
  }, [location.search]);

  const {
    state: { genders, zones, multiOrgans, cmInsurance, bloodGroup, age, recipientStatus, hospitalNames }
  } = useMasterData();
  const multiOrgansOptions = multiOrgans.map((m: MultiOrgans) => ({
    value: m.id,
    label: m.name
  }));
  // const genderOptions = genders.map((g: Gender) => ({
  //   label: g.name,
  //   value: g.name
  // }));
  const zoneoptions = zones.map((z: Zone) => ({
    label: z.name,
    value: z.name.toLowerCase()
  }));
  // const cmInsuranceOptions = cmInsurance.map((c: CMInsurance) => ({
  //   label: c.name,
  //   value: c.id
  // }));
  // const bloodGroupOptions = bloodGroup.map((b: BloodGroup) => ({
  //   label: b.name,
  //   value: b.id
  // }));
  const ageOptions = age.map((a: Age) => ({
    label: a.name,
    value: a.id
  }));
  const statusOptions = recipientStatus.map((s: Status) => ({
    label: s.name,
    value: s.name
  }));
  const hospitalNamesOptions = hospitalNames.map((h: HospitalNames) => ({
    label: h.hospitalName,
    value: h.hospitalName
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const organCount = summary?.organSummaries?.map((organ: any) => ({
    organName: organ.organ.name,
    organCount: organ.totalCount
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const organCountMap = organCount?.reduce((acc: Record<string, number>, organ: any) => {
    acc[organ.organName] = organ.organCount;
    return acc;
  }, {});
  const TranstanWaitingSummary = [
    { name: 'Kidney', image: KidneyImg, count: '117' },
    { name: 'Liver', image: LiverImg, count: '123' },
    { name: 'Heart', image: HeartImg, count: '546' },
    { name: 'Lungs', image: LungsImg, count: '423' },
    { name: 'Pancreas', image: PancreasImg, count: '134' },
    { name: 'Small bowl', image: SmallBowlImg, count: '543' },
    { name: 'Stomach', image: StomachImg, count: '433' },
    { name: 'Hand', image: HandImg, count: '554' }
  ];
  const bloodOptions = [
    { name: 'O Group', count: '0' },
    { name: 'A Group', count: '0' },
    { name: 'B Group', count: '0' },
    { name: 'AB Group', count: '0' }
  ];

  // Update your blood group map so that A+ and A- both map to 'A Group'
  const bloodGroupMap: Record<string, string> = {
    'O+': 'O Group',
    'O-': 'O Group',
    'A+': 'A Group',
    'A-': 'A Group',
    'B+': 'B Group',
    'B-': 'B Group',
    'AB+': 'AB Group',
    'AB-': 'AB Group'
  };

  // Use the exact property name from your API response ("bloodGrouopSummaries")
  const updatedBloodOptions = bloodOptions.map((option) => {
    const matchedBlood = summary?.bloodGrouopSummaries?.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (bg: any) => bloodGroupMap[bg.bloodGroup.name] === option.name
    );
    // Sum counts if multiple entries exist
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalCount = matchedBlood?.reduce((sum: number, bg: any) => sum + bg.totalCount, 0) || 0;
    return {
      ...option,
      count: totalCount.toString()
    };
  });
  console.log(updatedBloodOptions);

  //for filter

  const handleFilterClick = (filterKey: string, filterValue: string | null) => {
    const currentFilter = parsedQs[`filter[${filterKey}]`];
    let newSearchParams;
    if (filterKey === 'reset') {
      newSearchParams = { page: '1' };
      setActiveTab({ Organ: null, Total: null, Status: null, BloodGroup: null });
    } else {
      if (currentFilter === filterValue) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [`filter[${filterKey}]`]: _, ...remainingParams } = parsedQs;
        newSearchParams = { ...remainingParams };
        setActiveTab((prevFilters) => ({
          ...prevFilters,
          [filterKey]: null
        }));
      } else {
        newSearchParams = { ...parsedQs, page: '1', [`filter[${filterKey}]`]: filterValue };
        setActiveTab((prevFilters) => ({
          ...prevFilters,
          [filterKey]: filterValue
        }));
      }
    }
    navigate({
      search: QS.stringify(newSearchParams, { encode: false }),
      hash: hash
    });
  };
  useEffect(() => {
    getTranstanWaitingList(parsedQs);
    const newLocation = {
      ...location
    };
    let searchParams = {
      ...parsedQs
    };
    if (location.hash.trim().length === 0) {
      newLocation.hash = '#transtan';
    }
    if (!parsedQs.page) {
      searchParams = { ...searchParams, page: '1', perPage: '10' };
    }
    if (!parsedQs.perPage) {
      searchParams = { ...searchParams, perPage: '10' };
    }
    newLocation.search = QS.stringify(searchParams);
    navigate(newLocation, { replace: true });
  }, []);

  //for filter
  const filterMapping: Record<string, FilterOption[]> = {
    '#transtan': [
      { key: 'hospital', label: 'Hospital Name', options: hospitalNamesOptions },
      { key: 'Zone', label: 'Zone', options: zoneoptions },
      { key: 'Gender', label: 'Gender', options: genders },
      { key: 'BloodGroup', label: 'Blood Group', options: bloodGroup },
      { key: 'Age', label: 'Age', options: ageOptions },
      { key: 'status', label: 'Patient Status', options: statusOptions },
      { key: 'Date', label: 'Register Date', fieldType: 'date', options: [] },
      { key: 'CMInsurance', label: 'CM Insurance', options: cmInsurance }
    ]
  };
  const handleApplyFilters = (filters: Record<string, string | null>) => {
    const updatedQS = { ...parsedQs };

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
  useEffect(() => {
    setHospitalFilters(filterMapping['#transtan']);
  }, []);

  useEffect(() => {
    setActiveTab({ Organ: null, Total: null, Status: null, BloodGroup: null });
  }, [location.hash]);

  const currentPageSize = parsedQs.perPage ? Number(parsedQs.perPage) : 10;
  const totalPages = Math.ceil(count / currentPageSize);
  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen w-full">
        <LoadingSmall />
      </Box>
    );
  }
  return (
    <Box className="">
      <Box className="waitilist-stat-container">
        <Box className="organ-blood-container">
          <Box className="organ-container">
            {TranstanWaitingSummary.map((summary, index) => (
              <Box key={index} className={`w-full `}>
                <SummaryBox
                  small
                  count={organCountMap?.[summary.name] ?? 0}
                  icon={<img className="organ-image" src={summary.image} alt="summary_image" />}
                  name={summary.name}
                  isActive={activeTab.Organ === summary.name}
                  onClick={() => handleFilterClick('Organ', summary.name)}
                />
              </Box>
            ))}
          </Box>
          <Box className="stat-blood-container">
            <Box className="stat-container ">
              <Box className="stat-button-container">
                <Button variant="outlined" className="stat-button !border-[#00008B] !text-[#00008B]">
                  <PeopleIcon />
                  Total - {summary.totalCount}
                </Button>
                <Button
                  variant="outlined"
                  className={`stat-button !border-[#027545] !text-[#027545] ${activeTab.Status === 'Active' ? '!bg-[#CFEEBC]' : ''}`}
                  onClick={() => handleFilterClick('Status', 'Active')}
                >
                  <TickCircle color="#027545" toolText="" />
                  Active - {summary?.totalActiveCount}
                </Button>
                <Button
                  variant="outlined"
                  className={`stat-button !border-[#DD2323] !text-[#DD2323] ${activeTab.Status === 'Inactive' ? '!bg-[#FFE1E1]' : ''}`}
                  onClick={() => handleFilterClick('Status', 'Inactive')}
                >
                  <CloseCircleIcon stroke="#DD2323" toolText="" />
                  Inactive - {summary?.totalInactiveCount}
                </Button>
              </Box>
              <Box className="blood-container w-full">
                {updatedBloodOptions.map((option, index) => (
                  <Box key={index}>
                    <Button
                      variant="outlined"
                      className={`blood-button ${activeTab.BloodGroup === option.name.trim().split(' ')[0] ? '!bg-[#DD2323] !text-[white]' : '!bg-[#FFE1E1] !text-[#e12a2a]'}`}
                      onClick={() => handleFilterClick('BloodGroup', option.name.trim().split(' ')[0])}
                    >
                      {option.name} &#40;{option.count}&#41;
                    </Button>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box className="multi-organ-container">
              <Box className="">
                <AutoComplete
                  className="multi-input"
                  value={multiOrgans.find((m: MultiOrgans) => m.name === multiOrgansOptions)}
                  onChange={(value) => {
                    const updatedQS = { ...parsedQs, 'filter[multiorgan]': `${value?.label}`, page: '1' };
                    if (value?.label === undefined) {
                      delete updatedQS?.['filter[multiorgan]'];
                    }
                    navigate({
                      search: QS.stringify({ ...updatedQS }, { encode: false }),
                      hash: location.hash
                    });
                  }}
                  label="Multi Organ"
                  menuOptions={multiOrgansOptions}
                  fullWidth
                  textFieldProps={{
                    fullWidth: true
                  }}
                />
              </Box>
              <Box className="direction-container">
                <DirectionFilterRow />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box className="direction-container">
          <Directions />
        </Box>
      </Box>
      <Box className="tab-action-page-container">
        <Box className="title-filter">
          <Text className="title">TRANSTAN Waiting List</Text>
          <Box className="filter-export">
            <FilterIcon onClick={() => setOpenFilter(true)} className="cursor-pointer" />
            <ExportIcon />
          </Box>
        </Box>

        <Box className="flex items-center gap-4">
          <Box className="md:flex hidden items-center gap-4 ">
            <FilterIcon onClick={() => setOpenFilter(true)} className="cursor-pointer" />
            <ExportIcon />
          </Box>
          <Box className="w-full">
            <Pagination
              totalPages={totalPages}
              onPageSizeChanged={(perPage: string) => {
                navigate({ ...location, search: createSearchParams({ ...parsedQs, perPage, page: '1' }).toString() });
              }}
              page={(parsedQs && Number(parsedQs.page)) || 1}
              onChange={(_, page) => {
                navigate({
                  ...location,
                  search: createSearchParams({ ...parsedQs, page: page.toString() }).toString()
                });
              }}
              currentPageSize={(parsedQs && Number(parsedQs.perPage)) || 10}
              pageSizeOptions={PageSizeOptions}
            />
          </Box>
        </Box>
      </Box>
      <Box className="z-10">
        <RecipientTable list={transtan} isWaitinglist={true} />
      </Box>
      <RecipientFilter
        open={openFilter}
        onClose={() => {
          setOpenFilter(false);
        }}
        onApply={handleApplyFilters}
        filters={hospitalFilters}
      />
    </Box>
  );
};

export default WaitingList;
