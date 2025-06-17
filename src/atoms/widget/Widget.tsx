import {
  BottomCurve,
  BottomCurve2,
  UpperCurve,
  UpperCurve2,
  TickIcon // Ensure this import is correct
} from '@/assets/icons';
import './Styles.css';
import React from 'react';
import { Box } from '../box';
import { Text } from '../text';

interface WidgetProps {
  activeTab: number;
  tabTexts: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    step5: string;
    step6: string;
  };
  numberOfSteps?: boolean;
  isGovt?: boolean;
}

export const Widget: React.FC<WidgetProps> = ({ activeTab, tabTexts, numberOfSteps = true, isGovt = false }) => {
  const startSteps = numberOfSteps ? 1 : 2;
  return (
    <div className="flex items-center justify-end  p-2 gap-[5%] mr-[5%] mt-[2%] ">
      {numberOfSteps && (
        <Box className="relative flex items-center">
          <span className="absolute top-[43%] left-[-50%] ">
            <BottomCurve />
          </span>
          <div
            className={`text-[20px] font-[900] rounded-full p-7 border-2 w-1 h-1 flex items-center justify-center transition-colors duration-200 ${
              activeTab > 0 || activeTab === 0
                ? 'bg-[#804595] text-white'
                : 'border-[#804595] text-[#804595] hover:text-white hover:bg-[#804595]'
            }`}
          >
            {activeTab > 0 ? <TickIcon /> : 1}
          </div>
          <span className="absolute top-[-50%] right-[-15%] rotate-[5deg]">
            <UpperCurve className="" />
          </span>
          <span className="cust-line"></span>
          <Box
            className={`text-center  absolute bottom-[-140%] text-[#C967A280] ${activeTab > 0 || activeTab === 0 ? '!text-[#C967A2]' : ''}  text-[16px] font-[500] text-center`}
          >
            <Text className="flex h-[40px] items-center justify-center"> {tabTexts.step1}</Text>
          </Box>
        </Box>
      )}
      <Box className="relative flex items-center">
        <span className="absolute top-[-50%] left-[-18%] rotate-[-4deg] ">
          <UpperCurve2 />
        </span>
        <div
          className={`text-[20px] font-[900] rounded-full p-7 border-2 w-1 h-1 flex items-center justify-center transition-colors duration-200 ${
            activeTab >= (startSteps === 2 ? 0 : 1)
              ? 'bg-[#804595] text-white'
              : 'border-[#804595] text-[#804595] hover:text-white hover:bg-[#804595]'
          }`}
        >
          {activeTab >= (startSteps === 2 ? 0 : 1) ? <TickIcon /> : startSteps === 2 ? 1 : 2}
        </div>
        <span className="absolute top-[50%] right-[-15%] rotate-[-4deg]">
          <BottomCurve2 />
        </span>
        <div className="absolute  right-[-10%] top-[50%] h-[2px] bg-[#804595] w-[100%] transform translate-x-full -translate-y-1/2"></div>
        <Box
          className={`absolute bottom-[-135%] text-[#C967A280] ${activeTab > 1 || activeTab === 1 ? '!text-[#C967A2]' : ''} text-[15px] font-[500] text-center`}
        >
          <Text className="flex h-[40px] items-center justify-center">{tabTexts.step2}</Text>
        </Box>
      </Box>
      <Box className="relative flex items-center">
        <span className="absolute top-[-50%] left-[-18%] rotate-[-4deg] ">
          <UpperCurve2 />
        </span>
        <div
          className={`text-[20px] font-[900] rounded-full p-7 border-2 w-1 h-1 flex items-center justify-center transition-colors duration-200 ${
            activeTab >= (startSteps === 2 ? 1 : 2)
              ? 'bg-[#804595] text-white'
              : 'border-[#804595] text-[#804595] hover:text-white hover:bg-[#804595]'
          }`}
        >
          {activeTab >= (startSteps === 2 ? 1 : 2) ? <TickIcon /> : startSteps === 2 ? 2 : 3}
        </div>
        <span className="absolute top-[50%] right-[-15%] rotate-[-4deg]">
          <BottomCurve2 />
        </span>
        <div className="absolute  right-[-10%] top-[50%] h-[2px] bg-[#804595] w-[100%] transform translate-x-full -translate-y-1/2"></div>
        <Box
          className={`absolute bottom-[-135%] left-[-10%] text-[#C967A280] ${activeTab > 2 || activeTab === 2 ? '!text-[#C967A2]' : ''} text-[15px] font-[500] text-center`}
        >
          <Text className="flex h-[40px] items-center justify-center">{tabTexts.step3}</Text>
        </Box>
      </Box>
      <Box className="relative flex items-center">
        <span className="absolute top-[-50%] left-[-18%] rotate-[-4deg] ">
          <UpperCurve2 />
        </span>
        <div
          className={`text-[20px] font-[900] rounded-full p-7 border-2 w-1 h-1 flex items-center justify-center transition-colors duration-200 ${
            activeTab >= (startSteps === 2 ? 2 : 3)
              ? 'bg-[#804595] text-white'
              : 'border-[#804595] text-[#804595] hover:text-white hover:bg-[#804595]'
          }`}
        >
          {activeTab >= (startSteps === 2 ? 2 : 3) ? <TickIcon /> : startSteps === 2 ? 3 : 4}
        </div>
        <span className="absolute top-[50%] right-[-15%] rotate-[-4deg]">
          <BottomCurve2 />
        </span>
        <div className="absolute  right-[-10%] top-[50%] h-[2px] bg-[#804595] w-[100%] transform translate-x-full -translate-y-1/2"></div>
        <Box
          className={`absolute  bottom-[-135%]  text-[#C967A280] ${activeTab > 3 || activeTab === 3 ? '!text-[#C967A2]' : ''} text-[15px] font-[500] text-center text-wrap`}
        >
          <Text className="flex h-[40px] items-center justify-center">{tabTexts.step4}</Text>
        </Box>
      </Box>
      <Box className="relative flex items-center">
        <span className="absolute top-[-50%] left-[-18%] rotate-[-4deg] ">
          <UpperCurve2 />
        </span>
        <div
          className={`text-[20px] font-[900] rounded-full p-7 border-2 w-1 h-1 flex items-center justify-center transition-colors duration-200 ${
            activeTab >= (startSteps === 2 ? 3 : 4)
              ? 'bg-[#804595] text-white'
              : 'border-[#804595] text-[#804595] hover:text-white hover:bg-[#804595]'
          }`}
        >
          {activeTab >= (startSteps === 2 ? 3 : 4) ? <TickIcon /> : startSteps === 2 ? 4 : 5}
        </div>
        <span
          className={`absolute ${!isGovt ? 'top-[50%] right-[-15%] rotate-[-4deg]' : 'top-[50%] right-[-50%] rotate-[270deg]'} `}
        >
          {!isGovt ? <BottomCurve2 /> : <BottomCurve />}
        </span>
        {!isGovt && (
          <div className="absolute  right-[-10%] top-[50%] h-[2px] bg-[#804595] w-[100%] transform translate-x-full -translate-y-1/2"></div>
        )}{' '}
        <Box
          className={`absolute bottom-[-135%] text-[#C967A280]  ${activeTab > 4 || activeTab === 4 ? '!text-[#C967A2]' : ''}  text-[15px] font-[500] text-center`}
        >
          <Text className="flex h-[40px] items-center justify-center"> {tabTexts.step5}</Text>
        </Box>
      </Box>
      {!isGovt && (
        <Box className="relative flex items-center">
          <span className="absolute top-[-50%] left-[-18%] rotate-[-4deg] ">
            <UpperCurve2 />
          </span>
          <div
            className={`text-[20px] font-[900] rounded-full p-7 border-2 w-1 h-1 flex items-center justify-center transition-colors duration-200 ${
              activeTab >= (startSteps === 2 ? 4 : 5)
                ? 'bg-[#804595] text-white'
                : 'border-[#804595] text-[#804595] hover:text-white hover:bg-[#804595]'
            }`}
          >
            {activeTab >= (startSteps === 2 ? 4 : 5) ? <TickIcon /> : startSteps === 2 ? 5 : 6}
          </div>
          <span className="absolute top-[50%] right-[-50%] rotate-[270deg]">
            <BottomCurve />
          </span>
          <Box
            className={`absolute bottom-[-135%] text-[#C967A280] ${activeTab > 5 || activeTab === 5 ? '!text-[#C967A2]' : ''} text-[15px] font-[500] text-center`}
          >
            <Text className="h-[40px] flex items-center justify-center"> {tabTexts.step6}</Text>
          </Box>
        </Box>
      )}
    </div>
  );
};

