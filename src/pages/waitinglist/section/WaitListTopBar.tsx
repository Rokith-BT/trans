import { DropIcon, FilterIcon, HospitalGreyIcon, OrganAllocatedIcon, ZoneIcon } from '@/assets/icons';
import { Box, Button, FormAutoCompleteSelect, Text } from '@/atoms';
import React, { useState } from 'react';
// import HeartImg from '@/assets/imgs/heart.png';
// import LiverImg from '@/assets/imgs/liver.png';
// import KidneyImg from '@/assets/imgs/kidney.png';
// import LungImg from '@/assets/imgs/lungs.png';
// import PancreasImg from '@/assets/imgs/pancreas.png';
// import SmallBowlImg from '@/assets/imgs/spine.png';
// import StomachImg from '@/assets/imgs/stomach.png';
// import ObloodImg from '@/assets/imgs/O blood group.png';
// import O2bloodImg from '@/assets/imgs/O 2 bllod group.png';
// import AbloodImg from '@/assets/imgs/A blood group.png';
// import A2bloodImg from '@/assets/imgs/A2 blood group.png';
// import BbloodImg from '@/assets/imgs/Bbloodgroup.png';
// import B2bloodImg from '@/assets/imgs/B1blood group.png';
// import ABbloodImg from '@/assets/imgs/AB blood group.png';
// import AB2bloodImg from '@/assets/imgs/AB1 bloodgroup.png';
import { PeopleIcon } from '@/assets/icons/PeopleIcon';
// import { truncateTextByLines } from '@/utils/truncateText';
import { useLocation, useNavigate } from 'react-router';
import QS from 'query-string';
// import { toast } from '@/utils/toast';
// import HospitalDropdown from '@/pages/components/HospitalDropdown';
import CustomSearch from '@/pages/components/CustomSearch';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMasterData } from '@/pages/settings/setups/masterCotext';
import { Organ, Zone } from '@/types/common.type';
import { ActiveHospital } from '@/types/hospital';
import { truncateTextByLines } from '@/utils/truncateText';
import '../WaitingList.scss';

const waitingListSchema = z.object({
  hospital: z.any().optional(),
  organ: z.any().optional(),
  zone: z.any().optional(),
  bloodGroup: z.any().optional()
});

type WaitingListType = z.infer<typeof waitingListSchema>;

interface WaitListTopBarProps {
  isInhouse?: boolean;
  isTransplant?: boolean;
  totalCount?: number;
}

