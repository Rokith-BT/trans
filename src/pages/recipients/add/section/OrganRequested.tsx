/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, FormSelect, MUIContainer, Text } from '@/atoms';
import React, { useEffect, useState } from 'react';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import RecipientFooter from './RecipientFooter';
import { DeleteIcon } from '@/assets/icons';
import { organRequestSchema } from '../../validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from '@mui/material';
import Heart from '../organLayouts/Heart';
import Kidney from '../organLayouts/Kidney';
import Liver from '../organLayouts/Liver';
import Pancreas from '../organLayouts/Pancreas';
import Lungs from '../organLayouts/Lungs';
import { useRecipient } from '../../RecipientContext';
import { useMasterData } from '@/pages/settings/setups/masterCotext';
import { useHospitals } from '@/pages/hospitals/hospitalListContext';
import { useParams } from 'react-router';
import { OrganRequestData } from '@/types/recipient';
// import { Organ } from '@/types/common.type';
// import { FileSliderDialog } from '@/pages/components/FileSliderDialog';

interface OrganRequestedProps {
  readOnly?: boolean;
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  onNext: (data: any) => void;
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  onBack?: any;
  isPreview: boolean;
  forCancel?: boolean;
  organsRequest?: OrganRequestData;
  HospitalData?: { hospitalID: number; hospitalName: string; hospitalType: string };
}

