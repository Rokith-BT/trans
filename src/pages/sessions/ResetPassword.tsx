import CloseIcon from '@/assets/icons/Close';
import { Box, Button, FormPassword, Text } from '@/atoms';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import React, { useState } from 'react';
import PasswordChangedSuccess from '@/assets/icons/PasswordChangeSus';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProtectedHeader } from '@/templates';
import { useAuth } from '@/routes';
import { toast } from '@/utils/toast';

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(6, 'Enter your Old Password'),
    password: z.string().min(1, 'Password is required').max(15),
    confirm: z.string().min(1, 'Confirm Password is required').max(15)
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ['confirm'] // path of error
  })
  .refine((data) => data.oldPassword !== data.password, {
    message: 'New password must be different from the old password',
    path: ['password']
  });

type ChangePasswordType = z.infer<typeof changePasswordSchema>;

interface OnChangePasswordType {
  email: string;
  password: string;
  oldPassword: string;
  token: string | null;
}

export interface ResetPasswordProps {}

export const ResetPassword: React.FC<ResetPasswordProps> = () => {
  const navigate = useNavigate();
  const {
    state: { currentUser }
  } = useAuth();
  const {
    actions: { onChangePasswordLoggedIn }
  } = useProtectedHeader();
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { control, handleSubmit } = useForm<ChangePasswordType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      password: '',
      confirm: ''
    }
  });
  const handlePasswordChange = () => {
    setPasswordChanged(true);
    setTimeout(() => {
      navigate('./dashboard');
    }, 3000);
  };
  const OnSubmit = async (data: ChangePasswordType) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const email = currentUser?.email ?? '';
    const token = localStorage.getItem('token');
    const payload: OnChangePasswordType = {
      ...data,
      email: email,
      token: token
    };
    try {
      await onChangePasswordLoggedIn(payload, () => {
        toast('Password Changed Successfully', 'success');
        handlePasswordChange();
      });
    } catch (error) {
      toast('Something went wrong', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="text-center h-[90vh] flex flex-col items-center justify-center ">
      {!passwordChanged ? (
        <form onSubmit={handleSubmit(OnSubmit)}>
          <div className="absolute top-[15%] right-10 cursor-pointer">
            <CloseIcon onClick={() => navigate('/dashboard')} />
          </div>
          <Box>
            <Typography className="text-[#1A0616] text-[19px] font-[700]">Change Password</Typography>
            <Typography variant="body2" className="text-[#7A6F78] font-[500]">
              Reset your password here
            </Typography>
            <Box className=" mt-6 w-[100%] mr-[10px]">
              <FormPassword
                control={control}
                name="oldPassword"
                placeholder="Enter Old password"
                label="Old Password"
                required
                fullWidth
              />
            </Box>
            <Box className=" mt-6 w-[100%] mr-[10px]">
              <FormPassword
                control={control}
                name="password"
                placeholder="Enter New password"
                label="Password"
                required
                fullWidth
              />
            </Box>
            <Box className="mt-6 mb-6 w-[100%] mr-[10px]">
              <FormPassword
                control={control}
                name="confirm"
                placeholder="Re Enter New password"
                label="Confirm Password"
                required
                fullWidth
              />
            </Box>
          </Box>
          <Button type="submit" variant="contained" fullWidth>
            {isSubmitting ? 'Submitting' : ' Submit'}
          </Button>
        </form>
      ) : (
        <Box>
          <PasswordChangedSuccess className="mb-11" />
          <Text variant="h5" className="text-[#A1999F] text-[19px] font-[500] mb-2">
            Password Changed Successfully
          </Text>
        </Box>
      )}
    </Box>
  );
};
