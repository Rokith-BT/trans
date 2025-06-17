// TabsConfig.ts
import HospitalUsersTable from './HospitalUsersTable';
import PotentialDataTable from '@/pages/donors/section/PotentialTable';
import { RecipientTable } from './RecipientTable';
import HospitalListTable from './HospitalListTable';
import OrganListTable from './OrganListTable';
import { UsersTable } from '@/types/common.type';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateTabList = (hospitalApprovals: any[], organApprovals: any[], userApproval: any[]) => {
  console.log('user approval ', userApproval);

  const getUsers = (type: string) => {
    return userApproval.filter((user: UsersTable) => user.role.name === type);
  };

  return [
    {
      label: 'Hospital',
      hash: '#hospital',
      count: '26',
      tabs: [
        {
          label: 'Hospital List',
          hash: '#hlist',
          childTabs: [{ content: <HospitalListTable list={hospitalApprovals} /> }]
        },
        {
          label: 'Organ License List',
          hash: '#olist',
          childTabs: [{ content: <OrganListTable list={organApprovals} /> }]
        }
      ]
    },
    {
      label: 'Hospital Users',
      hash: '#user',
      count: '26',
      tabs: [
        {
          label: 'Director',
          hash: '#owner',
          childTabs: [{ content: <HospitalUsersTable userRole="Owner" list={userApproval} showPhone /> }]
        },
        {
          label: 'Admin',
          hash: '#admin',
          childTabs: [{ content: <HospitalUsersTable userRole="Admin" list={getUsers('Hospital Admin')} showPhone /> }]
        },
        {
          label: 'Doctor',
          hash: '#doctor',
          childTabs: [
            {
              content: (
                <HospitalUsersTable userRole="Doctor" specialization="Cardiology" list={getUsers('Doctor')} isExp />
              )
            }
          ]
        },
        {
          label: 'Coordinator',
          hash: '#coordi',
          childTabs: [
            { content: <HospitalUsersTable userRole="Co-ordinator" list={getUsers('Case Co-ordinators')} isExp /> }
          ]
        },
        {
          label: 'ALF Doctors',
          hash: '#alf',
          childTabs: [
            {
              content: (
                <HospitalUsersTable
                  userRole="Doctor"
                  list={getUsers('ALF')}
                  specialization="Cardiology"
                  isALFRole
                  isExp
                />
              )
            }
          ]
        }
      ]
    },
    {
      label: 'Recipients',
      hash: '#recipient',
      count: '26',
      tabs: [
        {
          label: 'Recipients List',
          hash: '#recipientlist',
          childTabs: [{ content: <RecipientTable isInsurance /> }]
        },
        {
          label: 'Recipients Transfer',
          hash: '#recipientstransfer',
          childTabs: [{ content: <RecipientTable isHospital /> }]
        },
        {
          label: 'Inactive to Active',
          hash: '#inactivetoactive',
          childTabs: [{ content: <RecipientTable isInactiveStatus isInsurance /> }]
        }
      ]
    },
    {
      label: 'Donors',
      hash: '#donor',
      count: '26',
      tabs: [{ label: 'Donor List', hash: '#donorlist', childTabs: [{ content: <PotentialDataTable list={[]} /> }] }]
    }
  ];
};
