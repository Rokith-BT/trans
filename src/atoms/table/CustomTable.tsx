// src/components/CustomTable.tsx
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import {
  ArrowDown2,
  DangerIcon,
  DeleteIcon,
  EditIcon,
  EyePink,
  FlagIcon,
  PhoneIcon,
  PlayIcon,
  VerifyIcon
} from '@/assets/icons';
import HeartImg from '@/assets/imgs/heart.png';
import LungsImg from '@/assets/imgs/lungs.png';
import KidneyImg from '@/assets/imgs/kidney.png';
import LiverImg from '@/assets/imgs/liver.png';
import PancreasImg from '@/assets/imgs/pancreas.png';
import HandImg from '@/assets/imgs/hand.png';
import BoneImg from '@/assets/imgs/bone.png';
import sampleLicense from '@/assets/imgs/organ_license.png';

import { styled } from '@mui/system';
import { Text } from '../text';
import { useNavigate } from 'react-router';
import { MenuItem, Pagination, Select, Stack } from '@mui/material';
import { CustomDialog } from '../dialog';
import { Box } from '../box';
import { Button } from '../button';

interface Column {
  id: string;
  label: string;
  align?: 'right' | 'left' | 'center';
}

interface DataRow {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface CustomTableProps {
  columns: Column[];
  rows: DataRow[];
  paginationPosition?: 'top' | 'bottom';
  extras?: React.ReactNode[];
}

const TopPaginationContainer = styled('div')({
  display: 'flex',
  justifyContent: 'end',
  alignItems: 'center',
  padding: '16px',
  border: 'none',
  position: 'absolute',
  right: '-1%',
  top: '-70px'
});
const BottomPaginationContainer = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px',
  border: 'none'
});

const RowsPerPageContainer = styled('div')({
  display: 'flex',
  alignItems: 'center'
});

const CustomSelect = styled(Select)({
  marginLeft: '8px',
  marginRight: '16px',
  color: '#C967A2',
  fontSize: '16px',
  '& .MuiSelect-select': {
    padding: '2px',
    textDecoration: 'none',
    listStyle: 'none'
  },

  '&:before': {
    borderBottom: 'none'
  },
  '&:after': {
    borderBottom: 'none'
  },
  '&:hover': {
    border: 'none',
    borderBottom: 'none'
  },
  '& .MuiSvgIcon-root': {
    color: '#C967A2'
  },
  backgroundColor: '#D876A94D',
  borderRadius: '4px',
  '& .MuiSelect-icon': {
    top: 'calc(65% - 12px)', // Adjust icon vertical position if needed
    right: '8px'
  }
});
const CustomPagination = styled(Pagination)(() => ({
  '& .MuiPaginationItem-root': {
    color: '#C967A2', // Custom color for other pages
    borderColor: 'none', // Custom border color for other pages

    fontWeight: '700',
    fontSize: '16px'
  },
  '& .MuiPaginationItem-page.Mui-selected': {
    color: '#C967A2', // Custom color for active page
    backgroundColor: '#D876A94D', // Custom background color for active page
    borderColor: 'none' // Custom border color for active page
  },
  '& .MuiPaginationItem-page:hover': {
    backgroundColor: '#D876A94D' // Custom background color on hover
  },
  '& .MuiPaginationItem-rounded': {
    borderRadius: '8px' // Rounded shape for pagination items
  },
  '& .MuiPaginationItem-icon': {
    borderRadius: '50%', // Rounded shape for page change icons
    border: 'none',
    // Custom border for page change icons
    padding: '0px' // Optional padding for page change icons
  }
}));

const CustomTableHead = styled(TableHead)({
  borderBottom: '1.6px solid #80459580' // Custom border color and thickness
});

const CustomTableContainer = styled(TableContainer)({
  boxShadow: 'none' // Remove box shadow
});
const imageMapping: { [key: string]: string } = {
  heart: HeartImg,
  bone: BoneImg,
  lungs: LungsImg,
  kidney: KidneyImg,
  pancreas: PancreasImg,
  liver: LiverImg,
  hand: HandImg
};

