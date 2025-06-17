import PotentialDataTable from '@/pages/donors/section/PotentialTable';
import HospitalListTable from '../../section/HospitalListTable';
import HospitalUsersTable from '../../section/HospitalUsersTable';
import OrganListTable from '../../section/OrganListTable';
// import { RecipientTable } from '../../section/RecipientTable';
import React from 'react';
import { Hospital } from '@/types/hospital';
import { OrganLicense } from '@/types/organLicense';
import { UsersTable } from '@/types/common.type';
import RecipientTable from '@/pages/recipients/section/RecipientTable';
// import { useRecipient } from '@/pages/recipients/RecipientContext';
// import { useLocation } from 'react-router';
// import QS from 'query-string';
import { Recipient, RecipientApprovalTransferType } from '@/types/recipient';
import { AlfTypes } from '@/types/alf';
import ALFTable from '@/pages/alf/section/ALFTable';
import TransferTable from '@/pages/recipients/section/TransferTable';

interface TableContainerProps {
  activeTab: string;
  activeSubTab: string;
  hospitalList: Hospital[];
  organList: OrganLicense[];
  userList: UsersTable[];
  recipientList: Recipient[];
  recipientTransferList: RecipientApprovalTransferType[];
  alfApproval: AlfTypes[];
  organCount: number;
}

const TableContainer: React.FC<TableContainerProps> = ({
  userList,
  organList,
  hospitalList,
  recipientList,
  recipientTransferList,
  activeTab,
  activeSubTab,
  alfApproval,
  organCount
}) => {
  // const location = useLocation();
  // const ParsedQs = QS.parse(location.search);
  // const {
  //   actions: { getAll },
  //   state: { list }
  // } = useRecipient();
  // useEffect(() => {
  //   getAll(ParsedQs);
  // }, []);
  if (activeTab === '#hospital') {
    if (activeSubTab === '#hlist') {
      return <HospitalListTable list={hospitalList} />;
    }
    if (activeSubTab === '#olist') {
      return <OrganListTable list={organList} totalCount={organCount} />;
    }
  } else if (activeTab === '#user') {
    if (activeSubTab === '#owner') {
      return <HospitalUsersTable list={userList} userRole="Owner" />;
    }
    if (activeSubTab === '#admin') {
      return <HospitalUsersTable userRole="Admin" list={userList} />;
    }
    if (activeSubTab === '#doctor') {
      return <HospitalUsersTable userRole="Doctor" specialization="Cardiology" list={userList} />;
    }
    if (activeSubTab === '#coordi') {
      return <HospitalUsersTable userRole="Co-ordinator" specialization="Cardiology" list={userList} />;
    }
    if (activeSubTab === '#alf') {
      return <HospitalUsersTable userRole="ALF Docotrs" specialization="Cardiology" list={userList} />;
    }
  } else if (activeTab === '#recipient') {
    if (activeSubTab === '#recipientlist') {
      return <RecipientTable list={recipientList} isApprove={true} />;
    }
    if (activeSubTab === '#recipientstransfer') {
      // return <RecipientTable list={recipientTransferList} isApprove={true} isRecipientTranf={true} />;
      return <TransferTable list={recipientTransferList} isApprove={true} />;
    }
    if (activeSubTab === '#cminsurance') {
      return <RecipientTable list={recipientList} isCmInsurance={true} isApprove={true} />;
    }
    if (activeSubTab === '#alfapproval') {
      return <ALFTable list={alfApproval} isApprove={true} />;
    }
  } else if (activeTab === '#donor') {
    return <PotentialDataTable list={[]} />;
  }

  return null; // Fallback if no matching table
};

export default TableContainer;
