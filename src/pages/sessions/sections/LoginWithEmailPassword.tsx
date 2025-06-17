import React from 'react';
import { Box, Text, Button, FormInput, FormPassword, Flex } from '@/atoms'; // Ensure the path is correct
import { loginFormSchema } from '../validators';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from 'react-router-dom';
import { useAuth } from '@/routes';
export interface LoginWithEmailPasswordProps {
}

type LoginPasswordType = z.infer<typeof loginFormSchema>;

export const LoginWithEmailPassword: React.FC<LoginWithEmailPasswordProps> = ({ }) => {
  const { actions:{onLogin}} = useAuth()
  const {
    control,
    handleSubmit,
  } = useForm<LoginPasswordType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        onLogin(data);
      })}
    >
      <Box className="text-center" maxWidth="100%">
        <Box className="pb-[8px]">
          <Text component="h1" className="text-[28px] text-[#1A0616]" fontWeight={'700'}>
            Welcome!
          </Text>
        </Box>
        <Text component="h5" className="text-[13px] text-[#7A6F78]" fontWeight={'500'} fontSize={'13px'}>
          Login to TRANSTAN
        </Text>
        <Flex className="flex-col gap-[16px] mt-[24px] mb-[8px]">
          <Box width="100%">
            <FormInput
              fullWidth
              label="Username/Email"
              placeholder="Enter mail"
              size="small"
              defaultValue={''}
              required
              name="email"
              control={control}
            />
          </Box>
          <Box width="100%">
            <FormPassword
              placeholder="Enter password"
              required
              fullWidth
              defaultValue={''}
              name="password"
              control={control}
            />
          </Box>
        </Flex>
        <Link to={'/forgot-password'}>
          <Text
            component="h5"
            className="text-[#804595] cursor-pointer text-right"
            fontSize={'13px'}
            fontWeight={'500'}
          >
            Forgot password
          </Text>
        </Link>
        <Box className="mt-[24px]">
          <Button className="!bg-[#9C539C]" type="submit" variant="contained" fullWidth>
            Login
          </Button>
        </Box>
      </Box>
    </form>
  );
};
