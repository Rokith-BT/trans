import React, { useState } from 'react';
import { Box, FormFileInput, FormInput, FormSelect, Text } from '@/atoms';
import { FormAtomRadioGroup } from '@/pages/components/AtomRadioGroup';
import AtomRadio from '@/atoms/radio/Radio';
import { OrganRequestData } from '@/types/recipient';
import FileViewModal from '../section/FileViewModal';
import LoadingOverlay from '@/pages/components/LoadingOverlay';

interface LungsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: any;
  readOnly?: boolean;
  sixMinuteWalkTestLungs?: string;
  getLungDisease?: { label: string; value: string }[];
  historyOfPreviousNonTransplantHeartAndLungSurgeryLungs?: string;
  currentRecipientID?: number | string;
  organsRequest: OrganRequestData;
  file: string;
  setFile: React.Dispatch<React.SetStateAction<string>>;
  openImgModal: boolean;
  setOpenImgModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Lungs: React.FC<LungsProps> = ({
  control,
  readOnly,
  sixMinuteWalkTestLungs,
  getLungDisease,
  historyOfPreviousNonTransplantHeartAndLungSurgeryLungs,
  currentRecipientID,
  organsRequest,
  file,
  setFile,
  openImgModal,
  setOpenImgModal
}) => {
  // const [openImgModal, setOpenImgModal] = useState(false);
  // const [file, setFile] = useState('');
  const [loader, setLoader] = useState(false);
  const [fileName, setFileName] = useState('');
  const lungsFilePath = `recipient/${currentRecipientID}/lungs`;
  return (
    <div>
      <Text className="text-[#804595] !font-[600] !mb-7 !text-[19px] !mt-8">Evaluation Specific to Lung</Text>
      <Box className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Box>
          <FormSelect
            menuOptions={getLungDisease || []}
            control={control}
            name={`causeOfLungDisease`}
            label="Cause of Lung Disease"
            fullWidth
            disabled={readOnly}
            required
          />
        </Box>
        <Box>
          <FormAtomRadioGroup
            label="6 Minute  Walk Test -Able to complete ?"
            name={'sixMinuteWalkTestLungs'}
            row
            control={control}
            isRequired
          >
            <AtomRadio label="Yes" value={'1'} disabled={readOnly} />
            <AtomRadio label="No" value={'0'} disabled={readOnly} />
          </FormAtomRadioGroup>
        </Box>
        {sixMinuteWalkTestLungs === '1' && (
          <Box>
            <FormInput
              control={control}
              name="sixMinuteWalkTestDistanceLungs"
              label="6 Minute Walk Test Distance"
              suffixComponent="m"
              fullWidth
              required
              disabled={readOnly}
              type={'number'}
            />
          </Box>
        )}
      </Box>
      <Text className="text-[#804595] !font-[600] !mb-7 !text-[19px] !mt-8">PFT</Text>
      <Box className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Box>
          <FormAtomRadioGroup
            label="History of Previous Non-Transplant Heart & Lung Surgery ?"
            name={'historyOfPreviousNonTransplantHeartAndLungSurgeryLungs'}
            row
            control={control}
            // isRequired
          >
            <AtomRadio label="Yes" value={'1'} disabled={readOnly} />
            <AtomRadio label="No" value={'0'} disabled={readOnly} />
          </FormAtomRadioGroup>
        </Box>
        {historyOfPreviousNonTransplantHeartAndLungSurgeryLungs === '1' && (
          <Box>
            <FormInput
              control={control}
              name="surgeryDetailsLungs"
              label="Surgery Details"
              fullWidth
              // required
              disabled={readOnly}
              multiline
              minRows={3}
            />
          </Box>
        )}
        <Box>
          <FormFileInput
            control={control}
            name="forcedExpiratoryVolumeIn1Second"
            label="Forced Expiratory Volume in 1 second (FEV1)"
            fullWidth
            disabled={readOnly}
            required
            filePath={lungsFilePath}
            fileData={organsRequest.forcedExpiratoryVolumeIn1Second}
            setOpenImgModal={setOpenImgModal}
            setFile={setFile}
            setLoader={setLoader}
            setPreviewName={() => {
              setFileName(`Forced Expiratory Volume in 1 second (FEV1)`);
            }}
          />
        </Box>
        <Box>
          <FormFileInput
            control={control}
            name="forcedVitalCapacity"
            label="Forced Vital Capacity (FVC)"
            fullWidth
            disabled={readOnly}
            required
            filePath={lungsFilePath}
            fileData={organsRequest.forcedVitalCapacity}
            setOpenImgModal={setOpenImgModal}
            setFile={setFile}
            setLoader={setLoader}
            setPreviewName={() => {
              setFileName(`Forced Vital Capacity (FVC)`);
            }}
          />
        </Box>

        <Box>
          <FormFileInput
            control={control}
            name="maximalVoluntaryVentilation"
            label="Maximal Voluntary Ventilation (MVV)"
            fullWidth
            disabled={readOnly}
            required
            filePath={lungsFilePath}
            fileData={organsRequest.maximalVoluntaryVentilation}
            setOpenImgModal={setOpenImgModal}
            setFile={setFile}
            setLoader={setLoader}
            setPreviewName={() => {
              setFileName(`Maximal Voluntary Ventilation (MVV)`);
            }}
          />
        </Box>

        <Box>
          <FormFileInput
            control={control}
            name="dlco"
            label="DLCO"
            fullWidth
            disabled={readOnly}
            required
            filePath={lungsFilePath}
            fileData={organsRequest.dlco}
            setOpenImgModal={setOpenImgModal}
            setFile={setFile}
            setLoader={setLoader}
            setPreviewName={() => {
              setFileName(`DLCO`);
            }}
          />
        </Box>
      </Box>
      <Text className="text-[#804595] !font-[600] !mb-7 !text-[19px] !mt-8">Ventilatory Status</Text>
      <Box className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Box>
          <FormAtomRadioGroup label="Self on Room air" name={'selfOnRoomAir'} row control={control} isRequired>
            <AtomRadio label="Yes" value={'1'} disabled={readOnly} />
            <AtomRadio label="No" value={'0'} disabled={readOnly} />
          </FormAtomRadioGroup>
        </Box>
        <Box>
          <FormAtomRadioGroup label="Supplement O2" name={'supplement02'} row control={control} isRequired>
            <AtomRadio label="Yes" value={'1'} disabled={readOnly} />
            <AtomRadio label="No" value={'0'} disabled={readOnly} />
          </FormAtomRadioGroup>
        </Box>
        <Box>
          <FormAtomRadioGroup
            label="Non-invasive ventilation (NIV)"
            name={'nonInvasiveVentilation'}
            row
            control={control}
            isRequired
          >
            <AtomRadio label="Yes" value={'1'} disabled={readOnly} />
            <AtomRadio label="No" value={'0'} disabled={readOnly} />
          </FormAtomRadioGroup>
        </Box>
        <Box>
          <FormAtomRadioGroup
            label="Mechanical Ventilation"
            name={'mechanicalVentilation'}
            row
            control={control}
            isRequired
          >
            <AtomRadio label="Yes" value={'1'} disabled={readOnly} />
            <AtomRadio label="No" value={'0'} disabled={readOnly} />
          </FormAtomRadioGroup>
        </Box>
        <Box>
          <FormAtomRadioGroup label="ECMO" name={'ecmo'} row control={control} isRequired>
            <AtomRadio label="Yes" value={'1'} disabled={readOnly} />
            <AtomRadio label="No" value={'0'} disabled={readOnly} />
          </FormAtomRadioGroup>
        </Box>
      </Box>
      <Text className="text-[#804595] !font-[600] !mb-7 !text-[19px] !mt-8">Arterial Blood Gas</Text>
      <Box className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Box>
          <FormInput control={control} name="roomAir" label="Room air" fullWidth disabled={readOnly} />
        </Box>
        <Box>
          <FormFileInput
            control={control}
            name="roomAirFile"
            label="Room air file"
            fullWidth
            disabled={readOnly}
            filePath={lungsFilePath}
            fileData={organsRequest.roomAirFile}
            setOpenImgModal={setOpenImgModal}
            setFile={setFile}
            setLoader={setLoader}
            setPreviewName={() => {
              setFileName(`Room air file`);
            }}
          />
        </Box>
        <Box>
          <FormInput control={control} name="onOxygen" label="On Oxygen" fullWidth disabled={readOnly} />
        </Box>
        <Box>
          <FormFileInput
            control={control}
            name="onOxygenFile"
            label="On Oxygen File"
            fullWidth
            disabled={readOnly}
            filePath={lungsFilePath}
            fileData={organsRequest.onOxygenFile}
            setOpenImgModal={setOpenImgModal}
            setFile={setFile}
            setLoader={setLoader}
            setPreviewName={() => {
              setFileName(`On Oxygen File`);
            }}
          />
        </Box>
      </Box>
      <FileViewModal open={openImgModal} onClose={() => setOpenImgModal(false)} file={file} fileLabel={fileName} />
      <LoadingOverlay isLoading={loader} />
    </div>
  );
};

export default Lungs;
