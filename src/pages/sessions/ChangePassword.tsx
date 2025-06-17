import CloseIcon from '@/assets/icons/Close';
import { Box, Button, Flex, FormPassword, Text } from '@/atoms';
import { passwordFormSchema } from './validators';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import React from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/routes';
import { useToggle } from '@/hooks/useToggle';
import PasswordChangedSuccess from '@/assets/icons/PasswordChangeSus';

export interface ChangePasswordProps {}

type ChangePasswordType = z.infer<typeof passwordFormSchema>;

export const ChangePassword: React.FC<ChangePasswordProps> = () => {
  const [searchParams] = useSearchParams();
  const [showSuccess, toggle] = useToggle();
  const {
    actions: { onChangePassword }
  } = useAuth();

  const rawToken = searchParams.get('token');
  const rawEmail = searchParams.get('email');

  const token = rawToken ? decodeURIComponent(rawToken) : '';
  const email = rawEmail ? decodeURIComponent(rawEmail) : '';

  const { control, handleSubmit } = useForm<ChangePasswordType>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      password: '',
      confirm: ''
    }
  });

  if (!token || !email) {
    return <Navigate to="/page-not-found" replace />;
  }

  if (showSuccess)
    return (
      <Flex className="w-[100vW] h-[100vH] justify-center items-center flex-col gap-[24px]">
        <Link to="/login" replace>
          <Box className="absolute top-7 right-10">
            <CloseIcon />
          </Box>
        </Link>
        <PasswordChangedSuccess />
        <Text fontSize={'13px'} fontWeight={500} className="text-[#A1999F]">
          Password Changed Successfully,{' '}
          <Link to="/login" replace>
            {' '}
            <Text component={'span'} fontSize={'13px'} fontWeight={500} className="text-[#A1999F] underline">
              {' '}
              Go back to Login
            </Text>
          </Link>
        </Text>
      </Flex>
    );

  if (!searchParams.get('token')) return <Navigate to="/page-not-found" replace={true} />;
  return (
    <Flex className="w-[100vW] h-[100vH] justify-center items-center">
      <Link to="/login" replace>
        <Box className="absolute top-7 right-10">
          <CloseIcon />
        </Box>
      </Link>
      <Box className="w-[400px]">
        <form
          onSubmit={handleSubmit(({ password }: { password: string }) => {
            onChangePassword({
              token: searchParams.get('token') ?? '',
              password,
              email: email,
              hash: ''
            });
            toggle();
          })}
        >
          <Flex className="gap-[24px] flex-col">
            <Flex className="flex-col justify-center items-center gap-[8px]">
              <Text component={'h3'} className="text-[#1A0616]" fontSize={'19px'} fontWeight={'600'}>
                Change Password
              </Text>
              <Text component={'p'} className="text-[#A1999F]" fontSize={13} fontWeight={400}>
                Reset your password here
              </Text>
            </Flex>
            <FormPassword
              label="New Password"
              placeholder="Enter Password"
              required
              fullWidth
              name={'password'}
              control={control}
            />
            <FormPassword
              label="Confirm Password"
              placeholder="Enter Password"
              required
              fullWidth
              name={'confirm'}
              control={control}
            />
            <Button type="submit" variant="contained" fullWidth>
              Submit
            </Button>
          </Flex>
        </form>
      </Box>
    </Flex>
  );
};
