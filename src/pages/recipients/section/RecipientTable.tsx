/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, DataTable, Text, ToolTips } from '@/atoms';
import React, { useEffect, useState } from 'react';
import './Style.css';
import {
  CardRemoveIcon,
  FemaleIcon,
  FileUploadIcon,
  InforCircleIcon,
  MaleIcon,
  TransgenderIcon,
  VerifyApprovalIcon,
  ViewIcon
} from '@/assets/icons';
import ActionsCellRenderer from './ActionCellRender';
import CMInsuranceDialog from './CMInsuranceDialog';
import SnoCellRender from './SnoCellRender';
import { Recipient, RecipientApprovalTransferType } from '@/types/recipient';
import { truncateTextByLines } from '@/utils/truncateText';
import { useNavigate } from 'react-router';
import CMInsuranceApprDialog from './CMInsuranceApprDialog';

import { formatDateAndTime } from '@/utils/dateutils';
import { getHospitalTypes } from '@/utils/hospitalTypeutils';
import Countdown from 'react-countdown';
import { Tooltip } from '@mui/material';
import { TableImageSliderDialog } from '@/pages/components/TableImageSlider';
import { useWindowType } from '@/hooks/useWindowType';
import { MobileCardRenderer } from '@/pages/components/MobileCardRender';
import RecipientTableCard from './RecipientTableCard';
import { OrganCellRenderer } from '@/pages/hospitals/section/hospital-table/OrganCellRenderer';
import { usePermissions } from '@/hooks/usePremission';
import { useRole } from '@/hooks/useRole';

interface RecipientListTableProps {
  list: Recipient[] | RecipientApprovalTransferType[];
  isCmInsurance?: boolean;
  isPaymentStatus?: boolean;
  isUnpaid?: boolean;
  isWaitinglist?: boolean;
  isApprove?: boolean;
  isAlf?: boolean;
  isRecipientTranf?: boolean;
}

const zoneTextColor: { [key: string]: { textColor: string } } = {
  W: { textColor: '#80C967' },
  N: { textColor: '#67B1C9' },
  S: { textColor: '#C96767' }
};
const cmInsuranceColor: { [key: string]: { textColor: string } } = {
  Applied: { textColor: '#C88726' },
  NA: { textColor: '#1A0616' },
  Approved: { textColor: '#80C967' },
  Rejected: { textColor: '#DD2323' }
};
const recipientTextColor: { [key: string]: { bgColor: string; textColor: string } } = {
  Draft: { bgColor: '#EDEDED', textColor: '#71717A' },
  'Draft Deleted': { bgColor: '#FFE1E1', textColor: '#DD2323' },
  PendingApproval: { bgColor: '#F4EADA', textColor: '#C88726' },
  Inactive: { bgColor: '#A1999F26', textColor: '#71717A' },
  Deleted: { bgColor: '#FFE1E1', textColor: '#DD2323' },
  Organs: { bgColor: '#E0F0FF', textColor: '#67B1C9' },
  DocumentVerified: { bgColor: '#E0F0FF', textColor: '#67B1C9' },
  Active: { bgColor: '#CFEEBC', textColor: '#027545' },
  'Organs Allocated': { bgColor: '#E0F0FF', textColor: '#67B1C9' }
};

