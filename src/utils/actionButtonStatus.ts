const viewIcon = [
  "Draft",
  "Draft Deleted",
  "PendingApproval",
  "Active",
  "Organs Allocated",
  "Inactive",
  "Deleted",
];
const editIcon = [
  "Draft Deleted",
  "PendingApproval",
  "Active",
  "Ready for Review",
  "Requesting Apnea Details",
  "Requesting more Details",
  "Terminated",
];
const deleteIcon = [
  "Draft Deleted",
  "PendingApproval",
  "Active",
  "Organs Allocated",
  "Inactive",
  "Ready for Review",
  "Requesting Apnea Details",
  "Requesting more Details",
];
const printIcon = [
  "Draft",
  "Draft Deleted",
  "PendingApproval",
  "Active",
  "Organs Allocated",
  "Inactive",
  "Deleted",
];
const downloadIcon = [
  "Draft",
  "Draft Deleted",
  "PendingApproval",
  "Active",
  "Organs Allocated",
  "Inactive",
  "Deleted",
];

const verifyIcon = ["PendingApproval", "Active"];
const inactiveIcon = [
  "Active",
  "Ready for Review",
  "Requesting Apnea Details",
  "Requesting more Details",
];
const activeIcon = ["Organs Allocated", "Inactive"];
const undoIcon = ["Deleted"];
const menuIcon = ["Ready for Review"];

// for potential

const viewiconPotential = [
  "Draft",
  "Draft Deleted",
  "Ready for Review",
  "Requesting Apnea Details",
  "Requesting more Details",
  "Terminated",
];
const editIconPotential = [
  "Draft",
  "Ready for Review",
  "Requesting Apnea Details",
  "Requesting more Details",
  "Terminated",
];
const terminatePotential = [
  "Draft",
  "Ready for Review",
  "Requesting Apnea Details",
  "Requesting more Details",
];
const deletePotential = [
  "Ready for Review",
  "Requesting Apnea Details",
  "Requesting more Details",
];

//for confirm
const viewIconConfirm = [
  "Case Officer Allocation Pending",
  "Case Officer Allocation",
  "Local Organ Requested",
  "Local Organ Chosen",
  "Case Completed",
  "Terminated",
];
const editIconConfirm = [
  "Case Officer Allocation Pending",
  "Case Officer Allocation",
  "Local Organ Requsted",
  "Local Organ Chosen",
  "Case Completed",
  "Terminated",
];
const terminateIconConfirm = [
  "Case Officer Allocation Pending",
  "Case Officer Allocation",
  "Local Organ Requested",
  "Local Organ Chosen",
  "Case Completed",
];
const changeStatusIconConfirm = [
  "Case Officer Allocation Pending",
  "Case Officer Allocation",
  "Local Organ Requested",
];
const printIconConfirm = ["Case Completed"];
const caseOverViewIconConfirm = ["Case Completed"];

//for hospital table
const viewIconHospital = [
  "Active",
  "Expired",
  "PendingApproval",
  "Deleted",
  "Rejected",
];
const deleteIconHospital = ["Active", "Expired"];
const editIconHospital = [
  "Active",
  "Expired",
  "DetailsPending",
  "PendingApproval",
  "Rejected",
];
const verifyIconHospital = ["Pending Approval"];
const undoIconHospital = ["Deleted"];
const loginIconHospital = ["Active"];

//for organ table
const viewIconOrgan = [
  "Active",
  "Expired",
  "Pending",
  "PendingApproval",
  "Deleted",
  "Rejected",
];
const deleteIconOrgan = ["Active", "Expired", "Pending"];
const editIconOrgan = ["Active", "Expired", "Pending", "Rejected"];
const verifyIconOrgan = ["Pending"];
const undoIconOrgan = ["Deleted"];

// for user table in hospital module
const penidingUser = ["PendingApproval"];
//license

const editLicense = ["Active", "Rejected", "PendingApproval"];
const viewLicense = ["Active", "Expired", "PendingApproval", "Rejected"];
const deletedLicense = [""];
const restoreLicense = ["Deleted"];
const rewokeLicense = ["Active"];
const renewLicense = ["Expired"];

