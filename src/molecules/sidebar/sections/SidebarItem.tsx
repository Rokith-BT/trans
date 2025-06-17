//  eslint-disable @typescript-eslint/no-explicit-any
import { RightArrowIcon } from '@/assets/icons';
import { Box, Text } from '@/atoms';
import { SidebarItemType } from '@/types/SidebarType';
import { Link, useLocation } from 'react-router-dom';
import { DonarNavImage } from '@/assets/sidebarimgs/DonarIcon';
import HospitalNavImage from '@/assets/sidebarimgs/HospitalIcon';
import { ApprovalNavImage } from '@/assets/sidebarimgs/ApprovalIcon';
import RecipientNavImage from '@/assets/sidebarimgs/RecipientIcon';
import WaitingListNavImage from '@/assets/sidebarimgs/WaitingListIcon';
import ALFNavImage from '@/assets/sidebarimgs/ALFIcon';
import SettingNavImage from '@/assets/sidebarimgs/SettingIcon';
import ResourceNavImage from '@/assets/sidebarimgs/ResourceIcon';
import DashboardNavImage from '@/assets/sidebarimgs/DashboardIcon';
import { SVGProps } from 'react';
import TicketNavImage from '@/assets/sidebarimgs/TicketNavImage';
import RecipientTransferImg from '@/assets/sidebarimgs/RecipientTransferIcon';
import ManageRecipientImg from '@/assets/sidebarimgs/ManageRecipientIcon';
import CommonWaitlistImg from '@/assets/sidebarimgs/CommonWaitlistIcon';
import TranstanWaitlistImg from '@/assets/sidebarimgs/TranstanWaitlistIcon';
import InhouseWaitListImg from '@/assets/sidebarimgs/InhouseWaitlistListIcon';
import ALFDocImg from '@/assets/sidebarimgs/ALFDocIcon';
import ManageALFImg from '@/assets/sidebarimgs/ALFManageIcon';
import LiverTransplantIcon from '@/assets/sidebarimgs/LiveTransplantIcon';
import ManageDonorIcon from '@/assets/sidebarimgs/ManageDonorIcon';
import ManageRecipientIcon from '@/assets/sidebarimgs/MagageRecipientIcon';
import AppSettingIcon from '@/assets/sidebarimgs/AppSetting';
import MasterSetUpIcon from '@/assets/sidebarimgs/MasterSetUpIcon';
import AccessPermissionIcon from '@/assets/sidebarimgs/AccessPermissionIcon';
import SetUpContactIcon from '@/assets/sidebarimgs/SetUpContactIcon';
import SetUpBloodgroupIcon from '@/assets/sidebarimgs/SetUpBloodgroupIcon';
import SetUpCauseofDeathIcon from '@/assets/sidebarimgs/SetUpCauseofDeath';
import AppsettingPaymentIcon from '@/assets/sidebarimgs/AppSettingPaymentIcon';
import AppSettingSMS from '@/assets/sidebarimgs/AppSettingSMS';
import SetUpZoneIcon from '@/assets/sidebarimgs/SetUpZoneIcon';
import AppSettingMailIcon from '@/assets/sidebarimgs/AppSettingMailIcon';
import AppsettingNotificationIcon from '@/assets/sidebarimgs/AppSettingNotificationIcon';
import GeneralSettingIcon from '@/assets/sidebarimgs/GeneralSetting';
import SetUpOrganIcon from '@/assets/sidebarimgs/SetUpOrgan';
import SetUpDepartmentIcon from '@/assets/sidebarimgs/SetUpDepartmentIcon';
import SetUpTerminateIcon from '@/assets/sidebarimgs/SetUpTerminateIcon';
import SetUpMultiOrganIcon from '@/assets/sidebarimgs/SetUpMultiOrganIcon';
import AppSettingModuleIcon from '@/assets/sidebarimgs/AppSettingModule';
import SetUpQualifcationIcon from '@/assets/sidebarimgs/SetUpQualificationIcon';

type IconComponent = React.ComponentType<SVGProps<SVGSVGElement>>;
export interface SidebarItemProps {
  item: SidebarItemType;
  onClick: () => void;
  toogleSidebar: () => void;
  showSidebar: boolean;
}
const iconMap: Record<
  | 'DashboardNavImage'
  | 'DonarNavImage'
  | 'HospitalNavImage'
  | 'ApprovalNavImage'
  | 'RecipientNavImage'
  | 'WaitingListNavImage'
  | 'ALFNavImage'
  | 'SettingNavImage'
  | 'ResourceNavImage'
  | 'TicketNavImage'
  | 'RecipientTransferImg'
  | 'ManageRecipientImg'
  | 'CommonWaitlistImg'
  | 'TranstanWaitlistImg'
  | 'InhouseWaitListImg'
  | 'ALFDocImg'
  | 'ManageALFImg'
  | 'LiverTransplantIcon'
  | 'ManageDonorIcon'
  | 'ManageRecipientIcon'
  | 'AppSettingIcon'
  | 'MasterSetUpIcon'
  | 'AccessPermissionIcon'
  | 'SetUpContactIcon'
  | 'SetUpBloodgroupIcon'
  | 'SetUpCauseofDeathIcon'
  | 'AppsettingPaymentIcon'
  | 'AppSettingSMS'
  | 'SetUpZoneIcon'
  | 'AppSettingMailIcon'
  | 'AppsettingNotificationIcon'
  | 'GeneralSettingIcon'
  | 'SetUpOrganIcon'
  | 'SetUpDepartmentIcon'
  | 'SetUpTerminateIcon'
  | 'SetUpMultiOrganIcon'
  | 'AppSettingModuleIcon'
  | 'SetUpQualifcationIcon',
  IconComponent