const RecipientTable: React.FC<RecipientListTableProps> = ({
  list = [],
  isCmInsurance = false,
  isPaymentStatus = false,
  isUnpaid = false,
  isApprove = false,
  isAlf = false,
  isRecipientTranf = false,
  isWaitinglist = false
}) => {
  const { isMobile, isSmallLaptop } = useWindowType();
  const { roleID } = useRole();
  const cmInsuranceFilesList: any = list
    .filter((li: any) => li.cmInsuranceDoc !== '')
    .map((li, index) => {
      return {
        ...li,
        serialNumber: index + 1
      };
    });

  const navigate = useNavigate();
  const {
    canRead: canRead5,
    canDelete: canDelete5,
    canApprove: canApprove5,
    canUpdate: canUpdate5
  } = usePermissions(5, roleID);
  const { canRead: canRead13 } = usePermissions(13, roleID);
  const [openCmInsurance, setOpenCmInsurance] = useState(false);
  const [openCmInsuranceApr, setOpenCmInsuranceApr] = useState(false);
  const [selectedData, setSelectedData] = useState<any>();
  const [openSliderView, setOpenSliderView] = useState(false);
  const [currentSerialNumber, setCurrentSerialNumber] = useState<number>(-1);
  const [fontSize, setFontSize] = useState('16px');

  const rowHeight = 74;

  const handleNext = () => {
    if (cmInsuranceFilesList.length === 0) return;
    const nextSerail = currentSerialNumber < cmInsuranceFilesList.length ? currentSerialNumber + 1 : 1;
    setCurrentSerialNumber(nextSerail);
  };
  const handlePrevious = () => {
    if (cmInsuranceFilesList.length === 0) return;
    const previousSerial = currentSerialNumber > 1 ? currentSerialNumber - 1 : cmInsuranceFilesList.length;
    setCurrentSerialNumber(previousSerial);
  };

  const renderer = ({
    days,
    hours,
    minutes,
    seconds,
    completed
  }: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    completed: boolean;
  }) => {
    if (completed) {
      return <span className="text-[#B9585A] text-sm font-medium">00:00:00:00</span>;
    } else {
      // Render a countdown
      return (
        <span className="text-sm font-medium">
          {String(days).padStart(2, '0')}:{String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:
          {String(seconds).padStart(2, '0')}
        </span>
      );
    }
  };

  const rowStyle = {
    display: 'flex',
    // width: '100%',
    alignItems: 'center',
    justifyContent: 'left',
    fontWeight: '400',
    fontSize: fontSize,
    scale: 0.5
  };
  const rowStyleCenter = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '400',
    fontSize: fontSize,
    scale: 0.5
  };

  useEffect(() => {
    const updateFontSize = () => {
      if (window.innerWidth >= 1280 && window.innerWidth < 1600) {
        setFontSize('13px');
      } else {
        setFontSize('16px');
      }
    };

    updateFontSize(); // on mount
    window.addEventListener('resize', updateFontSize);

    return () => window.removeEventListener('resize', updateFontSize);
  }, []);

  const baseColumnDef: any = [
    {
      headerName: 'S.No',
      minWidth: 72,
      maxWidth: 72,
      cellRenderer: ({ data }: { data: Recipient }) => {
        return <SnoCellRender data={data} />;
      },
      cellStyle: rowStyleCenter,
      wrapHeaderText: true,
      autoHeaderHeight: true
    },
    isAlf
      ? {
          headerName: 'ALF ID',
          field: 'id',
          cellStyle: rowStyle,
          wrapHeaderText: true,
          autoHeaderHeight: true
          // minWidth: 80
        }
      : null,
    {
      headerName: 'Transtan ID',
      field: 'transtanId',
      cellStyle: rowStyle,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth: 100
    },
    !isAlf && !isRecipientTranf
      ? {
          headerName: 'Register Date & Time',
          cellRenderer: ({ data }: { data: Recipient }) => {
            const { dateOfRegistration } = data || null;
            const { formattedDate, formattedTime } = formatDateAndTime(dateOfRegistration);
            return (
              <Box>
                <Text className="textResponse">{formattedDate}</Text>
                <Text className="textResponse">{formattedTime}</Text>
              </Box>
            );
          },
          cellStyle: rowStyle,
          wrapHeaderText: true,
          autoHeaderHeight: true,
          minWidth: 140
        }
      : {
          headerName: 'Register Date & Time',
          cellRenderer: ({ data }: { data: RecipientApprovalTransferType }) => {
            const { createdAt } = data || null;

            const { formattedDate, formattedTime } = formatDateAndTime(createdAt);
            console.log('formatted date and time ', formattedDate, formattedTime);

            return (
              <Box>
                <Text>{formattedDate}</Text>
                <Text>{formattedTime}</Text>
              </Box>
            );
          },
          cellStyle: rowStyle,
          wrapHeaderText: true,
          autoHeaderHeight: true,
          minWidth: 120
        },
    !isRecipientTranf && !isAlf
      ? {
          headerName: 'Zonal Rank',
          wrapText: true,
          cellRenderer: ({ data }: { data: Recipient }) => {
            const zone = data.zone?.name?.charAt(0) || '';
            const { currentZoneRank } = data || {};
            const { textColor } = zoneTextColor[zone] || { textColor: 'black' };
            return (
              <Box className="textResponse text-center ">
                <Text
                  className="flex flex-col !text-[16px] !font-[600]"
                  sx={{
                    color: textColor
                  }}
                >
                  {zone || 'NA'}
                </Text>
                <Text className="textResponse">{currentZoneRank}</Text>
              </Box>
            );
          },
          cellStyle: rowStyleCenter,
          wrapHeaderText: true,
          autoHeaderHeight: true,
          minWidth: 80
        }
      : null,
    isRecipientTranf
      ? {
          headerName: 'Recipient Name',
          field: 'recipientName',
          cellStyle: rowStyle,
          wrapHeaderText: true,
          autoHeaderHeight: true,
          minWidth: 140
        }
      : {
          headerName: 'Recipient Name',
          field: 'name',
          cellStyle: rowStyle,
          wrapHeaderText: true,
          autoHeaderHeight: true,
          minWidth: 120
        },
    !isAlf
      ? {
          headerName: ' Blood / Gender / Age ',
          cellRenderer: (parmas: { data: Recipient }) => {
            const { age, bloodGroup, gender } = parmas.data || {};
            console.log('gender form recipient table ', gender);

            return (
              <Box className="flex gap-[8px] h-[40px] items-center  w-full">
                <Text className="text-[#C83926] !text-[14px] !font-[700]">{bloodGroup?.name}</Text>
                <Box>
                  {gender?.name === 'Female' ? <FemaleIcon /> : ''}
                  {gender?.name === 'Male' ? <MaleIcon /> : ''}
                  {gender?.name === 'TransGender' ? <TransgenderIcon /> : ''}
                </Box>
                <Text
                  className={` px-[3px] py-[1px] rounded-[4px] text-center !text-[13px] !font-[600] ${age <= 20 ? 'bg-[#67B1C9] text-[white]' : age >= 60 ? 'bg-[#C96767] text-[white]' : 'text-[black]'}`}
                >
                  {age}
                </Text>
              </Box>
            );
          },
          cellStyle: rowStyle,
          wrapHeaderText: true,
          autoHeaderHeight: true,
          minWidth: 130
        }
      : null,
    !isRecipientTranf
      ? {
          headerName: 'Status',
          cellRenderer: ({ data }: { data: Recipient }) => {
            const recipientStatus = data.status && data.status.trim();
            const { bgColor, textColor } = recipientTextColor[recipientStatus] || {
              bgColor: '#FFE1E1',
              textColor: '#dd2323'
            };
            const DateVal = new Date(data.activationDate);
            return (
              <Box
                className={`flex items-center gap-2 ${recipientStatus === 'PendingApproval' ? 'flex-col relative' : ''}`}
              >
                <Box className="mt-3">
                  <Box className="flex gap-2">
                    <Text
                      className="rounded-lg"
                      sx={{
                        color: textColor,
                        backgroundColor: bgColor,
                        borderRadius: '8px',
                        padding: '0px 8px',
                        fontSize: '11px',
                        fontWeight: '500'
                      }}
                    >
                      {recipientStatus === 'PendingApproval'
                        ? 'Pending Approval'
                        : recipientStatus === 'DocumentVerified'
                          ? 'Document Verified'
                          : recipientStatus === 'ChangeRequest'
                            ? 'Change Request'
                            : recipientStatus}
                    </Text>
                    {(recipientStatus === 'Deleted' ||
                      recipientStatus === 'Inactive' ||
                      recipientStatus === 'ChangeRequest' ||
                      recipientStatus === 'Active' ||
                      recipientStatus === 'DocumentVerified') && (
                      <ToolTips
                        title={data?.reason}
                        arrow
                        placement="top"
                        sx={{
                          '& .MuiTooltip-tooltip': {
                            backgroundColor: 'black',
                            color: 'white',
                            fontSize: '12px',
                            borderRadius: '8px',
                            padding: '8px'
                          },
                          '& .MuiTooltip-arrow': {
                            color: 'black'
                          }
                        }}
                      >
                        <Box className="">
                          <InforCircleIcon />
                        </Box>
                      </ToolTips>
                    )}
                  </Box>
                  {data.activationDate && (
                    <Box className="text-left">
                      <Countdown date={DateVal} renderer={renderer} />
                    </Box>
                  )}
                </Box>
              </Box>
            );
          },
          cellStyle: rowStyle,
          wrapHeaderText: true,
          autoHeaderHeight: true,
          minWidth: 150
        }
      : null,
    {
      headerName: 'Hospital Name',
      cellRenderer: ({ data }: { data: Recipient }) => {
        const { hospital, hospitalType } = data;
        console.log('hospitals from recipient table ', hospital);
        const truncateHospital = isRecipientTranf ? '' : truncateTextByLines(hospital?.name ?? 'NA', 2, 10);
        const formateHospitalType = isWaitinglist ? '' : isRecipientTranf ? '' : getHospitalTypes(hospitalType?.name);
        return (
          <Box className="flex w-[100%] gap-2 justify-between">
            <Box>
              <Text
                title={hospital?.name ?? 'NA'}
                className="line-clamp-2 max-w-[200px] textResponse overflow-hidden break-words"
                style={{
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2,
                  whiteSpace: 'normal'
                }}
              >
                {truncateHospital}
              </Text>
            </Box>

            <Box className="relative ml-2">
              <Text
                className={`absolute textResponse !font-medium ${!isWaitinglist && hospitalType?.name === 'Private' ? 'text-[#C88726]' : 'text-[#008774]'} top-0 right-0 !text-sm`}
              >
                {formateHospitalType}
              </Text>
            </Box>
          </Box>
        );
      },
      cellStyle: rowStyle,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth: 150
    },
    !isRecipientTranf
      ? {
          headerName: 'Organ Requested',
          //minWidth: 200,
          cellRenderer: (params: any) => {
            const { organs } = params?.data || {};
            return (
              <Box>
                <OrganCellRenderer organs={organs ?? []} column={params.column} api={params.api} />
              </Box>
            );
          },
          cellStyle: rowStyle,
          wrapHeaderText: true,
          autoHeaderHeight: true,
          minWidth: 130
        }
      : {
          headerName: 'Organ Requested',
          //minWidth: 200,
          cellRenderer: ({ data }: { data: RecipientApprovalTransferType }) => {
            const organs = data?.organMappings
              ?.map((organ: { organId: { toString: () => string } }) => organ.organId.toString().trim() || 'NA')
              .join(', ');
            return (
              <Box>
                <Text
                  title={organs ?? 'NA'}
                  className="line-clamp-2 max-w-[200px] overflow-hidden break-words"
                  style={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                    whiteSpace: 'normal'
                  }}
                >
                  {(!isWaitinglist || !isRecipientTranf) && truncateTextByLines(organs, 2, 10)}
                </Text>
              </Box>
            );
          },
          cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
          wrapHeaderText: true,
          autoHeaderHeight: true,
          minWidth: 130
        },
    isRecipientTranf
      ? {
          headerName: 'Transfer Reg. Date',
          cellRenderer: ({ data }: { data: RecipientApprovalTransferType }) => {
            const { transferRegDate } = data || null;
            const { formattedDate, formattedTime } = formatDateAndTime(transferRegDate);
            if (!formattedDate || !formattedTime) {
              return (
                <Box>
                  <Text>{transferRegDate}</Text>
                </Box>
              );
            }
            return (
              <Box>
                <Text>{formattedDate}</Text>
                <Text>{formattedTime}</Text>
              </Box>
            );
          },
          cellStyle: rowStyle,
          wrapHeaderText: true,
          autoHeaderHeight: true,
          minWidth: 130
        }
      : null,
    isRecipientTranf
      ? {
          headerName: 'Transferring  Hospital Name',
          //minWidth: 200,
          cellRenderer: ({ data }: { data: RecipientApprovalTransferType }) => {
            const { transferringHospital } = data;
            console.log('hospitals from recipient table ', transferringHospital);
            const truncateHospital = truncateTextByLines(transferringHospital?.name ?? 'NA', 2, 10);
            return (
              <>
                <Box className="relative">
                  <Text
                    title={transferringHospital?.name ?? 'NA'}
                    className="line-clamp-2 max-w-[200px] overflow-hidden break-words"
                    style={{
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 2,
                      whiteSpace: 'normal'
                    }}
                  >
                    {truncateHospital}
                  </Text>
                </Box>
              </>
            );
          },
          cellStyle: rowStyle,
          wrapHeaderText: true,
          autoHeaderHeight: true,
          minWidth: 130
        }
      : null,

    isCmInsurance && !isAlf
      ? {
          headerName: 'CM Insurance',
          cellRenderer: ({ data }: { data: Recipient }) => {
            const cmInsurance = data.cmInsurance?.name && data.cmInsurance?.name.trim();
            const { textColor } = cmInsuranceColor[cmInsurance] || { textColor: 'black' };
            return (
              <Box className=" text-center ">
                <Text
                  className="flex items-center gap-2 textResponse !font-[400]"
                  sx={{
                    color: textColor
                  }}
                >
                  {cmInsurance}
                  {(cmInsurance === 'Approved' || cmInsurance === 'Rejected' || cmInsurance === 'Applied') && (
                    <>
                      <Tooltip
                        title={data?.cmInsuranceNote || ''}
                        arrow
                        placement="top"
                        sx={{
                          '& .MuiTooltip-tooltip': {
                            backgroundColor: 'black',
                            color: 'white',
                            fontSize: '14px',
                            borderRadius: '8px',
                            padding: '8px'
                          },
                          '& .MuiTooltip-arrow': {
                            color: 'black'
                          }
                        }}
                      >
                        <Box>
                          <InforCircleIcon />
                        </Box>
                      </Tooltip>
                      <ViewIcon
                        onClick={() => {
                          // setFile(data.cmInsuranceDoc);
                          // setOpenImgModal(true);
                          setCurrentSerialNumber(data?.serialNumber);
                          setOpenSliderView(true);
                        }}
                      />
                    </>
                  )}

                  {cmInsurance === 'To be Applied' || cmInsurance === 'Rejected' ? (
                    <FileUploadIcon
                      isPink={true}
                      className="h-[16px] w-[16px]"
                      onClick={() => {
                        setOpenCmInsurance(true);
                        setSelectedData(data);
                      }}
                    />
                  ) : (
                    ''
                  )}
                </Text>
              </Box>
            );
          },
          cellStyle: rowStyle,
          wrapHeaderText: true,
          autoHeaderHeight: true,
          minWidth: 150
        }
      : null,
    isAlf
      ? {
          headerName: 'Category',
          field: 'recipientName',
          cellStyle: rowStyle,
          wrapHeaderText: true,
          autoHeaderHeight: true
          //minWidth: 200
        }
      : null,
    {
      headerName: 'Phone Number',
      cellRenderer: ({ data }: { data: Recipient }) => {
        const { phoneNumber, countryCode1 } = data || {};
        return (
          <Box>
            <Text className="textResponse">
              {countryCode1 === null ? 91 : countryCode1} {phoneNumber}
            </Text>
          </Box>
        );
      },
      cellStyle: rowStyle,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth: 130
    },
    isPaymentStatus
      ? {
          headerName: 'Payment Status',
          cellRenderer: ({ data }: { data: Recipient }) => {
            return (
              <Box className="">
                <Text
                  className="flex items-center gap-2"
                  sx={{
                    color: '#C96767'
                  }}
                >
                  <CardRemoveIcon /> {!data.isPaymentCompleted && 'UnPaid'}
                </Text>
              </Box>
            );
          },
          cellStyle: rowStyle,
          wrapHeaderText: true,
          autoHeaderHeight: true,
          minWidth: 150
        }
      : null,
    {
      headerName: 'Actions',
      pinned: 'right',
      maxWidth: 100,
      cellRenderer: (data: any) => (
        <>
          {(isApprove && !isCmInsurance && !isRecipientTranf) || isAlf ? (
            <VerifyApprovalIcon
              className="cursor-pointer"
              onClick={() => {
                navigate(`/recipients/${data?.data?.recipientId}/view`, {
                  state: {
                    isApproval: true,
                    onlyView: true,
                    origin: `approvals`,
                    tab: `${location.hash}`,
                    filter: `${location.search}`
                  }
                });
              }}
            />
          ) : isApprove && isCmInsurance ? (
            <VerifyApprovalIcon
              className="cursor-pointer"
              onClick={() => {
                setOpenCmInsuranceApr(true);
                setSelectedData(data?.data);
              }}
            />
          ) : isRecipientTranf ? (
            <VerifyApprovalIcon
              className="cursor-pointer"
              onClick={() => {
                navigate(`/recipients/view-recipient-transfer`, {
                  state: {
                    isRecipientTranf: true,
                    origin: `approvals`,
                    tab: `${location.hash}`,
                    filter: `${location.search}`
                  }
                });
              }}
            />
          ) : (
            <>
              <ActionsCellRenderer
                isWaitinglist={isWaitinglist}
                data={data?.data}
                isUnpaid={isUnpaid}
                canRead={canRead5}
                canDelete={canDelete5}
                canApprove={canApprove5}
                canUpdate={canUpdate5}
                canRead13={canRead13}
              />
            </>
          )}
        </>
      ),
      cellStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '400',
        fontSize: '16px'
      }
    }
  ].filter((colDef) => colDef !== null);
  return (
    <Box>
      {!isMobile ? (
        <DataTable
          popupParent={document.body}
          gridOptions={{
            suppressCellFocus: true
          }}
          rowData={list}
          columnDefs={baseColumnDef}
          rowHeight={isSmallLaptop ? 60 : rowHeight}
          // headerHeight={60}
        />
      ) : (
        <Box className="!mb-10">
          <MobileCardRenderer
            list={list}
            renderCard={(item) => (
              <RecipientTableCard
                key={item.id}
                data={item}
                isApprove={isApprove}
                isCmInsurance={isCmInsurance}
                isRecipientTranf={isRecipientTranf}
                isAlf={isAlf}
                isWaitinglist={isWaitinglist}
                isUnpaid={isUnpaid}
                setCurrentSerialNumber={setCurrentSerialNumber}
                setOpenSliderView={setOpenSliderView}
                setOpenCmInsurance={setOpenCmInsurance}
                setSelectedData={setSelectedData}
                renderer={renderer}
                setOpenCmInsuranceApr={setOpenCmInsuranceApr}
              />
            )}
          />
        </Box>
      )}

      <CMInsuranceDialog
        open={openCmInsurance}
        onClose={() => setOpenCmInsurance(false)}
        recipientData={selectedData}
      />
      <CMInsuranceApprDialog
        open={openCmInsuranceApr}
        onClose={() => setOpenCmInsuranceApr(false)}
        cmInsuranceData={selectedData}
      />
      {/* <FileViewModal open={openImgModal} onClose={() => setOpenImgModal(false)} file={file} /> */}
      <TableImageSliderDialog
        open={openSliderView}
        onClose={() => {
          setOpenSliderView(false);
          setCurrentSerialNumber(-1);
        }}
        document={cmInsuranceFilesList?.find((item: any) => item.serialNumber === currentSerialNumber)?.cmInsuranceDoc}
        currentPosition={currentSerialNumber}
        onNext={handleNext}
        onPrevious={handlePrevious}
        totalItems={cmInsuranceFilesList?.length}
      />
    </Box>
  );
};

export default RecipientTable;