interface Step {
  number: number | string;
  text: string;
}

interface WidgetProps2 {
  activeTab: number;
  steps: Step[];
}

export const Widget2: React.FC<WidgetProps2> = ({ activeTab, steps }) => {
  return (
    <div className="flex items-center justify-end !bg-white p-2 gap-[5%] mr-[5%] mt-[2%] ">
      {steps.map((step, index) => (
        <div key={index} className="relative flex items-center">
          {index === 0 ? (
            // First step uses BottomCurve and UpperCurve
            <>
              <span className="absolute top-[43%] left-[-50%]">
                <BottomCurve />
              </span>
              <span className="absolute top-[-50%] right-[-15%] rotate-[5deg]">
                <UpperCurve />
              </span>
            </>
          ) : index === steps.length - 1 ? (
            // First step uses BottomCurve and UpperCurve
            <>
              <span className="absolute top-[-50%] left-[-18%] rotate-[-4deg]">
                <UpperCurve2 />
              </span>
              <span className="absolute top-[50%] right-[-50%] rotate-[-90deg]">
                <BottomCurve />
              </span>
            </>
          ) : (
            // Inner steps use BottomCurve2 and UpperCurve2
            <>
              <span className="absolute top-[-50%] left-[-18%] rotate-[-4deg]">
                <UpperCurve2 />
              </span>
              <span className="absolute top-[50%] right-[-15%] rotate-[-4deg]">
                <BottomCurve2 />
              </span>
            </>
          )}

          <div
            className={`text-[20px] font-[900] rounded-full p-7 border-2 w-1 h-1 flex items-center justify-center transition-colors duration-200 ${
              activeTab >= index
                ? 'bg-[#804595] text-white'
                : 'border-[#804595] text-[#804595] hover:text-white hover:bg-[#804595]'
            }`}
          >
            {activeTab > index ? <TickIcon /> : step.number}
          </div>

          {index < steps.length - 1 && (
            <div className="absolute right-[-10%] top-[50%] h-[2px] bg-[#804595] w-[100%] transform translate-x-full -translate-y-1/2"></div>
          )}

          <Box
            className={`absolute  bottom-[-135%] text-[#C967A280] ${
              activeTab > index ? '!text-[#C967A2]' : ''
            } text-[16px] font-[500] text-center`}
          >
            <Text className="text-center flex items-center h-[40px] justify-center">
              {step.text !== 'ABG Test Details' && step.text}
              {step.text === 'ABG Test Details' && <span>ABG Test<span className='opacity-0'>_</span>Details</span>}
            </Text>
          </Box>
        </div>
      ))}
    </div>
  );
};
