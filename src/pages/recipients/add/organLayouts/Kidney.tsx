import React from 'react';
import { AtomDatePicker, Box, FormInput, Text } from '@/atoms';

interface KidneyProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: any;
  readOnly?: boolean;
}

const Kidney: React.FC<KidneyProps> = ({ control, readOnly }) => {
  return (
    <div>
      <Text className="text-[#804595] !font-[600] !mb-7 !text-[19px] !mt-8">Evaluation Specific to Kidney</Text>
      <Box className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Box>
          <FormInput
            control={control}
            name="ureaKidny"
            label="Urea"
            suffixComponent="mg/dL"
            fullWidth
            required
            disabled={readOnly}
            type={'number'}
          />
        </Box>
        <Box>
          <FormInput
            control={control}
            name="creatineKidny"
            label="Creatinine"
            suffixComponent="mg/dL"
            fullWidth
            required
            disabled={readOnly}
            type={'number'}
          />
        </Box>
        <Box>
          <FormInput
            control={control}
            name="serumSodiumKidny"
            label="Serum Sodium"
            suffixComponent="mg/dL"
            fullWidth
            required
            disabled={readOnly}
            type={'number'}
          />
        </Box>

        <Box>
          <FormInput
            control={control}
            name="serumPotassiumKidny"
            label="Serum Potassium"
            suffixComponent="mg/dL"
            fullWidth
            required
            disabled={readOnly}
            type={'number'}
          />
        </Box>
        <Box>
          <FormInput
            control={control}
            name="serumChlorideKidny"
            label="Serum Chloride"
            suffixComponent="mg/dL"
            fullWidth
            required
            disabled={readOnly}
            type={'number'}
          />
        </Box>

        <Box>
          <FormInput
            control={control}
            name="serumBicarbonateKidny"
            label="Serum Bicarbonate"
            suffixComponent="mg/dL"
            fullWidth
            required
            disabled={readOnly}
            type={'number'}
          />
        </Box>
        <Box>
          <AtomDatePicker
            control={control}
            name="firstDialysisDateKidny"
            label="First Dialysis Date"
            fullWidth
            required
            disabled={readOnly}
          />
        </Box>
        <Box>
          <FormInput
            control={control}
            name="periodUndergoingDialysisKidny"
            label="Period Undergoing Dialysis"
            suffixComponent="Months"
            fullWidth
            required
            disabled={readOnly}
            type={'number'}
          />
        </Box>
      </Box>
    </div>
  );
};

export default Kidney;
