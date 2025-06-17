import { AddMoreIcon2, ExportIcon } from '@/assets/icons';
import { Box, Button, Pagination, Text } from '@/atoms';
import CustomSearch from '@/pages/components/CustomSearch';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import QS from 'query-string';
import { useLocation, useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';
import PageSizeOptions from '@/data/pageSizeOptions.json';
import AddLiveTransplantTable from './LiveTransplantTable';
import SelectTransplantDialog from './section/SelectTransplantDialog';
import { useMasterData } from '@/pages/settings/setups/masterCotext';
import WaitListTopBar from '@/pages/components/LiveTransplantTopbar';

interface LiverTransplantProps {
  list: [];
}

const LiveTransplantSchema = z.object({
  hospital: z.string().optional().nullable(),
  organs: z.string().optional().nullable(),
  zone: z.string().optional().nullable(),
  dateRange: z.string().optional().nullable()
});
type LiveTransplantType = z.infer<typeof LiveTransplantSchema>;

const LiveTransplant: React.FC<LiverTransplantProps> = ({ list = [] }) => {
  const {
    state: { hospitalNames, organs, zones }
  } = useMasterData();
  console.log(hospitalNames, 'hospitalNames', organs, zones);

  const [openHospital, setOpenHospital] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const parsedQS = QS.parse(location.search);

  const { handleSubmit } = useForm<LiveTransplantType>({
    resolver: zodResolver(LiveTransplantSchema),
    defaultValues: {
      hospital: '',
      organs: '',
      zone: '',
      dateRange: ''
    }
  });
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

  // const [isFilterApplied, setIsFilterApplied] = useState(false);

  //   // Update API call and track filter/search changes
  //   useEffect(() => {
  //     const hasFilters = location.search.includes('filter') || (parsedQS?.q && parsedQS.q?.trim() !== '');
  //     setIsFilterApplied(!!hasFilters);

  //     if (hasFilters) {
  //       getCommonWaitingList(parsedQS);
  //     }
  //   }, [location.search]);

  const renderTable = () => {
    switch (location.hash) {
      case '#addlivetransplanttable':
        return <AddLiveTransplantTable list={list} />;
      default:
        return;
    }
  };
  console.log('data table', renderTable);

  const onSubmit = (data: LiveTransplantType) => {
    console.log('liver transplant ', data);
  };

  const currentPageSize = parsedQS.perPage ? Number(parsedQS.perPage) : 10;
  const totalPages = Math.ceil(100 / currentPageSize);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <Box mt={5} className="flex items-center justify-between">
          <Box className="flex gap-4 align-center">
            <Text className="!text-[#804595] !text-[23px] !font-[600] !mb-8">Live Transplant</Text>
          </Box>
          <Box className="flex gap-4 align-center">
            <Button variant="contained" className="gap-2" onClick={() => setOpenHospital(true)}>
              <AddMoreIcon2 />
              Add New
            </Button>
          </Box>
        </Box>

        <Box className="!z-[999]">
          <WaitListTopBar totalCount={12} isInhouse={true} isTransplant={true} />
        </Box>
        <Box mt={5} className="flex justify-between">
          <Text className="!text-[#804595] !text-[19px] !font-[600]">Liver Transplant</Text>
          <Box className="flex gap-4 items-center ">
            <CustomSearch />
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
        <AddLiveTransplantTable list={[]} />
        <SelectTransplantDialog open={openHospital} onClose={() => setOpenHospital(false)} />
      </Box>
    </form>
  );
};

export default LiveTransplant;
