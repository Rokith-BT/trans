import { ALFTypes } from "@/types/alf";

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
const getRandomItem = <T extends unknown>(array: T[]): T => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};
export const returnFakeData = (): Array<ALFTypes> => {
  const ALFStatus = [
    "Pending Transtan Review",
    "Requested ALF Review",
    "Approved",
    "Deleted",
    "Rejected",
    "Delisted",
    "Utilized",
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
  const Category = [
    {
      categoryID: 1,
      categoryName:
        "Early Allograft dysfunction or Primary non-function Of the liver",
    },
    {
      categoryID: 2,
      categoryName: "Rat Killer Poisoning",
    },
  ];

  const baseData: ALFTypes[] = ALFStatus.map((status, index) => ({
    id: index + 1,
    alfID: index * 2,
    uniqueId: index * 31,
    recipientName: `Recipient ${index + 1}`,
    hospital: getRandomItem(Hospital),
    date: new Date(),
    category: getRandomItem(Category),
    pendingAlfAppr: index + 1,
    status: status,
  }));
  while (baseData.length < 10) {
    baseData.push({
      ...baseData[baseData.length % ALFStatus.length],
      id: (baseData.length + 1).toString(),
      uniqueId: `UID-${baseData.length + 1}`,
    });
  }
  return baseData;
};
