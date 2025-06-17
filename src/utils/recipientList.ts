import { Recipient } from "@/types/recipient";

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
const getRandomItem = <T extends unknown>(array: T[]): T => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};
export const returnFakeData = (): Array<Recipient> => {
  const cmInsuranceOptions = ["Applied", "NA", "Approved"];
  const organRequestedOptions = [
    { name: "Heart", id: 1 },
    { name: "Lungs", id: 2 },
    { name: "Liver", id: 3 },
  ];
  const zonalOptions = ["N", "S", "W"];
  const RecipientStatus = [
    "Draft",
    "Draft Deleted",
    "Pending Approval",
    "Inactive",
    "Deleted",
    "Document Verified",
    "Active",
    "Organs Allocated",
  ];
  const Hospital = [
    { hospitalName: "Miot Hospital", hospitalId: 1, hospitalType: "Private" },
    {
      hospitalName: "Pari Health care Hospital",
      hospitalId: 1,
      hospitalType: "Government",
    },
    {
      hospitalName: "HealthCare Hospital ",
      hospitalId: 1,
      hospitalType: "Private",
    },
    {
      hospitalName: "Vcare Hospital",
      hospitalId: 1,
      hospitalType: "Government",
    },
  ];
  const CommentOptions = [
    "Only 3 License was Upload",
    "",
    "Upload Proper Documnets",
  ];

  const baseData = RecipientStatus.map((status, index) => ({
    id: (index + 1).toString(),
    alfId: (index * 2).toString(),
    alfCategory:
      "Early Allograft dysfunction or Primary non-function Of the liver",
    date: new Date(),
    zonalRank: getRandomItem(zonalOptions),
    uniqueId: `UID-${index + 1}`,
    recipientName: `Recipient ${index + 1}`,
    gender:
      index % 2 === 0
        ? { name: "Female", id: 2 }
        : index % 3 === 0
          ? { name: "Male", id: 1 }
          : { name: "TransGender", id: 3 },
    age: getRandomItem([50, 60, 20, 15, 25, 65]),
    bloodGroup: getRandomItem(["O+", "B+", "AB+", "A+", "O-", "AB-"]),
    recipientStatus: status,
    paymentStatus: "UnPaid",
    hospital: getRandomItem(Hospital),
    organRequested: Array.from({ length: getRandomItem([1, 2, 3]) }, () =>
      getRandomItem(organRequestedOptions),
    ),
    cmInsurance: getRandomItem(cmInsuranceOptions),
    phoneNumber: `12345678${index}`,
    comment: getRandomItem(CommentOptions),
    dateOfBirth: "10-06-2000",
    transtanId: `100${index + 1}`,
  }));

  while (baseData.length < 10) {
    baseData.push({
      ...baseData[baseData.length % RecipientStatus.length],
      id: (baseData.length + 1).toString(),
      uniqueId: `UID-${baseData.length + 1}`,
    });
  }

  return baseData;
};

