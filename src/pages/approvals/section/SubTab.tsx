import React, { useState, useEffect } from 'react';
import { Box, Button, Pagination, Tabbar, TabItem, Text } from '@/atoms';
import ChildContent from './ChildTab';
import { FilterIcon } from '@/assets/icons/Filter';
import { AddALFUser } from './AddALFUser';
import paginationData from '@/data/pageSizeOptions.json';
import { useLocation, useNavigate } from 'react-router';
import QS from 'query-string';
import { createSearchParams } from 'react-router-dom';

interface ChildTab {
  content: React.ReactNode;
}

interface SubTab {
  label: string;
  hash: string;
  childTabs?: ChildTab[];
}
interface SubTabProps {
  tabs: SubTab[];
  totalCount: number;
  forOrgan: number;
  forUser: number;
  // eslint-disable-next-line no-unused-vars
  onPageChange: (newPage: number, newPageSize: number) => void;
  childHash: string;
}

const SubTabs: React.FC<SubTabProps> = ({ tabs, forOrgan, totalCount, onPageChange, forUser }) => {
  const [activeSubTab, setActiveSubTab] = useState<string>(tabs[0].hash || '');
  const [openDialog, setOpendialog] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const parsedQS = QS.parse(location.search);

  useEffect(() => {
    const newLoaction = { ...location };
    let searchParams = {
      ...parsedQS
    };
    if (location.hash.trim().length === 0) {
      newLoaction.hash = '#hlist';
    }
    if (!parsedQS.page) {
      searchParams = { ...searchParams, page: '1', perPage: '10' };
    }
    if (!parsedQS.perPage) {
      searchParams = { ...searchParams, perPage: '10' };
    }
    newLoaction.search = QS.stringify(searchParams);
    navigate(newLoaction);
  }, []);

  const currentPageSize = parsedQS.perPage ? Number(parsedQS.perPage) : 10;
  const currentPage = parsedQS.page ? Number(parsedQS.page) : 1;
  const totalRows = location.hash === '#hlist' ? totalCount : location.hash === '#owner' ? forUser : forOrgan;
  const totalPages = Math.ceil(totalRows / currentPageSize);
  useEffect(() => {
    if (tabs.length > 0) {
      setActiveSubTab(tabs[0].hash);
    }
  }, [tabs]);

  const handleChildTabClick = (hash: string) => {
    setActiveSubTab(hash);

    const updatedQs = { ...parsedQS, page: '1', perPage: parsedQS.perPage || '10' };
    navigate({
      pathname: location.pathname,
      search: QS.stringify(updatedQs),
      hash
    });
  };
  console.log('organ license count ', forOrgan);

  const renderChildTabs = () => {
    const currentSubTab = tabs.find((tab) => tab.hash === activeSubTab);
    return currentSubTab?.childTabs ? (
      <ChildContent childTabs={currentSubTab.childTabs} />
    ) : (
      <Box>No Content available</Box>
    );
  };

  return (
    <Box className="flex flex-col w-full">
      <Box className="flex items-center justify-between">
        <Tabbar>
          {tabs.map((subTab) => (
            <TabItem
              key={subTab.hash}
              label={
                <Text
                  className={`text-[#A1999F] flex gap-2 ${activeSubTab === subTab.hash ? 'text-[#C967A2] !font-bold' : ''}`}
                  sx={{
                    textDecoration: activeSubTab === subTab.hash ? 'underline' : '',
                    textUnderlineOffset: 10
                  }}
                >
                  {subTab.label}
                </Text>
              }
              value={subTab.hash}
              onClick={() => handleChildTabClick(subTab.hash)}
            />
          ))}
        </Tabbar>
        <Box className="flex gap-4 items-center">
          {activeSubTab === '#alf' && (
            <Button variant="text" className="!bg-[#D876A94D] !text-[#C967A2]" onClick={() => setOpendialog(true)}>
              + Add User
            </Button>
          )}
          <FilterIcon />
          <Pagination
            totalPages={totalPages}
            onPageSizeChanged={(size) => onPageChange(currentPage, Number(size))} // Handle page size change
            page={currentPage}
            onChange={(_, page) => {
              navigate({ ...location, search: createSearchParams({ ...parsedQS, page: page.toString() }).toString() });
            }} // Handle page change
            currentPageSize={currentPageSize}
            pageSizeOptions={paginationData}
          />
        </Box>
      </Box>
      <Box mt={2} className="w-full">
        {renderChildTabs()}
      </Box>
      <AddALFUser open={openDialog} onClose={() => setOpendialog(false)} />
    </Box>
  );
};

export default SubTabs;
