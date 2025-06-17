import { AddMoreIcon2, BackIcon, ExportIcon } from '@/assets/icons';
import { FilterIcon } from '@/assets/icons/Filter';
import { Box, Button, Flex, Grid, Pagination, Tabbar, TabItem, Text } from '@/atoms';
import DonorFragmentData from '@/data/donorFragment.json';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import DonorFilter from './section/DonorFilter';
import AddDonorDialog from './section/AddDonorDialog';
import ConfirmedDataTable from './section/ConfirmedDataTable';
import PotentialDataTable from './section/PotentialDataTable';
import DonorDataTable from './section/DonorDataTable';

export interface DonotListProps {}

export const returnFakeData = () => {
  return [...Array(15)].map(() => ({
    id: '1',
    donorId: 'ram12',
    name: 'Ramachandran',
    hospitalName: 'Govt Hospital India',
    notes: 'This is a test notes for the donor',
    gender: 'Male',
    age: '24',
    blood: 'B',
    organConsents: ['liver', 'heart', 'brain'],
    status: 'ready-for-review'
  }));
};

export const DonorList: React.FC<DonotListProps> = () => {
  const navigate = useNavigate();
  const [openAddDonor, setOpenAddDonor] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  const handleFilterDialog = () => {
    setOpenFilter(false);
  };

  const handleOpenAddDialog = () => {
    setOpenAddDonor(false);
  };

  const [selectedTab, setSelectedTab] = useState('#confirmed');

  const renderContent = () => {
    switch (selectedTab) {
      case '#confirmed':
        return (
          <div>
            <ConfirmedDataTable />
          </div>
        );
      case '#pontential':
        return (
          <div>
            <PotentialDataTable forApproval={false} />
          </div>
        );
      case '#identification':
        return (
          <div>
            <DonorDataTable />
          </div>
        );
      default:
        return;
    }
  };

  return (
    <Grid gridTemplateRows={'auto 1fr'} className="w-[inherit] h-[inherit] py-[28px] px-[40px]">
      <Box>
        <Flex className="justify-between items-center">
          <Box>
            <Text variant="h3" className="flex items-center gap-4 text-[23px] text-[#804595]" fontWeight={600}>
              <BackIcon onClick={() => navigate('/dashboard')} className=" cursor-pointer" /> Manage Donors
            </Text>
          </Box>
          <Flex className="gap-[20px] pr-[2%]">
            <Button
              onClick={() => setOpenAddDonor(true)}
              className="flex gap-4 w-[183px]  bg-gradient-to-r from-[#D268A8] to-[#E3B2CF]"
              variant="contained"
            >
              <AddMoreIcon2 /> Add Donor
            </Button>
          </Flex>
        </Flex>
        <Flex flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
          <Tabbar value={selectedTab} className="items-center" onChange={(_, newValue) => setSelectedTab(newValue)}>
            {DonorFragmentData.map((item) => (
              <TabItem
                key={item.hash}
                disableRipple
                value={item.hash}
                iconPosition="end"
                label={item.label}
                style={{
                  padding: 0,
                  fontWeight: 500,
                  color: selectedTab === item.hash ? '#C967A2' : '#A1999F',
                  marginRight: '15px',
                  paddingBottom: '10px',
                  textDecoration: selectedTab === item.hash ? 'underline' : 'none',
                  textUnderlineOffset: 10
                }}
              />
            ))}
          </Tabbar>
          <Flex justifyContent={'center'} alignItems={'center'} gap={'20px'}>
            <FilterIcon onClick={() => setOpenFilter(true)} className="cursor-pointer" />
            <ExportIcon className="cursor-pointer" />
            <Pagination
              count={10}
              onPageSizeChanged={() => {}}
              pageSize="10"
              pageSizeOptions={[{ value: '10', label: '10' }]}
            />
          </Flex>
        </Flex>
      </Box>
      {renderContent()}
      <AddDonorDialog open={openAddDonor} onClose={handleOpenAddDialog} selectedTab={selectedTab} />
      <DonorFilter open={openFilter} onClose={handleFilterDialog} selectedTab={selectedTab} />
    </Grid>
  );
};
