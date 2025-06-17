import { CameraIcon, ProfileIcon } from '@/assets/icons';
import { Box } from '@/atoms';
// import { APIService } from '@/services';
import React, { useRef, useState } from 'react';

interface ProfileImgProps {
  setFiles?: React.Dispatch<React.SetStateAction<string | File | null>>;
  preViewImage?: string;
}

const ProfileImg = ({ setFiles, preViewImage }: ProfileImgProps) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFiles?.(file);
    const imagePreviewUrl = URL.createObjectURL(file);
    setUploadedImage(imagePreviewUrl);
  };

  const handleClickOnCameraIcon = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  console.log('preview image ', preViewImage);

  return (
    <Box>
      <Box className="flex w-full justify-center  ">
        {uploadedImage ? (
          <Box className="relative">
            {preViewImage ? (
              <img
                src={preViewImage}
                alt="Uploaded Profile"
                className="rounded-full h-[124px] w-[124px] object-cover"
              />
            ) : (
              <img
                src={uploadedImage}
                alt="Uploaded Profile"
                className="rounded-full h-[124px] w-[124px] object-cover"
              />
            )}
            <Box className="absolute -right-[5px] bottom-[5px]">
              <Box className="h-[28px] w-[28px]   bg-[#fefdfd] rounded-full" onClick={handleClickOnCameraIcon}>
                <Box className=" bg-[#D876A926] rounded-full ">
                  <CameraIcon />
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box className="relative">
            <ProfileIcon className="bg-[#8045954D] rounded-full h-[124px] w-[124px] p-7" />
            <Box className="absolute -right-[5px] bottom-[5px]">
              <Box className="h-[28px] w-[28px]   bg-[#fefdfd] rounded-full" onClick={handleClickOnCameraIcon}>
                <Box className=" bg-[#D876A926] rounded-full ">
                  <CameraIcon />
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProfileImg;
