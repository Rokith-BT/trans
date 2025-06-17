import React, { useState, useEffect } from 'react';
import { Box, Text } from '@/atoms';
import { tabList } from './section/TabConfig';
import SubTab from './section/SubContent';
import QS from 'query-string';
import { useLocation, useNavigate } from 'react-router';
import { useHospitals } from '@/pages/hospitals/hospitalListContext';

const Approvals: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    state: { approvalSummary }
  } = useHospitals();

  const [activeTab, setActiveTab] = useState<string>(tabList[0].hash); // Default to the first main tab
  const [activeSubTab, setActiveSubTab] = useState<string>(tabList[0].subTabs[0].hash); // Default to the first sub-tab
  const [approvalCount, setApprovalCount] = useState<Record<string, number>>({});

  const roleFilters: Record<string, string> = {
    '#owner': 'Director',
    '#admin': 'Hospital Admin',
    '#doctor': 'SurgeonOrConsultant',
    '#coordi': 'Case Co-ordinators',
    '#alf': 'ALF Doctor'
  };

  useEffect(() => {
    const hash = location.hash || tabList[0].subTabs[0].hash;
    const tabFromHash = tabList.find((tab) => tab.subTabs.some((sub) => sub.hash === hash))?.hash || tabList[0].hash;

    if (tabFromHash !== activeTab) setActiveTab(tabFromHash);
    if (hash !== activeSubTab) setActiveSubTab(hash);
    // Apply filters on first load if `#recipientlist` is active
    if (hash === '#recipientlist') {
      updateQueryParams({ 'filter[status]': 'PendingApproval' }, '#recipientlist');
    }
  }, [location.hash]);

  const updateQueryParams = (params: Record<string, string | number>, hash?: string) => {
    const queryParams = QS.parse(location.search);
    const updatedParams = { ...queryParams, ...params };
    navigate({ search: QS.stringify(updatedParams), hash: hash || activeSubTab }); // Update URL with new params
  };

  const handleTabChange = (newTabHash: string) => {
    const currentTab = tabList.find((tab) => tab.hash === newTabHash);

    if (currentTab) {
      const firstSubTab = currentTab.subTabs[0]?.hash || '';
      const updatedParams = newTabHash === '#user' ? { page: '1' } : { page: '1', 'filter[status]': 'PendingApproval' };
      setActiveTab(newTabHash);
      setActiveSubTab(firstSubTab);
      console.log(newTabHash, 'newTabHash', updatedParams);
      navigate({
        search: QS.stringify(updatedParams),
        hash: firstSubTab
      });
    }
  };

  const handleSubTabChange = (newSubTabHash: string) => {
    const isUserTab = activeTab === '#user';
    const isRecipientTab = activeTab === '#recipient';
    const role = isUserTab ? roleFilters[newSubTabHash] : undefined;
    // Mapping of sub-tab hashes to their specific filters
    const recipientFilters: Record<string, { key: string; value: string }> = {
      '#recipientlist': { key: 'filter[status]', value: 'PendingApproval' },
      '#cminsurance': { key: 'filter[cminsurance]', value: 'Applied' },
      '#alfapproval': { key: 'filter[status]', value: 'PendingTranstanReview' }
    };
    const shouldApplyRecipientFilter = isRecipientTab && recipientFilters[newSubTabHash];
    // eslint-disable-next-line prefer-const
    let filter: Record<string, string | number> = {
      page: '1'
    };

    // Apply role filter if on the user tab
    if (isUserTab && role) {
      filter['filter[role]'] = role;
    }

    // Apply recipient-specific filters
    if (shouldApplyRecipientFilter) {
      filter[recipientFilters[newSubTabHash].key] = recipientFilters[newSubTabHash].value;
    }
    setActiveSubTab(newSubTabHash);
    updateQueryParams(filter, newSubTabHash);
  };

  useEffect(() => {
    const counts = {
      '#hospital': approvalSummary?.totalHospitals || 0,
      '#user': approvalSummary?.totalHospitalUsers || 0,
      '#recipient': approvalSummary?.totalRecipients || 0,
      '#donor': approvalSummary?.totalDonors || 0
    };
    setApprovalCount(counts);
  }, [approvalSummary]);

  return (
    <Box>
      {/* Main Tabs */}
      <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
        {tabList.map((tab) => {
          return (
            <Box
              key={tab.hash}
              className={`flex justify-between items-center p-4 h-[80px] border-[1px] border-[#C967A2] rounded-lg shadow-inner-custom-pink transition-colors ${
                activeTab === tab.hash ? 'bg-[#C967A226]' : ''
              }`}
              onClick={() => {
                handleTabChange(tab.hash);
              }}
            >
              <Box>
                <Text className="text-[#1A0616] textResponse text-[16px] !font-[700]">{tab.label}</Text>
                <Box className="text-[#C967A2] !font-[700] text-[18px] "> {approvalCount[tab.hash] || 0} </Box>
              </Box>
              <Box>{<tab.icon />}</Box>
            </Box>
          );
        })}
      </Box>

      {/* Sub-Tabs */}
      <Box mt={4}>
        {tabList
          .filter((tab) => tab.hash === activeTab) // Find the active main tab
          .map((tab) => (
            <SubTab
              key={tab.hash}
              activeTab={activeTab}
              subTabs={tab.subTabs}
              activeSubTab={activeSubTab}
              setActiveSubTab={handleSubTabChange}
            />
          ))}
      </Box>
    </Box>
  );
};

export default Approvals;
