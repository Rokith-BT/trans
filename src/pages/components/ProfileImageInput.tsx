/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useRef, useState, useEffect } from 'react';
// import { Controller, Control } from 'react-hook-form';
// import { CameraIcon, ProfileIcon } from '@/assets/icons';
// import { Box } from '@/atoms';

// interface ProfileImageInputProps {
//   name: string;
//   control: Control<any>;
//   defaultUrl?: string;        // for edit/view mode
//   fileUpload: (data: FormData, cb?: (res: any) => void) => void;
// }

// const ProfileImageInput = ({
//   name,
//   control,
//   defaultUrl,
//   fileUpload,
// }: ProfileImageInputProps) => {
//   const [preview, setPreview] = useState<string | null>(defaultUrl || null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   // If defaultUrl changes (e.g. after getFiles), update preview
//   useEffect(() => {
//     setPreview(defaultUrl || null);
//   }, [defaultUrl]);

//   return (
//     <Controller
//       name={name}
//       control={control}
//       render={({ field: { onChange } }) => (
//         <Box className="flex justify-center">
//           <Box className="relative">
//             {preview ? (
//               <img
//                 src={preview}
//                 alt="Profile"
//                 className="rounded-full h-[124px] w-[124px] object-cover"
//               />
//             ) : (
//               <ProfileIcon className="bg-[#8045954D] rounded-full h-[124px] w-[124px] p-7" />
//             )}
//             <Box
//               className="absolute -right-[5px] bottom-[5px] h-[28px] w-[28px] bg-[#fefdfd] rounded-full flex items-center justify-center"
//               onClick={() => inputRef.current?.click()}
//             >
//               <CameraIcon />
//             </Box>
//             <input
//               ref={inputRef}
//               type="file"
//               accept="image/*"
//               className="hidden"
//               onChange={async (e) => {
//                 const file = e.target.files?.[0];
//                 if (!file) return;
//                 // show local preview
//                 const url = URL.createObjectURL(file);
//                 setPreview(url);
//                 // upload to server
//                 const form = new FormData();
//                 form.append('file', file);
//                 fileUpload(form, (res) => {
//                   // assume res.data.fileResponse.fullfilepath
//                   const fullUrl = res.data.fileResponse.fullfilepath;
//                   onChange(fullUrl);
//                 });
//               }}
//             />
//           </Box>
//         </Box>
//       )}
//     />
//   );
// };

// export default ProfileImageInput;

// import React, { useEffect, useRef, useState } from 'react';
// import { Controller } from 'react-hook-form';
// import { CameraIcon, ProfileIcon } from '@/assets/icons';
// import { Box } from '@/atoms';
// import { useMasterData } from '../settings/setups/masterCotext';

// interface ProfileImageFieldProps {
//   name: string;
//   control: any;
//   defaultUrl?: string;
// }

// export const ProfileImageField: React.FC<ProfileImageFieldProps> = ({ name, control, defaultUrl }) => {
//   const [preview, setPreview] = useState<string | null>(null);
//   const revokeRef = useRef<string | null>(null);
//   const inputRef = useRef<HTMLInputElement | null>(null);
//   const {
//     action: { getFiles, fileUpload }
//   } = useMasterData();
//   // on mount, if defaultUrl provided, fetch blob → URL
//   useEffect(() => {
//     if (defaultUrl) {
//       getFiles(defaultUrl, (url) => {
//         setPreview(url);
//       });
//     }
//   }, [defaultUrl]);

//   // cleanup objectURL on unmount
//   useEffect(() => {
//     return () => {
//       if (revokeRef.current) URL.revokeObjectURL(revokeRef.current);
//     };
//   }, []);

//   const handleSelect = async (file: File, onChange: (url: string) => void, setLoading: (v: boolean) => void) => {
//     setLoading(true);
//     // local preview
//     const objectUrl = URL.createObjectURL(file);
//     setPreview(objectUrl);
//     revokeRef.current = objectUrl;

//     // upload
//     const form = new FormData();
//     form.append('file', file);
//     fileUpload(form, (res) => {
//       const fullUrl = res.data.fileResponse.fullfilepath;
//       onChange(fullUrl);
//       setLoading(false);
//     });
//   };

//   return (
//     <Controller
//       name={name}
//       control={control}
//       defaultValue={defaultUrl || ''}
//       // eslint-disable-next-line @typescript-eslint/no-unused-vars
//       render={({ field: { onChange, value }, fieldState }) => {
//         // eslint-disable-next-line react-hooks/rules-of-hooks
//         const [loading, setLoading] = useState(false);
//         return (
//           <Box className="flex justify-center">
//             <Box className="relative">
//               {preview ? (
//                 <img src={preview} alt="Profile" className="rounded-full h-[124px] w-[124px] object-cover" />
//               ) : (
//                 <ProfileIcon className="bg-[#8045954D] rounded-full h-[124px] w-[124px] p-7" />
//               )}

//               <Box
//                 className="absolute -right-[5px] bottom-[5px] h-[28px] w-[28px] bg-[#fefdfd] rounded-full flex items-center justify-center cursor-pointer"
//                 onClick={() => inputRef.current?.click()}
//               >
//                 <CameraIcon />
//               </Box>