> = {
  DashboardNavImage: DashboardNavImage,
  DonarNavImage: DonarNavImage,
  HospitalNavImage: HospitalNavImage,
  ApprovalNavImage: ApprovalNavImage,
  RecipientNavImage: RecipientNavImage,
  WaitingListNavImage: WaitingListNavImage,
  ALFNavImage: ALFNavImage,
  SettingNavImage: SettingNavImage,
  ResourceNavImage: ResourceNavImage,
  TicketNavImage: TicketNavImage,
  RecipientTransferImg: RecipientTransferImg,
  ManageRecipientImg: ManageRecipientImg,
  CommonWaitlistImg: CommonWaitlistImg,
  TranstanWaitlistImg: TranstanWaitlistImg,
  InhouseWaitListImg: InhouseWaitListImg,
  ALFDocImg: ALFDocImg,
  ManageALFImg: ManageALFImg,
  LiverTransplantIcon: LiverTransplantIcon,
  ManageDonorIcon: ManageDonorIcon,
  ManageRecipientIcon: ManageRecipientIcon,
  AppSettingIcon: AppSettingIcon,
  MasterSetUpIcon: MasterSetUpIcon,
  AccessPermissionIcon: AccessPermissionIcon,
  SetUpContactIcon: SetUpContactIcon,
  SetUpBloodgroupIcon: SetUpBloodgroupIcon,
  SetUpCauseofDeathIcon: SetUpCauseofDeathIcon,
  AppsettingPaymentIcon: AppsettingPaymentIcon,
  AppSettingSMS: AppSettingSMS,
  SetUpZoneIcon: SetUpZoneIcon,
  AppSettingMailIcon: AppSettingMailIcon,
  AppsettingNotificationIcon: AppsettingNotificationIcon,
  GeneralSettingIcon: GeneralSettingIcon,
  SetUpOrganIcon: SetUpOrganIcon,
  SetUpDepartmentIcon: SetUpDepartmentIcon,
  SetUpTerminateIcon: SetUpTerminateIcon,
  SetUpMultiOrganIcon: SetUpMultiOrganIcon,
  AppSettingModuleIcon: AppSettingModuleIcon,
  SetUpQualifcationIcon: SetUpQualifcationIcon
};
export const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  onClick,
  toogleSidebar,
  showSidebar
}: SidebarItemProps) => {
  console.log(toogleSidebar);
  const location = useLocation(); // Get current route
  const isActive = location.pathname === item.route; // Check if current tab is active
  const IconComponent = iconMap[item.icon as keyof typeof iconMap];
  if (item.route) {
    return (
      <Link to={item.route}>
        <Box
          className={`flex justify-between py-[12px] pl-[20px] pr-[8px] gap-4 items-center hover:bg-[#E3DBEE] ${isActive ? 'bg-[#E3DBEE]' : ''} cursor-pointer hover:border-r-4 hover:border-[#804595]`}
        >
          <Box className={`flex gap-2`} title={`${!showSidebar ? item.name : ''}`}>
            {IconComponent && (
              <Box className="w-[24px] h-[24px]">
                <IconComponent />
              </Box>
            )}
            {showSidebar && (
              <Text className="!text-[14px] xl-custom:!text-[16px] text-nowrap text-[#804595] !font-medium">
                {item.name}
              </Text>
            )}
          </Box>
          <Box>
            {item.children.length ? (
              <Box className="w-[24px] h-[24px]">
                <RightArrowIcon />
              </Box>
            ) : (
              ''
            )}
          </Box>
        </Box>
      </Link>
    );
  }
  return (
    <Box
      className={`flex justify-between py-[12px] pl-[20px] pr-[8px] gap-4 items-center hover:bg-[#E3DBEE] ${isActive ? 'bg-[#E3DBEE]' : ''} cursor-pointer hover:border-r-4 hover:border-[#804595]`}
      onClick={() => {
        onClick();
        // toogleSidebar();
      }}
    >
      <Box className={`flex gap-2`} title={`${!showSidebar ? item.name : ''}`}>
        {IconComponent && (
          <Box className="w-[24px] h-[24px]">
            <IconComponent />
          </Box>
        )}
        {showSidebar && (
          <Text className="lg:!text-[14px] xl-custom:!text-[16px] text-nowrap text-[#804595] !font-medium">
            {item.name}
          </Text>
        )}
      </Box>
      <Box className=" ">
        {item.children.length && showSidebar ? (
          <Box className="w-[24px] h-[24px] relative top-1">
            <RightArrowIcon />
          </Box>
        ) : (
          <Box className="w-[24px] h-[24px]" />
        )}
      </Box>
    </Box>
  );
};
