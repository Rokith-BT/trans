import { ChatIcon, CloseCircleIcon, DeleteIcon, TickCircle } from '@/assets/icons';
import { Box, Input, Text } from '@/atoms';
import { RecipientALFDTOs } from '@/types/alf';
import { Recipient } from '@/types/recipient';
import { toast } from '@/utils/toast';
import React, { useEffect, useState } from 'react';

interface SnoCellRenderProps {
  data: Recipient | RecipientALFDTOs;
}

const SnoCellRender: React.FC<SnoCellRenderProps> = ({ data }) => {
  const [showChatIcon, setShowChatIcon] = useState(data?.comment?.length > 3);
  const [isEditing, setIsEditing] = useState(false);
  const [comment, setComment] = useState(data?.comment);

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleToggleChat = () => {
    if (comment?.length > 3) {
      setIsEditing(!isEditing);
      setShowChatIcon(false);
    }
  };

  const handleSaveComment = () => {
    if (comment?.length > 3) {
      setShowChatIcon(true);
      setIsEditing(false);
      toast('Comment added successfully', 'success');
    } else {
      toast('Comment must be greater than 3 characters', 'error');
    }
  };

  const handleEditComment = () => {
    setIsEditing(true);
    setShowChatIcon(true);
  };

  useEffect(() => {
    if (comment?.length < 3) setShowChatIcon(false);
  }, [comment?.length, isEditing]);

  return (
    <Box className="relative">
      <Box className="flex items-center gap-2">
        <Text className='textResponse' onClick={comment?.length < 3 ? handleEditComment : handleEditComment}>
          {data?.serialNumber}
        </Text>

        {showChatIcon && <ChatIcon className="cursor-pointer" onClick={handleToggleChat} />}

        {isEditing ? (
          <Box className="fixed text-[#C96767] rounded-md bg-[white] top-[1px] items-center  gap-3 left-[6%] flex z-[999]">
            <Input noBorder fullWidth value={comment} onChange={handleCommentChange} placeholder="Enter a comment" />
            {comment?.length > 2 && (
              <DeleteIcon
                isRed
                className="cursor-pointer "
                onClick={() => {
                  setIsEditing(false);
                  setComment('');
                }}
              />
            )}
            <button>
              {comment?.length < 2 ? (
                <CloseCircleIcon onClick={() => setIsEditing(false)} />
              ) : (
                <TickCircle onClick={handleSaveComment} />
              )}
            </button>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

export default SnoCellRender;
