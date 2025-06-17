import { Box, Button } from '@/atoms';
import React, { useEffect } from 'react';
import ApprovedOrganDoc from '../add/sections/ApprovedOrganDoc';
import { ApproveIcon, DeclineIcon, DocumentDownload, PrintIcon } from '@/assets/icons';
import { useHospital } from '../hospitalContext';
import { useNavigate, useParams } from 'react-router';
interface EditHospitalProps {
  isApproval?: boolean;
}
const EditLicence: React.FC<EditHospitalProps> = ({ isApproval }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    state,
    actions: { getOrganLicenses }
  } = useHospital();
  useEffect(() => {
    getOrganLicenses(id);
  }, []);
  const { hospital } = state || {};
  console.log('get organ license ', hospital?.organLicences);
  const isNTORC = hospital?.basicDetails?.hospitalType?.name === 'NTORC';
  return (
    <Box px={5} py={2}>
      {/* <BackIcon onClick={() => navigate(`/hospitals/${id}/dashboard`)} className="mb-4" /> */}
      <ApprovedOrganDoc
        organData={hospital?.organLicences}
        readOnly={false}
        onNext={() => {
          navigate(-1);
        }}
        onBack={() => {
          navigate(`/hospitals/${id}/dashboard`);
        }}
        reCheck={true}
        forNtorc={isNTORC}
        isAddLicense={true}
        isClickable={false}
        isOnboarding={false}
      />
      {/* <Box className="flex justify-end gap-[22px] mt-[60px]">
        <Button
          variant="outlined"
          className="w-[164px] h-[44px] flex gap-2 border-[1px]  !text-[#D876A9] !border-[#D876A9]"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          className="w-[164px] flex gap-2 border-[1px] !text-[#F8F8FF] !bg-[#D876A9]"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Box> */}
      {/* <Box className="mt-5 flex items-center justify-end gap-9  mb-[4%]">
        <Button variant="contained" className="w-[150px] flex gap-2 h-[40px] !bg-[#D876A9]" onClick={onSubmit}>
          Submit
        </Button>
      </Box> */}
      {isApproval && (
        <Box className="mt-[60px] mb-[10%] flex gap-[22px] justify-end">
          <Button
            variant="outlined"
            className="w-[164px] h-[44px] flex gap-2 border-[1px] !text-[#D876A9] !border-[#D876A9] "
          >
            <PrintIcon /> Print
          </Button>
          <Button
            variant="outlined"
            className="w-[164px] h-[44px] flex gap-2 border-[1px] !text-[#D876A9] !border-[#D876A9] "
          >
            <DocumentDownload /> Download
          </Button>
          <Button
            variant="outlined"
            className="w-[164px] h-[44px] flex gap-2 border-[1px] !text-[#DD2323] !border-[#DD2323] "
            //   onClick={() => setOpenDeclineDialog(true)}
          >
            <DeclineIcon /> Decline
          </Button>
          <Button
            variant="contained"
            className="w-[164px] h-[44px] flex gap-2 border-[1px] !text-[white] !bg-[#80C967] "
            //   onClick={() => setOpenApproveDialog(true)}
          >
            <ApproveIcon /> Approve
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default EditLicence;
