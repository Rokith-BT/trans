const hospitalTypes: { [key: string]: string } = {
  private: "P",
  government: "G",
};

export const getHospitalTypes = (hospitalType: string) => {
  const hospital = hospitalType?.toLowerCase();
  return hospitalTypes[hospital] || "";
};
