import { HospitalIcon, HospitalUserIcon, RecipientIcon } from '@/assets/icons';

type TabItem = {
  label: string;
  hash: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  subTabs: {
    label: string;
    hash: string;
  }[];
};

export const tabList: TabItem[] = [
  {
    label: 'Hospital',
    hash: '#hospital',
    icon: HospitalIcon,
    subTabs: [
      { label: 'Hospital List', hash: '#hlist' },
      { label: 'Organ License List', hash: '#olist' }
    ]
  },
  {
    label: 'Hospital Users',
    hash: '#user',
    icon: HospitalUserIcon,
    subTabs: [
      { label: 'Director', hash: '#owner' },
      { label: 'Admin', hash: '#admin' },
      { label: 'Doctor', hash: '#doctor' },
      { label: 'Coordinator', hash: '#coordi' },
      { label: 'ALF Doctors', hash: '#alf' }
    ]
  },
  {
    label: 'Recipients',
    hash: '#recipient',
    icon: RecipientIcon,
    subTabs: [
      { label: 'Recipients List', hash: '#recipientlist' },
      { label: 'Recipient Transfer', hash: '#recipientstransfer' },
      { label: 'CM Insurance', hash: '#cminsurance' },
      { label: 'ALF Approval', hash: '#alfapproval' }
    ]
  }
  // {
  //   label: 'Donors',
  //   hash: '#donor',
  //   icon: ApprovalDonorIcon,
  //   subTabs: [{ label: 'Donor List', hash: '#donorlist' }]
  // }
];
