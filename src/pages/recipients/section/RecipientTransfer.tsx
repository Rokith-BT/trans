import { Box, Button, FormInput, Text } from '@/atoms';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import RecipientBasicDeatils from './RecipientBasicDeatils';
import { recipientTransferSchema } from './Validators/index';
import { useRecipient } from '../RecipientContext';
import { RecipientsSearch, RecipientTransferType } from '@/types/recipient';
import { useLocation, useNavigate } from 'react-router';
import QS from 'query-string';
import { createSearchParams } from 'react-router-dom';
import { CloseSimpleIcon } from '@/assets/icons';
import { toast } from '@/utils/toast';

const RecipientTransfer = () => {
  const {
    state: { recipientSearch, recipientVerifyOTP },
    actions: { getRecipientSearch, getRecipientVerifyOTP }
  } = useRecipient();
  const location = useLocation();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const parsedQs = QS.parse(location.search);
  //for search
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchValue, setSearchValue] = useState<any>();
  const [searchResults, setSearchResults] = useState<RecipientsSearch[]>([]); // Store search results
  const [isRecipientSelected, setIsRecipientSelected] = useState(false);
  const [showOtpPart, setShowOtpPart] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isTranstanId, setIsTranstanId] = useState(true);
  const [selectedRecipient, setSelectedRecipient] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(30);
  // const [isRegPhone, setIsRegPhone] = useState(true);
  const [isResend, setIsResend] = useState(false);
  // console.log('is reg phone ', isRegPhone);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    formState: { errors }
  } = useForm<RecipientTransferType>({
    resolver: zodResolver(recipientTransferSchema),
    defaultValues: {
      registerPhone: '',
      transtanId: '',
      enterOTP: '',
      isTranstan: isTranstanId
    }
  });
  // const handleChangebySearch = (value: boolean) => {
  //   setIsTranstanId(value);
  //   setValue('isTranstan', value);
  // };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
  };

  const handleSearchRecipient = async () => {
    if (isRecipientSelected) {
      setShowOtpPart(true);
    } else {
      if (searchValue === undefined || searchValue === '') {
        toast(isTranstanId ? 'Please enter Phone or Unique Id to search' : 'Please enter Unique Id to search', 'error');
        return;
      }
      navigate({
        pathname: location.pathname,
        search: createSearchParams({ searchValue }).toString()
      });

      // Call API function with correct query value
      getRecipientSearch(searchValue);
    }
  };
  // useEffect(() => {
  //   setSearchResults([]); // Clear previous search results when component loads
  //   setSearchValue(''); // Reset search value as well
  // }, [location]);
  useEffect(() => {
    setSearchResults(Array.isArray(recipientSearch) ? recipientSearch : [recipientSearch]);
  }, [recipientSearch]);
  useEffect(() => {
    setSearchResults([]);
  }, [location.hash]);
  useEffect(() => {
    if (isResend && timeLeft > 0) {
      const timeId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timeId);
    } else if (timeLeft === 0) {
      setIsResend(false);
    }
  }, [isResend, timeLeft]);

  // const handleSendOtpClick = () => {
  //   getHospitalNames(parsedQs);
  //   setIsResend(true);
  //   setTimeLeft(30);
  //   console.log('OTP sent');
  // };
  const handleSearchResultClick = (result: RecipientsSearch) => {
    setSearchValue(result.recipientName); // Set the selected value
    setValue('transtanId', result.recipientName);
    setSearchResults([]); // Hide results
    setIsRecipientSelected(true);
  };

  const onSubmit = async (data: RecipientTransferType) => {
    console.log('Transfer data:', data);
    const transtanId = data ? data.transtanId : '0';
    setSelectedRecipient(transtanId);
    setOtpVerified(true);
    console.log('search Value:', searchValue);

    const recipientId = recipientSearch.recipientId;
    await getRecipientVerifyOTP(recipientId);
    setSearchResults([]);
    setSearchValue('');
    setIsRecipientSelected(false);
    setIsTranstanId(true);
    setTimeout(() => {
      reset({ enterOTP: '', transtanId: '', registerPhone: '' });
    }, 0);
    setShowOtpPart(false);
    delete parsedQs.searchValue;
    navigate({ search: QS.stringify(parsedQs) });
  };

  return (
    <Box className="relative">
      {/*  */}
      {/* {Object.keys(errors).length > 0 && <pre>{JSON.stringify(errors, null, 2)}</pre>} */}
      {/* {!otpVerified && (
        <Box
          className="absolute top-[5%] left-[5%] flex gap-2 items-center !font-[500] !text-[16px] text-[#804595] cursor-pointer "
          onClick={() => navigate('/recipients/manage-transfer')}
        >
          <BackIcon className="" />
          Back
        </Box>
      )} */}
      {!otpVerified ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box className="flex flex-col items-center justify-center h-[80vh]">
            <Box className="flex flex-col">
              {/* <Text className="text-[#804595] text-[19px] !font-[600] !mb-[12px] ">Transfer Recipient</Text> */}
              <Text className="text-[#804595] text-[16px] !font-[500] ">Search By Phone Number / Unique ID</Text>
              <Box className="mt-4 relative">
                <Box className=" mb-6 text-nowrap gap-2 w-full  flex items-center justify-between ">
                  <Box>
                    <FormInput
                      control={control}
                      name="registerPhone"
                      label="Phone / Unique ID"
                      placeholder="Enter here"
                      onChange={handleSearchChange}
                      value={searchValue}
                      fullWidth
                      required
                    />
                    {isRecipientSelected && (
                      <CloseSimpleIcon
                        className="absolute top-[7px] right-[140px]"
                        onClick={() => {
                          setSearchValue([]);
                          setIsRecipientSelected(false);
                          setShowOtpPart(false);
                        }}
                      />
                    )}
                  </Box>

                  <Box className="">
                    <Button onClick={handleSearchRecipient} className="w-[110px]" variant="contained">
                      {isRecipientSelected ? 'Send OTP' : 'Search'}
                    </Button>
                  </Box>
                </Box>
                <Box
                  className="absolute z-10 top-[80%] left-0 w-full bg-white shadow-xl"
                  sx={{ boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.20)' }}
                >
                  {searchResults && searchResults.length > 0 ? (
                    <Box className="">
                      {searchResults?.map((result: RecipientsSearch) => (
                        <Box
                          key={result.recipientId}
                          className="cursor-pointer p-2 hover:bg-gray-100"
                          onClick={() => {
                            handleSearchResultClick(result);
                          }}
                        >
                          <Text className="!text-[16px] text-[#1A0616] !font-[400]">
                            Recipient ID: {result.recipientId}, <br></br> Recipient Name: {result.recipientName},
                            <Text className="!text-[16px] text-[#A1999F] !font-[400]">
                              Hospital: {result.hospital.name}, <br></br>
                              Zone: {result.zone.name}.
                            </Text>
                          </Text>
                        </Box>
                      ))}
                    </Box>
                  ) : null}
                </Box>

                {showOtpPart && (
                  <Box>
                    <Box className=" mb-6 ">
                      <FormInput
                        control={control}
                        name="enterOTP"
                        label="Enter OTP"
                        placeholder="Enter OTP"
                        fullWidth
                        required
                      />
                    </Box>

                    <Box>
                      <Button
                        variant="contained"
                        className="!bg-[#D876A9] !text-[#F8F8FF] w-full !mb-2"
                        // onClick={() => {
                        //   handleSubmit(onSubmit);
                        // }}
                        type="submit"
                        disabled={!!(timeLeft < 30)}
                      >
                        Verify OTP
                      </Button>
                      {/* {timeLeft !== 0 && (
                    <> */}
                      <Text className="text-[#A1999F] !text-[13px] !font-[400]">
                        OTP will be sent to registered mobile number xxxxx xx456
                      </Text>

                      <Box className="mt-6 flex items-center justify-center gap-2">
                        {timeLeft <= 30 && timeLeft > 0 ? (
                          <Text className="text-[#804595] !text-[13px] !font-[500] cursor-pointer">
                            {` Resend Code in 00:${timeLeft} sec`}
                          </Text>
                        ) : (
                          ''
                        )}
                        {timeLeft < 1 ? (
                          <Text
                            className="text-[#A1999F] !text-[13px] cursor-pointer hover:text-[purple] !font-[500] underline "
                            onClick={() => {
                              // handleSendOtpClick();
                            }}
                          >
                            Resend Code
                          </Text>
                        ) : (
                          ''
                        )}
                      </Box>
                      {/* </>
                  )} */}
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </form>
      ) : (
        <RecipientBasicDeatils
          recipientData={recipientVerifyOTP}
          transtanID={selectedRecipient}
          setOtpVerified={setOtpVerified}
          // readOnly={true}
        />
      )}
    </Box>
  );
};

export default RecipientTransfer;
