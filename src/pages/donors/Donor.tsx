import { AddMoreIcon2, CustomTooltip, ExportIcon } from '@/assets/icons';
import { Box, Button, Pagination, Tabbar, TabItem, Text } from '@/atoms';
import { useEffect, useState } from 'react';
import QS from 'query-string';
import { useLocation, useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';
import { FilterIcon } from '@/assets/icons/Filter';
import PageSizeOptions from '@/data/pageSizeOptions.json';
import PotentialTable from './section/PotentialTable';
import { useDonor } from './DonorContext';
import DonorDialog from './section/DonorConsentDialog';
import ConfrimedTable from './section/ConfrimedTable';
import BSCIdentifiedTable from './section/BSCIdentifiedTable';
import CustomSearch from '../components/CustomSearch';

const DONOR_TABS = [
  {
    label: 'PDL',
    hash: '#pdl'
  },
  { label: 'CCD', hash: '#ccd' },
  { label: 'BSD-I', hash: '#bsd_i' },
  { label: 'BSD-NP', hash: '#bsd_np' }
];

const Donor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const parsedQS = QS.parse(location.search);
  console.log(parsedQS, 'parsedQS');
  const [openDialog, setOpenDialog] = useState(false);

  const {
    state: { potensialDonarList, ccdDonarList, bsdiDonarlist, bsdnpDonarList, potensialCount, getDonorStatuses },
    action: { getPotensialDonarList, getDonorStatus }
  } = useDonor();
  console.log(potensialDonarList, 'potensialDonarLis1212t', getDonorStatuses);
  const currentPageSize = parsedQS.perPage ? Number(parsedQS.perPage) : 10;
  const totalPages = Math.ceil(potensialCount / currentPageSize);
  useEffect(() => {
    getDonorStatus();
  }, []);
  useEffect(() => {
    const newLocation = {
      ...location
    };
    let searchParams = {
      ...parsedQS
    };

    if (location.hash.trim().length === 0) {
      newLocation.hash = '#pdl';
    }
    if (!parsedQS.page) {
      searchParams = { ...searchParams, page: '1', perPage: '10' };
    }
    if (!parsedQS.perPage) {
      searchParams = { ...searchParams, perPage: '10' };
    }
    console.log(searchParams, 'searchParams');

    newLocation.search = QS.stringify(searchParams);
    navigate(newLocation, { replace: true });
  }, []);

  useEffect(() => {
    getPotensialDonarList(parsedQS, location.hash);
  }, [location.search, location.hash]);

  const renderTable = () => {
    switch (location.hash) {
      case '#pdl':
        return <PotentialTable list={potensialDonarList} />;
      case '#ccd':
        return <ConfrimedTable list={ccdDonarList} />;
      case '#bsd_i':
        return <BSCIdentifiedTable list={bsdiDonarlist} />;
      case '#bsd_np':
        return <PotentialTable list={bsdnpDonarList} />;
    }
  };

  return (
    <Box>
      <Box mt={2} className="flex items-center justify-between">
        <Text className="!text-[#804595] !text-[23px] !font-[600]">Manage Donor</Text>
        <Button variant="contained" className="gap-2" onClick={() => setOpenDialog(true)}>
          <AddMoreIcon2 />
          Add Donor
        </Button>
      </Box>

      <Box className="flex xl:items-center justify-between flex-col xl:flex-row ">
        <Box className="pl-2 sm:pl-0">
          <Tabbar
            value={location.hash}
            className=" mx-[-25px]"
            onChange={(_, newValue) =>
              navigate({ hash: newValue, search: createSearchParams({ page: '1', perPage: '10' }).toString() })
            }
          >
            {DONOR_TABS.map((item) => (
              // eslint-disable-next-line react/jsx-key
              <CustomTooltip
                title={
                  item.label === 'PDL'
                    ? 'Potential Donor List'
                    : item.label === 'CCD'
                      ? 'Confrimed and Consented Donor'
                      : item.label === 'BSD-I'
                        ? 'BrainStem Death Identified'
                        : 'BrainStem Death Identified - Not Proceeded'
                }
                placement="top"
                // color="#EDEDED"
                // text="#A1999F"
                arrow={true}
              >
                <TabItem
                  key={item.hash}
                  disableRipple
                  value={item.hash}
                  iconPosition="end"
                  label={item.label}
                  onClick={() => {
                    // handleTabChange(item.hash);
                  }}
                  className={`relative -left-0 !mb-2 !text-[15px] !font-medium !capitalize !underline-offset-[10px] ${
                    location.hash === item.hash ? '!text-[#C967A2] !underline' : 'text-[#A1999F] !no-underline'
                  }`}
                />
              </CustomTooltip>
            ))}
          </Tabbar>
        </Box>
        <Box className="flex md:items-center gap-2 flex-col md:flex-row mt-4 md:mt-0 ">
          <CustomSearch />
          <FilterIcon className="cursor-pointer" />
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
        </Box>
      </Box>
      <Box className="mb-8">{renderTable()}</Box>
      <DonorDialog open={openDialog} onClose={() => setOpenDialog(false)} />
    </Box>
  );
};

export default Donor;
