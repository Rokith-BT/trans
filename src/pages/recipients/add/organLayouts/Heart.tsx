import React from 'react';
import { Box, FormInput, Text } from '@/atoms';
import { FormAtomRadioGroup } from '@/pages/components/AtomRadioGroup';
import AtomRadio from '@/atoms/radio/Radio';

interface HeartProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: any;
  readOnly?: boolean;
  sixMinuteWalkTest?: string;
  historyOfPreviousNonTransplantHeartAndLungSurgery?: string;
}

const Heart: React.FC<HeartProps> = ({
  control,
  readOnly,
  sixMinuteWalkTest,
  historyOfPreviousNonTransplantHeartAndLungSurgery
}) => {
  return (
    <div>
      <Text className="text-[#804595] !font-[600] !mb-7 !text-[19px] !mt-8">Evaluation Specific to Heart</Text>
      <Box className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Box>
          <FormInput
            control={control}
            name="cardiacIndex"
            label="Cardiac Index"
            fullWidth
            required
            disabled={readOnly}
          />
        </Box>
        <Box>
          <FormInput
            control={control}
            name="tpgTransPulmonaryGradient"
            label="TPG Trans pulmonary Gradient"
            suffixComponent="NA"
            fullWidth
            // required
            disabled={readOnly}
          />
        </Box>
        <Box>
          <FormInput
            control={control}
            name="pvri"
            label="PVRI"
            suffixComponent="WU(Woods Unit)"
            fullWidth
            // required
            disabled={readOnly}
            type={'number'}
          />
        </Box>
      </Box>
      <Box className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Box>
          <FormAtomRadioGroup
            label="6 Minute  Walk Test -Able to complete ?"
            name={'sixMinuteWalkTest'}
            row
            control={control}
            isRequired
          >
            <AtomRadio label="Yes" value={'1'} disabled={readOnly} />
            <AtomRadio label="No" value={'0'} disabled={readOnly} />
          </FormAtomRadioGroup>
        </Box>
        {sixMinuteWalkTest === '1' && (
          <Box>
            <FormInput
              control={control}
              name="sixMinuteWalkTestDistance"
              label="6 Minute Walk Test Distance"
              suffixComponent="m"
              fullWidth
              required
              disabled={readOnly}
              type={'number'}
            />
          </Box>
        )}
        <Box>
          <FormInput
            control={control}
            name="NtProBnp"
            label="NT Pro BNP"
            suffixComponent="%"
            fullWidth
            // required
            disabled={readOnly}
            type={'number'}
          />
        </Box>
      </Box>
      <Box className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Box>
          <FormAtomRadioGroup
            label="History of Previous Non-Transplant Heart & Lung Surgery ?"
            name={'historyOfPreviousNonTransplantHeartAndLungSurgery'}
            row
            control={control}
            isRequired
          >
            <AtomRadio label="Yes" value={'1'} disabled={readOnly} />
            <AtomRadio label="No" value={'0'} disabled={readOnly} />
          </FormAtomRadioGroup>
        </Box>
        {historyOfPreviousNonTransplantHeartAndLungSurgery === '1' && (
          <Box>
            <FormInput
              control={control}
              name="surgeryDetails"
              label="Surgery Details"
              fullWidth
              required
              disabled={readOnly}
              minRows={3}
              multiline
            />
          </Box>
        )}
      </Box>
    </div>
  );
};

export default Heart;