export const CustomTable: React.FC<CustomTableProps> = ({ columns, rows, paginationPosition = 'bottom' }) => {
  const [page, setPage] = React.useState(1); // Note: Pagination component uses 1-based index
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1); // Reset to first page
  };

  const paginatedRows = rows.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const navigate = useNavigate();

  const renderImageIfContainsKeyword = (cellValue: string) => {
    const key = "ntorc's";
    if (cellValue.toLowerCase().includes(key)) {
      return (
        <span className="flex items-center gap-x-3">
          {cellValue} <FlagIcon />
        </span>
      );
    }

    for (const [keyword, image] of Object.entries(imageMapping)) {
      if (cellValue.toLowerCase().includes(keyword)) {
        return (
          <span className="flex items-center">
            <img src={image} alt={keyword} className="w-6 h-6 mr-2" />
            {cellValue}
          </span>
        );
      }
    }
    return cellValue;
  };
  const getRandomDoctorText = () => {
    const texts = ['Surgeon', 'Consultant'];
    return texts[Math.floor(Math.random() * texts.length)];
  };

  // for contact info dialog
  const [openPhoneDialog, setOpenPhoneDialog] = React.useState(false);

  const handleOpenPhone = () => {
    setOpenPhoneDialog(true);
  };
  const handleClosePhone = () => {
    setOpenPhoneDialog(false);
  };

  // for organ click dialog

  const [openOrganDialog, setOpenOrganDialog] = React.useState(false);

  const handleOpenOrgan = () => {
    setOpenOrganDialog(true);
  };
  const handleCloseOrgan = () => {
    setOpenOrganDialog(false);
  };

  // for view click dialog
  const [openViewDialog, setOpenViewDialog] = React.useState(false);

  const handleOpenView = () => {
    setOpenViewDialog(true);
  };
  const handleCloseView = () => {
    setOpenViewDialog(false);
  };

  // for delete dialog
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const handleOpenDelete = () => {
    setOpenDeleteDialog(true);
  };
  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
  };

  const phoneColumns = [
    { id: 'sno', label: 'S.No' },
    { id: 'name', label: 'Name' },
    { id: 'pn', label: 'Phone Number' },
    { id: 'emaill', label: 'Email' },
    { id: 'organs', label: 'Organ' },
    { id: 'ct', label: 'Contact Type' }
  ];

  const phoneRows = [
    {
      sno: '1',
      name: 'Praveen',
      pn: '9500915939',
      emaill: 'abc@gmail.com',
      organs: 'Heart',
      ct: 'Hospital'
    }
  ];

  //for navigate the edit icon
  const navigate2 = useNavigate();
  const handlenavigation = () => {
    navigate2('/hospitals/add-hospital');
  };

  return (
    <Paper className="border-none relative ">
      {paginationPosition === 'top' && rows.length > 3 && (
        <TopPaginationContainer className="">
          <RowsPerPageContainer>
            <span className="text-[#c967a2] !font-medium !text-[13px]">
              Rows per page
            </span>
           
            <CustomSelect
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              variant="standard"
              disableUnderline
              IconComponent={ArrowDown2}
            >
              {[5, 10, 25, 100].map((rowsPerPageOption) => (
                <MenuItem key={rowsPerPageOption} value={rowsPerPageOption}>
                  <span className="pl-1">{rowsPerPageOption}</span>
                </MenuItem>
              ))}
            </CustomSelect>
          </RowsPerPageContainer>
          <Stack spacing={2}>
            <CustomPagination
              count={Math.ceil(rows.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              variant="outlined"
              color="primary"
              shape="rounded"
            />
          </Stack>
        </TopPaginationContainer>
      )}
      <CustomTableContainer className=" !border-[#80459580] !border-b-0  !border-[0.5px] rounded-lg">
        <Table stickyHeader className="min-w-full !rounded-lg">
          <CustomTableHead className=" !m-0">
            <TableRow className="!text-[16px] !text-[#1A0616] !bg-[#80459526] !font-[500]">
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || "left"}
                  className="px-6 py-3 text-left text-lg !font-bold !text-[#804595] !bg-[#80459526]  tracking-wider"
                >
                  {<>{column.label}</>}
                </TableCell>
              ))}
            </TableRow>
          </CustomTableHead>
          <TableBody className="bg-white  !border-[#80459580]">
            {paginatedRows.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="hover:bg-[#C8E4FF]">
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || 'left'}
                    className="px-6 !py-5 whitespace-nowrap  !text-[16px] !font-[400] !border-[#80459580] text-gray-900"
                  >
                    {column.id === 'organs' ? (
                      <Text component={'span'} className="cursor-pointer" onClick={handleOpenOrgan}>
                        {renderImageIfContainsKeyword(row[column.id])}
                      </Text>
                    ) : column.id === 'notify' && Array.isArray(row[column.id]) ? (
                      row[column.id].map((item: string, index: number) => (
                        <React.Fragment key={index}>
                          {item}
                          <br />
                        </React.Fragment>
                      ))
                    ) : column.id === 'email' || column.id === 'mobile' || column.id === 'web' ? (
                      <Checkbox checked={row[column.id] > 0} />
                    ) : column.id === 'action' ? (
                      <>
                        <EditIcon className="cursor-pointer mr-2" />
                      </>
                    ) : column.id === 'action2' ? (
                      <Text component={'span'} className="flex">
                        <EditIcon className="cursor-pointer mr-3" onClick={handlenavigation} />
                        <DeleteIcon className="cursor-pointer mr-3 " onClick={handleOpenDelete} />
                        {row.status === 'Pending Approval' && <VerifyIcon className="cursor-pointer" />}
                      </Text>
                    ) : column.id === 'hospitalname' ? (
                      <Text component={'span'} className="flex items-center  justify-between pr-3 cursor-pointer">
                        <Text component={'span'} onClick={() => navigate('/hospitals/hospital-dashboard')}>
                          {row[column.id]}
                        </Text>
                        <Text component={'span'} onClick={handleOpenPhone}>
                          <PhoneIcon />
                        </Text>
                      </Text>
                    ) : column.id === 'pendingupdate' ? (
                      <Text
                        className={`${row.pendingupdate === 'Update Details' ? 'text-[#C96767]' : 'text-[#67B1C9]'}`}
                      >
                        {row[column.id]}
                      </Text>
                    ) : column.id === 'status' ? (
                      <Text
                        component={'span'}
                        className={`px-2 rounded-[20px] ${
                          row.status === 'Inactive'
                            ? 'bg-[#FFE1E1] text-[#D32F2F]  '
                            : // : row.status === "Expired"
                              //   ? "bg-[#A1999F] text-white px-2"
                              row.status === 'Deleted' || row.status === 'Expired'
                              ? 'bg-[#FFE1E1] text-[#DD2323] '
                              : // : // : row.status === "Pending Approval"
                                //   ? "bg-[#67B1C9] text-white"
                                // row.status === "Pending"
                                // ? "bg-[#C9A267] text-white  "
                                row.status === 'Details Pending' ||
                                  row.status === 'Pending Approval' ||
                                  row.status === 'Pending'
                                ? 'bg-[#EEDABC] text-[#C88726] '
                                : 'bg-[#CFEEBC] text-[#027545] '
                        } font-base p-1 px-1 rounded-lg`}
                      >
                        {row[column.id]}
                      </Text>
                    ) : column.id === 'dms' || column.id === 'licienceexpiry' || column.id === 'transtant' ? (
                      <div className="flex items-center ">
                        {row[column.id]}
                        <Text component={'span'} className="flex items-center" onClick={handleOpenView}>
                          <EyePink className="cursor-pointer ml-2" />
                        </Text>
                      </div>
                    ) : column.id === 'rewoke' ? (
                      <div className="flex items-center ">
                        {row[column.id]}
                        <span className="cursor-pointer">
                          <span className="underline text-[#804595]">Revoke</span> &nbsp;{' '}
                          <span className="underline text-[#C967A2]">Renew</span>
                        </span>
                      </div>
                    ) : column.id === 'led' ? (
                      <div className="flex items-center">
                        {row[column.id]}
                        <DangerIcon className="ml-2" />
                      </div>
                    ) : column.id === 'role' && row.role === 'Doctor' ? (
                      <div className="flex flex-col ">
                        <span> {row[column.id]}</span>
                        <span className="text-[13px] font-[400] text-[#A1999F]">{getRandomDoctorText()}</span>
                      </div>
                    ) : (
                      row[column.id]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CustomTableContainer>
      {paginationPosition === 'bottom' && rows.length > 3 && (
        <BottomPaginationContainer className="">
          <RowsPerPageContainer>
            <span className="text-[#C967A280] font-medium text-base">Rows per page:</span>
            <CustomSelect value={rowsPerPage} onChange={handleChangeRowsPerPage} variant="standard" disableUnderline>
              {[5, 10, 25, 100].map((rowsPerPageOption) => (
                <MenuItem key={rowsPerPageOption} value={rowsPerPageOption}>
                  {rowsPerPageOption}
                </MenuItem>
              ))}
            </CustomSelect>
          </RowsPerPageContainer>
          <Stack spacing={2}>
            <CustomPagination
              count={Math.ceil(rows.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              variant="outlined"
              color="primary"
              shape="rounded"
            />
          </Stack>
        </BottomPaginationContainer>
      )}
      <CustomDialog onClose={handleClosePhone} open={openPhoneDialog} maxWidth="md" title="" actions={<></>}>
        <Box className="px-5 pb-4">
          <Text className="!text-[23px] !text-[#804595] !font-[600] ">Contact List</Text>
          <Text className="!text-[#C967A2] !text-[16px] !mb-2 !font-[600]">Hospital Name</Text>
          <CustomTable columns={phoneColumns} rows={phoneRows} extras={[]} />
        </Box>
      </CustomDialog>
      <CustomDialog open={openOrganDialog} onClose={handleCloseOrgan} title="" maxWidth="md" actions={<></>}>
        <Box>
          <Box className="px-5 pb-4">
            <Text className="!text-[23px] !text-[#804595] !font-[600] ">Organ List</Text>
            <Text className="!text-[#C967A2] !text-[16px] !mb-2 !font-[600]">Hospital Name</Text>
            <CustomTable columns={phoneColumns} rows={phoneRows} extras={[]} />
          </Box>
        </Box>
      </CustomDialog>
      <CustomDialog title="" open={openViewDialog} onClose={handleCloseView} actions={<></>}>
        <Box>
          <Box className="px-5 pb-4">
            <Text className="!text-[23px] !text-[#804595] !font-[600] !mb-5  ">License View</Text>

            <Box className="flex items-center">
              <PlayIcon className="cursor-pointer" />
              <Box>
                <img src={sampleLicense} alt="" />
              </Box>
              <PlayIcon className="rotate-180 cursor-pointer" />
            </Box>
          </Box>
        </Box>
      </CustomDialog>
      <CustomDialog title="" open={openDeleteDialog} onClose={handleCloseDelete} actions={<></>}>
        <Box>
          <Box className="">
            <Text className="!text-[16px] !text-[#A1999F] !font-[600] !mb-5  ">
              Are you sure, Do you want to
              <span className="text-red-600"> Delete</span>?
            </Text>
            <Text className="text-center !text-[#1A0616] !text-[16px] !font-[600]">
              Government Villupuram Medical College, <br /> Villupuram
            </Text>
            <Box className="flex justify-center gap-5 mt-7">
              <Button variant="contained" className="!bg-[#A1999F] !w-[82px] !h-[32px] !text-white !rounded">
                No
              </Button>
              <Button variant="contained" className="!bg-[#DA2424] !w-[82px] !h-[32px] !text-white !rounded">
                Yes
              </Button>
            </Box>
          </Box>
        </Box>
      </CustomDialog>
    </Paper>
  );
};