const WaitListTopBar: React.FC<WaitListTopBarProps> = ({ isInhouse = false, totalCount, isTransplant = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const parsedQS = QS.parse(location.search);

  const [applyFilter, setApplyFilter] = useState<{
    hospital: string | null | number;
    organ: string | null | number;
    zone: string | null | number;
    bloodGroup: string | null | number;
  }>({
    hospital: null,
    organ: null,
    zone: null,
    bloodGroup: null
  });
  const {
    state: { zones, organs, bloodGroup, hospitalNames }
  } = useMasterData();
  console.log('hospitalnames', hospitalNames);
  const { control, handleSubmit, reset } = useForm<WaitingListType>({
    resolver: zodResolver(waitingListSchema),
    defaultValues: {
      hospital: '',
      organ: '',
      zone: '',
      bloodGroup: ''
    }
  });

  const organsOptions = organs.map((o: Organ) => ({
    label: o.name,
    value: o.name.toLowerCase()
  }));
  const zoneoptions = zones.map((z: Zone) => ({
    label: z.name,
    value: z.name.toLowerCase()
  }));
  const hospitalOptions = hospitalNames.map((h: ActiveHospital) => ({
    label: truncateTextByLines(h.hospitalName, 1, 30),
    value: h.hospitalName.toLowerCase()
  }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bloodGroupOptions = bloodGroup.map((b: any) => ({
    label: b?.label,
    value: b?.label
  }));
  // const [showOrgans, setShowOrgans] = useState(false);
  // const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null);
  // const [showHospital, setShowHospital] = useState(false);
  // const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  // const [showZone, setShowZone] = useState(false);
  // const [selectZone, setSelectZone] = useState<string | null>(null);
  // const [showBlood, setShowBlood] = useState(false);
  // const [selectBlood, setSelectBlood] = useState<string | null>(null);
  // const [hoveredBlood, setHoveredBlood] = useState<string | number | null>(null);
  // const [isApply, setIsApply] = useState(false);
  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // // const [applyFilter, setApplyFilter] = useState<any>({ hospitalName: null, organ: null, bloodGroup: null });
  // const parsedQS = QS.parse(location.search);

  // const organsDropdown = [
  //   { name: 'Kidney', image: KidneyImg },
  //   { name: 'Liver', image: LiverImg },
  //   { name: 'Heart', image: HeartImg },
  //   { name: 'Lungs', image: LungImg },
  //   { name: 'Pancreas', image: PancreasImg },
  //   { name: 'Small Bowl', image: SmallBowlImg },
  //   { name: 'Stomach', image: StomachImg }
  // ];
  // const zonesDropdown = [
  //   { name: 'North Zone', image: '' },
  //   { name: 'West Zone', image: '' },
  //   { name: 'South Zone', image: '' }
  // ];
  // const bloodDropdown = [
  //   { name: 'O', image: ObloodImg, hoverImg: O2bloodImg },
  //   { name: 'A', image: AbloodImg, hoverImg: A2bloodImg },
  //   { name: 'B', image: BbloodImg, hoverImg: B2bloodImg },
  //   { name: 'AB', image: ABbloodImg, hoverImg: AB2bloodImg }
  // ];

  // const handleOrganClick = (organName: string) => {
  //   setSelectedOrgan(organName);
  //   setShowOrgans(false);
  //   setShowHospital(false);
  //   setShowBlood(false);
  // };
  // const handleHosptialClick = (hospitalName: string) => {
  //   setSelectedHospital(hospitalName);
  //   setShowHospital(false);
  //   setShowOrgans(false);
  //   setShowBlood(false);
  // };
  // const handleZoneClick = (zoneName: string) => {
  //   setSelectZone(zoneName);
  //   setShowZone(false);
  // };
  // const handleBloodClick = (bloodName: string) => {
  //   setSelectBlood(bloodName);
  //   setShowBlood(false);
  //   setShowHospital(false);
  //   setShowOrgans(false);
  // };
  // const handleApplyFilters = () => {
  //   if (selectedHospital === null && selectedOrgan === null && selectBlood === null) {
  //     toast('Select any fields to filter', 'warning');
  //   } else {
  //     setIsApply(true);
  //     const newFilters: Record<string, string | null> = {
  //       [`filter[hospital]`]: selectedHospital,
  //       [`filter[organ]`]: selectedOrgan,
  //       [`filter[bloodGroup]`]: selectBlood
  //     };
  //     const filteredFilters = Object.entries(newFilters).reduce(
  //       (acc, [key, value]) => {
  //         if (value && value.trim() !== '') {
  //           acc[key] = value;
  //         }
  //         return acc;
  //       },
  //       {} as Record<string, string>
  //     );

  //     // Merge with existing query parameters
  //     const updatedQuery = { ...parsedQS, ...filteredFilters };

  //     navigate({ search: QS.stringify(updatedQuery), hash: location.hash });
  //   }
  // };
  // const handleRemoveFilters = () => {
  //   delete parsedQS[`filter[hospital]`];
  //   delete parsedQS[`filter[organ]`];
  //   delete parsedQS[`filter[bloodGroup]`];

  //   navigate({ search: QS.stringify(parsedQS), hash: location.hash });
  // };

  // const {
  //   state,
  //   actions: { getCommonWaitingList, getInHouseList }
  // } = useWaitingList();

  const isFilterApplied = Object.values(applyFilter).some((value) => value);
  // const isQueryApplied = parsedQS && parsedQS?.q && parsedQS?.q?.trim() !== '';

  // useEffect(() => {
  //   if ((!isInhouse && isFilterApplied) || isQueryApplied) {
  //     getCommonWaitingList(parsedQS);
  //   }
  // }, [location.search]);

  const onSubmit = async (data: WaitingListType) => {
    const filters: Record<string, string> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        filters[`filter[${key}]`] = value; // Format: filter[zone]=west
      }
    });

    // Merge with existing query params
    const updatedQS = { ...parsedQS, ...filters, page: '1' }; // Reset to page 1 when filtering
    navigate({ search: QS.stringify(updatedQS, { encode: false }), hash: location.hash });

    // Fetch data with filters
    // getCommonWaitingList(updatedQS);

    // Update state to track applied filters
    setApplyFilter({
      hospital: data.hospital ?? null,
      organ: data.organ ?? null,
      zone: data.zone ?? null,
      bloodGroup: data.bloodGroup ?? null
    });
  };
  const handleClearFilters = () => {
    // Reset filter state
    setApplyFilter({ hospital: null, organ: null, zone: null, bloodGroup: null });

    // Remove all `filter[...]` parameters
    const updatedQS = { ...parsedQS };
    Object.keys(updatedQS).forEach((key) => {
      if (key.startsWith('filter[')) {
        delete updatedQS[key];
      }
    });

    // Navigate without filters
    navigate({ search: QS.stringify(updatedQS, { encode: false }), hash: location.hash });
    // Reset form fields
    reset({
      organ: '',
      zone: '',
      bloodGroup: ''
    });
  };
  return (
    <Box>
      {/* <Box className="flex items-center gap-[10px]">
        <Box className="flex gap-[10px] items-center w-[80%]">
          <Box
            className="flex w-[100%] items-center justify-between gap-4"
            sx={{
              boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.20)',
              borderRadius: '26px',
              padding: '10px'
            }}
          >
            <Box className="w-full flex  items-center text-left bg-[#A1999F26] !rounded-[26px]">
              {isInhouse && (
                <Box
                  className={`bg-[#A1999F26] relative !text-[#A1999F] px-[16px] py-[9px] !rounded-l-[26px] w-[100%] hover:bg-[#D876A94D]  transition-all duration-[0.7s]  ${
                    selectedHospital ? 'bg-[#D876A94D] !text-[#C967A2]' : ''
                  }`}
                >
                  <Text
                    onClick={() => {
                      setShowHospital(!showHospital);
                      setShowOrgans(false);
                      setShowBlood(false);
                    }}
                    className="flex items-center justify-between"
                  >
                    <Text
                      className="flex items-center gap-2 hover:!text-[#C967A2] cursor-pointer"
                      title={selectedHospital ?? 'Hospital'}
                    >
                      <HospitalGreyIcon stroke={selectedHospital ? '#C967A2' : '#A1999F'} />
                      {selectedHospital === null ? 'Hospital' : truncateTextByLines(selectedHospital, 1, 15)}
                    </Text>
                    {selectedHospital !== null && (
                      <CloseSimpleIcon
                        className="z-[101]"
                        onClick={() => {
                          setShowHospital(false);
                          setSelectedHospital(null);
                        }}
                      />
                    )}
                  </Text>
                  {showHospital && (
                    // <Box
                    //   className="absolute z-[100] bg-[white] top-[60px] left-3 flex flex-col p-2 rounded-[16px] h-[300px] overflow-y-scroll "
                    //   sx={{
                    //     overflow: 'scroll',
                    //     scrollbarWidth: 'none',
                    //     boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.20)'
                    //   }}
                    // >
                    //   {
                    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    //     hospitalNamesOptions.map((hospital: any) => {
                    //       const names = hospital?.label.trim();
                    //       return (
                    //         <Box
                    //           key={hospital.value}
                    //           className="cursor-pointer flex flex-col"
                    //           onClick={() => {
                    //             handleHosptialClick(names);
                    //           }}
                    //         >
                    //           <Text
                    //             title={names}
                    //             className="h-[48px] hover:!text-[#C967A2] hover:bg-[#7f7f8236] flex items-center pl-[16px] rounded-lg "
                    //           >
                    //             {truncateTextByLines(names, 2, 12)}
                    //           </Text>
                    //         </Box>
                    //       );
                    //     })
                    //   }
                    // </Box>
                    <Box
                      className="absolute z-[100] bg-[white] top-[60px] left-3 flex flex-col p-2 rounded-[16px] h-[300px] w-full overflow-y-scroll "
                      sx={{
                        overflow: 'scroll',
                        scrollbarWidth: 'none',
                        boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.20)'
                      }}
                    >
                      <HospitalDropdown selectedHospital={selectedHospital} setSelectedHospital={handleHosptialClick} />
                    </Box>
                  )}
                </Box>
              )}

              <Box
                className={`bg-[#A1999F26] relative !text-[#A1999F] px-[16px] py-[9px] ${isInhouse ? 'rounded-none' : '!rounded-l-[26px]'} w-[100%] hover:bg-[#D876A94D] hover:!text-[#C967A2] transition-all duration-[0.7s]  ${
                  selectedOrgan ? 'bg-[#D876A94D] !text-[#C967A2]' : ''
                }`}
              >
                <Text
                  onClick={() => {
                    setShowOrgans(!showOrgans);
                    setShowHospital(false);
                    setShowBlood(false);
                  }}
                  className="flex items-center justify-between"
                >
                  <Text className="cursor-pointer flex items-center gap-2">
                    <OrganAllocatedIcon color={selectedOrgan ? '#C967A2' : '#A1999F'} />
                    {selectedOrgan === null ? 'Organs' : selectedOrgan}
                  </Text>
                  {selectedOrgan !== null && (
                    <CloseSimpleIcon
                      onClick={() => {
                        setShowOrgans(false);
                        setSelectedOrgan(null);
                      }}
                    />
                  )}
                </Text>
                {showOrgans && (
                  <Box
                    className="absolute top-[60px] left-3 z-[100] bg-[white] flex flex-wrap gap-4 p-2 rounded-[16px] "
                    sx={{
                      justifyContent: 'flex-start', // Align items to the left
                      boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.20)'
                    }}
                  >
                    {organsDropdown.map((organ, index) => (
                      <Box
                        key={index}
                        className="h-[68px] w-[68px] flex flex-col items-center justify-center rounded-lg bg-[#A1999F26] hover:bg-[#D876A94D] transition-all duration-[0.5s]"
                        sx={{
                          flex: '0 0 calc(33.0% - 10px)', // 3 items per row, minus gap
                          maxWidth: 'calc(33.0% - 10px)', // Ensure width doesn't exceed
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          handleOrganClick(organ.name);
                        }}
                      >
                        <img src={organ.image} alt="organ_img" className="h-[32px] w-[32px]" />
                        <Text className="!text-[11px] !font-[500] text-[#1A0616] ">{organ.name}</Text>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

              {!isInhouse && (
                <Box
                  className={`bg-[#A1999F26] relative !text-[#A1999F] px-[16px] py-[9px]  w-[100%] hover:bg-[#D876A94D] hover:!text-[#C967A2] transition-all duration-[0.7s]  ${
                    selectZone ? 'bg-[#D876A94D] !text-[#C967A2]' : ''
                  }`}
                >
                  <Text
                    onClick={() => {
                      setShowZone(!showZone);
                    }}
                    className="flex items-center justify-between"
                  >
                    <Text className="flex gap-2 items-center cursor-pointer">
                      <ZoneIcon color={selectZone ? '#C967A2' : '#A1999F'} />
                      {selectZone === null ? 'Zone' : selectZone}
                    </Text>
                    {selectZone !== null && (
                      <CloseSimpleIcon
                        onClick={() => {
                          setShowZone(false);
                          setSelectZone(null);
                        }}
                      />
                    )}
                  </Text>
                  {showZone && (
                    <Box
                      className="absolute top-[60px] left-3 z-[100] bg-[white] flex flex-col w-[100%] gap-4 p-2 rounded-[16px] "
                      sx={{
                        justifyContent: 'flex-start', // Align items to the left
                        boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.20)'
                      }}
                    >
                      {zonesDropdown.map((zone, index) => (
                        <Box
                          key={index}
                          className="h-[68px] w-[100%] flex  items-center justify-left px-4 rounded-lg bg-[#F8F8FF] hover:bg-[#D876A94D]  transition-all duration-[0.5s]"
                          onClick={() => {
                            handleZoneClick(zone.name);
                          }}
                        >
                          <Box>
                            <ZoneIcon />
                          </Box>
                          <Text className="!text-[16px] !font-[400] hover:!font-[700] cursor-pointer  text-[#1A0616] ">
                            {zone.name}
                          </Text>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              )}
              <Box
                className={`bg-[#A1999F26] relative !text-[#A1999F] px-[16px] py-[9px]  w-[100%] hover:bg-[#D876A94D] hover:!text-[#C967A2] transition-all duration-[0.7s]  ${
                  selectBlood ? 'bg-[#D876A94D] !text-[#C967A2]' : ''
                }`}
              >
                <Text
                  onClick={() => {
                    setShowBlood(!showBlood);
                    setShowHospital(false);
                    setShowOrgans(false);
                  }}
                  className="flex items-center justify-between"
                >
                  <Text className="flex gap-2 items-center cursor-pointer">
                    <DropIcon color={selectBlood ? '#C967A2' : '#A1999F'} />{' '}
                    {selectBlood === null ? 'Blood Group' : `${selectBlood} Blood Group`}
                  </Text>
                  {selectBlood !== null && (
                    <CloseSimpleIcon
                      onClick={() => {
                        setShowBlood(false);
                        setSelectBlood(null);
                      }}
                    />
                  )}
                </Text>
                {showBlood && (
                  <Box
                    className="absolute top-[60px] left-3 z-[100] bg-[white] flex flex-wrap w-[100%] gap-2 px-4 py-[22px] rounded-[16px] "
                    sx={{
                      justifyContent: 'flex-start',
                      boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.20)'
                    }}
                  >
                    {bloodDropdown.map((blood, index) => (
                      <Box
                        key={index}
                        className=" w-[100%] flex  items-center justify-center rounded-lg transition-all duration-[0.5s]"
                        sx={{
                          flex: '0 0 calc(50.0% - 10px)',
                          maxWidth: 'calc(100.0% - 10px)',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleBloodClick(blood.name)}
                        onMouseEnter={(e) => {
                          setHoveredBlood(index);
                          e.preventDefault();
                        }}
                        onMouseLeave={() => setHoveredBlood(null)}
                      >
                        <Box
                          className="flex items-center justify-center rounded-lg"
                          sx={{
                            height: '90px',
                            width: '90px',
                            overflow: 'hidden'
                          }}
                        >
                          <img
                            src={hoveredBlood === index ? blood.hoverImg : blood.image}
                            alt="bloodgroup"
                            className="!h-full !w-full !object-contain" // Ensure image fills the wrapper
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
              <Box className="bg-[#D876A9] !text-[#F8F8FF] text-center px-[16px] py-[9px] !rounded-r-[26px] w-[50%]">
                <Text
                  className="cursor-pointer"
                  onClick={() => {
                    handleApplyFilters();
                  }}
                >
                  Apply
                </Text>
              </Box>
            </Box>
            <Box
              className={`${!isApply ? 'bg-[#A1999F]' : 'bg-[#D876A9] cursor-pointer'} p-[10px] rounded-[26px]`}
              onClick={() => {
                setSelectBlood(null);
                setSelectZone(null);
                setSelectedOrgan(null);
                setSelectedHospital(null);
                setIsApply(false);
                handleRemoveFilters();
              }}
            >
              <RefreshIcon />
            </Box>
          </Box>
        </Box>
        <Box className="w-[20%]">
          <Box className="flex gap-[10px] ">
            <Button
              variant="contained"
              className={`!flex !items-center !px-[16px] !py-[6px] !h-[36px] w-[70%] !rounded-[33px] !bg-[#D876A94D] !text-[#C967A2] ${
                isApply ? '!bg-[#D876A9] !text-[white]' : ''
              }`}
              style={{
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <PeopleIcon
                stroke="#C967A2"
                className="transition-transform bg-[white] rounded-[14px]  duration-500 ease-in-out"
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: `translateY(-50%) ${isApply ? 'translateX(260%) ' : 'translateX(-260%)'}`,
                  transition: 'transform 0.8s linear '
                }}
              />
              <Text
                className="!ml-auto !mr-auto text-center text-nowrap !text-[13px] !font-[500]"
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: `translateY(-50%) ${isApply ? 'translateX(-20%) ' : 'translateX(20%)'}`,
                  transition: 'transform 0.6s linear '
                }}
              >
                Total {count}
              </Text>
            </Button>
          </Box>
        </Box>
      </Box> */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className="common-waitlist-container">
          <Box className="filter-inputs">
            {isInhouse && (
              <FormAutoCompleteSelect
                control={control}
                name="hospital"
                label="Hospitals"
                menuOptions={hospitalOptions}
                isWaitlist={true}
                startIcon={<HospitalGreyIcon className="h-[10px] w-[10px] md:h-[17px] md:w-[17px] " stroke="#C967A2" />}
                textFieldProps={{ fullWidth: true, sx: { border: 'none', outline: 'none' } }}
              />
            )}
            <FormAutoCompleteSelect
              control={control}
              name="organ"
              label="Organs"
              menuOptions={organsOptions}
              isWaitlist={true}
              startIcon={<OrganAllocatedIcon className="h-[10px] w-[10px] md:h-[17px] md:w-[17px] " />}
              textFieldProps={{ fullWidth: true, sx: { border: 'none', outline: 'none' } }}
            />

            {!isInhouse && (
              <FormAutoCompleteSelect
                control={control}
                name="zone"
                label="Zone"
                startIcon={<ZoneIcon className="h-[10px] w-[10px] md:h-[17px] md:w-[17px] " color="#C967A2" />}
                isWaitlist={true}
                menuOptions={zoneoptions}
                textFieldProps={{ fullWidth: true }}
              />
            )}
            <FormAutoCompleteSelect
              // className='!appearance-none'
              control={control}
              name="bloodGroup"
              label="Blood Group"
              startIcon={<DropIcon className="h-[10px] w-[10px] md:h-[17px] md:w-[17px] " color="#C967A2" />}
              isWaitlist={true}
              menuOptions={bloodGroupOptions}
              textFieldProps={{ fullWidth: true }}
            />
            <Button
              className="filter-button"
              type="submit"
              variant="outlined"
              onClick={isFilterApplied ? handleClearFilters : handleSubmit(onSubmit)}
            >
              <FilterIcon className="h-[13px] w-[13px]" />
              {isFilterApplied ? 'Clear Filter' : 'Apply Filter'}
            </Button>
            {!isTransplant && (
              <Box className="total-button">
                <Box className="flex items-center justify-between w-full px-1 py-1 my-1  bg-[#D876A94D] text-[#C967A2] ">
                  <div className="flex items-center gap-2">
                    <div className="h-full bg-white ">
                      <PeopleIcon stroke="#C967A2" />
                    </div>
                    <Text className="total-text">Total Recipients</Text>
                  </div>
                  <Text className="relative top-[1px] !ml-1">
                    {isFilterApplied || isInhouse ? (totalCount ?? 0) : 0}
                  </Text>
                </Box>
              </Box>
            )}
          </Box>

          {!isTransplant && (
            <Box className="py-1 search-container">
              <Button
                className="filter-button"
                type="submit"
                variant="outlined"
                onClick={isFilterApplied ? handleClearFilters : handleSubmit(onSubmit)}
              >
                <FilterIcon className="h-[13px] w-[13px]" />
                {isFilterApplied ? 'Clear Filter' : 'Apply Filter'}
              </Button>
              {!isTransplant && (
                <Box className="total-button">
                  <Box className="flex items-center justify-between w-full px-1 py-1 my-1  bg-[#D876A94D] text-[#C967A2] ">
                    <div className="flex items-center gap-2">
                      <div className="h-full bg-white hidden md:flex">
                        <PeopleIcon stroke="#C967A2" className="" />
                      </div>
                      <Text className="total-text">Total</Text>
                    </div>
                    <Text className="relative top-[1px] !mx-1">
                      {isFilterApplied || isInhouse ? (totalCount ?? 0) : 0}
                    </Text>
                  </Box>
                </Box>
              )}
              <CustomSearch
                name={isInhouse ? 'Search Any' : 'Unique ID/Phone'}
                className=" search-button"
                isLeftSearch={true}
              />
            </Box>
          )}
        </Box>
      </form>
    </Box>
  );
};

export default WaitListTopBar;
