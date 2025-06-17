import { BackIcon, BackIconPink, NextIcon } from '@/assets/icons';
import { Box, Button, Text, Widget } from '@/atoms';
import React, { useState } from 'react';
import DonorDetails from './section/DonorDetails';
import ApnoeaDetails from './section/ApnoeaDetails';
import Organs from './section/Organs';
import Injuries from './section/Injuries';
import Abg from './section/Abg';
import Attachment from './section/Attachment';
import { useNavigate } from 'react-router';
import AddDonorDialog from '../add/section/AddDonorDialog';

// enum Tabs {
//   DonorDetails,
//   ApnoeaDetails,
//   OrgansConstend,
//   injuries,
//   ABG,
//   Attachemnts
// }

const AddDonor = () => {
  const navigate = useNavigate();
  const tabText = {
    step1: 'Donor Medical Details',
    step2: 'Apnoea & Consent Details',
    step3: 'Organs & Tissue Consentend',
    step4: 'Injuries, Rescue and Ventilator',
    step5: 'ABG, Intropes Hormone',
    step6: 'Form & Attachments '
  };
  // const [activeTab, setActiveTab] = useState<Tabs>(Tabs.DonorDetails);
  const [activeTab, setActiveTab] = useState(0);
  const handleNext = () => {
    if (activeTab === 0) {
      setActiveTab(1);
    } else if (activeTab === 1) {
      setActiveTab(2);
    } else if (activeTab === 2) {
      setActiveTab(3);
    } else if (activeTab === 3) {
      setActiveTab(4);
    } else if (activeTab === 4) {
      setActiveTab(5);
    } else {
      setActiveTab(0);
    }
  };
  const handleBack = () => {
    if (activeTab === 5) {
      setActiveTab(4);
    } else if (activeTab === 4) {
      setActiveTab(3);
    } else if (activeTab === 3) {
      setActiveTab(2);
    } else if (activeTab === 2) {
      setActiveTab(1);
    } else if (activeTab === 1) {
      setActiveTab(0);
    } else {
      setActiveTab(0);
    }
  };
  // const handleNext = () => {
  //   if (activeTab === Tabs.DonorDetails) {
  //     setActiveTab(Tabs.ApnoeaDetails);
  //   } else if (activeTab === Tabs.ApnoeaDetails) {
  //     setActiveTab(Tabs.OrgansConstend);
  //   } else if (activeTab === Tabs.OrgansConstend) {
  //     setActiveTab(Tabs.injuries);
  //   } else if (activeTab === Tabs.injuries) {
  //     setActiveTab(Tabs.ABG);
  //   } else if (activeTab === Tabs.ABG) {
  //     setActiveTab(Tabs.Attachemnts);
  //   } else {
  //     setActiveTab(Tabs.DonorDetails);
  //   }
  // };
  // const handleBack = () => {
  //   if (activeTab === Tabs.ApnoeaDetails) {
  //     setActiveTab(Tabs.DonorDetails);
  //   } else if (activeTab === Tabs.OrgansConstend) {
  //     setActiveTab(Tabs.ApnoeaDetails);
  //   } else if (activeTab === Tabs.injuries) {
  //     setActiveTab(Tabs.OrgansConstend);
  //   } else if (activeTab === Tabs.ABG) {
  //     setActiveTab(Tabs.injuries);
  //   } else if (activeTab === Tabs.Attachemnts) {
  //     setActiveTab(Tabs.ABG);
  //   } else {
  //     setActiveTab(Tabs.Attachemnts);
  //   }
  // };
const [backDialog,setBackDialog] = React.useState(false);

  return (
    <Box>
      <Box className="sticky top-0 !bg-white z-10 h-[150px] ">
        <Widget tabTexts={tabText} activeTab={activeTab} />
        <Text className="flex gap-5 !text-[#804595] !text-[23px] pl-[3%] !font-[600]">
          <BackIcon onClick={()=>setBackDialog(true)} className="cursor-pointer" /> Add Donor
        </Text>
      </Box>
      <Box px={5} mt={5}>
        {activeTab === 0 && <DonorDetails />}
        {activeTab === 1 && <ApnoeaDetails />}
        {activeTab === 2 && <Organs />}
        {activeTab === 3 && <Injuries />}
        {activeTab === 4 && <Abg />}
        {activeTab === 5 && <Attachment />}
      </Box>
      <Box className="flex gap-4 pr-[5%] mt-[5%] mb-[2%] items-center justify-end">
        {activeTab === 0 ? (
          <Button className="w-[150px] !border-[#D876A9] !text-[#D876A9]" variant="outlined">
            Cancel
          </Button>
        ) : (
          <Button
            onClick={handleBack}
            className="w-[150px] !border-[#D876A9] !text-[#D876A9] flex gap-4"
            variant="outlined"
          >
            <BackIconPink />
            Back
          </Button>
        )}
        {activeTab === 5 ? (
          <div className="flex gap-4 items-center">
            <Button variant="outlined" className="w-[150px] !border-[#D876A9] !text-[#D876A9]">
              Draft
            </Button>
            <Button
              onClick={() => navigate('/donors')}
              variant="contained"
              className="w-[150px] !bg-[#D876A9] !text-[white]"
            >
              Submit
            </Button>
          </div>
        ) : (
          <Button onClick={handleNext} className="w-[150px] flex gap-4 !bg-[#D876A9] !text-[white]">
            Next <NextIcon />
          </Button>
        )}
      </Box>
      <AddDonorDialog open={backDialog} onClose={() => {setBackDialog(false)}} />
    </Box>
  );
};

export default AddDonor;
