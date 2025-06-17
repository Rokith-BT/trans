import React from 'react';
import { Box, Text, Button, FormInput } from '@/atoms'; // Ensure the path is correct
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { aadharLoginSchema } from '../validators';
import { z } from 'zod';
import { useAuth } from '@/routes';
import { toast } from '@/utils/toast';

export interface LoginWithAadharProps {
  onOtpClick: () => void;
  // eslint-disable-next-line no-unused-vars
  onCaptureInput?: (val: string) => void;
}

type LoginPasswordType = z.infer<typeof aadharLoginSchema>;
export const LoginWithAadharOTP: React.FC<LoginWithAadharProps> = ({ onOtpClick, onCaptureInput }) => {
  const {
    // state: { aadhaarOtpLogin },
    actions: { onAadhaarLogin }
  } = useAuth();
  const { control, handleSubmit } = useForm<LoginPasswordType>({
    resolver: zodResolver(aadharLoginSchema),
    defaultValues: {
      mobileoremail: ''
    }
  });
  const onSubmit = (data: LoginPasswordType) => {
    console.log('Form data:', data);
    onAadhaarLogin(data.mobileoremail, () => {
      toast('OTP sent successfully', 'success');
      onOtpClick();
      onCaptureInput?.(data.mobileoremail);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box className="text-center  " maxWidth="100%">
        <Box className=" pb-2">
          <Text className="text-[28px] font-[800] text-[#1A0616]">Welcome!</Text>
        </Box>
        <Text variant="h5" className="text-[16px] font-[500] text-[#7A6F78] my-2">
          Login to transtant
        </Text>
        <Box mt="24px" width="100%">
          {/* <Input
            sx={{
              width: '100%',
              '& .MuiInputBase-input': {
                textAlign: 'center'
              }
            }}
            className="text-center "
            label="Eamil / Phone Number"
            placeholder="0000 0000 0000"
            size="small"
            fullWidth
            required
          /> */}
          <FormInput control={control} name="mobileoremail" label="Mobile / Email" required fullWidth />
        </Box>

        <Box className="pt-[24px]">
          <Button className="" variant="contained" fullWidth onClick={handleSubmit(onSubmit)}>
            Get OTP
          </Button>
        </Box>

        <Box
          sx={{
            display: 'flex',
            fontSize: '13px',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
          className=" text-nowrap pt-[8px]"
        ></Box>
      </Box>
    </form>
  );
};