//for delete & user table in hospital module
const editIconUser = ["Active", "PendingApproval"];
const deleteIconUser = ["Active"];
const ApproveAdminALFIcon = ["FinalReview"];
const viewIconALF = [
  "PendingTranstanReview",
  "PendingALFReview",
  "Delisted",
  "Approved",
  "FinalReview",
  "Deleted",
  "Rejected",
];
const editIconALF = ["Rejected", "PendingTranstanReview"];
const revokeIconALF = ["FinalReviewRejected"];
// for recipient table icons in recipient module
const viewIconRecipient = [
  "PendingApproval",
  "ChangeRequest",
  "Active",
  "DocumentVerified",
  "Inactive",
  "Deleted",
  "Organs Allocated",
  "Draft",
  "Draft Deleted",
];
const editIconRecipient = [
  "Draft",
  "ChangeRequest",
  "PendingApproval",
  "Active",
];
const VerifyDocumentIconRecipient = ["deleted"];
const documentDownloadIconRecipient = [
  "DocumentVerified",
  "Inactive",
  "Active",
  "Deleted",
  "Organs Allocated",
  "Draft Deleted",
];
const deleteIconRecipient = ["Draft", "Active"];
const tickCircleRecipient = ["Inactive"];
const organsAllocatedRecipient = ["Active"];
const closeCircleIconRecipient = ["Active"];
const restoreIconRecipient = ["Deleted"]; //"PendingALFReview"

const verifyIconALF = ["PendingTranstanReview", "PendingALFReview"];
const restoreIconALF = ["PendingALFReview", "PendingTranstanReview"];

export const isEditforUser = (
  status: string,
  isVisibleAccess: boolean,
): boolean => {
  return editIconUser.includes(status) && isVisibleAccess;
};

export const isdeleteIconUser = (
  status: string,
  isVisibleAccess: boolean,
): boolean => {
  return deleteIconUser.includes(status) && isVisibleAccess;
};

//for organ table
export const isViewforOgran = (
  status: string,
  isVisibleAccess: boolean,
): boolean => {
  return viewIconOrgan.includes(status) && isVisibleAccess;
};
export const isDeleteforOrgan = (
  status: string,
  canDelete: boolean,
): boolean => {
  return deleteIconOrgan.includes(status) && canDelete;
};
export const isEditforOrgan = (
  status: string,
  isVisibleAccess: boolean,
): boolean => {
  return editIconOrgan.includes(status) && isVisibleAccess;
};
export const isVerifyforOrgan = (status: string): boolean => {
  return verifyIconOrgan.includes(status);
};
export const isUndoIconOrgan = (
  status: string,
  isVisibleAccess: boolean,
): boolean => {
  return undoIconOrgan.includes(status) && isVisibleAccess;
};

export const isViewforHospital = (
  status: string,
  isVisibleAccess: boolean | undefined,
): boolean | undefined => {
  return viewIconHospital.includes(status) && isVisibleAccess;
};
export const isDeleteforHospital = (
  status: string,
  isVisibleAccess: boolean | undefined,
): boolean | undefined => {
  return deleteIconHospital.includes(status) && isVisibleAccess;
};
export const isEditforHosptial = (
  status: string,
  isVisibleAccess: boolean | undefined,
): boolean | undefined => {
  return editIconHospital.includes(status) && isVisibleAccess;
};
export const isVerifyforHospital = (status: string): boolean => {
  return verifyIconHospital.includes(status);
};
export const isUndoIconHospital = (
  status: string,
  isVisibleAccess: boolean,
): boolean => {
  return undoIconHospital.includes(status) && isVisibleAccess;
};
export const isLoginIconHospital = (
  status: string,
  isVisibleAccess: boolean,
): boolean => {
  return loginIconHospital.includes(status) && isVisibleAccess;
};

// for license table in each hospital

export const isViewLicense = (
  status: string,
  isVisibleAccess: boolean,
): boolean => {
  return viewLicense.includes(status) && isVisibleAccess;
};
export const isEditLicense = (
  status: string,
  isVisibleAccess: boolean,
): boolean => {
  return editLicense.includes(status) && isVisibleAccess;
};
export const isRestoreLicense = (
  status: string,
  isVisibleAccess: boolean,
): boolean => {
  return restoreLicense.includes(status) && isVisibleAccess;
};
export const isDeletedLicense = (
  status: string,
  isVisibleAccess: boolean,
): boolean => {
  return deletedLicense.includes(status) && isVisibleAccess;
};
export const isRewokeLicense = (
  status: string,
  isVisibleAccess: boolean,
): boolean => {
  return rewokeLicense.includes(status) && isVisibleAccess;
};
export const isRenewLicense = (
  status: string,
  isVisibleAccess: boolean,
): boolean => {
  return renewLicense.includes(status) && isVisibleAccess;
};

//for user table
export const isPendingApproval = (status: string): boolean => {
  return penidingUser.includes(status);
};

