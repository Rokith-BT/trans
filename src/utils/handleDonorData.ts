/* eslint-disable @typescript-eslint/no-explicit-any */
export const handleDonorsData = async (donorDatas: any) => {
  const medicalHistory = donorDatas?.medicalHistory?.medicalHistory;
  const medicalInjury = donorDatas?.medicalHistory?.medicalInjury;
  console.log(donorDatas, "donorDatasdonorDatas");

  const donor = {
    ...donorDatas?.donor,
    isMlc: donorDatas?.donor?.isMlc ? "1" : "0",
    age: donorDatas?.donor?.age?.toString(),
    height: donorDatas?.donor?.height?.toString(),
    weight: donorDatas?.donor?.height?.toString(),
  };
  const donorandConsent = {
    ...donor,
    ...donorDatas?.consentDetails,
  };
  const organConsentsDatas = {
    organConsent: donorDatas?.organConsent,
    apnoeaTest: donorDatas?.apnoeaTest,
  };
  const medicalDetails = {
    ...medicalHistory,
    pulseRate: medicalHistory?.pulseRate?.toString(),
    bpSystolic: medicalHistory?.bpSystolic?.toString(),
    bpDiastolic: medicalHistory?.bpDiastolic?.toString(),
    map: medicalHistory?.map?.toString(),
    urineOutput: medicalHistory?.urineOutput?.toString(),
    cvp: medicalHistory?.cvp?.toString(),
    spo2: medicalHistory?.spo2?.toString(),
    temperature: medicalHistory?.temperature?.toString(),
    noOfDaysInVentilator: medicalHistory?.noOfDaysInVentilator?.toString(),
    isSmoking: medicalHistory?.isSmoking ? "1" : "0",
    isAlcoholic: medicalHistory?.isAlcoholic ? "1" : "0",
    isDiabetes: medicalHistory?.isDiabetes ? "1" : "0",
    isHt: medicalHistory?.isHt ? "1" : "0",
    isCoronaryArterial: medicalHistory?.isCoronaryArterial ? "1" : "0",
    isRenal: medicalHistory?.isRenal ? "1" : "0",
    isLiverDisease: medicalHistory?.isLiverDisease ? "1" : "0",
    isCovid: medicalHistory?.isCovid ? "1" : "0",
  };
  const medicalInjuryData = {
    ...medicalInjury,
    vcv: medicalInjury?.vcv?.toString(),
    pcv: medicalInjury?.pcv?.toString(),
    fio2: medicalInjury?.fio2?.toString(),
    peep: medicalInjury?.peep?.toString(),
    pip: medicalInjury?.pip?.toString(),
    tv: medicalInjury?.tv?.toString(),
    respiratoryRate: medicalInjury?.respiratoryRate?.toString(),
    pressureSupport: medicalInjury?.pressureSupport?.toString(),
    isChestInjury: medicalInjury?.isChestInjury ? "1" : "0",
    isAbdomenInjury: medicalInjury?.isAbdomenInjury ? "1" : "0",
    isCprGiven: medicalInjury?.isCprGiven ? "1" : "0",
    isHypotensiveEpisodes: medicalInjury?.isHypotensiveEpisodes ? "1" : "0",
    isOnVentilation: medicalInjury?.isOnVentilation ? "1" : "0",
  };
  const hormome = {
    ...donorDatas?.medicalHistory?.hormoneDetails,
    isSteroids: donorDatas?.medicalHistory?.hormoneDetails?.isSteroids
      ? "1"
      : "0",
    isVasopressin: donorDatas?.medicalHistory?.hormoneDetails?.isVasopressin
      ? "1"
      : "0",
    isThyroxin: donorDatas?.medicalHistory?.hormoneDetails?.isThyroxin
      ? "1"
      : "0",
  };
  const abgTestes = {
    ...hormome,
    abgTestResult: donorDatas?.abgTestDetails,
    inotropeData: donorDatas?.inotropeDetails,
  };
  return {
    donorandConsent,
    organConsentsDatas,
    medicalDetails,
    medicalInjuryData,
    abgTestes,
  };
};
