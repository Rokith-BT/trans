/* eslint-disable no-unused-vars */
import {
  CityWorkerIcon,
  DoctorMaleIcon,
  EditPencilIcon,
  ExportIcon,
  EyeHideIcon,
  EyeIcon,
  HospitalizedIcon,
  Maximize,
  SlingIcon
} from '@/assets/icons';
import { Box, Button, Pagination, Tabbar, TabItem, Text } from '@/atoms';
import { useEffect, useState } from 'react';
import PageSizeOptions from '@/data/pageSizeOptions.json';
import '../Styles.css';
import { FilterIcon } from '@/assets/icons/Filter';
import { createSearchParams, useLocation, useNavigate, useParams } from 'react-router-dom';
import AddUseDialog from './AddUseDialog';
import { useHospital } from '../hospitalContext';
import QS from 'query-string';
import { Department, Role, UsersTable } from '@/types/common.type';
import { useHospitalId } from '@/hooks/useHospitalID';
import { useRole } from '@/hooks/useRole';
import { FilterOption, GenericFilter } from '@/pages/components/GenericFilter';
import { useMasterData } from '@/pages/settings/setups/masterCotext';
import './OneHospital.scss';
import { formatDateAndTime } from '@/utils/dateutils';
import LicenseTable from './one-hospital-table/license-table';
import UserDataTable from './one-hospital-table/user-table';
import { usePermissions } from '@/hooks/usePremission';

