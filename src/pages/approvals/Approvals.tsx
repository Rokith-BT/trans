import React, { useEffect, useState } from 'react';
import { Box, Text } from '@/atoms';
import { ApprovalDonorIcon, HospitalIcon, HospitalUserIcon, RecipientIcon } from '@/assets/icons';
import SubTabs from './section/SubTab';
import { useHospitals } from '@/pages/hospitals/hospitalListContext';
import { generateTabList } from './section/TabsConfig';
import { useLocation, useNavigate } from 'react-router';
import QS from 'query-string';

const Approvals: React.FC = () => {
  const [approvalCount, setApprovalCount] = useState<Record<string, number>>({});
  const location = useLocation();
  const navigate = useNavigate();
  const parsedQs = QS.parse(location.search);

  const {
    actions: { getHospitalApprovals, getOrganlApprovals, getUserApproval },
    state: {
      hospitalApprovals: hospitalList,
      organApprovals,
      userApproval,
      count: totalCount,
      forOrganApprovalCount,
      approvalSummary,
      userApprovalCount
    }
  } = useHospitals();
  console.log('total counts from approval ', userApproval);

  const [activeTab, setActiveTab] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tabList, setTabList] = useState<any[]>([]);

  // Generate the tab list after receiving hospital and organ data
  useEffect(() => {
    if (hospitalList.length && organApprovals.length) {
      const generatedTabList = generateTabList(hospitalList, organApprovals, userApproval);
      console.log('Approvals / generatedTabList: ', generatedTabList);

      setTabList(generatedTabList);
      setActiveTab(generatedTabList[0]?.hash || '');
    }
  }, [hospitalList, organApprovals, userApproval]);
  useEffect(() => {
    const newLocation = {
      ...location
    };
    let searchParams = {
      ...parsedQs
    };
    if (location.hash.trim().length === 0) {
      newLocation.hash === '#hlist';
    }
    if (!parsedQs.page) {
      searchParams = { ...searchParams, page: '1', perPage: '10' };
    }
    if (!parsedQs.perPage) {
      searchParams = { ...searchParams, perPage: '10' };
    }
    newLocation.search = QS.stringify(searchParams);
    console.log('Approvals / searchParams: ', searchParams);
    navigate(newLocation, { replace: true });
  }, []);

  const handleTabClick = (hash: string) => {
    setActiveTab(hash);

    const childHashes = getChildHashes(tabList, hash);

    const newHash = childHashes.length > 0 ? childHashes[0] : '';

    const updatedQs = {
      ...parsedQs,
      page: '1',
      perPage: '10'
    };

    navigate({
      pathname: location.pathname,
      search: QS.stringify(updatedQs),
      hash: newHash
    });

    if (hash === '#hlist') {
      getHospitalApprovals(updatedQs);
    } else if (hash === '#olist') {
      getOrganlApprovals(updatedQs);
    } else if (hash === '#owner') {
      getUserApproval(updatedQs);
    }
  };

  useEffect(() => {
    if (location.hash === '#hlist') {
      getHospitalApprovals(parsedQs);
    } else if (location.hash === '#olist') {
      getOrganlApprovals(parsedQs);
    } else if (location.hash === '#owner') {
      getUserApproval(parsedQs);
    }
    console.log('logging hash ', location.hash);
  }, [location.hash, parsedQs.page, parsedQs.perPage]);

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    const updatedQs = { ...parsedQs, page: newPage.toString(), perPage: newPageSize.toString() };
    navigate({
      ...location,
      search: QS.stringify(updatedQs),
      hash: location.hash
    });

    // if (location.hash === '#hlist') {
    //   getHospitalApprovals(updatedQs);
    // } else if (location.hash === '#olist') {
    //   getOrganlApprovals(updatedQs);
    // } else if (location.hash === '#owner') {
    //   getUserApproval(updatedQs);
    // }
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getChildHashes = (tabList: any, activeTab: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentTab = tabList.find((tab: any) => tab.hash === activeTab);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return currentTab?.tabs.map((tab: any) => tab.hash) || []; // Returns an array of child hashes
  };
  const renderSubTabs = () => {
    const childHashes = getChildHashes(tabList, activeTab);
    const currentTab = tabList.find((tab) => tab.hash === activeTab);
    console.log('current tab', currentTab);

    return currentTab?.tabs ? (
      <SubTabs
        tabs={currentTab.tabs}
        totalCount={totalCount}
        forOrgan={forOrganApprovalCount}
        forUser={userApprovalCount}
        onPageChange={handlePaginationChange}
        childHash={childHashes}
      />
    ) : null;
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

  // useEffect(() => {
  //   getHospitalApprovals({});
  //   getOrganlApprovals({});
  //   getUserApproval({});
  // }, []);

  return (
    <Box>
      <Box className="flex w-full justify-start items-center gap-7">
        {tabList.map((tab) => (
          <Box
            key={tab.hash}
            className={`flex justify-between items-center p-5 md:w-1/5 border-[1px] border-[#C967A2] rounded-lg shadow-inner-custom-pink ${
              activeTab === tab.hash ? 'bg-[#C967A226]' : ''
            }`}
            onClick={() => handleTabClick(tab.hash)}
          >
            <Box>
              <Text className="text-[#1A0616] !text-[16px] !font-[700]">{tab.label}</Text>
              <Text className="text-[#C967A2] !font-[700] !text-[23px]"> {approvalCount[tab.hash] ?? 0}</Text>
            </Box>
            <Box>
              {tab.hash === '#user' ? (
                <HospitalUserIcon />
              ) : tab.hash === '#recipient' ? (
                <RecipientIcon />
              ) : tab.hash === '#donor' ? (
                <ApprovalDonorIcon />
              ) : (
                <HospitalIcon className="h-[56px] w-[56px]" />
              )}
            </Box>
          </Box>
        ))}
      </Box>

      <Box mt={3} className="flex w-full gap-7">
        {renderSubTabs()}
      </Box>
    </Box>
  );
};

export default Approvals;