const OrganRequested: React.FC<OrganRequestedProps> = ({
  readOnly,
  onNext,
  onBack,
  isPreview,
  forCancel,
  organsRequest,
  HospitalData
}) => {
  const [file, setFile] = useState('');
  const [openImgModal, setOpenImgModal] = useState(false);
  const organsVal = organsRequest?.organReq || [];
  console.log(organsRequest, 'organsRequest',organsVal);
  const { recipientId } = useParams();

  const organIDs = { Heart: '11', Kidney: '1', Liver: '4', Pancreas: '10', Lungs: '12' };

  const {
    state: { complications, cancerscreening, lungdiseasecause, organs, alfListingType }
  } = useMasterData();
  const {
    actions: { getHospitalOrganList, getHospitalConsultantList },
    state: { consultants, hospitalOrgans, hospitalConsultant }
  } = useHospitals();
  console.log(consultants, hospitalOrgans, organs);

  useEffect(() => {
    if (HospitalData?.hospitalID) {
      getHospitalOrganList(Number(HospitalData?.hospitalID));
      getHospitalConsultantList(Number(HospitalData?.hospitalID));
    }
  }, [HospitalData?.hospitalID]);
  const {
    actions: { updateRecipientOrganReq },
    state: { currentRecipientID }
  } = useRecipient();
  const historyOfComplication = complications;
  const getOrgans = hospitalOrgans;

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(organRequestSchema),
    defaultValues: {
      isLoadingBasic: false,
      organReq: organsVal?.length > 0 ? organsVal : [{ recipientId: '', organId: '', consultantId: '' }],
      heartID: organsRequest?.heartID ?? 0,
      kidneyID: organsRequest?.kidneyID ?? 0,
      liverID: organsRequest?.liverID ?? 0,
      pancreasID: organsRequest?.pancreasID ?? 0,
      lungsID: organsRequest?.lungsID ?? 0,
      cardiacIndex: organsRequest?.cardiacIndex ?? undefined,
      tpgTransPulmonaryGradient: organsRequest?.tpgTransPulmonaryGradient ?? '',
      pvri: organsRequest?.pvri ?? null,
      sixMinuteWalkTest: organsRequest?.sixMinuteWalkTest ?? '0',
      sixMinuteWalkTestDistance: organsRequest?.sixMinuteWalkTestDistance ?? null,
      NtProBnp: organsRequest?.NtProBnp ?? null,
      historyOfPreviousNonTransplantHeartAndLungSurgery:
        organsRequest?.historyOfPreviousNonTransplantHeartAndLungSurgery ?? '0',
      surgeryDetails: organsRequest?.surgeryDetails ?? '',
      ureaKidny: organsRequest?.ureaKidny ?? null,
      creatineKidny: organsRequest?.creatineKidny ?? null,
      serumSodiumKidny: organsRequest?.serumSodiumKidny ?? null,
      serumPotassiumKidny: organsRequest?.serumPotassiumKidny ?? null,
      serumChlorideKidny: organsRequest?.serumChlorideKidny ?? null,
      serumBicarbonateKidny: organsRequest?.serumBicarbonateKidny ?? null,
      firstDialysisDateKidny: organsRequest?.firstDialysisDateKidny?.toString() ?? '',
      periodUndergoingDialysisKidny: organsRequest?.periodUndergoingDialysisKidny ?? null,
      isAlf: organsRequest?.isAlf ?? false,
      alfListingType: organsRequest?.alfListingType ?? '',
      alfEvaluationSheet: organsRequest?.alfEvaluationSheet ?? '',
      additionalHepatologyNotes: organsRequest?.additionalHepatologyNotes ?? '',
      consultantShortSummary: organsRequest?.consultantShortSummary ?? '',
      historyOfComplications: organsRequest?.historyOfComplications ?? '',
      complicationDescription: organsRequest?.complicationDescription ?? '',
      cancerScreening: organsRequest?.cancerScreening ?? null,
      meldScore: organsRequest?.meldScore ?? null,
      bilirubin: organsRequest?.bilirubin ?? null,
      albumin: organsRequest?.albumin ?? null,
      globulin: organsRequest?.globulin ?? null,
      ggt: organsRequest?.ggt ?? null,
      ast: organsRequest?.ast ?? null,
      alt: organsRequest?.alt ?? null,
      coronaryAngiogram: organsRequest?.coronaryAngiogram ?? '',
      stressTest: organsRequest?.stressTest ?? '',
      roomAirAbg: organsRequest?.roomAirAbg ?? '',
      pft: organsRequest?.pft ?? '',
      ureaLiver: organsRequest?.ureaLiver ?? null,
      creatineLiver: organsRequest?.creatineLiver ?? null,
      uricAcidLiver: organsRequest?.uricAcidLiver ?? null,
      serumSodiumLiver: organsRequest?.serumSodiumLiver ?? null,
      serumPotassiumLiver: organsRequest?.serumPotassiumLiver ?? null,
      serumChlorideLiver: organsRequest?.serumChlorideLiver ?? null,
      serumBicarbonateLiver: organsRequest?.serumBicarbonateLiver ?? null,
      serumMagnesiumLiver: organsRequest?.serumMagnesiumLiver ?? null,
      serumPhosphateLiver: organsRequest?.serumPhosphateLiver ?? null,
      inr: organsRequest?.inr ?? null,
      aptt: organsRequest?.aptt ?? null,
      platelets: organsRequest?.platelets ?? null,
      fibrinogen: organsRequest?.fibrinogen ?? null,
      historyOfComplicationsPancreas: organsRequest?.historyOfComplicationsPancreas ?? '',
      complicationDescriptionPancreas: organsRequest?.complicationDescriptionPancreas ?? '',
      cancerScreeningPancreas: organsRequest?.cancerScreeningPancreas ?? null,
      meldScorePancreas: organsRequest?.meldScorePancreas ?? null,
      bilirubinPancreas: organsRequest?.bilirubinPancreas ?? null,
      albuminPancreas: organsRequest?.albuminPancreas ?? null,
      globulinPancreas: organsRequest?.globulinPancreas ?? null,
      ggtPancreas: organsRequest?.ggtPancreas ?? null,
      astPancreas: organsRequest?.astPancreas ?? null,
      altPancreas: organsRequest?.altPancreas ?? null,
      coronaryAngiogramPancreas: organsRequest?.coronaryAngiogramPancreas ?? '',
      stressTestPancreas: organsRequest?.stressTestPancreas ?? '',
      roomAirAbgPancreas: organsRequest?.roomAirAbgPancreas ?? '',
      pftPancreas: organsRequest?.pftPancreas ?? '',
      ureaPancreas: organsRequest?.ureaPancreas ?? null,
      creatinePancreas: organsRequest?.creatinePancreas ?? null,
      uricAcidPancreas: organsRequest?.uricAcidPancreas ?? null,
      serumSodiumPancreas: organsRequest?.serumSodiumPancreas ?? null,
      serumPotassiumPancreas: organsRequest?.serumPotassiumPancreas ?? null,
      serumChloridePancreas: organsRequest?.serumChloridePancreas ?? null,
      serumBicarbonatePancreas: organsRequest?.serumBicarbonatePancreas ?? null,
      serumMagnesiumPancreas: organsRequest?.serumMagnesiumPancreas ?? null,
      serumPhosphatePancreas: organsRequest?.serumPhosphatePancreas ?? null,
      inrPancreas: organsRequest?.inrPancreas ?? null,
      apttPancreas: organsRequest?.apttPancreas ?? null,
      plateletsPancreas: organsRequest?.plateletsPancreas ?? null,
      fibrinogenPancreas: organsRequest?.fibrinogenPancreas ?? null,
      causeOfLungDisease: organsRequest?.causeOfLungDisease ?? '',
      sixMinuteWalkTestLungs: organsRequest?.sixMinuteWalkTestLungs ?? '0',
      sixMinuteWalkTestDistanceLungs: organsRequest?.sixMinuteWalkTestDistanceLungs ?? null,
      historyOfPreviousNonTransplantHeartAndLungSurgeryLungs:
        organsRequest?.historyOfPreviousNonTransplantHeartAndLungSurgeryLungs ?? '0',
      surgeryDetailsLungs: organsRequest?.surgeryDetailsLungs ?? '',
      forcedExpiratoryVolumeIn1Second: organsRequest?.forcedExpiratoryVolumeIn1Second ?? '',
      forcedVitalCapacity: organsRequest?.forcedVitalCapacity ?? '',
      maximalVoluntaryVentilation: organsRequest?.maximalVoluntaryVentilation ?? '',
      dlco: organsRequest?.dlco ?? '',
      selfOnRoomAir: organsRequest?.selfOnRoomAir ?? '0',
      supplement02: organsRequest?.supplement02 ?? '0',
      nonInvasiveVentilation: organsRequest?.nonInvasiveVentilation ?? '0',
      mechanicalVentilation: organsRequest?.mechanicalVentilation ?? '0',
      ecmo: organsRequest?.ecmo ?? '0',
      roomAir: organsRequest?.roomAir ?? null,
      roomAirFile: organsRequest?.roomAirFile ?? '',
      onOxygen: organsRequest?.onOxygen ?? null,
      onOxygenFile: organsRequest?.onOxygenFile ?? ''
    }
  });
  useEffect(() => {
    if (organsRequest) {
      reset({
        organReq: organsVal?.length > 0 ? organsVal : [{ recipientId: '', organId: '', consultantId: '' }],
        heartID: organsRequest?.heartID ?? 0,
        kidneyID: organsRequest?.kidneyID ?? 0,
        liverID: organsRequest?.liverID ?? 0,
        pancreasID: organsRequest?.pancreasID ?? 0,
        lungsID: organsRequest?.lungsID ?? 0,
        cardiacIndex: organsRequest?.cardiacIndex ?? undefined,
        tpgTransPulmonaryGradient: organsRequest?.tpgTransPulmonaryGradient ?? '',
        pvri: organsRequest?.pvri ?? null,
        sixMinuteWalkTest: organsRequest?.sixMinuteWalkTest ?? '0',
        sixMinuteWalkTestDistance: organsRequest?.sixMinuteWalkTestDistance ?? null,
        NtProBnp: organsRequest?.NtProBnp ?? null,
        historyOfPreviousNonTransplantHeartAndLungSurgery:
          organsRequest?.historyOfPreviousNonTransplantHeartAndLungSurgery ?? '0',
        surgeryDetails: organsRequest?.surgeryDetails ?? '',
        ureaKidny: organsRequest?.ureaKidny ?? null,
        creatineKidny: organsRequest?.creatineKidny ?? null,
        serumSodiumKidny: organsRequest?.serumSodiumKidny ?? null,
        serumPotassiumKidny: organsRequest?.serumPotassiumKidny ?? null,
        serumChlorideKidny: organsRequest?.serumChlorideKidny ?? null,
        serumBicarbonateKidny: organsRequest?.serumBicarbonateKidny ?? null,
        firstDialysisDateKidny: organsRequest?.firstDialysisDateKidny?.toString() ?? '',
        periodUndergoingDialysisKidny: organsRequest?.periodUndergoingDialysisKidny ?? null,
        isAlf: organsRequest?.isAlf ?? false,
        alfListingType: organsRequest?.alfListingType ?? '',
        alfEvaluationSheet: organsRequest?.alfEvaluationSheet ?? '',
        additionalHepatologyNotes: organsRequest?.additionalHepatologyNotes ?? '',
        consultantShortSummary: organsRequest?.consultantShortSummary ?? '',
        historyOfComplications: organsRequest?.historyOfComplications ?? '',
        complicationDescription: organsRequest?.complicationDescription ?? '',
        cancerScreening: organsRequest?.cancerScreening ?? null,
        meldScore: organsRequest?.meldScore ?? null,
        bilirubin: organsRequest?.bilirubin ?? null,
        albumin: organsRequest?.albumin ?? null,
        globulin: organsRequest?.globulin ?? null,
        ggt: organsRequest?.ggt ?? null,
        ast: organsRequest?.ast ?? null,
        alt: organsRequest?.alt ?? null,
        coronaryAngiogram: organsRequest?.coronaryAngiogram ?? '',
        stressTest: organsRequest?.stressTest ?? '',
        roomAirAbg: organsRequest?.roomAirAbg ?? '',
        pft: organsRequest?.pft ?? '',
        ureaLiver: organsRequest?.ureaLiver ?? null,
        creatineLiver: organsRequest?.creatineLiver ?? null,
        uricAcidLiver: organsRequest?.uricAcidLiver ?? null,
        serumSodiumLiver: organsRequest?.serumSodiumLiver ?? null,
        serumPotassiumLiver: organsRequest?.serumPotassiumLiver ?? null,
        serumChlorideLiver: organsRequest?.serumChlorideLiver ?? null,
        serumBicarbonateLiver: organsRequest?.serumBicarbonateLiver ?? null,
        serumMagnesiumLiver: organsRequest?.serumMagnesiumLiver ?? null,
        serumPhosphateLiver: organsRequest?.serumPhosphateLiver ?? null,
        inr: organsRequest?.inr ?? null,
        aptt: organsRequest?.aptt ?? null,
        platelets: organsRequest?.platelets ?? null,
        fibrinogen: organsRequest?.fibrinogen ?? null,
        historyOfComplicationsPancreas: organsRequest?.historyOfComplicationsPancreas ?? '',
        complicationDescriptionPancreas: organsRequest?.complicationDescriptionPancreas ?? '',
        cancerScreeningPancreas: organsRequest?.cancerScreeningPancreas ?? null,
        meldScorePancreas: organsRequest?.meldScorePancreas ?? null,
        bilirubinPancreas: organsRequest?.bilirubinPancreas ?? null,
        albuminPancreas: organsRequest?.albuminPancreas ?? null,
        globulinPancreas: organsRequest?.globulinPancreas ?? null,
        ggtPancreas: organsRequest?.ggtPancreas ?? null,
        astPancreas: organsRequest?.astPancreas ?? null,
        altPancreas: organsRequest?.altPancreas ?? null,
        coronaryAngiogramPancreas: organsRequest?.coronaryAngiogramPancreas ?? '',
        stressTestPancreas: organsRequest?.stressTestPancreas ?? '',
        roomAirAbgPancreas: organsRequest?.roomAirAbgPancreas ?? '',
        pftPancreas: organsRequest?.pftPancreas ?? '',
        ureaPancreas: organsRequest?.ureaPancreas ?? null,
        creatinePancreas: organsRequest?.creatinePancreas ?? null,
        uricAcidPancreas: organsRequest?.uricAcidPancreas ?? null,
        serumSodiumPancreas: organsRequest?.serumSodiumPancreas ?? null,
        serumPotassiumPancreas: organsRequest?.serumPotassiumPancreas ?? null,
        serumChloridePancreas: organsRequest?.serumChloridePancreas ?? null,
        serumBicarbonatePancreas: organsRequest?.serumBicarbonatePancreas ?? null,
        serumMagnesiumPancreas: organsRequest?.serumMagnesiumPancreas ?? null,
        serumPhosphatePancreas: organsRequest?.serumPhosphatePancreas ?? null,
        inrPancreas: organsRequest?.inrPancreas ?? null,
        apttPancreas: organsRequest?.apttPancreas ?? null,
        plateletsPancreas: organsRequest?.plateletsPancreas ?? null,
        fibrinogenPancreas: organsRequest?.fibrinogenPancreas ?? null,
        causeOfLungDisease: organsRequest?.causeOfLungDisease ?? '',
        sixMinuteWalkTestLungs: organsRequest?.sixMinuteWalkTestLungs ?? '0',
        sixMinuteWalkTestDistanceLungs: organsRequest?.sixMinuteWalkTestDistanceLungs ?? null,
        historyOfPreviousNonTransplantHeartAndLungSurgeryLungs:
          organsRequest?.historyOfPreviousNonTransplantHeartAndLungSurgeryLungs ?? '0',
        surgeryDetailsLungs: organsRequest?.surgeryDetailsLungs ?? '',
        forcedExpiratoryVolumeIn1Second: organsRequest?.forcedExpiratoryVolumeIn1Second ?? '',
        forcedVitalCapacity: organsRequest?.forcedVitalCapacity ?? '',
        maximalVoluntaryVentilation: organsRequest?.maximalVoluntaryVentilation ?? '',
        dlco: organsRequest?.dlco ?? '',
        selfOnRoomAir: organsRequest?.selfOnRoomAir ?? '0',
        supplement02: organsRequest?.supplement02 ?? '0',
        nonInvasiveVentilation: organsRequest?.nonInvasiveVentilation ?? '0',
        mechanicalVentilation: organsRequest?.mechanicalVentilation ?? '0',
        ecmo: organsRequest?.ecmo ?? '0',
        roomAir: organsRequest?.roomAir ?? null,
        roomAirFile: organsRequest?.roomAirFile ?? '',
        onOxygen: organsRequest?.onOxygen ?? null,
        onOxygenFile: organsRequest?.onOxygenFile ?? ''
      });
    }
  }, [reset, organsRequest]);
  console.log(errors, 'errorserrorserrorserrors');

  const OrganReq: any = watch('organReq');
  const sixMinuteWalkTest = watch('sixMinuteWalkTest');
  const sixMinuteWalkTestLungs = watch('sixMinuteWalkTestLungs');
  const historyOfPreviousNonTransplantHeartAndLungSurgery = watch('historyOfPreviousNonTransplantHeartAndLungSurgery');
  const historyOfPreviousNonTransplantHeartAndLungSurgeryLungs = watch(
    'historyOfPreviousNonTransplantHeartAndLungSurgeryLungs'
  );
  const isAlf = watch('isAlf');
  const alfListingTypei = watch('alfListingType');
  const isLoadingBasic = watch('isLoadingBasic');
  console.log(alfListingTypei, 'alfListingTypei');

  const { fields, append, remove } = useFieldArray({ control, name: 'organReq' });
  const handleNewOrgan = () => {
    append({ organId: '', consultantId: '' });
  };
  const getFilteredOptions = (index: number) => {
    const selectedValues = fields.map((field) => field.organId);
    return getOrgans.filter(
      (option: { value: string }) => !selectedValues.includes(option.value) || option.value === fields[index]?.organId
    );
  };
  const onSubmit = async (data: any) => {
    setValue('isLoadingBasic', true);
    const payload = OrganReq.map((organ: { organId: string | number; consultantId: any }) => {
      const basePayload = {
        recipientId: currentRecipientID,
        organId: organ.organId,
        consultantId: organ.consultantId,
        isAlf: data.isAlf,
        ...(data.isAlf &&
          organ.organId === '4' && {
            recipientALFBasicDetail: {
              id: organsRequest?.alfId,
              recipientId: currentRecipientID,
              organId: organ.organId,
              alfListingTypeId: data.alfListingType,
              alfEvlouationSheetDoc: data.alfEvaluationSheet,
              additionalHepatologyNotesDoc: data.additionalHepatologyNotes,
              consulatantShortSummaryDoc: data.consultantShortSummary
            }
          })
      };

      const evaluations = {
        [organIDs.Heart]: {
          recipientHeartEvaluation: {
            id: organsRequest?.heartID ? organsRequest?.heartID : 0,
            recipientId: currentRecipientID,
            organId: organ.organId,
            cardiacIndex: data.cardiacIndex,
            tpgtransPulmonaryGradient: data.tpgTransPulmonaryGradient,
            pvri: data.pvri,
            sixMinuteWalkTestAble: data.sixMinuteWalkTest === '1',
            sixMinuteWalkTestDistance: data.sixMinuteWalkTestDistance,
            ntproBnppercentage: data.NtProBnp,
            historyNonTransplantSurgery: data.historyOfPreviousNonTransplantHeartAndLungSurgery === '1',
            surgeryDetails: data.surgeryDetails
          }
        },
        [organIDs.Kidney]: {
          recipientKidneyEvaluation: {
            id: organsRequest?.kidneyID ? organsRequest?.kidneyID : 0,
            recipientId: currentRecipientID,
            organId: organ.organId,
            urea: data.ureaKidny,
            creatine: data.creatineKidny,
            serumSodium: data.serumSodiumKidny,
            serumPotassium: data.serumPotassiumKidny,
            serumChloride: data.serumChlorideKidny,
            serumBicarbonate: data.serumBicarbonateKidny,
            firstDialysisDate: data.firstDialysisDateKidny,
            periodUndergoingDialysis: data.periodUndergoingDialysisKidny
          }
        },
        [organIDs.Liver]: {
          recipientLiverEvaluation: {
            id: organsRequest?.liverID ? organsRequest?.liverID : 0,
            recipientId: currentRecipientID,
            organId: organ.organId,
            historyOfComplicationsId: data.historyOfComplications,
            complicationDescription: data.complicationDescription,
            cancerScreeningId: data.cancerScreening || null,
            meldScore: data.meldScore,
            bilirubin: data.bilirubin,
            albumin: data.albumin || null,
            globulin: data.globulin,
            ggt: data.ggt,
            alt: data.alt,
            ast: data.ast,
            coronaryAngiogram: data.coronaryAngiogram,
            stressTest: data.stressTest,
            roomAirAbg: data.roomAirAbg,
            pft: data.pft,
            urea: data.ureaLiver,
            creatine: data.creatineLiver,
            uricAcid: data.uricAcidLiver || null,
            serumSodium: data.serumSodiumLiver,
            serumPotassium: data.serumPotassiumLiver,
            serumChloride: data.serumChlorideLiver,
            serumBicarbonate: data.serumBicarbonateLiver,
            serumMagnesium: data.serumMagnesiumLiver || null,
            serumPhosphate: data.serumPhosphateLiver || null,
            inr: data.inr,
            aptt: data.aptt || null,
            platelets: data.platelets || null,
            fibrinogen: data.fibrinogen || null
          }
        },
        [organIDs.Pancreas]: {
          recipientLiverEvaluation: {
            id: organsRequest?.pancreasID ? organsRequest?.pancreasID : 0,
            recipientId: currentRecipientID,
            organId: organ.organId,
            historyOfComplicationsId: data.historyOfComplicationsPancreas,
            complicationDescription: data.complicationDescriptionPancreas,
            cancerScreeningId: data.cancerScreeningPancreas,
            meldScore: data.meldScorePancreas,
            bilirubin: data.bilirubinPancreas,
            albumin: data.albuminPancreas,
            globulin: data.globulinPancreas,
            ggt: data.ggtPancreas,
            alt: data.altPancreas,
            ast: data.astPancreas,
            coronaryAngiogram: data.coronaryAngiogramPancreas,
            stressTest: data.stressTestPancreas,
            roomAirAbg: data.roomAirAbgPancreas,
            pft: data.pftPancreas,
            urea: data.ureaPancreas,
            creatine: data.creatinePancreas,
            uricAcid: data.uricAcidPancreas || null,
            serumSodium: data.serumSodiumPancreas,
            serumPotassium: data.serumPotassiumPancreas,
            serumChloride: data.serumChloridePancreas,
            serumBicarbonate: data.serumBicarbonatePancreas,
            serumMagnesium: data.serumMagnesiumPancreas || null,
            serumPhosphate: data.serumPhosphatePancreas || null,
            inr: data.inrPancreas,
            aptt: data.apttPancreas || null,
            platelets: data.plateletsPancreas || null,
            fibrinogen: data.fibrinogenPancreas || null
          }
        },
        [organIDs.Lungs]: {
          recipientLungEvaluation: {
            id: organsRequest?.lungsID ? organsRequest?.lungsID : 0,
            recipientId: currentRecipientID,
            organId: organ.organId,
            causeofLungDiseaseId: data.causeOfLungDisease,
            sixMinWalkTestComp: data.sixMinuteWalkTestLungs === '1',
            sixMWalkTestDist: data.sixMinuteWalkTestDistanceLungs || null,
            histPrevNonTxHrtLungSurg: data.historyOfPreviousNonTransplantHeartAndLungSurgeryLungs === '1',
            surgeryDetails: data.surgeryDetailsLungs,
            fev1: data.forcedExpiratoryVolumeIn1Second,
            fvc: data.forcedVitalCapacity,
            mvv: data.maximalVoluntaryVentilation,
            dlco: data.dlco,
            selfonRoomAir: data.selfOnRoomAir === '1',
            supplement02: data.supplement02 === '1',
            niv: data.nonInvasiveVentilation === '1',
            mechanicalVentilation: data.mechanicalVentilation === '1',
            ecmo: data.ecmo === '1',
            roomAir: data.roomAir || null,
            roomAirFile: data.roomAirFile,
            onOxygen: data.onOxygen || null,
            onOxygenFile: data.onOxygenFile
          }
        }
      };

      return { ...basePayload, ...(evaluations[organ.organId] || {}) };
    });

    console.log(payload, 'payload12');

    if (recipientId) {
      updateRecipientOrganReq(Number(recipientId), payload, () => onNext(data));
    } else {
      updateRecipientOrganReq(currentRecipientID, payload, () => onNext(data));
    }
  };

  return (
    <div className="mt-8">
      <MUIContainer maxWidth="xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          {fields.length > 0 &&
            fields.map((field, index) => {
              const filteredOptions = getFilteredOptions(index);
              return (
                <Box key={field.id}>
                  <Box className="flex items-center justify-between my-1">
                    {index === 0 ? (
                      <Text className="!text-[19px] text-[#804595]  !font-[700] !mb-6">Organ Requested</Text>
                    ) : (
                      <Text className="!mb-0"></Text>
                    )}

                    {!readOnly ? (
                      <>
                        {index < 1 ? (
                          <>
                            <Button
                              variant="text"
                              className=" !bg-transparent !text-[#C967A2] !font-[500] !text-[16px] disabled:opacity-50"
                              onClick={handleNewOrgan}
                              disabled={readOnly}
                            >
                              + Add Organ
                            </Button>
                          </>
                        ) : (
                          <div>
                            <DeleteIcon
                              onClick={() => remove(index)}
                              className="relative top-9 md:top-6 right-[-19px]"
                            />
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="relative top-6 mb-4"> </div>
                      </>
                    )}
                  </Box>
                  <Box className="flex flex-wrap gap-y-[28px] -mx-[27px] ">
                    <Box className="px-8 w-full md:w-1/3 md:px-[27px] relative ">
                      <FormSelect
                        menuOptions={filteredOptions}
                        control={control}
                        name={`organReq.${index}.organId`}
                        label="Organ"
                        fullWidth
                        required
                        disabled={readOnly}
                      />
                    </Box>
                    <Box className="px-8 w-full md:w-1/3 md:px-[27px] relative">
                      <FormSelect
                        menuOptions={hospitalConsultant}
                        control={control}
                        name={`organReq.${index}.consultantId`}
                        label="Consultant Name"
                        fullWidth
                        required
                        disabled={readOnly}
                      />
                    </Box>
                    {OrganReq[index]?.organId === organIDs.Liver && (
                      <>
                        <Controller
                          name="isAlf"
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <>
                              {!readOnly && (
                                <>
                                  <Checkbox {...field} checked={field.value} />
                                  <span className="!mt-2">IS ALF</span>
                                </>
                              )}
                            </>
                          )}
                        />
                      </>
                    )}
                  </Box>
                </Box>
              );
            })}
          {OrganReq.length > 0 &&
            OrganReq.map((organs: { organId: string }) => {
              return (
                <>
                  {organs?.organId === organIDs.Heart && (
                    <>
                      <Heart
                        control={control}
                        readOnly={readOnly}
                        sixMinuteWalkTest={sixMinuteWalkTest}
                        historyOfPreviousNonTransplantHeartAndLungSurgery={
                          historyOfPreviousNonTransplantHeartAndLungSurgery
                        }
                      />
                      <hr className="mt-8 mb-6 border-dashed border-[#8045954D]" />
                    </>
                  )}
                  {organs?.organId === organIDs.Kidney && (
                    <>
                      <Kidney control={control} readOnly={readOnly} />
                      <hr className="mt-8 mb-6 border-dashed border-[#8045954D]" />
                    </>
                  )}
                  {organs?.organId === organIDs.Liver && (
                    <>
                      <Liver
                        control={control}
                        readOnly={readOnly}
                        isAlf={isAlf}
                        getHistoryOfComplications={historyOfComplication}
                        getCancerScreening={cancerscreening}
                        getALFListing={alfListingType}
                        currentRecipientID={currentRecipientID}
                        organsRequest={organsRequest ?? ({} as OrganRequestData)}
                        file={file}
                        setFile={setFile}
                        openImgModal={openImgModal}
                        setOpenImgModal={setOpenImgModal}
                      />
                      <hr className="mt-8 mb-6 border-dashed border-[#8045954D]" />
                    </>
                  )}
                  {organs?.organId === organIDs.Pancreas && (
                    <>
                      <Pancreas
                        control={control}
                        readOnly={readOnly}
                        getHistoryOfComplications={historyOfComplication}
                        getCancerScreening={cancerscreening}
                        currentRecipientID={currentRecipientID}
                        organsRequest={organsRequest ?? ({} as OrganRequestData)}
                        file={file}
                        setFile={setFile}
                        openImgModal={openImgModal}
                        setOpenImgModal={setOpenImgModal}
                      />
                      <hr className="mt-8 mb-6 border-dashed border-[#8045954D]" />
                    </>
                  )}
                  {organs?.organId === organIDs.Lungs && (
                    <>
                      <Lungs
                        control={control}
                        readOnly={readOnly}
                        sixMinuteWalkTestLungs={sixMinuteWalkTestLungs}
                        getLungDisease={lungdiseasecause}
                        historyOfPreviousNonTransplantHeartAndLungSurgeryLungs={
                          historyOfPreviousNonTransplantHeartAndLungSurgeryLungs
                        }
                        currentRecipientID={currentRecipientID}
                        organsRequest={organsRequest ?? ({} as OrganRequestData)}
                        file={file}
                        setFile={setFile}
                        openImgModal={openImgModal}
                        setOpenImgModal={setOpenImgModal}
                      />
                    </>
                  )}
                </>
              );
            })}

          {isPreview && (
            <RecipientFooter
              onBack={() => onBack(currentRecipientID)}
              onNext={handleSubmit(onSubmit)}
              forCancel={forCancel}
              isLoadingBasic={isLoadingBasic}
            />
          )}
        </form>
      </MUIContainer>
    </div>
  );
};
export default OrganRequested;
