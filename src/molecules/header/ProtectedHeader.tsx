import { CalenderIconHead, NotificationIcon } from '@/assets/icons';
import { TranstantLogo } from '@/assets/logo';
import { Box, Flex, Grid, Text } from '@/atoms';
import { useProtectedHeader } from '@/templates';
import AccountMenu from './AccountMenu';
import NavMenuImg from '@/assets/sidebarimgs/NavMenu';
import VerticalDD from '@/assets/icons/VerticalDD';
import BreadScrumb from '@/pages/components/BreadScrumb';
import { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, onSnapshot, query, Timestamp, updateDoc, where } from 'firebase/firestore';
import { dataBase } from '../../firebase-config';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@mui/material';
import { useWindowType } from '@/hooks/useWindowType';
import { useAuth } from '@/routes';
// import {  Timestamp } from 'firebase/firestore';
// import { dataBase } from '../../firebase-config';

export interface ProtectedHeaderProps {}
interface Notifications {
  read: boolean;
  room: string;
  sendUserMail: string;
  sendUserName: string;
  createdAt: Timestamp;
  text: string;
  _id: string;
  id: string;
}

export const ProtectedHeader: React.FC<ProtectedHeaderProps> = () => {
  const navigate = useNavigate();
  const [dropdown, setDropdown] = useState(false);
  const { state } = useAuth();
  const { currentUser } = state;
  const [notification, setNotification] = useState<Notifications[]>([]);
  const {
    actions: { sidebarToggle },
    state: { showSidebar }
  } = useProtectedHeader();
  const { isMobile } = useWindowType();
  const notificationRef = collection(dataBase, 'notifications');
  const usersRef = collection(dataBase, 'Users');
  useEffect(() => {
    const queryMessage = query(notificationRef, where('read', '==', false));
    // const queryMessage = query(notificationRef);
    const fetchUsers = async () => {
      const snapshot = await getDocs(usersRef);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
    };
    const unsubscribe = onSnapshot(queryMessage, async (snaps) => {
      const currentUsers = await fetchUsers();
      const isCurrentUserInList = currentUsers.some((user) => user.email === currentUser?.email);
      const notification = snaps.docs
        .map((doc) => ({
          ...(doc.data() as Omit<Notifications, 'id'>),
          id: doc.id,
          createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
        }))
        .filter(() => {
          return isCurrentUserInList;
        })
        .sort((a, b) => {
          const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : a.createdAt;
          const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : b.createdAt;
          return timeB - timeA;
        });
      setNotification(notification);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  console.log(notification, 'notification121212');
  const handleNotificationClick = async (notificationId: string, roomId: string | number) => {
    try {
      const notificationDocRef = doc(dataBase, 'notifications', notificationId);
      const notificationSnap = await getDoc(notificationDocRef);
      console.log(notificationSnap, 'notificationSnap');
      if (notificationSnap.exists()) {
        await updateDoc(notificationDocRef, { read: true });
        navigate('/alf?filter%5Bstatus%5D=PendingTranstanReview%2CPendingALFReview&page=1&perPage=10#alfpending', {
          state: { alfID: roomId }
        });
      } else {
        console.warn('Notification does not exist:', notificationId);
      }
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };

  return (
    <Box gridArea={'header'} className={`bg-[#6A398C26] `}>
      <Box className={`flex ${isMobile ? 'w-[90%]' : 'w-full'} items-center justify-between px-5`}>
        <TranstantLogo />
        <Box className="flex items-center gap-6">
          <CalenderIconHead />
          <Box className=" duration-500 cursor-pointer" onClick={() => setDropdown(!dropdown)}>
            <Badge badgeContent={notification.length} color="primary">
              <NotificationIcon />
            </Badge>
            <Box
              className={`${!dropdown && 'hidden'} bg-white p-4 py-3 space-y-2 shadow-xl absolute top-[54px] right-[160px] z-50 rounded-lg w-[340px]`}
            >
              <Text className="text-lg font-semibold w-full mb-2">Notifications</Text>

              <Box className="space-y-2 max-h-[250px] overflow-y-scroll ">
                {notification.map((el: Notifications, i: number) => {
                  return (
                    <Box
                      key={i}
                      onClick={() => handleNotificationClick(el.id, el.room)}
                      className="flex items-start gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                    >
                      <span className="text-blue-500 mt-1">🔔</span>
                      <Box className="flex flex-col">
                        <Text className="!text-sm !font-medium">
                          {el.sendUserName} sent a message {el?.text} at room {el.room}
                        </Text>
                        <Text className="!text-xs !text-gray-500">Just now</Text>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>

          <AccountMenu />
        </Box>
      </Box>
      <Flex className="h-[30px] w-[100vW] bg-[#804595] relative">
        {!isMobile ? (
          <Grid
            gridTemplateColumns={showSidebar ? '1fr 1fr' : '1fr'}
            className="px-[23px] cursor-pointer"
            onClick={() => {
              sidebarToggle();
            }}
          >
            <Flex className="gap-3 items-center">
              {showSidebar ? (
                <>
                  <VerticalDD />
                  <Text className="text-[#F8F8FF] !text-[14px] relative left-1 !font-[500]">Main Menu</Text>
                </>
              ) : (
                <NavMenuImg />
              )}
            </Flex>
          </Grid>
        ) : (
          <Box className="absolute right-5 top-0 z-10">
            <Grid
              className="px-[23px] cursor-pointer"
              onClick={() => {
                sidebarToggle();
              }}
            >
              <Flex className="gap-3 items-center">
                {showSidebar ? (
                  <>
                    {/* <VerticalDD /> */}
                    <Text className="text-[#F8F8FF] !text-[14px] relative left-1 !font-[500]"></Text>
                  </>
                ) : (
                  // <NavMenuImg />
                  <Text className="text-[#F8F8FF] !text-[14px] relative left-1 !font-[500]"></Text>
                )}
              </Flex>
            </Grid>
          </Box>
        )}

        <Flex className="justify-between items-center">
          <Text className="text-[#F8F8FF] text-[14px] font-[500]">
            <BreadScrumb />
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};
