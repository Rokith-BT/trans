import React, { useEffect, useRef, useState } from 'react';
import { useRecipient } from '../recipients/RecipientContext';
import { CameraIcon } from '@/assets/icons';
import { Box } from '@/atoms';

interface ImageViewerProps {
  file: string;
  setFiles?: React.Dispatch<React.SetStateAction<string | File | null>>;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ file, setFiles }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    actions: { getFileData },
    state: { fileBlop }
  } = useRecipient();
  console.log(fileBlop, 'fileBlop12');
  useEffect(() => {
    if (file) {
      getFileData(file);
    }
  }, [file]);
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
  console.log(uploadedImage, 'uploadedImage', fileBlop);

  return (
    <>
      {fileBlop && !uploadedImage ? (
        <Box className="relative">
          <img src={fileBlop} alt="Img" className="rounded-full h-[124px] w-[124px] object-cover" />
          <Box className="absolute -right-[5px] bottom-[15px]">
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
      ) : uploadedImage && fileBlop ? (
        <Box className="relative">
          <img src={uploadedImage} alt="Uploaded Profile" className="rounded-full h-[124px] w-[124px] object-cover" />
          <Box className="absolute -right-[5px] bottom-[15px]">
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
        <p>Loading Image...</p>
      )}
    </>
  );
};

export default ImageViewer;