const OneHospital = () => {
  const location = useLocation();
  const { isSuperAdmin, roleID } = useRole();
  console.log(location, 'dkhadhehedh', roleID);
  const { canCreate: canCreateModule2 } = usePermissions(2, roleID);
  const { canCreate: canCreateModule3 } = usePermissions(3, roleID);
  console.log(canCreateModule2, 'sdacsaedce___', canCreateModule3);

  //for hospital id
  const hospitalId = useHospitalId();
  const {
    state: { roles, departments }
  } = useMasterData();
  //for user type

  const basePath = isSuperAdmin ? '/hospitals' : '';
  const {
    state,
    actions: { getHospitalUsers, getOrganLicenses, getOneHospitalSummary }
  } = useHospital();

  const { hospital, hospitalUsers, totalCount, getOrganLicense, oneHospitalSummary } = state;

  useEffect(() => {
    getOneHospitalSummary();
  }, []);

  console.log('summary from onehospital ', oneHospitalSummary, hospital);

  const TabList = [
    {
      label: 'License & Certificates',
      hash: '#license'
    },

    {
      label: 'Users',
      hash: '#users'
    },
    {
      label: 'Deleted Users',
      hash: '#deleted'
    }
  ];

  const activeUsers = hospitalUsers ? hospitalUsers.filter((a: UsersTable) => a.status !== 'Deleted') : [];
  const deletedUsers = hospitalUsers ? hospitalUsers.filter((d: UsersTable) => d.status === 'Deleted') : [];

  const [openFilter, setOpenFilter] = useState(false);
  const [hideDash, setHideDash] = useState(false);
  const [activefilter, setActiveFilter] = useState<FilterOption[]>([]);
  const parsedQS = QS.parse(location.search);
  // const hospitalType = hospital?.basicDetails?.hospitalType?.name;
  const roleOptions = roles.map((r: Role) => ({
    value: r.name,
    label: r.name
  }));
  const departmentOptions = departments.map((r: Department) => ({
    value: r.name,
    label: r.name
  }));
  useEffect(() => {
    const newLocation = {
      ...location
    };
    let searchParams = {
      ...parsedQS
    };
    if (location.hash.trim().length === 0) {
      newLocation.hash = '#license';
    }
    if (location.hash === '#deleted') {
      searchParams = { ...searchParams, 'filter[status]': 'Deleted' };
    } else {
      delete searchParams['filter[status]'];
    }
    if (!parsedQS.page) {
      searchParams = { ...searchParams, page: '1', perPage: '10' };
    }
    if (!parsedQS.perPage) {
      searchParams = { ...searchParams, perPage: '10' };
    }
    newLocation.search = QS.stringify(searchParams);
    navigate(newLocation);
  }, [location.hash]);

  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [userType, setUserType] = useState('');

  const { id } = useParams();
  console.log('id varutha ', id);

  // const handleNavigate = () => {
  //   navigate(`/hospitals/${id}/organlicense`);
  // };

  const toggleDropdwon = () => {
    setOpenDropdown(!openDropdown);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDialog = (userType: string) => {
    if (userType === 'Director' || userType === 'Hospital Admin') {
      navigate(`${basePath}/${hospitalId}/users`, {
        state: {
          existUser: false,
          userType,
          origin: 'hospitals',
          hospitalName: oneHospitalSummary?.name ?? '',
          hospitalId: oneHospitalSummary?.id ?? 0,
          tab: `${location.hash}`,
          filter: location.search
        }
      });
    } else {
      setOpenDialog(true);
      setUserType(userType);
    }
  };

  useEffect(() => {
    if (location.hash === '#users') {
      getHospitalUsers(parsedQS);
    } else if (location.hash === '#license') {
      getOrganLicenses(parsedQS);
    }
  }, [location]);

  const renderTable = () => {
    switch (location.hash) {
      case '#license':
        return <LicenseTable list={getOrganLicense} hospitalName={oneHospitalSummary?.name ?? 'NA'} />;

      case '#users':
        return <UserDataTable isUser={true} list={activeUsers} hospitalName={oneHospitalSummary?.name ?? 'NA'} />;

      case '#deleted':
        return <UserDataTable list={deletedUsers} hospitalName={oneHospitalSummary?.name ?? 'NA'} />;
    }
  };
  //for filter
  const userFilters: Record<string, FilterOption[]> = {
    '#users': [
      { key: 'role', label: 'Role', options: roleOptions, fieldType: 'select' },
      { key: 'specialization', label: 'Specialization', options: departmentOptions, fieldType: 'auto_select' },
      { key: 'experience', label: 'Experience', options: [], fieldType: 'text' },
      { key: 'status', label: 'Status', options: [], fieldType: 'text' }
    ]
  };
  useEffect(() => {
    if (location.hash === '#users' || location.hash === '#deleted') {
      setActiveFilter(userFilters['#users']);
    }
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
  const totalPages = Math.ceil(totalCount / currentPageSize);
  console.log('totalcount ', totalCount);
  console.log('total pages ', totalPages);
  const { formattedDate: firstLicenseRegDate } = formatDateAndTime(oneHospitalSummary?.firstOrganLicenceRegDate);

  return (
    <div>
      <Box
        className={`hospital-summary px-[20px] md:px-[40px] mt-[8px] md:mt-[16px]  ${hideDash ? ' hospital-summary-hide ' : ''} `}
      >
        <Box className="hospital-infra">
          <Box className="hospital-bio custom-box-shadow">
            <Box className=" hospital-details ">
              <Text className="hospital-name">{hospital ? hospital?.basicDetails?.hospitalName : 'NA'}</Text>
              <Text className="transtan-number">TRANSTAN NUMBER : {hospital?.basicDetails?.transtanId ?? 'NA'}</Text>
              <Text className="hospital-since">
                <span className="border-[#804595] rounded-[12px] border-[1px] since-round">
                  Since {oneHospitalSummary ? oneHospitalSummary?.establishedYear : 'NA'}
                </span>
              </Text>
            </Box>
            <Box className="hospital-license">
              <Text className="label">License First Registration</Text>
              <Text className="">
                <span className="custom-box-shadow value">{firstLicenseRegDate ?? 'NA'}</span>
              </Text>
            </Box>
            <Box className="hospital-organ">
              <Text className="label">Number of Organs Expired</Text>
              <Text className="">
                <span className="custom-box-shadow value">{oneHospitalSummary?.totalOrgansExpired}</span>
              </Text>
            </Box>
          </Box>
          {/* hospital red green */}
          <Box className="hospital-red-green">
            <Box
              className={`flex hospital-feature items-center justify-center  ${oneHospitalSummary?.isMedicalCollege ? 'bg-[#CFEEBC] border-[#80C967]' : 'bg-[#FFE1E1]  border-[#C96767]'}  border-[1px] rounded-lg`}
            >
              <Text className="hospital-text">
                Medical College
                {oneHospitalSummary?.isMedicalCollege ? (
                  <EyeIcon className="hospital-eye" />
                ) : (
                  <EyeHideIcon className="hospital-eye" />
                )}
              </Text>
            </Box>
            <Box
              className={`flex hospital-feature items-center justify-center ${oneHospitalSummary?.isTraumaUnitAvailble ? 'bg-[#CFEEBC] border-[#80C967]' : 'bg-[#FFE1E1]  border-[#C96767]'}  border-[1px]  rounded-lg`}
            >
              <Text className="hospital-text">
                Trauma Unit{' '}
                {oneHospitalSummary?.isTraumaUnitAvailble ? (
                  <EyeIcon className="hospital-eye" />
                ) : (
                  <EyeHideIcon className="hospital-eye" />
                )}
              </Text>
            </Box>
            <Box
              className={`flex hospital-feature items-center justify-center ${oneHospitalSummary?.isClinicalEstablishmentAct ? 'bg-[#CFEEBC] border-[#80C967]' : 'bg-[#FFE1E1]  border-[#C96767]'}  border-[1px]  rounded-lg`}
            >
              <Text className="hospital-text">
                Clinical Establishment Act
                {oneHospitalSummary?.isClinicalEstablishmentAct ? (
                  <EyeIcon className="hospital-eye" />
                ) : (
                  <EyeHideIcon className="hospital-eye" />
                )}
              </Text>
            </Box>
            <Box
              className={`flex hospital-feature items-center justify-center ${oneHospitalSummary?.isISONABH ? 'bg-[#CFEEBC] border-[#80C967]' : 'bg-[#FFE1E1]  border-[#C96767]'}  border-[1px]  rounded-lg`}
            >
              <Text className="hospital-text">
                ISO/NABH{' '}
                {oneHospitalSummary?.isISONABH ? (
                  <EyeIcon className="hospital-eye" />
                ) : (
                  <EyeHideIcon className="hospital-eye" />
                )}
              </Text>
            </Box>
          </Box>
        </Box>
        {/* hospital hr */}
        <Box className="hospital-hr ">
          <Box className="doctor-co-ordi">
            <Box className="doctor-box custom-box-shadow ">
              <Box>
                <Text className="resource-total">{oneHospitalSummary?.totalDoctors}</Text>
                <Text className="resource-title">Doctors</Text>
              </Box>
              <DoctorMaleIcon className="resource-icon" />
            </Box>
            <Box className="doctor-box custom-box-shadow">
              <Box className="">
                <Text className="resource-total">{oneHospitalSummary?.totalCaseCoordinators}</Text>
                <Text className="resource-title">Case Co-ordinators</Text>
              </Box>
              <CityWorkerIcon className="resource-icon" />
            </Box>
          </Box>
          <Box className="doctor-co-ordi">
            <Box className="doctor-box custom-box-shadow">
              <Box className="">
                <Text className="resource-total">{oneHospitalSummary?.totalDonors}</Text>
                <Text className="resource-title">Donors</Text>
              </Box>
              &nbsp; &nbsp;
              <Box>
                <Text className="resource-total">{oneHospitalSummary?.totalRecipients}</Text>
                <Text className="resource-title">Recipients</Text>
              </Box>
              <SlingIcon className="resource-icon" />
            </Box>
            <Box className="doctor-box custom-box-shadow">
              <Box>
                <Text className="resource-total">{oneHospitalSummary?.totalBeds ?? 'NA'}</Text>
                <Text className="resource-title">Beds</Text>
              </Box>
              <HospitalizedIcon className="resource-icon" />
            </Box>
          </Box>
        </Box>
        {/* infra */}
      </Box>

      <Box className={`tabbed-paged-actions mt-8 lg:mt-4 ${hideDash ? '!m-0' : ''}`}>
        <Tabbar
          value={location.hash}
          // className="items-center lg:h-[10px] lg:mt-2"
          onChange={(_, newValue) =>
            navigate({ hash: newValue, search: createSearchParams({ page: '1', perPage: '10' }).toString() })
          }
        >
          {TabList.map((item) => (
            <TabItem
              key={item.hash}
              value={item.hash}
              label={item.label}
              // onClick={() => setActiveTab(item.hash)}
              disableRipple
              iconPosition="end"
              icon={
                item.hash === location.hash ? (
                  <Maximize
                    className="h-4 md:h-5"
                    onClick={(e) => {
                      e.preventDefault();
                      setHideDash(!hideDash);
                    }}
                  />
                ) : undefined
              }
              className="!text-[12px] !font-[500] lg:!text-[14px] xl:!text-[16px] xl:!font-[600]"
              style={{
                padding: 0,
                fontWeight: 500,
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

        <Box className="action-buttons">
          <Box className="flex">
            {location.hash != '#deleted' && (
              <Button variant="text" className={`!bg-transparent !text-[19px] !text-[#C967A2] !font-[500] `}>
                {location.hash === '#license' && (
                  <Box className="flex gap-4 items-center">
                    {canCreateModule3 && (
                      <Box
                        className="md:!text-[13px] text-[10px] flex items-center !h-[24px] !text-[#C967A2] !font-[500] bg-[#D876A94D] px-2 py-[10px] rounded"
                        onClick={() => {
                          navigate(`${basePath}/${hospitalId}/organlicense-edit`, {
                            state: {
                              origin: 'hospitals',
                              hospitalId: `${oneHospitalSummary?.id}`,
                              hospitalName: `${oneHospitalSummary?.name}`,
                              tab: `${location.hash}`,
                              filter: location.search
                            }
                          });
                        }}
                      >
                        + Add <span className="hidden sm:block px-1"> Organ</span> Licence
                      </Box>
                    )}
                    {canCreateModule2 && (
                      <Box
                        className="md:!text-[13px] text-[10px] !text-[#C967A2] h-[24px] !font-[500] bg-[#D876A94D] px-2 py-[10px] rounded flex items-center gap-2"
                        onClick={() => {
                          navigate(`${basePath}/${hospitalId}/edit`, {
                            state: {
                              origin: 'hospitals',
                              hospitalId: `${oneHospitalSummary?.id}`,
                              hospitalName: `${oneHospitalSummary?.name}`,
                              tab: `${location.hash}`,
                              filter: location.search
                            }
                          });
                        }}
                      >
                        <>
                          <EditPencilIcon /> Edit Hospital
                        </>
                      </Box>
                    )}
                    <Box className="md:!text-[13px] text-[10px] !text-[#C967A2] h-[24px] !font-[500] bg-[#D876A94D] px-2 py-[10px] rounded flex items-center gap-2">
                      <ExportIcon className="h-[12px] md:h-[16px]" /> Print
                    </Box>
                  </Box>
                )}
                {location.hash === '#users' && canCreateModule2 && (
                  <Box className="flex items-center gap-x-1 md:gap-x-5">
                    <Box className="relative" onClick={toggleDropdwon}>
                      <Text className="md:!text-[13px] !text-[12px] !text-[#C967A2] !font-[500] bg-[#D876A94D] px-1 md:px-2 py-[5px] md:py-[10px] rounded">
                        + Add Users
                      </Text>
                      {openDropdown && (
                        <Box className="flex flex-col absolute z-50 bg-white shadow-2xl shadow-slate-300  p-4 px-6 text-black !text-[16px] gap-y-3 !font-[400] text-left">
                          <Text component={'span'} onClick={() => handleOpenDialog('Director')}>
                            Director
                          </Text>
                          <Text component={'span'} onClick={() => handleOpenDialog('Doctor')}>
                            Doctor
                          </Text>
                          <Text
                            component={'span'}
                            onClick={() => handleOpenDialog('Case Co-ordinators')}
                            className="text-nowrap"
                          >
                            Co-ordinator
                          </Text>
                          <Text
                            component={'span'}
                            onClick={() => handleOpenDialog('Hospital Admin')}
                            className="text-nowrap"
                          >
                            Hospital Admin
                          </Text>
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}
              </Button>
            )}

            {location.hash != '#license' && (
              <Box className="flex items-center gap-2">
                <FilterIcon onClick={() => setOpenFilter(true)} className="cursor-pointer" />
                <ExportIcon className=" md:hidden" />
              </Box>
            )}
          </Box>
          <Box>
            {location.hash != '#license' && (
              <Box className="flex gap-4 items-center">
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
                <ExportIcon className="hidden md:block" />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <Box className="px-[10px] md:px-[40px] mb-2 md:mb-4">{renderTable()}</Box>
      <AddUseDialog
        open={openDialog}
        onClose={handleCloseDialog}
        userType={userType}
        hospitalName={oneHospitalSummary?.name ?? ''}
      />
      {/* <UserFilter isUser={!!(location.hash === '#users')} open={openFilter} onClose={() => setOpenFilter(false)} /> */}
      <GenericFilter
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        filters={activefilter}
        onApply={handleApplyFilters}
      />
    </div>
  );
};

export default OneHospital;
