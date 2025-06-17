/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Box, Button, FormFileInput, FormSelect, Text } from '@/atoms';
import { OrganRequestData } from '@/types/recipient';
import FileViewModal from '@/pages/recipients/add/section/FileViewModal';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useRecipient } from '@/pages/recipients/RecipientContext';
import { useNavigate } from 'react-router';
import { useALF } from '../ALFContext';
import LoadingOverlay from '@/pages/components/LoadingOverlay';
import ALFRejectDialog from './ALFRejectDialog';
import { useRole } from '@/hooks/useRole';
const alfLiverSchema = z.object({
  alfListingType: z.string().nullable().optional(),
  alfEvaluationSheet: z.any(),
  additionalHepatologyNotes: z.any(),
  consultantShortSummary: z.any()
});

interface addALFProps {
  readOnly?: boolean;
  getALFListing?: { label: string; value: string }[];
  currentRecipientID?: number | string;
  organsRequest?: OrganRequestData;
  isApprove?: boolean;
  alfID?: string | number;
  isALFReview?: boolean;
  viewOnly?: boolean;
  isDeleteEnable?: boolean;
  recipientName?: string;
}

const AddALF: React.FC<addALFProps> = ({
  readOnly,
  getALFListing,
  currentRecipientID,
  organsRequest,
  isApprove,
  alfID,
  isALFReview,
  viewOnly,
  isDeleteEnable,
  recipientName
}) => {
  console.log(alfID, 'alfIDalfIDalfIDalfIDalfIDalfIDalfIDalfID', organsRequest);
  const { isSuperAdmin } = useRole();
  const [openImgModal, setOpenImgModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [file, setFile] = useState('');
  const [loader, setLoader] = useState(false);
  const [liver, setLiver] = useState([]);
  const navigate = useNavigate();
  const addALFFilePath = `recipient/${currentRecipientID}/liver-alf`;
  const {
    state: { getRecipientById },
    actions: { getRecipientDataByID, updateRecipientOrganReq }
  } = useRecipient();
  const {
    state: {},
    actions: { alfApprove, alfReject, updateALFConsultant, alfUpdate, alfDelete }
  } = useALF();
  useEffect(() => {
    if (currentRecipientID) {
      getRecipientDataByID(Number(currentRecipientID));
    }
  }, [currentRecipientID]);
  useEffect(() => {
    const dataOrgan: any = { organReq: [] };
    getRecipientById?.recipientOrganMappings?.map((ele: any) => {
      if (ele?.organId === Number(4)) {
        dataOrgan.organReq.push({
          recipientId: ele?.recipientId,
          organId: ele?.organId.toString(),
          consultantId: ele?.consultantId.toString()
        });
        dataOrgan.isAlf = ele?.isAlf;
        dataOrgan.alfListingType = ele?.recipientALFBasicDetail?.alfListingType;
        dataOrgan.alfEvaluationSheet = ele?.recipientALFBasicDetail?.alfEvaluationSheet;
        dataOrgan.additionalHepatologyNotes = ele?.recipientALFBasicDetail?.additionalHepatologyNotes;
        dataOrgan.consultantShortSummary = ele?.recipientALFBasicDetail?.consultantShortSummary;
        dataOrgan.alfId = ele?.recipientALFBasicDetail?.id;
        dataOrgan.historyOfComplications = ele?.recipientLiverEvaluation?.historyOfComplicationsId?.toString();
        dataOrgan.complicationDescription = ele?.recipientLiverEvaluation?.complicationDescription?.toString();
        dataOrgan.cancerScreening = ele?.recipientLiverEvaluation?.cancerScreeningId?.toString();
        dataOrgan.meldScore = ele?.recipientLiverEvaluation?.meldScore?.toString();
        dataOrgan.bilirubin = ele?.recipientLiverEvaluation?.bilirubin?.toString();
        dataOrgan.albumin = ele?.recipientLiverEvaluation?.albumin?.toString();
        dataOrgan.globulin = ele?.recipientLiverEvaluation?.globulin?.toString();
        dataOrgan.ggt = ele?.recipientLiverEvaluation?.ggt?.toString();
        dataOrgan.ast = ele?.recipientLiverEvaluation?.ast?.toString();
        dataOrgan.alt = ele?.recipientLiverEvaluation?.alt?.toString();
        dataOrgan.coronaryAngiogram = ele?.recipientLiverEvaluation?.coronaryAngiogram;
        dataOrgan.stressTest = ele?.recipientLiverEvaluation?.stressTest;
        dataOrgan.roomAirAbg = ele?.recipientLiverEvaluation?.roomAirAbg;
        dataOrgan.pft = ele?.recipientLiverEvaluation?.pft;
        dataOrgan.ureaLiver = ele?.recipientLiverEvaluation?.urea?.toString();
        dataOrgan.creatineLiver = ele?.recipientLiverEvaluation?.creatine?.toString();
        dataOrgan.uricAcidLiver = ele?.recipientLiverEvaluation?.uricAcid?.toString();
        dataOrgan.serumSodiumLiver = ele?.recipientLiverEvaluation?.serumSodium?.toString();
        dataOrgan.serumPotassiumLiver = ele?.recipientLiverEvaluation?.serumPotassium?.toString();
        dataOrgan.serumChlorideLiver = ele?.recipientLiverEvaluation?.serumChloride?.toString();
        dataOrgan.serumBicarbonateLiver = ele?.recipientLiverEvaluation?.serumChloride?.toString();
        dataOrgan.serumMagnesiumLiver = ele?.recipientLiverEvaluation?.serumMagnesium?.toString();
        dataOrgan.serumPhosphateLiver = ele?.recipientLiverEvaluation?.serumPhosphate?.toString();
        dataOrgan.inr = ele?.recipientLiverEvaluation?.inr?.toString();
        dataOrgan.aptt = ele?.recipientLiverEvaluation?.aptt?.toString();
        dataOrgan.platelets = ele?.recipientLiverEvaluation?.platelets?.toString();
        dataOrgan.fibrinogen = ele?.recipientLiverEvaluation?.fibrinogen?.toString();
      }
    });
    setLiver(dataOrgan?.organReq);
  }, [getRecipientById]);
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(alfLiverSchema),
    defaultValues: {
      alfListingType: organsRequest?.alfListingType ?? '',
      alfEvaluationSheet: organsRequest?.alfEvaluationSheet ?? '',
      additionalHepatologyNotes: organsRequest?.additionalHepatologyNotes ?? '',
      consultantShortSummary: organsRequest?.consultantShortSummary ?? ''
    }
  });
  useEffect(() => {
    reset({
      alfListingType: organsRequest?.alfListingType ?? '',
      alfEvaluationSheet: organsRequest?.alfEvaluationSheet ?? '',
      additionalHepatologyNotes: organsRequest?.additionalHepatologyNotes ?? '',
      consultantShortSummary: organsRequest?.consultantShortSummary ?? ''
    });
  }, [reset, organsRequest]);
  console.log(liver, 'liverliverliverliverliverliver', errors);

  const onSubmit = async (data: any) => {
    const payload = liver?.map((organ: { organId: string | number; consultantId: number | string }) => {
      const basePayload = {
        recipientId: currentRecipientID,
        organId: organ.organId,
        consultantId: organ.consultantId,
        isAlf: true,
        ...{
          recipientALFBasicDetail: {
            id: organsRequest?.alfId || 0,
            recipientId: currentRecipientID,
            organId: organ.organId,
            alfListingTypeId: data.alfListingType,
            alfEvlouationSheetDoc: data.alfEvaluationSheet,
            additionalHepatologyNotesDoc: data.additionalHepatologyNotes,
            consulatantShortSummaryDoc: data.consultantShortSummary
          }
        }
      };
      return { ...basePayload };
    });
    updateRecipientOrganReq(Number(currentRecipientID), payload, () => {
      if (!organsRequest?.alfId) {
        navigate('/alf');
        return;
      }
      alfUpdate(Number(organsRequest?.alfId), () => {
        navigate('/alf');
      });
    });
    console.log(payload, 'payloadpayload');
  };
  const handleSubmitTransanApprove = (flog: string) => {
    if (flog === 'reject') {
      alfReject(Number(alfID), flog, () => {
        navigate('/alf');
      });
    } else {
      alfApprove(Number(alfID), flog, () => {
        navigate('/alf');
      });
    }
  };
  const handleSubmitALFApprove = (flog: string) => {
    if (flog === 'Approved') {
      updateALFConsultant(Number(alfID), flog, flog, () => {
        navigate('/alf');
      });
    } else if (flog === 'Hold') {
      updateALFConsultant(Number(alfID), flog, flog, () => {
        navigate('/alf');
      });
    } else {
      updateALFConsultant(Number(alfID), flog, flog, () => {
        navigate('/alf');
      });
    }
  };
  return (
    <div className="mb-10">
      <form onSubmit={() => {}}>
        {!viewOnly && (
          <>
            {isApprove ? (
              <Box className="flex flex-wrap gap-3 justify-end">
                <Button
                  variant="outlined"
                  className="w-[140px] h-[38px] border border-[#D876A9] text-[#D876A9]"
                  // onClick={() => handleSubmitTransanApprove('reject')}
                  onClick={() => {
                    setOpenDialog(true);
                  }}
                >
                  Reject
                </Button>
                <Button
                  variant="contained"
                  className="w-[140px] h-[38px] bg-[#D876A9] text-white"
                  onClick={() => handleSubmitTransanApprove('approve')}
                >
                  Submit
                </Button>
              </Box>
            ) : isALFReview ? (
              <Box className="flex flex-wrap gap-3 justify-end">
                <Button
                  variant="contained"
                  className="w-[140px] h-[38px] bg-[#80C967] text-white"
                  onClick={() => handleSubmitALFApprove('Approved')}
                >
                  Approve
                </Button>
                <Button
                  variant="outlined"
                  className="w-[140px] h-[38px] bg-[#C9A267] text-white"
                  onClick={() => handleSubmitALFApprove('Hold')}
                >
                  Hold
                </Button>

                <Button
                  variant="outlined"
                  className="w-[140px] h-[38px] bg-[#D876A9] text-white"
                  onClick={() => handleSubmitALFApprove('Rejected')}
                >
                  Decline
                </Button>
              </Box>
            ) : (
              <Box className="flex flex-wrap gap-3 justify-end">
                <Button
                  variant="contained"
                  className="w-[140px] h-[38px] bg-[#D876A9] text-white"
                  onClick={handleSubmit(onSubmit)}
                >
                  Submit
                </Button>
                <Button
                  onClick={() => {
                    navigate(-1);
                  }}
                  variant="outlined"
                  className="w-[140px] h-[38px] border border-[#D876A9] text-[#D876A9]"
                >
                  Cancel
                </Button>
                {isDeleteEnable && isSuperAdmin && (
                  <Button
                    onClick={() => {
                      alfDelete(Number(alfID), () => {
                        const payload = liver?.map(
                          (organ: { organId: string | number; consultantId: number | string }) => {
                            const basePayload = {
                              recipientId: currentRecipientID,
                              organId: organ.organId,
                              consultantId: organ.consultantId,
                              isAlf: false
                            };
                            return { ...basePayload };
                          }
                        );
                        updateRecipientOrganReq(Number(currentRecipientID), payload, () => {
                          navigate(-1);
                        });
                      });
                    }}
                    variant="outlined"
                    className="w-[140px] h-[38px] border !border-[#FF474C] !text-[#FF474C]"
                  >
                    Delete ALF
                  </Button>
                )}
              </Box>
            )}
          </>
        )}

        <Text className="text-[#804595] !font-semibold text-[19px] !mt-5 !mb-5">ALF Details</Text>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[27px] gap-y-[28px]">
          <div className="col-span-full">
            <FormSelect
              menuOptions={getALFListing || []}
              control={control}
              name="alfListingType"
              label="ALF Listing Type"
              fullWidth
              required
              disabled={readOnly}
            />
          </div>

          <FormFileInput
            control={control}
            name="alfEvaluationSheet"
            label="ALF Evaluation Sheet"
            fullWidth
            required
            disabled={readOnly}
            filePath={addALFFilePath}
            fileData={organsRequest?.alfEvaluationSheet}
            setOpenImgModal={setOpenImgModal}
            setFile={setFile}
            setLoader={setLoader}
          />

          <FormFileInput
            control={control}
            name="additionalHepatologyNotes"
            label="Additional Hepatology Notes"
            fullWidth
            required
            disabled={readOnly}
            filePath={addALFFilePath}
            fileData={organsRequest?.additionalHepatologyNotes}
            setOpenImgModal={setOpenImgModal}
            setFile={setFile}
            setLoader={setLoader}
          />

          <FormFileInput
            control={control}
            name="consultantShortSummary"
            label="Consultant Short Summary"
            fullWidth
            required
            disabled={readOnly}
            filePath={addALFFilePath}
            fileData={organsRequest?.consultantShortSummary}
            setOpenImgModal={setOpenImgModal}
            setFile={setFile}
            setLoader={setLoader}
          />
        </div>
      </form>

      <FileViewModal open={openImgModal} onClose={() => setOpenImgModal(false)} file={file} fileLabel="" />
      <LoadingOverlay isLoading={loader} />
      <ALFRejectDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        alfID={alfID}
        recipientName={recipientName}
      />
    </div>
  );
};

export default AddALF;
