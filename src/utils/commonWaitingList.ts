import { CommonWaitingList, InhouseWaitingList } from "@/types/waitinglist";

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
const getRandomItem = <T extends unknown>(array: T[]): T => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

export const commonWaitingData = (): Array<CommonWaitingList> => {
  const genders = ["Male", "Female", "Transgender"];
  const bloodGroups = ["O+", "B+", "AB+", "A+", "O-", "AB-"];
  const hospitals = [
    "Miot Hospital",
    "Pari Health Care Hospital",
    "HealthCare Hospital",
    "Vcare Hospital",
  ];
  const organs = ["Heart", "Lungs", "Liver", "Kidney"];
  const cities = ["Chennai", "Mumbai", "Bangalore", "Hyderabad"];
  const zones = ["North", "South", "West", "East"];
  const registrationDates = [
    "2022-12-01",
    "2023-01-15",
    "2023-03-20",
    "2023-05-10",
  ];

  const data: CommonWaitingList[] = Array.from({ length: 10 }, (_, index) => ({
    serialNumber: index + 1,
    transtanid: `${index + 1001}`,
    gender: getRandomItem(genders),
    age: getRandomItem([15, 19, 75, 65]),
    bloodGroup: getRandomItem(bloodGroups),
    hospitalname: getRandomItem(hospitals),
    organ: getRandomItem(organs),
    city: getRandomItem(cities),
    regdate: getRandomItem(registrationDates),
    zone: getRandomItem(zones),
    rank: getRandomItem([1, 2, 3, 4, 5]),
  }));

  return data;
};

//for inhouse table

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint

export const inhouseWaitingData = (): Array<InhouseWaitingList> => {
  const genders = ["Male", "Female", "Transgender"];
  const bloodGroups = ["O+", "B+", "AB+", "A+", "O-", "AB-"];
  const hospitals = [
    "Miot Hospital",
    "Pari Health Care Hospital",
    "HealthCare Hospital",
    "Vcare Hospital",
  ];
  const organs = ["Heart", "Lungs", "Liver", "Kidney"];
  const zones = ["North", "South", "West", "East"];
  const registrationDates = [
    "2022-12-01",
    "2023-01-15",
    "2023-03-20",
    "2023-05-10",
  ];

  const data: InhouseWaitingList[] = Array.from({ length: 10 }, (_, index) => ({
    serialNumber: index + 1,
    uniqueid: `${index + 1001}`,
    zonalrank: " 1",
    currentrank: " 1",
    proposedrank: "1",
    recipientname: "Praveen",
    gender: getRandomItem(genders),
    age: getRandomItem([15, 19, 75, 65]),
    bloodGroup: getRandomItem(bloodGroups),
    hospitalname: getRandomItem(hospitals),
    organ: getRandomItem(organs),
    regdate: getRandomItem(registrationDates),
    phonenumber: "9876543210",
    zone: getRandomItem(zones),
    reason: "Not fit for Surgery",
  }));

  return data;
};
