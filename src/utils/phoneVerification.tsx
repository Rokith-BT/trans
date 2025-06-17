// phoneUtils.ts
export interface PhoneDetails {
  phoneNumber1: string;
  isPhoneNumber1Verified: boolean;
  phoneNumber2: string;
  isPhoneNumber2Verified: boolean;
  verifiedPhoneNumber1: string;
  verifiedPhoneNumber2: string;
}

/**
 * Updates phone number and resets verification status if the number changes.
 */
export const updatePhoneNumber = (
  details: PhoneDetails,
  type: 'primary' | 'alternate',
  newNumber: string
): PhoneDetails => {
  if (type === 'primary') {
    return {
      ...details,
      phoneNumber1: newNumber,
      isPhoneNumber1Verified: newNumber === details.verifiedPhoneNumber1
    };
  }
  return {
    ...details,
    phoneNumber2: newNumber,
    isPhoneNumber2Verified: newNumber === details.verifiedPhoneNumber2
  };
};

/**
 * Verifies a phone number.
 */
export const verifyPhoneNumber = (details: PhoneDetails, type: 'primary' | 'alternate'): PhoneDetails => {
  if (type === 'primary') {
    return {
      ...details,
      isPhoneNumber1Verified: true,
      verifiedPhoneNumber1: details.phoneNumber1
    };
  }
  return {
    ...details,
    isPhoneNumber2Verified: true,
    verifiedPhoneNumber2: details.phoneNumber2
  };
};
