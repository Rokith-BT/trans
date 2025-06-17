import CloseIcon from '@/assets/icons/Close';
import { Box, Button, Flex, FormInput, Text } from '@/atoms';
import { forgotPasswordSchema } from './validators';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import React, { } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/routes';
import { useToggle } from '@/hooks/useToggle';
import PasswordSuccess from '@/assets/icons/PasswordSuccess';

export interface ForgotPasswordProps { }

type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>;


export const ForgotPassword: React.FC<ForgotPasswordProps> = () => {
  const { actions: { onforgotPassword } } = useAuth()
  const [showSuccess, toggleSuccess] = useToggle(false)
  const {
    control,
    handleSubmit,
  } = useForm<ForgotPasswordType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  });
  if (showSuccess)
    return (<Flex className="w-[100vW] h-[100vH] justify-center items-center flex-col gap-[24px]">
      <Link to="/login" replace>
        <Box className="absolute top-7 right-10">
          <CloseIcon />
        </Box>
      </Link>
      <PasswordSuccess />
      <Text fontSize={"13px"} fontWeight={500} className='text-[#A1999F]'>
        Your temporary credentials has been sent to your email,  <Link to="/login" replace> <Text component={"span"} fontSize={"13px"} fontWeight={500} className='text-[#A1999F] underline'> Go back to Login</Text></Link>
      </Text>
    </Flex>)

  return (
    <Flex className="w-[100vW] h-[100vH] justify-center items-center">
      <Link to="/login" replace>
        <Box className="absolute top-7 right-10">
          <CloseIcon />
        </Box>
      </Link>
      <Box className="w-[400px]">
        <form
          onSubmit={handleSubmit((data) => {
            onforgotPassword(data, () => {
              toggleSuccess();
            });
          })}
        >
          <Flex className="gap-[24px] flex-col">
            <Flex className="flex-col justify-center items-center gap-[8px]">
              <Text component={'h3'} className="text-[#1A0616]" fontSize={'19px'} fontWeight={'600'}>
                {' '}
                Forgot Password
              </Text>
              <Text component={'p'} className="text-[#A1999F]" fontSize={13} fontWeight={400}>
                Enter your registered email address to reset password
              </Text>
            </Flex>
            <FormInput label="Email" placeholder="Enter Email" required fullWidth name={'email'} control={control} />
            <Button className="!bg-[#9C539C]" type="submit" variant="contained" fullWidth>
              Submit
            </Button>
          </Flex>
        </form>
      </Box>
    </Flex>
  );
};