//               <input
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 ref={inputRef}
//                 onChange={(e) => {
//                   const file = e.target.files?.[0];
//                   if (file) handleSelect(file, onChange, setLoading);
//                 }}
//               />
//               {loading && <span className="text-sm">Uploading...</span>}
//               {fieldState.error && <span className="text-red-500 text-sm">{fieldState.error.message}</span>}
//             </Box>
//           </Box>
//         );
//       }}
//     />
//   );
// };
import React, { useEffect, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import { CameraIcon, ProfileIcon } from '@/assets/icons';
import { Box } from '@/atoms';
import { useMasterData } from '../settings/setups/masterCotext';
import { base64toFile } from '@/utils/base64tofile';

interface ProfileImageFieldProps {
  name: string;
  control: any;
  defaultUrl?: string;
  aadharBase64?: string; // new prop for base64 data
  setValue: any;
  setFiles: any;
}

export const ProfileImageField: React.FC<ProfileImageFieldProps> = ({
  name,
  setValue,
  control,
  defaultUrl,
  aadharBase64,
  setFiles
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const revokeRef = useRef<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const {
    action: { getFiles, fileUpload }
  } = useMasterData();
  // on mount/view: if defaultUrl provided, fetch blob → URL
  useEffect(() => {
    if (defaultUrl) {
      getFiles(defaultUrl, (url) => setPreview(url));
    }
  }, [defaultUrl]);

  // on aadhar verify: if base64 arrives, show & upload
  //   useEffect(() => {
  //     if (aadharBase64) {
  //       // show base64 immediately
  //       setPreview(aadharBase64);

  //       // convert to File and upload same as user selection
  //       const file = base64toFile(aadharBase64, `${name}-aadhar.png`);
  //       // reuse handleSelect logic via Controller render closure
  //       // here we temporarily create FormData & upload
  //       const form = new FormData();
  //       form.append('file', file);
  //       fileUpload(form, (res) => {
  //         // update RHF value
  //         control.setValue(name, res.data.fileResponse.fullfilepath);
  //       });
  //     }
  //   }, [aadharBase64, control, name]);
  useEffect(() => {
    if (aadharBase64) {
      // add prefix if it's not already there
      const hasPrefix = aadharBase64.startsWith('data:');
      const mimeType = 'image/jpeg'; // or detect dynamically if needed
      const base64WithPrefix = hasPrefix ? aadharBase64 : `data:${mimeType};base64,${aadharBase64}`;

      // show preview
      setPreview(base64WithPrefix);

      // convert to file and upload
      const file = base64toFile(base64WithPrefix, `${name}-aadhar.jpg`);
      const form = new FormData();
      form.append('fileUploadRequests[0].data', file);
      form.append('fileUploadRequests[0].path', 'hospital/profile'); // or dynamic path
      form.append('fileUploadRequests[0].filename', file.name);
      form.append('fileUploadRequests[0].fieldName', 'profile');

      fileUpload(form, (res) => {
        const fullUrl = res.data?.fileResponse?.[0]?.fullfilepath;
        if (fullUrl) {
          setValue(name, fullUrl);
          setFiles(fullUrl);
        }
      });
    }
  }, [aadharBase64, control, name]);

  // cleanup objectURL on unmount
  useEffect(
    () => () => {
      if (revokeRef.current) URL.revokeObjectURL(revokeRef.current);
    },
    []
  );

  // const handleSelect = async (file: File, onChange: (url: string) => void, setLoading: (v: boolean) => void) => {
  //   setLoading(true);
  //   // local preview
  //   const objectUrl = URL.createObjectURL(file);
  //   setPreview(objectUrl);
  //   revokeRef.current = objectUrl;
  //   onChange(file);
  //   setLoading(false);
  //   // upload
  //   // const form = new FormData();
  //   // form.append('file', file);
  //   // fileUpload(form, (res) => {
  //   //   const fullUrl = res.data.fileResponse.fullfilepath;
  //   //   onChange(fullUrl);
  //   //   setLoading(false);
  //   // });
  // };
  // const handleSelect = async (file: File, onChange: (value: any) => void, setLoading: (v: boolean) => void) => {
  //   setLoading(true);
  //   const objectUrl = URL.createObjectURL(file);
  //   setPreview(objectUrl);
  //   revokeRef.current = objectUrl;

  //   // store file instead of uploading now
  //   onChange(file);
  //   setLoading(false);
  // };
  const handleSelect = async (file: File, onChange: (value: any) => void, setLoading: (v: boolean) => void) => {
    setLoading(true);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    revokeRef.current = objectUrl;

    // Upload logic
    const form = new FormData();
    form.append('fileUploadRequests[0].data', file);
    form.append('fileUploadRequests[0].path', 'hospital/profile');
    form.append('fileUploadRequests[0].filename', file.name);
    form.append('fileUploadRequests[0].fieldName', 'profile');

    fileUpload(form, (res) => {
      const fullUrl = res.data?.fileResponse?.[0]?.fullfilepath;
      if (fullUrl) {
        onChange(fullUrl); // updates RHF value
        setFiles(fullUrl); // updates local state
      }
      setLoading(false);
    });
  };
  

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultUrl || ''}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render={({ field: { onChange, value }, fieldState }) => {
        const [loading, setLoading] = useState(false);

        return (
          <Box className="flex justify-center">
            <Box className="relative">
              {preview ? (
                <img src={preview} alt="Profile" className="rounded-full h-[124px] w-[124px] object-cover" />
              ) : (
                <ProfileIcon className="bg-[#8045954D] rounded-full h-[124px] w-[124px] p-7" />
              )}

              <Box
                className="absolute -right-[5px] bottom-[5px] h-[28px] w-[28px] bg-[#fefdfd] rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => inputRef.current?.click()}
              >
                <CameraIcon />
              </Box>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={inputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleSelect(file, onChange, setLoading);
                    setFiles(file);
                  }
                }}
              />

              {loading && <span className="text-sm">Uploading...</span>}
              {fieldState.error && <span className="text-red-500 text-sm">{fieldState.error.message}</span>}
            </Box>
          </Box>
        );
      }}
    />
  );
};
