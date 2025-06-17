import { Box, Button, Text } from '@/atoms';
import React, { useEffect, useState } from 'react';
import {
  ActiveIcon,
  AddMoreIcon2,
  DeleteIcon2,
  ExportIcon,
  HospitalIcon,
  PendingIcon,
  TargetIcon,
  ExpiredIcon
} from '@/assets/icons';
import HeartImg from '@assets/imgs/heart.png';
import LungImg from '@assets/imgs/lungs.png';
import LiverImg from '@assets/imgs/liver.png';
import KindneyImg from '@assets/imgs/kidney.png';
import PancreasImg from '@/assets/imgs/pancreas.png';
import { useHospitals } from '../hospitalListContext';
import SummaryBox from '@/pages/components/SummaryBox';
import { useLocation, useNavigate } from 'react-router';
import QS from 'query-string';
import { AddHospital, AddLicense } from './dialogs';
import './HospitalDashboard.scss';
import CustomSearch from '@/pages/components/CustomSearch';
import { usePermissions } from '@/hooks/usePremission';
import { useRole } from '@/hooks/useRole';

interface HospitalListDashboardProps {
  hash?: string;
}

const HospitalListDashboard: React.FC<HospitalListDashboardProps> = ({ hash }) => {
  const { roleID } = useRole();
  const [openHospitalDialog, setOpenHospitalDialog] = useState(false);
  const [openLicenseDialog, setOpenLicenseDialog] = useState(false);
  const [activeFilter, setActiveFilter] = useState({ HospitalType: null, organ: null, status: null, zone: null });
  const { canCreate } = usePermissions(1, roleID);
  const {
    state: { summarys, organsSummary }
  } = useHospitals();
  const location = useLocation();
  const navigate = useNavigate();
  const parsedQS = QS.parse(location.search);
  const handleFilterClick = (filterKey: string, filterValue: string | null) => {
    const currentFilter = parsedQS[`filter[${filterKey}]`];
    let newSearchParams;
    if (filterKey === 'reset') {
      // Clear all filters
      newSearchParams = { page: '1' }; // Reset to page 1 and remove all filters
      setActiveFilter({ HospitalType: null, organ: null, status: null, zone: null }); // Reset active filters
    } else if (filterValue === null) {
      // Remove the specific filter key from search params
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [`filter[${filterKey}]`]: _, ...remainingParams } = parsedQS;
      newSearchParams = { ...remainingParams };
      // Ensure the state is updated correctly
      setActiveFilter((prevFilters) => ({
        ...prevFilters,
        [filterKey]: null // Explicitly set the state to null
      }));
    } else {
      if (currentFilter === filterValue) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [`filter[${filterKey}]`]: _, ...remainingParams } = parsedQS;
        newSearchParams = { ...remainingParams };
        setActiveFilter((prevFilters) => ({
          ...prevFilters,
          [filterKey]: null
        }));
      } else {
        newSearchParams = { ...parsedQS, page: '1', [`filter[${filterKey}]`]: filterValue };
        setActiveFilter((prevFilters) => ({
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
    setActiveFilter({ HospitalType: null, organ: null, status: null, zone: null });
  }, [location.hash]);
  const handleAddButton = () => {
    setOpenHospitalDialog(true);
  };

  return (
    <>
      <Box className="w-full flex flex-col">
        <Box className="top-bar-grid">
          <Box className="grid-container">
            <SummaryBox
              name="All Hospital"
              count={summarys.summary?.allHospitals}
              icon={<HospitalIcon className="w-6 h-6 md:w-12 md:h-12" />}
              onClick={() => handleFilterClick('reset', null)}
              isActive={
                (activeFilter.HospitalType || activeFilter.organ || activeFilter.status || activeFilter.zone) === null
              }
            />
            <SummaryBox
              name="Government"
              count={summarys.summary?.governmentHospitals}
              icon={<HospitalIcon className="w-6 h-6 md:w-12 md:h-12" />}
              onClick={() => handleFilterClick('HospitalType', 'Government')}
              isActive={activeFilter.HospitalType === 'Government'}
            />
            <SummaryBox
              name="Private"
              count={summarys.summary?.privateHospitals}
              icon={<HospitalIcon className="w-6 h-6 md:w-12 md:h-12" />}
              onClick={() => handleFilterClick('HospitalType', 'Private')}
              isActive={activeFilter.HospitalType === 'Private'}
            />
            <SummaryBox
              name="NTORC"
              isNtorc
              count={summarys.summary?.ntorcHospitals}
              icon={<HospitalIcon className="w-6 h-6 md:w-12 md:h-12" />}
              onClick={() => handleFilterClick('HospitalType', 'NTORC')}
              isActive={activeFilter.HospitalType === 'NTORC'}
            />
          </Box>
          {/* direction */}
          <Box className="direction-box">
            <Box className="flex md:!mx-5 items-center justify-center  min-w-[80px] sm:min-w-[80px] h-[80px] relative">
              <Box
                onClick={() => handleFilterClick('zone', 'west')}
                className={`flex items-center justify-center absolute ${activeFilter.zone === 'west' ? 'bg-[#C967A2] text-[#fff]' : 'bg-[#D876A94D] text-[#C967A2]'} rounded-[50%] h-[24px] w-[24px] left-[-0px] shadow-lg cursor-pointer`}
              >
                <Text className="!font-[500] !text-[13px]">W</Text>
              </Box>
              <Box
                onClick={() => handleFilterClick('zone', 'north')}
                className={`flex items-center justify-center absolute ${activeFilter.zone === 'north' ? 'bg-[#C967A2] text-[#fff]' : 'bg-[#D876A94D] text-[#C967A2]'} rounded-[50%] h-[24px] w-[24px] top-[0px]  right-[27px] shadow-lg cursor-pointer`}
              >
                <Text className="!font-[500] !text-[13px]">N</Text>
              </Box>
              <Box className="p-[4px]">
                <TargetIcon
                  className="h-[16px] w-[16px] cursor-pointer"
                  onClick={() => {
                    if (activeFilter.zone !== null) {
                      handleFilterClick('zone', null);
                    }
                  }}
                />
              </Box>
              <Box
                onClick={() => handleFilterClick('zone', 'south')}
                className={`flex items-center justify-center w-[24px] h-[24px] absolute ${activeFilter.zone === 'south' ? 'bg-[#C967A2] text-[#fff]' : 'bg-[#D876A94D] text-[#C967A2]'} rounded-[50%] px-1 right-[27px] bottom-[0px] shadow-lg cursor-pointer`}
              >
                <Text className="!font-[500] !text-[13px]">S</Text>
              </Box>
              <Box
                // handleFilterClick('zone', 'east')
                onClick={() => {}}
                className="flex items-center justify-center w-[24px] h-[24px] absolute bg-[#6764654d]  rounded-[50%] px-1 right-[0px]   shadow-lg"
              >
                <Text className="text-[#524e51af] !font-[500] !text-[13px]">E</Text>
              </Box>
            </Box>
            <Box className=" w-full h-[80px] button-box">
              <Box className="flex w-full flex-col gap-y-[4px]">
                {canCreate && (
                  <button
                    onClick={handleAddButton}
                    className="flex gap-x-3 items-center justify-center h-[38px] custom-btn btn-11 text-nowrap relative py-2.5  p-2 font-medium text-white transition duration-[1000] ease-in-out transform bg-gradient-to-r from-[#D268A8] via-[#D268A8] to-[#E3B2CF] rounded-md shadow-inset-light   hover:opacity-70 focus:outline-none overflow-hidden"
                  >
                    <AddMoreIcon2 /> Add Hospital
                    <div className="dot"></div>
                    <span className="absolute top-0 left-0 w-8 h-full bg-white opacity-0 animate-shinyBtn"></span>
                  </button>
                )}

                <Button
                  className="flex gap-x-3 !bg-[#D876A94D] !h-[38px] !text-[#C967A2] !p-1.55 !font-medium shadow-none"
                  variant="contained"
                >
                  <ExportIcon /> Export Table
                </Button>
              </Box>
            </Box>
          </Box>
          {/* //button */}
          {/* <Box className=""></Box> */}
        </Box>
        <Box className="md:mt-[0px] last-bar-grid">
          {/* <Box> */}
          <Box className="grid-container">
            <Box className="status-grid">
              <SummaryBox
                onClick={() => handleFilterClick('status', 'active')}
                isActive={activeFilter.status === 'active'}
                name="Active"
                small
                count={summarys.summary?.activeHospitals}
                icon={<ActiveIcon />}
              />
              <SummaryBox
                onClick={() => handleFilterClick('status', 'pendingapproval')}
                isActive={activeFilter.status === 'pendingapproval'}
                name="Pending"
                small
                count={summarys.summary?.pendingHospitals}
                icon={<PendingIcon />}
              />

              <SummaryBox
                onClick={() => handleFilterClick('status', 'deleted')}
                isActive={activeFilter.status === 'deleted'}
                name="Deleted"
                small
                count={summarys.summary?.deletedHospitals}
                icon={<DeleteIcon2 />}
              />

              <SummaryBox
                onClick={() => handleFilterClick('status', 'expired')}
                isActive={activeFilter.status === 'expired'}
                name="Expired"
                small
                count={summarys.summary?.expiredHospitals}
                icon={<ExpiredIcon />}
              />
            </Box>
            <Box className="organ-grid">
              <SummaryBox
                onClick={() => handleFilterClick('organ', 'kidney')}
                isActive={activeFilter.organ === 'kidney'}
                name="Kidney"
                small
                count={organsSummary.organsSummary?.kidney}
                icon={<img src={KindneyImg} alt="" className="md:w-[30px] md:h-[30px]" />}
              />
              <SummaryBox
                onClick={() => handleFilterClick('organ', 'heart')}
                isActive={activeFilter.organ === 'heart'}
                name="Heart"
                small
                count={organsSummary.organsSummary?.heart}
                icon={<img src={HeartImg} alt="" className="md:w-[30px] md:h-[30px]" />}
              />
              <SummaryBox
                onClick={() => handleFilterClick('organ', 'liver')}
                isActive={activeFilter.organ === 'liver'}
                name="Liver"
                small
                count={organsSummary.organsSummary?.liver}
                icon={<img src={LiverImg} alt="" className="md:w-[30px] md:h-[30px]" />}
              />
              <SummaryBox
                onClick={() => handleFilterClick('organ', 'Dual lungs')}
                isActive={activeFilter.organ === 'Dual lungs'}
                name="Lung"
                small
                count={organsSummary.organsSummary?.lungs}
                icon={<img src={LungImg} alt="" className="md:w-[30px] md:h-[30px]" />}
              />
              <SummaryBox
                onClick={() => handleFilterClick('organ', 'pancreas')}
                isActive={activeFilter.organ === 'pancreas'}
                name="Pancreas"
                small
                count={organsSummary.organsSummary?.kidney}
                icon={<img src={PancreasImg} alt="" className="md:w-[30px] md:h-[30px]" />}
              />
            </Box>
          </Box>
          {/* </Box> */}
        </Box>
        <Box className="add-button-block">
          <Box className="flex gap-x-[16px] items-center justify-between relative ">
            <CustomSearch
              className="search-field !rounded-[4px] bg-transparent !outline-[1px] !outline-[#D876A9]"
              isLeftSearch
            />
            <Button
              className="export-button flex textResponse gap-x-3 w-full !text-[#C967A2] !p-1.55 shadow-none !rounded-[4px]"
              variant="outlined"
            >
              Export
            </Button>
            <Button
              onClick={handleAddButton}
              className="flex gap-x-3 w-full textResponse add-button  !p-1.55 shadow-none !rounded-[4px]"
              variant="contained"
            >
              Add
            </Button>
          </Box>
        </Box>
      </Box>

      <AddHospital
        open={openHospitalDialog}
        onClose={() => {
          setOpenHospitalDialog(false);
        }}
      />
      <AddLicense
        open={openLicenseDialog}
        onClose={() => {
          setOpenLicenseDialog(false);
        }}
      />
    </>
  );
};

export default HospitalListDashboard;

/**for backup
 * 
 * 
 *       <Box className="w-full">
        <Box className="flex ">
          <Box className="flex w-full gap-4">
            <SummaryBox
              name="All Hospital"
              count={summarys.summary?.allHospitals}
              icon={<HospitalIcon />}
              onClick={() => handleFilterClick('reset', null)}
              isActive={
                (activeFilter.HospitalType || activeFilter.organ || activeFilter.status || activeFilter.zone) === null
              }
            />
            <SummaryBox
              name="Government"
              count={summarys.summary?.governmentHospitals}
              icon={<HospitalIcon />}
              onClick={() => handleFilterClick('HospitalType', 'Government')}
              isActive={activeFilter.HospitalType === 'Government'}
            />
            <SummaryBox
              name="Private"
              count={summarys.summary?.privateHospitals}
              icon={<HospitalIcon />}
              onClick={() => handleFilterClick('HospitalType', 'Private')}
              isActive={activeFilter.HospitalType === 'Private'}
            />
            <SummaryBox
              name="NTORC"
              isNtorc
              count={summarys.summary?.ntorcHospitals}
              icon={<HospitalIcon />}
              onClick={() => handleFilterClick('HospitalType', 'NTORC')}
              isActive={activeFilter.HospitalType === 'NTORC'}
            />
          </Box>
          {/* direction *
      //     <Box className="flex !mx-5 items-center justify-center w-1/8 md:min-w-[80px] h-[80px] relative">
      //       <Box
      //         onClick={() => handleFilterClick('zone', 'west')}
      //         className={`flex items-center justify-center absolute ${activeFilter.zone === 'west' ? 'bg-[#C967A2] text-[#fff]' : 'bg-[#D876A94D] text-[#C967A2]'} rounded-[50%] h-[24px] w-[24px] left-[-0px] shadow-lg cursor-pointer`}
      //       >
      //         <Text className="!font-[500] !text-[13px]">W</Text>
      //       </Box>
      //       <Box
      //         onClick={() => handleFilterClick('zone', 'north')}
      //         className={`flex items-center justify-center absolute ${activeFilter.zone === 'north' ? 'bg-[#C967A2] text-[#fff]' : 'bg-[#D876A94D] text-[#C967A2]'} rounded-[50%] h-[24px] w-[24px] top-[0px]  right-[27px] shadow-lg cursor-pointer`}
      //       >
      //         <Text className="!font-[500] !text-[13px]">N</Text>
      //       </Box>
      //       <Box className="p-[4px]">
      //         <TargetIcon
      //           className="h-[16px] w-[16px] cursor-pointer"
      //           onClick={() => {
      //             if (activeFilter.zone !== null) {
      //               handleFilterClick('zone', null);
      //             }
      //           }}
      //         />
      //       </Box>
      //       <Box
      //         onClick={() => handleFilterClick('zone', 'south')}
      //         className={`flex items-center justify-center w-[24px] h-[24px] absolute ${activeFilter.zone === 'south' ? 'bg-[#C967A2] text-[#fff]' : 'bg-[#D876A94D] text-[#C967A2]'} rounded-[50%] px-1 right-[27px] bottom-[0px] shadow-lg cursor-pointer`}
      //       >
      //         <Text className="!font-[500] !text-[13px]">S</Text>
      //       </Box>
      //       <Box
      //         // handleFilterClick('zone', 'east')
      //         onClick={() => {}}
      //         className="flex items-center justify-center w-[24px] h-[24px] absolute bg-[#6764654d]  rounded-[50%] px-1 right-[0px]   shadow-lg"
      //       >
      //         <Text className="text-[#524e51af] !font-[500] !text-[13px]">E</Text>
      //       </Box>
      //     </Box>
      //     {/* //button *
      //     <Box className="w-1/6 h-[80px]">
      //       <Box className="flex w-full flex-col gap-y-[4px]">
      //         <button
      //           onClick={handleAddButton}
      //           className="flex gap-x-3 items-center justify-center h-[38px] custom-btn btn-11 text-nowrap relative py-2.5  p-2 font-medium text-white transition duration-[1000] ease-in-out transform bg-gradient-to-r from-[#D268A8] via-[#D268A8] to-[#E3B2CF] rounded-md shadow-inset-light   hover:opacity-70 focus:outline-none overflow-hidden"
      //         >
      //           <AddMoreIcon2 /> Add Hospital
      //           <div className="dot"></div>
      //           <span className="absolute top-0 left-0 w-8 h-full bg-white opacity-0 animate-shinyBtn"></span>
      //         </button>
      //         <Button
      //           className="flex gap-x-3 !bg-[#D876A94D] !h-[38px] !text-[#C967A2] !p-1.55 !font-medium shadow-none"
      //           variant="contained"
      //         >
      //           <ExportIcon /> Export Table
      //         </Button>
      //       </Box>
      //     </Box>
      //   </Box>
      //   <Box className="mt-[16px]">
      //     <Box>
      //       <Box className="flex gap-3 w-full items-center justify-between">
      //         <SummaryBox
      //           onClick={() => handleFilterClick('status', 'active')}
      //           isActive={activeFilter.status === 'active'}
      //           name="Active"
      //           small
      //           count={summarys.summary?.activeHospitals}
      //           icon={<ActiveIcon />}
      //         />
      //         <SummaryBox
      //           onClick={() => handleFilterClick('status', 'pendingapproval')}
      //           isActive={activeFilter.status === 'pendingapproval'}
      //           name="Pending"
      //           small
      //           count={summarys.summary?.pendingHospitals}
      //           icon={<PendingIcon />}
      //         />

      //         <SummaryBox
      //           onClick={() => handleFilterClick('status', 'deleted')}
      //           isActive={activeFilter.status === 'deleted'}
      //           name="Deleted"
      //           small
      //           count={summarys.summary?.deletedHospitals}
      //           icon={<DeleteIcon2 />}
      //         />

      //         <SummaryBox
      //           onClick={() => handleFilterClick('status', 'expired')}
      //           isActive={activeFilter.status === 'expired'}
      //           name="Expired"
      //           small
      //           count={summarys.summary?.expiredHospitals}
      //           icon={<ExpiredIcon />}
      //         />
      //         <SummaryBox
      //           onClick={() => handleFilterClick('organ', 'kidney')}
      //           isActive={activeFilter.organ === 'kidney'}
      //           name="Kidney"
      //           small
      //           count={organsSummary.organsSummary?.kidney}
      //           icon={<img src={KindneyImg} alt="" />}
      //         />
      //         <SummaryBox
      //           onClick={() => handleFilterClick('organ', 'heart')}
      //           isActive={activeFilter.organ === 'heart'}
      //           name="Heart"
      //           small
      //           count={organsSummary.organsSummary?.heart}
      //           icon={<img src={HeartImg} alt="" />}
      //         />
      //         <SummaryBox
      //           onClick={() => handleFilterClick('organ', 'liver')}
      //           isActive={activeFilter.organ === 'liver'}
      //           name="Liver"
      //           small
      //           count={organsSummary.organsSummary?.liver}
      //           icon={<img src={LiverImg} alt="" />}
      //         />
      //         <SummaryBox
      //           onClick={() => handleFilterClick('organ', 'Dual lungs')}
      //           isActive={activeFilter.organ === 'Dual lungs'}
      //           name="Lung"
      //           small
      //           count={organsSummary.organsSummary?.lungs}
      //           icon={<img src={LungImg} alt="" />}
      //         />
      //         <SummaryBox
      //           onClick={() => handleFilterClick('organ', 'pancreas')}
      //           isActive={activeFilter.organ === 'pancreas'}
      //           name="Pancreas"
      //           small
      //           count={organsSummary.organsSummary?.kidney}
      //           icon={<img src={PancreasImg} alt="" />}
      //         />
      //       </Box>
      //     </Box>
      //   </Box>
      // </Box>
 */