export const returnRecipirntFakeData = (transtanId: string) => {
  console.log(transtanId);

  const recipientData = {
    basicDetails: {
      aadharNumber: "123456789012",
      passportNumber: "",
      name: "Naveen Kumar",
      gender: 1,
      dateOfBirth: "1999-12-11T18:30:00.000Z",
      age: 25,
      fatherName: "Kannan",
      phoneNumber1: "911111111111",
      phoneNumber2: "911111111111",
      email: "test@gmail.com",
      bloodGroup: "B+",
      cmInsurance: "1",
      address: [
        {
          addressLine1: "Test",
          addressLine2: "Test",
          townVillage: "TEst",
          landmark: "Test",
          pincode: "123456",
          city: 1,
          state: 1,
          country: 1,
        },
      ],
      isIndian: true,
    },
    familyContact: {
      familyContacts: [
        {
          relationType: "1",
          name: "Kannan",
          gender: 1,
          dateOfBirth: "1111-12-11T18:06:32.000Z",
          phone: "911111111111",
        },
        {
          relationType: "2",
          name: "Kanan",
          gender: 1,
          dateOfBirth: "1888-12-11T18:38:50.000Z",
          phone: "911111111111",
        },
      ],
    },
    medicalDetails: {
      height: "180",
      weight: "77",
      bmi: "",
      smoker: "1",
      alcohol: "1",
      periodOfAsst: "Test",
      drugs: "1",
      hypertension: "1",
      diabetes: "1",
      cad: "1",
      bronchialAst: "1",
      epilepsy: "1",
      hepatitisB: "0",
      hepatitisC: "0",
      historyTb: "1",
      historyPeripheral: "1",
      historyTransplant: "1",
      organTransplanted: "TEst",
      historyCovid: "1",
      covidFreePeriod: "Test",
      historyMalignancy: "1",
      typeMalignancy: "Test",
      remissionDuration: "Test",
      hbsAg: "1",
      antiHBsAg: "1",
      hcv: "1",
      epsteinBarr: "1",
      hiv: "1",
      cmv: "1",
      vaccinationStatus: [
        {
          vaccinationName: "Dolo",
          vaccinationDate: "1999-12-11T18:30:00.000Z",
        },
        {
          vaccinationName: "Prastramal",
          vaccinationDate: "1999-12-11T18:30:00.000Z",
        },
      ],
    },
    organsRequest: {
      organReq: [
        {
          organ: "1",
          consultantName: "Dr. Naveen",
        },
        {
          organ: "2",
          consultantName: "Dr. Suriya",
        },
        {
          organ: "3",
          consultantName: "Dr. Naveen",
        },
        {
          organ: "4",
          consultantName: "Dr. Suriya",
        },
        {
          organ: "5",
          consultantName: "Dr. Naveen",
        },
      ],
      cardiacIndex: "1",
      tpgTransPulmonaryGradient: "1",
      pvri: "1",
      sixMinuteWalkTest: "1",
      sixMinuteWalkTestDistance: "1",
      NtProBnp: "1",
      historyOfPreviousNonTransplantHeartAndLungSurgery: "1",
      surgeryDetails: "1",
      ureaKidny: "1",
      creatineKidny: "1",
      serumSodiumKidny: "1",
      serumPotassiumKidny: "1",
      serumChlorideKidny: "1",
      serumBicarbonateKidny: "1",
      firstDialysisDateKidny: "1999-12-11T18:30:00.000Z",
      periodUndergoingDialysisKidny: "1",
      isAlf: true,
      alfListingType: "1",
      alfEvaluationSheet: "",
      additionalHepatologyNotes: "",
      consultantShortSummary: "",
      historyOfComplications: "1",
      complicationDescription: "1",
      cancerScreening: "1",
      meldScore: "1",
      bilirubin: "1",
      albumin: "1",
      globulin: "1",
      ggt: "1",
      ast: "1",
      alt: "1",
      coronaryAngiogram: "1",
      stressTest: "1",
      roomAirAbg: "1",
      pft: "1",
      serumMagnesiumLiver: "1",
      serumPhosphateLiver: "1",
      aptt: "1",
      platelets: "1",
      fibrinogen: "1",
      complicationDescriptionPancreas: "1",
      cancerScreeningPancreas: "1",
      albuminPancreas: "1",
      coronaryAngiogramPancreas: "1",
      stressTestPancreas: "1",
      roomAirAbgPancreas: "1",
      pftPancreas: "1",
      serumMagnesiumPancreas: "1",
      serumPhosphatePancreas: "1",
      apttPancreas: "1",
      plateletsPancreas: "1",
      fibrinogenPancreas: "1",
      historyOfPreviousNonTransplantHeartAndLungSurgeryLungs: "1",
      surgeryDetailsLungs: "1",
      roomAir: "1",
      roomAirFile: "1",
      onOxygen: "1",
      onOxygenFile: "1",
      ureaLiver: "1",
      creatineLiver: "1",
      serumSodiumLiver: "1",
      serumPotassiumLiver: "1",
      serumChlorideLiver: "1",
      serumBicarbonateLiver: "1",
      inr: "1",
      historyOfComplicationsPancreas: "1",
      meldScorePancreas: "111",
      bilirubinPancreas: "1",
      globulinPancreas: "1",
      ggtPancreas: "1",
      astPancreas: "1",
      altPancreas: "1",
      ureaPancreas: "1",
      creatinePancreas: "1",
      serumSodiumPancreas: "1",
      serumPotassiumPancreas: "1",
      serumChloridePancreas: "1",
      serumBicarbonatePancreas: "1",
      inrPancreas: "1",
      causeOfLungDisease: "1",
      sixMinuteWalkTestLungs: "1",
      sixMinuteWalkTestDistanceLungs: "1",
      forcedExpiratoryVolumeIn1Second: "1",
      forcedVitalCapacity: "1",
      maximalVoluntaryVentilation: "1",
      dlco: "1",
      selfOnRoomAir: "1",
      supplement02: "1",
      nonInvasiveVentilation: "1",
      mechanicalVentilation: "1",
      ecmo: "1",
    },
    attachments: {},
  };
  return recipientData;
};
export const returnRecipientTrasferFake = () => {
  const fakeData = {
    id: 4,
    recipientId: 3,
    recipientName: "Bob Johnson",
    transtanId: 1003,
    currentHospital: {
      id: 1,
      name: "Miot Hospitals",
    },
    transferringHospital: {
      id: 2,
      name: "Kumaran Hospitals P Ltd",
    },
    transferRegDate: "2025-01-19T21:51:58",
    patientDeclarationDoc: "string",
    doctorDeclarationDoc: "string",
    isPhoneNumber1Verified: true,
    isPaymentCompleted: true,
    dateOfBirth: "10-06-2000",
    bloodGroup: {
      id: 3,
      name: "B+",
    },
    gender: {
      id: 1,
      name: "Male",
    },
    age: 32,
    phoneNumber1: "1234567890",
    createdAt: "2025-01-19T21:51:58",
    organMappings: [
      {
        organId: 1,
        currentConsultantId: 2,
        transferringConsultantId: 3,
      },
    ],
  };

  return fakeData;
};
