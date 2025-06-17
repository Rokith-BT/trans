import React, { useEffect, useRef, useState } from 'react';
import { Dialog } from '@mui/material';
import { Box, FormFileInput, Text } from '@/atoms';
// import AvatarIcon from '@/assets/icons/AvatarIcon';
import { ArrowLeftIcon } from '@mui/x-date-pickers/icons';
import MsgButtonIcon from '@/assets/icons/MsgButtonIcon';
import { addDoc, collection, getDocs, onSnapshot, query, serverTimestamp, Timestamp, where } from 'firebase/firestore';
import { dataBase } from '../../../firebase-config';
import { useAuth } from '@/routes';
import { EyeIcon } from '@/assets/icons';
import { RecipientALFDTOs } from '@/types/alf';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import FileViewModal from '@/pages/recipients/add/section/FileViewModal';
import { PeopleIcon } from '@/assets/icons/PeopleIcon';
import { formatTimestamp } from '@/utils';
import { useWindowType } from '@/hooks/useWindowType';

interface MessageDialogProps {
  open: boolean;
  onClose: () => void;
  alfData: RecipientALFDTOs | undefined;
}

interface Message {
  id: string;
  text: string;
  fileUrl: string;
  createdAt: Timestamp;
  user: string;
  room: string;
  email: string;
}
type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber1: string;
};
export const MessageDialog: React.FC<MessageDialogProps> = ({ open, onClose, alfData }) => {
  const { isMobile } = useWindowType();
  const [showUsers, setShowUsers] = useState(false);
  const [mgs, setMsg] = useState('');
  const [message, setMessage] = useState<Message[]>([]);
  const [file, setFile] = useState('');
  const messageRef = collection(dataBase, 'messages');
  const usersRef = collection(dataBase, 'Users');
  const notificationRef = collection(dataBase, 'notifications');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [openImgModal, setOpenImgModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const { state } = useAuth();

  const { currentUser } = state;
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [message]);
  const { handleSubmit, control, watch, setValue } = useForm({
    resolver: zodResolver(z.object({ fileAtt: z.any().optional() })),
    defaultValues: {
      fileAtt: ''
    }
  });
  const fileAtt = watch('fileAtt');

  useEffect(() => {
    if (!alfData?.id) return; // Early return if no alfData.id

    const queryMessage = query(messageRef, where('room', '==', `ALF-${alfData.id}`));

    // Fetch users once and reuse the data
    const fetchUsers = async () => {
      const snapshot = await getDocs(usersRef);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
    };

    const unsubscribe = onSnapshot(queryMessage, async (snaps) => {
      // Get fresh users data
      const currentUsers = await fetchUsers();
      setUsers(currentUsers); // Update users state if needed
      // Check if current user exists in users collection
      const isCurrentUserInList = currentUsers.some((user) => user.email === currentUser?.email);

      const messages: Message[] = snaps.docs
        .map((doc) => ({
          ...(doc.data() as Omit<Message, 'id'>),
          id: doc.id,
          createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
        }))
        .filter(() => {
          return isCurrentUserInList;
        })
        .sort((a, b) => {
          const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : a.createdAt;
          const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : b.createdAt;
          return timeA - timeB;
        });

      setMessage(messages);
    });

    return () => unsubscribe();
  }, [open, alfData?.id, currentUser?.email]); // Proper dependencies
  function generateRandomId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  const handleMsgSubmit = async () => {
    if (mgs === '' && !file) return;
    const fileUrl = fileAtt;
    await addDoc(messageRef, {
      text: mgs,
      fileUrl: fileUrl || null,
      email: currentUser?.email,
      createdAt: serverTimestamp(),
      user: currentUser?.firstName,
      room: `ALF-${alfData?.id}`
    });
    await addDoc(notificationRef, {
      sendUserMail: currentUser?.email,
      sendUserName: currentUser?.firstName,
      room: `ALF-${alfData?.id}`,
      read: false,
      text: mgs,
      createdAt: serverTimestamp(),
      _id: generateRandomId()
    });
    setMsg('');
    setValue('fileAtt', '');
  };
  console.log(message, 'message');
  const onSubmit = async () => {};
  return (
    <Dialog
      className="!rounded-[16px]"
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={
        !isMobile
          ? {
              sx: {
                borderRadius: '16px',
                position: 'absolute',
                right: 0,
                bottom: 0,
                height: { xs: '100%', sm: '80%' },
                width: { xs: '100%', sm: '400px' },
                maxWidth: 'none',
                display: 'flex',
                flexDirection: 'column'
              }
            }
          : {
              sx: {
                borderRadius: '16px',
                height:"500px"
              }
            }
      }
    >
      {/* Header */}
      <Box className="bg-[#6A398C26] p-4">
        <Box className="flex justify-between">
          <Box className="flex items-center">
            <Box className="cursor-pointer mr-2 relative -top-[1px]" onClick={onClose}>
              <ArrowLeftIcon />
            </Box>
            <Text className="text-[#804595] font-semibold mt-1">
              ALF-{alfData?.id} ({alfData?.name})
            </Text>
          </Box>
          <Box className={'flex cursor-pointer'} onClick={() => setShowUsers(!showUsers)}>
            <PeopleIcon /> {users.length}
          </Box>
          {showUsers && (
            <div className="absolute top-12 right-2 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-[300px] overflow-y-scroll">
              {/* <Text className='mb-4 px-4 py-2 text-[15px]'>Group Users</Text> */}
              {users.map((user) => (
                <div key={user.id} className="mt-2 px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                  <div className="font-medium">{user.firstName}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              ))}
            </div>
          )}
        </Box>
      </Box>

      {/* Messages Area */}
      <Box className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {message.map((msg: Message, i: number) => (
          <Box key={i} className={`flex gap-2 ${msg?.email === currentUser.email ? 'flex-row-reverse' : ''}`}>
            <Box className="mt-5">
              <Box className="text-[12px] h-[34px] w-[34px] rounded-full bg-[#804595] flex items-center justify-center text-white font-semibold">
                {msg?.user?.split('')?.[0]}
              </Box>
            </Box>
            {msg.text && (
              <Box>
                {msg?.email !== currentUser.email ? (
                  <Text className="!text-[11px] text-[#804595] !font-medium">
                    {msg?.user} - {formatTimestamp(msg?.createdAt?.toString())}
                  </Text>
                ) : (
                  <Text className="!text-[11px] text-[#804595] !font-medium">
                    {formatTimestamp(msg?.createdAt?.toString())}
                  </Text>
                )}

                <Text
                  className={`mt-2.5 ${msg?.email === currentUser.email ? 'bg-gray-200' : 'bg-purple-500 text-white'} p-2 rounded-md`}
                >
                  {msg.text}
                </Text>
                {/* <Text className="!text-[10px]">Naveen</Text> */}
              </Box>
            )}
            {msg.fileUrl && (
              <Box
                rel="noopener noreferrer"
                className="block mt-1 text-blue-500 underline"
                onClick={() => {
                  setFile(msg.fileUrl);
                  setOpenImgModal(true);
                }}
              >
                <Box className="mt-5 cursor-pointer flex gap-1">
                  <EyeIcon /> <Box>Document</Box>
                </Box>
              </Box>
            )}
          </Box>
        ))}
        <Box ref={messagesEndRef} />
      </Box>

      {/* Footer (Input) */}
      <Box className="p-4 flex items-center gap-2 border-t">
        <input
          type="text"
          className="flex-1 border border-gray-300 bg-[#A1999F26] rounded-lg p-2"
          placeholder="Type Here"
          onChange={(e) => setMsg(e.target.value)}
          value={mgs}
        />
        {mgs && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormFileInput
              className="!w-[30px]"
              control={control}
              name="fileAtt"
              fullWidth
              disabled={false}
              filePath={`alfChat/${2001}/messageImgs`}
              fileData={''}
              setFile={setFile}
            />
          </form>
        )}

        {mgs && (
          <Box className="cursor-pointer" onClick={handleMsgSubmit}>
            <MsgButtonIcon />
          </Box>
        )}
      </Box>
      <FileViewModal
        open={openImgModal}
        onClose={() => setOpenImgModal(false)}
        file={file}
        fileLabel={'Message Image'}
      />
    </Dialog>
  );
};

// rules_version = '2';

// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /{document=**} {
//       allow read, write: if false;
//     }
//   }
// }
