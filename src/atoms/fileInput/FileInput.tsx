/* eslint-disable @typescript-eslint/no-explicit-any */
import { InputAdornment } from '@mui/material';
import { Input, InputProps } from '../input';
import { EyeIcon, FileUploadIcon } from '@/assets/icons';
import { Control, Controller } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import { fileNameSplit } from '@/utils/fileNameSplit';
import { useMasterData } from '@/pages/settings/setups/masterCotext';
import { toast } from '@/utils/toast';
import { Box } from '../box';

export interface FileInputProps extends InputProps {
  accept?: string;
  fileData?: any;
  setOpenImgModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setFile?: React.Dispatch<React.SetStateAction<string>>;
  onChange?: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  setPreviewName?: () => void;
}

export interface FormFileInputProps extends InputProps {
  control: Control<any>;
  name: string;
  filePath?: string;
  fileData?: string | Blob;
  setOpenImgModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setFile?: any;
  isPostFile?: boolean;
  setLoader?: any;
  // eslint-disable-next-line no-unused-vars
  setPreviewName?: () => void;
  allowedTypes?: string[];
}

export const FileInput: React.FC<FileInputProps> = ({
  accept = '.pdf,.png,.jpg,.jpeg,.webp,.mp4',
  onChange,
  fileData,
  disabled,
  setOpenImgModal,
  setFile,
  setPreviewName,
  ...props
}: FileInputProps) => {
  return (
    <Box className="relative">
      <Input
        aria-label="fileupload"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => e.preventDefault()}
        endAdornment={
          <InputAdornment position="end" sx={{ pointerEvents: 'pointer' }}>
            {fileData && (
              <Box
                className="cursor-pointer z-10"
                onClick={() => {
                  setOpenImgModal?.(true);
                  setFile?.(fileData);
                  setPreviewName?.();
                }}
              >
                <EyeIcon />
              </Box>
            )}
            <FileUploadIcon className="cursor-pointer" />
          </InputAdornment>
        }
        {...props}
      />
      <input
        type="file"
        accept={accept}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        style={{ pointerEvents: 'auto' }} // allow file input to still work
        onChange={onChange}
        disabled={disabled}
        // Disable drag and drop
        onDragStart={(e) => e.preventDefault()}
        onDragEnter={(e) => e.preventDefault()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => e.preventDefault()}
      />
    </Box>
  );
};

export const FormFileInput: React.FC<FormFileInputProps> = ({
  control,
  name,
  filePath,
  fileData,
  setOpenImgModal,
  setFile,
  isPostFile,
  setLoader,
  setPreviewName,
  allowedTypes,
  ...props
}: FormFileInputProps) => {
  const [fileName, setFileName] = useState<string | undefined>();
  const [preview, setPreview] = useState<any>(null);
  const effectiveAllowedTypes = allowedTypes || ['application/pdf', 'image/png', 'image/jpeg'];
  const {
    action: { fileUpload }
  } = useMasterData();

  useEffect(() => {
    handleFileSplit();
  }, [fileData]);

  const handleFileSplit = async () => {
    const value = fileNameSplit(fileData ? fileData : '');
    setFileName(value);
  };

  const getAcceptAttribute = (types: string[]): string => {
    return types
      .map((type) => {
        if (type.includes('/')) return type;
        return `.${type}`;
      })
      .join(',');
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FileInput
          {...field}
          value={fileName ? fileName : ''}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          accept={getAcceptAttribute(effectiveAllowedTypes)}
          onChange={(e) => {
            setLoader?.(true);
            const file = e.target.files ? e.target.files[0] : null;

            if (file) {
              if (!effectiveAllowedTypes.includes(file.type)) {
                const errorMessage = `Invalid file type. Allowed: ${effectiveAllowedTypes.map((type) => type.split('/')[1] || type).join(', ')}.`;
                console.error(errorMessage);
                toast(errorMessage, 'error');

                e.target.value = '';
                setFileName(undefined);
                setPreview(null);
                field.onChange(undefined);
                setLoader?.(false);
                return;
              }

              if (file.type.startsWith('image') || file.type === 'video/mp4') {
                setPreview(URL.createObjectURL(file));
              } else if (file.type === 'application/pdf') {
                setPreview(URL.createObjectURL(file));
              }

              if (isPostFile) {
                field.onChange(file);
                setFileName(file.name);
              } else {
                const formData = new FormData();
                formData.append('fileUploadRequests[0].data', file);
                formData.append('fileUploadRequests[0].path', filePath || 'default/path');
                formData.append('fileUploadRequests[0].filename', file.name);
                formData.append('fileUploadRequests[0].fieldName', 'profile');
                fileUpload(formData, (resp) => {
                  setFileName(resp?.data?.fileResponse?.[0]?.filename);
                  field.onChange(resp?.data?.fileResponse?.[0]?.fullfilepath);
                  setLoader(false);
                });
              }
            } else {
              setFileName('');
            }

            field.onChange(file);
          }}
          fileData={fileData || preview}
          setPreviewName={setPreviewName}
          setOpenImgModal={setOpenImgModal}
          setFile={setFile}
          {...props}
        />
      )}
    />
  );
};