//for confirm table
export const isViewforConfirm = (status: string): boolean => {
  return viewIconConfirm.includes(status);
};
export const isEditIconConfirm = (status: string): boolean => {
  return editIconConfirm.includes(status);
};
export const isTerminateIconConfirm = (status: string): boolean => {
  return terminateIconConfirm.includes(status);
};
export const isChangeStatusIconConfirm = (status: string): boolean => {
  return changeStatusIconConfirm.includes(status);
};
export const isPrintIconConfirm = (status: string): boolean => {
  return printIconConfirm.includes(status);
};
export const isCaseOverViewIconConfirm = (status: string): boolean => {
  return caseOverViewIconConfirm.includes(status);
};
// export const isIconVisibleForStatus = (status: string, requiredStatus: string[]): boolean => {
//   return requiredStatus.includes(status);
// };

export const isViewforPotential = (status: string): boolean => {
  return viewiconPotential.includes(status);
};
export const isEditforPotential = (status: string): boolean => {
  return editIconPotential.includes(status);
};
export const isTerminatforPotential = (status: string): boolean => {
  return terminatePotential.includes(status);
};
export const isDeleteforPotential = (status: string): boolean => {
  return deletePotential.includes(status);
};

export const isViewIconVisible = (status: string): boolean => {
  return viewIcon.includes(status);
};
export const isEditIconVisible = (status: string): boolean => {
  return editIcon.includes(status);
};
export const isDeleteIconVisible = (status: string): boolean => {
  return deleteIcon.includes(status);
};
export const isPrintIconVisible = (status: string): boolean => {
  return printIcon.includes(status);
};
export const isDownloadIconVisible = (status: string): boolean => {
  return downloadIcon.includes(status);
};
export const isVerifyIconVisible = (status: string): boolean => {
  return verifyIcon.includes(status);
};

export const isInactiveIconVisible = (status: string): boolean => {
  return inactiveIcon.includes(status);
};
export const isActiveIconVisible = (status: string): boolean => {
  return activeIcon.includes(status);
};

export const isUndoIconVisble = (status: string): boolean => {
  return undoIcon.includes(status);
};
export const isMenuIconVisible = (status: string): boolean => {
  return menuIcon.includes(status);
};
export const isALFApproveAdminIconVisible = (
  status: string,
  isVisibleAccess: boolean | undefined,
) => {
  return ApproveAdminALFIcon.includes(status) && isVisibleAccess;
};
export const isALFViewIconVisible = (
  status: string,
  isVisibleAccess: boolean | undefined,
) => {
  return viewIconALF.includes(status) && isVisibleAccess;
};
export const isALFEditIconVisible = (
  status: string,
  isVisibleAccess: boolean | undefined,
) => {
  return editIconALF.includes(status) && isVisibleAccess;
};
export const isALFRevokeIconVisible = (
  status: string,
  isVisibleAccess: boolean | undefined,
) => {
  return revokeIconALF.includes(status) && isVisibleAccess;
};
//for recipient module
export const isViewIconRecipientVisible = (
  status: string,
  isVisibleAccess: boolean | undefined,
): boolean | undefined => {
  return viewIconRecipient.includes(status) && isVisibleAccess;
};
export const iseditIconRecipientVisible = (
  status: string,
  isVisibleAccess: boolean | undefined,
): boolean | undefined => {
  return editIconRecipient.includes(status) && isVisibleAccess;
};
export const isVerifyDocumentIconRecipientVisible = (
  status: string,
): boolean => {
  return VerifyDocumentIconRecipient.includes(status);
};
export const isDocumentDownloadIconRecipientVisible = (
  status: string,
): boolean => {
  return documentDownloadIconRecipient.includes(status);
};
export const isDeleteIconRecipientVisible = (
  status: string,
  isVisibleAccess: boolean | undefined,
): boolean | undefined => {
  return deleteIconRecipient.includes(status) && isVisibleAccess;
};
export const isOrganAllocatedRecipientVisible = (status: string): boolean => {
  return organsAllocatedRecipient.includes(status);
};
export const isCloseCircleIconRecipientVisible = (
  status: string,
  isVisibleAccess: boolean | undefined,
): boolean | undefined => {
  return closeCircleIconRecipient.includes(status) && isVisibleAccess;
};

export const isRestoreIconRecipientVisible = (status: string): boolean => {
  return restoreIconRecipient.includes(status);
};
export const isTickCircleIconRecipientVisible = (status: string): boolean => {
  return tickCircleRecipient.includes(status);
};

export const isALFVerifyIcon = (
  status: string,
  isVisibleAccess: boolean | undefined,
): boolean | undefined => {
  return verifyIconALF.includes(status) && isVisibleAccess;
};
export const isALFRestore = (status: string): boolean => {
  return restoreIconALF.includes(status);
};
