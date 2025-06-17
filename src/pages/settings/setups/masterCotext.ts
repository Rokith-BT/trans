/* eslint-disable @typescript-eslint/no-explicit-any */
import { APIService, ContextContainer } from '@/services';
import { useEffect, useReducer } from 'react';
import {
  ALFListing,
  Cancerscreening,
  City,
  CMInsurance,
  Complications,
  Country,
  Department,
  Designation,
  Gender,
  HospitalDeleteReason,
  HospitalType,
  Lungdiseasecause,
  Organ,
  PeriodCategory,
  Qualification,
  RelationType,
  Role,
  State,
  Vaccinations,
  Zone,
  BloodGroup,
  Age,
  Status,
  HospitalNames,
  MultiOrgans,
  ConsultantList,
  causeOfDeath,
  causeOfDeathDelete,
  PaymentConfigType,
  TerminateReason,
  DeleteTerminationReasons,
  RelationTypeList,
  OrganList,
  ContactTypes
} from '@/types/common.type';
import { toast } from '@/utils/toast';
import queryString from 'query-string';
import { MultiOrgansList } from '@/types/setup';

const setup = `setup`;

const ApiRoutes = {
  genders: `/${setup}/genders`,
  designations: `/${setup}/designations`,
  qualifications: `/${setup}/qualifications`,
  establishedyears: `/${setup}/establishedyears`,
  departments: `/${setup}/departments`,
  roles: `/${setup}/roles`,
  zones: `/${setup}/zones`,
  hospitalTypes: `/${setup}/hospitaltypes`,
  organs: `/${setup}/organs`,
  hospitalDeleteReasons: `/${setup}/hospitaldeletereason`,
  summarys: `/${setup}/summary`,
  countries: `/${setup}/countries`,
  cities: `/${setup}/cities`,
  hospitalNames: `/hospitals/names`,
  states: `/${setup}/states`,
  cmInsurance: `/${setup}/cminsurance`,
  bloodGroup: `/${setup}/bloodgroups`,
  age: `/${setup}/periodcategories`,
  relationType: `/${setup}/relationtypes`,
  periodCategory: `/${setup}/periodcategories`,
  recipientStatus: `/recipients/status`,
  vaccinations: `/${setup}/vaccinations`,
  complications: `/${setup}/complications`,
  cancerscreening: `/${setup}/cancerscreening`,
  lungdiseasecause: `/${setup}/lungdiseasecause`,
  bloodgroup: `/${setup}/bloodgroups`,
  alflistingtype: `/${setup}/alflistingtype`,
  multiOrgan: `/${setup}/multiorgancombination`,
  causeOfDeath: `/${setup}/causeofdeath`,
  paymentconfig: `/${'settings'}/paymentconfig`,
  terminationreasons: `/${setup}/terminationreasons`,
  hospital: '/hospitals',
  consultant: '/consultants',
  files: '/files',
  auth: '/auth',
  verifyAadhaar: '/verify-aadhaar',
  kycAadhaarOtp: '/kyc-aadhaar-otp',
  multiOrganCombinations: `/${setup}/multiorgancombination`,
  restore: '/restore',
  all: '/All',
  contactTypes: `/${setup}/contacttypes`,
  relationTypes: `/${setup}/relationtypes`
};
interface MasterData {
  genders: Gender[];
  designations: Designation[];
  qualifications: Qualification[];
  establishedyears: string[];
  departments: Department[];
  roles: Role[];
  zones: Zone[];
  hospitalTypes: HospitalType[];
  organs: Organ[];
  hospitalDeleteReasons: HospitalDeleteReason[];
  countries: Country[];
  cities: City[];
  states: State[];
  hospitalNames: HospitalNames[];
  cmInsurance: CMInsurance[];
  age: Age[];
  relationType: RelationType[];
  periodCategory: PeriodCategory[];
  recipientStatus: Status[];
  vaccinations: Vaccinations[];
  complications: Complications[];
  cancerscreening: Cancerscreening[];
  lungdiseasecause: Lungdiseasecause[];
  bloodGroup: BloodGroup[];
  bloodGroupData: { name: string; isActive: number }[];
  alfListingType: ALFListing[];
  multiOrgans: MultiOrgans[];
  consultants: ConsultantList[];
  consultant: ConsultantList[];
  causeOfDeath: causeOfDeath[];
  causeOfDeathDelete: causeOfDeathDelete[];
  terminationreasons: TerminateReason[];
  deleteTerminateReason: DeleteTerminationReasons[];
  paymentConfig: PaymentConfigType[];
  file: string | null;
  filePath: string;
  aadhaarResponse: any;
  postKycAadhaarOtp: any;
  multiOrganCombinations: MultiOrgansList[];
  count: number;
  relationTypeList: RelationTypeList[];
  organList: OrganList[];
  contactTypes: ContactTypes[];
  fileBlop: any;
  loading: boolean;
}

const initialState: MasterData = {
  genders: [],
  designations: [],
  qualifications: [],
  establishedyears: [],
  departments: [],
  roles: [],
  zones: [],
  hospitalTypes: [],
  organs: [],
  hospitalDeleteReasons: [],
  countries: [],
  cities: [],
  states: [],
  hospitalNames: [],
  cmInsurance: [],
  age: [],
  recipientStatus: [],
  relationType: [],
  periodCategory: [],
  vaccinations: [],
  complications: [],
  cancerscreening: [],
  lungdiseasecause: [],
  bloodGroup: [],
  bloodGroupData: [],
  alfListingType: [],
  multiOrgans: [],
  consultants: [],
  consultant: [],
  causeOfDeath: [],
  causeOfDeathDelete: [],
  deleteTerminateReason: [],
  terminationreasons: [],
  paymentConfig: [],
  file: '',
  filePath: '',
  aadhaarResponse: null,
  postKycAadhaarOtp: null,
  multiOrganCombinations: [],
  count: 0,
  relationTypeList: [],
  organList: [],
  contactTypes: [],
  fileBlop: '',
  loading: true
};

const reducer = (
  state: MasterData,
  action: {
    type: string;
    payload?: any;
  }
) => {
  const { type, payload } = action;
  switch (type) {
    case 'GETGENDERS':
      return { ...state, genders: payload.map((g: Gender) => ({ label: g.name, value: g.id })) ?? [] };
    case 'GETRELATIONTYPE':
      return {
        ...state,
        relationTypeList: payload.relationTypes,
        relationType: payload.relationTypes.map((r: Gender) => ({ label: r.name, value: r.id })),
        count: payload.total
      };
    case 'GETDESIGNATIONS':
      return { ...state, designations: payload.designations ?? [], count: payload.total, loading: false };
    case 'GETQUALIFICATIONS':
      return { ...state, qualifications: payload ?? [], loading: false };
    case 'GETESTABLISHEDYEARS':
      return { ...state, establishedyears: payload ?? [] };
    case 'GETDEPARTMENTS':
      return { ...state, departments: payload.departments ?? [], count: payload.total, loading: false };
    case 'GETROLES':
      return { ...state, roles: payload ?? [] };
    case 'GETZONES':
      return { ...state, zones: payload.zones ?? [], count: payload.total, loading: false };
    case 'GETHOSPITALTYPES':
      return { ...state, hospitalTypes: payload ?? [] };
    case 'GETCAUSEOFDEATH':
      return { ...state, causeOfDeath: payload.causeOfDeaths ?? [], count: payload.total, loading: false };
    case 'GETPAYMENT':
      return { ...state, paymentConfig: payload ?? [] };
    case 'PATCHCAUSEOFDEATH':
      return { ...state };
    case 'RESTORECAUSEOFDEATH':
      return { ...state };
    case 'RESTOREZONES':
      return { ...state };
    case 'RESTOREORGANS':
      return { ...state };
    case 'RESTBLOODGROUP':
      return { ...state };
    case 'RESTORETERMINATIONREASON':
      return { ...state };
    case 'PATCHTERMINALREASON':
      return { ...state };
    case 'POSTTERMINATIONREASON':
      return { ...state };
    case 'POSTZONES':
      return { ...state };
    case 'POSTCAUSEOFDEATH':
      return { ...state };
    case 'POSTORGANS':
      return { ...state };
    case 'POSTBLOODGROUP':
      return { ...state };
    case 'PATCHBLOODGROUP':
      return { ...state };
    case 'PATCHORGANS':
      return { ...state };
    case 'PATCHTERMINATEREASON':
      return { ...state };
    case 'PATCHZONES':
      return { ...state };
    case 'PATCHPAYMENT':
      return { ...state };
    case 'GETTERMINATIONREASON':
      return { ...state, terminationreasons: payload.terminationReasons, count: payload.total, loading: false };
    case 'DELETETERMINATEREASON':
      return { ...state };
    case 'DELETEORGANS':
      return { ...state };
    case 'DELETEZONES':
      return { ...state };
    case 'DELETEBLOODGROUP':
      return { ...state };
    case 'GETORGANS':
      // return { ...state, organs: payload.map((p: Organ) => ({ label: p.name, value: p.id.toString() })) ?? [] };

      return { ...state, organs: payload.organs ?? [], count: payload.total, loading: false };
    case 'GETHOSPITALDELETEREASON':
      // return { ...state, hospitalDeleteReasons: payload ?? [] };
      return { ...state, hospitalDeleteReasons: [] };
    case 'DELETECAUSEOFDEATH':
      return { ...state, causeOfDeathDelete: [] };
    case 'GETCOUNTRIES':
      return { ...state, countries: payload.map((ct: Country) => ({ label: ct.name, value: ct.id })) ?? [] };
    case 'GETCITIES':
      return { ...state, cities: payload.map((c: City) => ({ label: c.name, value: c.id })) ?? [] };
    case 'GETHOSPITALNAMES':
      return { ...state, hospitalNames: payload ?? [] };
    case 'GETCMINSURANCE':
      return { ...state, cmInsurance: payload.map((cm: CMInsurance) => ({ label: cm.name, value: cm.id })) ?? [] };
    case 'GETAGE':
      return { ...state, age: payload ?? [] };
    case 'GETRECIPIENTSTATUS':
      return { ...state, recipientStatus: payload ?? [] };
    case 'GETSTATES':
      return { ...state, states: payload.map((s: State) => ({ label: s.name, value: s.id })) ?? [] };
    case 'GETPERIODCATEGORY':
      return { ...state, periodCategory: payload.map((p: PeriodCategory) => ({ label: p.name, value: p.id })) ?? [] };
    case 'GETVACCINE':
      return {
        ...state,
        vaccinations:
          payload.map((v: Vaccinations) => ({
            label: v.name,
            value: v.id
          })) ?? []
      };
    case 'GETHISTORYOFCOMPLICATIONS':
      return {
        ...state,
        complications: payload?.map((p: Complications) => ({ label: p.name, value: p.id.toString() })) ?? []
      };
    case 'GETCANCERSCREENING':
      return {
        ...state,
        cancerscreening: payload?.map((p: Cancerscreening) => ({ label: p.name, value: p.id.toString() })) ?? []
      };
    case 'GETLUNGDISE':
      return {
        ...state,
        lungdiseasecause: payload?.map((p: Lungdiseasecause) => ({ label: p.name, value: p.id.toString() })) ?? []
      };
    case 'GETBLOODGROUP':
      return {
        ...state,
        bloodGroupData: payload.bloodGroups,
        count: payload.total,
        loading: false,
        bloodGroup: payload.bloodGroups.map((ct: BloodGroup) => ({ label: ct.name, value: ct.id })) ?? []
      };
    case 'ALFLISTINGTYPE':
      return {
        ...state,
        alfListingType: payload.map((al: ALFListing) => ({ label: al.name, value: al.id.toString() })) ?? []
      };
    case 'GETMULTIORGANS':
      return { ...state, multiOrgans: payload ?? [], loading: false };

    case 'GETCONSULTANTBYHOSPITALID':
      return { ...state, consultants: payload ?? [] };
    case 'GETCONSULTANT':
      return { ...state, consultant: payload ?? [] };
    case 'GETFILES':
      return { ...state, file: payload };
    case 'FILEUPLOAD':
      return { ...state, filePath: payload };
    case 'GETAADHAARRESPONSE':
      return { ...state, aadhaarResponse: payload };
    case 'AUTHKYCAADHAROTP':
      return { ...state, postKycAadhaarOtp: payload };
    case 'GET_MULTIORGAN':
      return { ...state, multiOrganCombinations: payload.multiOrganCombinations, count: payload.total, loading: false };
    case 'POST_MULTIORGAN':
      return { ...state };
    case 'DELETE_MULTIORGAN':
      return { ...state };
    case 'RESTORE_MULTIORGAN':
      return { ...state };
    case 'GET_ORGAN_LIST':
      return { ...state, organList: payload.organs, count: payload.total };
    case 'GET_CONTACTTYPE':
      return { ...state, contactTypes: payload };
    case 'ADD_RELATIONTYPE':
      return { ...state };
    case 'EDIT_RELATIONTYPE':
      return { ...state };
    case 'DELETE_RELATIONTYPE':
      return { ...state };
    case 'RESTORE_RELATIONTYPE':
      return { ...state };
    case 'GETFILE':
      return { ...state, fileBlop: payload };
    default:
      return state;
  }
};

export const { useContext: useMasterData, Provider: MasterDataProvider } = ContextContainer(() => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getGenders = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.genders}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { genders } = res; // Correctly extract the genders array
        console.log(genders, 'gendersgendersgenders');

        dispatch({ type: 'GETGENDERS', payload: genders }); // Use correct action type and payload
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };

  const getDesignation = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.designations}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { designations, total } = res;
        dispatch({ type: 'GETDESIGNATIONS', payload: { designations, total } });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const getestablishedyears = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.establishedyears}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { establishedyears } = res; // Correctly extract the genders array
        dispatch({ type: 'GETESTABLISHEDYEARS', payload: establishedyears }); // Use correct action type and payload
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };

  const getQualifications = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.qualifications}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { qualifications } = res;
        dispatch({ type: 'GETQUALIFICATIONS', payload: qualifications });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };

  const getDepartments = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.departments}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { departments, total } = res;

        dispatch({ type: 'GETDEPARTMENTS', payload: { departments, total } });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };

  const getRoles = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.roles}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { roles } = res;

        dispatch({ type: 'GETROLES', payload: roles });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };

  const getZones = (params: any, callback?: (_data: any) => void) => {
    console.log(`${ApiRoutes.zones}?${queryString.stringify(params)}`);

    APIService.get(`${ApiRoutes.zones}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { zones, total } = res;

        dispatch({ type: 'GETZONES', payload: { zones, total } });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const getTerminationReason = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.terminationreasons}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { terminationReasons, total } = res;
        dispatch({ type: 'GETTERMINATIONREASON', payload: { terminationReasons, total } });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const getHospitalTypes = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.hospitalTypes}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { hospitalTypes } = res;

        dispatch({ type: 'GETHOSPITALTYPES', payload: hospitalTypes });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };

  const getOrgans = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.organs}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { organs, total } = res;
        dispatch({ type: 'GETORGANS', payload: { organs, total } });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const getCauseOfDeath = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.causeOfDeath}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { causeOfDeaths, total } = res;
        dispatch({ type: 'GETCAUSEOFDEATH', payload: { causeOfDeaths, total } });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const getPayment = (callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.paymentconfig}`)
      .then((res: any) => {
        const { paymentconfigs } = res;
        console.log(res, 'sfcescdedfedcved');

        dispatch({ type: 'GETPAYMENT', payload: paymentconfigs });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const postCauseOfDeath = (data: any, callback?: (_data: any) => void) => {
    APIService.post(`${ApiRoutes.causeOfDeath}`, data)
      .then((res: any) => {
        dispatch({ type: 'POSTCAUSEOFDEATH', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };

  const postTerminateReason = (data: any, callback?: (_data: any) => void) => {
    APIService.post(`${ApiRoutes.terminationreasons}`, data)
      .then((res: any) => {
        dispatch({ type: 'POSTTERMINATIONREASON', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const postOrgans = (data: any, callback?: (_data: any) => void) => {
    APIService.post(`${ApiRoutes.organs}`, data)
      .then((res: any) => {
        dispatch({ type: 'POSTORGANS', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const postBloodGroup = (data: any, callback?: (_data: any) => void) => {
    APIService.post(`${ApiRoutes.bloodGroup}`, data)
      .then((res: any) => {
        dispatch({ type: 'POSTBLOODGROUP', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const patchBloodGroup = (data: any, id: number, callback?: (_data: any) => void) => {
    console.log('id2YGUGBdwd', id);

    APIService.patch(`${ApiRoutes.bloodGroup}/${id}`, data)
      .then((res: any) => {
        dispatch({ type: 'PATCHBLOODGROUP', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const patchOrgans = (data: any, id: number, callback?: (_data: any) => void) => {
    console.log('id2YGUGBdwd', id);

    APIService.patch(`${ApiRoutes.organs}/${id}`, data)
      .then((res: any) => {
        dispatch({ type: 'PATCHORGANS', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const postZones = (data: any, callback?: (_data: any) => void) => {
    APIService.post(`${ApiRoutes.zones}`, data)
      .then((res: any) => {
        dispatch({ type: 'POSTZONES', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };

  const patchCauseOfDeath = (data: any, id: number, callback?: (_data: any) => void) => {
    console.log('id2345678987654', id);

    APIService.patch(`${ApiRoutes.causeOfDeath}/${id}`, data)
      .then((res: any) => {
        dispatch({ type: 'PATCHCAUSEOFDEATH', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const restoreCauseOfDeath = (id: number, callback?: (_data: any) => void) => {
    APIService.patch(`${ApiRoutes.causeOfDeath}/${id}/restore`)
      .then((res: any) => {
        dispatch({ type: 'RESTORECAUSEOFDEATH' });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const restoreBloodGroup = (id: number, callback?: (_data: any) => void) => {
    APIService.patch(`${ApiRoutes.bloodGroup}/${id}/restore`)
      .then((res: any) => {
        dispatch({ type: 'RESTBLOODGROUP' });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const restoreOrgan = (id: number, callback?: (_data: any) => void) => {
    APIService.patch(`${ApiRoutes.organs}/${id}/restore`)
      .then((res: any) => {
        dispatch({ type: 'RESTOREORGANS' });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const restoreZoens = (id: number, callback?: (_data: any) => void) => {
    APIService.patch(`${ApiRoutes.zones}/${id}/restore`)
      .then((res: any) => {
        dispatch({ type: 'RESTOREZONES' });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const restoreTerminationReason = (id: number, callback?: (_data: any) => void) => {
    APIService.patch(`${ApiRoutes.terminationreasons}/${id}/restore`)
      .then((res: any) => {
        dispatch({ type: 'RESTORETERMINATIONREASON' });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const patchTerminateReason = (data: any, id: number, callback?: (_data: any) => void) => {
    console.log('id2YGUGB', id);

    APIService.patch(`${ApiRoutes.terminationreasons}/${id}`, data)
      .then((res: any) => {
        dispatch({ type: 'PATCHTERMINATEREASON', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const patchZones = (data: any, id: number, callback?: (_data: any) => void) => {
    console.log('id2YGUGBdwd', id);

    APIService.patch(`${ApiRoutes.zones}/${id}`, data)
      .then((res: any) => {
        dispatch({ type: 'PATCHZONES', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const patchPayment = (data: any, id: number, callback?: (_data: any) => void) => {
    console.log('id7654367676876', id);

    APIService.patch(`${ApiRoutes.paymentconfig}/${id}`, data)
      .then((res: any) => {
        dispatch({ type: 'PATCHPAYMENT', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const getCountries = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.countries}?${queryString.stringify(params)}`)
      .then((res: any) => {
        if (res && res.countries) {
          console.log('Response from countries: ', res);
          dispatch({ type: 'GETCOUNTRIES', payload: res.countries });
        } else {
          console.error('No countries data returned:', res);
          toast('No countries data available.', 'error');
        }
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (error?.status) {
          toast(error.message, 'error');
        } else {
          toast('Failed to fetch countries.', 'error');
        }
        console.log('Error from countries fetch: ', error);
      });
  };
  const getStates = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.states}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { states } = res;
        console.log('response from states ', states);
        dispatch({ type: 'GETSTATES', payload: states });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
      });
  };
  const getCities = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.cities}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { cities } = res;
        console.log('response form cities ', cities);
        dispatch({ type: 'GETCITIES', payload: cities });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
      });
  };
  const getHospitalNames = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.hospitalNames}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { hospitals } = res;
        console.log('hospital name ', hospitals);
        dispatch({ type: 'GETHOSPITALNAMES', payload: hospitals });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
      });
  };
  const getCMInsuranceList = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.cmInsurance}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { cmInsurance } = res;
        console.log('gfvr ', cmInsurance);
        dispatch({ type: 'GETCMINSURANCE', payload: cmInsurance });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
      });
  };
  const getBloodGroupList = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.bloodGroup}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { bloodGroups, total } = res;
        dispatch({ type: 'GETBLOODGROUP', payload: { bloodGroups, total } });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
      });
  };
  const getAgeList = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.periodCategory}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { periodCategories } = res;
        dispatch({ type: 'GETAGE', payload: periodCategories });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
      });
  };
  const getRecipientStatus = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.recipientStatus}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { recipients } = res;
        console.log('recipients status ', recipients);

        dispatch({ type: 'GETRECIPIENTSTATUS', payload: recipients });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
      });
  };
  const getRelationTypeList = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.relationType}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { relationTypes, total } = res || {};
        dispatch({ type: 'GETRELATIONTYPE', payload: { relationTypes, total } });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
      });
  };
  const getPeriodCategoryList = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.periodCategory}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { periodCategories } = res;
        dispatch({ type: 'GETPERIODCATEGORY', payload: periodCategories });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
      });
  };
  const getVaccinationList = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.vaccinations}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { vaccinations } = res;
        dispatch({ type: 'GETVACCINE', payload: vaccinations });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
      });
  };
  const getHistoryOfComplicationsList = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.complications}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { complications } = res;
        dispatch({ type: 'GETHISTORYOFCOMPLICATIONS', payload: complications });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
      });
  };
  const getCancerScreeningList = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.cancerscreening}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { cancerScreeningTypes } = res;
        dispatch({ type: 'GETCANCERSCREENING', payload: cancerScreeningTypes });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
      });
  };
  const getLungDieseList = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.lungdiseasecause}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { lungDiseaseCauses } = res;
        dispatch({ type: 'GETLUNGDISE', payload: lungDiseaseCauses });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
      });
  };

  const getALFListingList = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.alflistingtype}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { alfListingTypes } = res;
        dispatch({ type: 'ALFLISTINGTYPE', payload: alfListingTypes });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
      });
  };
  const getMultiOrgans = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.multiOrgan}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { multiOrganCombinations } = res;
        dispatch({ type: 'GETMULTIORGANS', payload: multiOrganCombinations });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
      });
  };
  const getConsultantByHospitalId = (hospitalId: number | string, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.hospital}/${hospitalId}${ApiRoutes.consultant}`)
      .then((res: any) => {
        const { doctors } = res;
        if (!doctors || doctors.length === 0) {
          toast('Hospital doesn’t have any consultants', 'error');
        }
        dispatch({ type: 'GETCONSULTANTBYHOSPITALID', payload: doctors });

        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (error?.status) {
          toast(error.message, 'error');
        } else {
          toast('An unexpected error occurred', 'error');
        }
      });
  };
  const getConsultantList = (params?: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.hospital}${ApiRoutes.consultant}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { doctors } = res;
        dispatch({ type: 'GETCONSULTANT', payload: doctors });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
      });
  };
  // const getFiles = (data: any, callback?: (_data: any) => void) => {
  //   APIService.getFile(`${ApiRoutes.files}?path=${data}`)
  //     .then((res: any) => res.blob())
  //     .then((blob: Blob) => {
  //       const fileUrl = URL.createObjectURL(blob);
  //       dispatch({ type: 'GETFILES', payload: fileUrl });
  //       if (typeof callback === 'function') {
  //         callback(fileUrl);
  //       }
  //     })
  //     .catch((error: any) => {
  //       console.log('fff', error);

  //       if (typeof error === 'object' && error.status) {
  //         toast(error.message, 'error');
  //       }
  //     });
  // };
  const getFiles = async (data: any, callback?: (_data: any) => void) => {
    dispatch({ type: 'GETFILES', payload: null });
    if (!data || data.trim() === '') {
      console.warn('Invalid document path or empty string');
      if (typeof callback === 'function') {
        callback(null);
      }
      return;
    }
    try {
      // Make the API call and ensure the response is valid

      const res: any = await APIService.getFile(`${ApiRoutes.files}?path=${data}`);

      // Check if res is already a blob or needs conversion
      if (res instanceof Blob) {
        handleBlob(res, callback);
      } else if (res.ok && typeof res.blob === 'function') {
        // Convert response to blob if it's a valid fetch response
        const blob: Blob = await res.blob();
        handleBlob(blob, callback);
      } else {
        throw new Error('No Files Found ');
      }
    } catch (error: any) {
      // Handle errors properly
      if (typeof error === 'object' && error.message) {
        toast(error.message, 'error');
      } else {
        toast('No Files Found', 'error');
      }
    }
  };

  // Helper function to handle the blob and dispatch
  const handleBlob = (blob: Blob, callback?: (_data: any) => void) => {
    const fileUrl = URL.createObjectURL(blob);
    dispatch({ type: 'GETFILES', payload: fileUrl });

    if (typeof callback === 'function') {
      callback(fileUrl);
    }
  };

  const fileUpload = (data: any, callback?: (_data: any) => void) => {
    APIService.upload(`${ApiRoutes.files}`, data)
      .then((res: any) => {
        console.log(res, 'reswdwdwqdfwqdfqfwqfwqfwfwqfwf');
        if (!res.data?.status) {
          toast('Not Support', 'error');
          return false;
        }
        dispatch({ type: 'FILEUPLOAD', payload: res?.data?.fileResponse?.fullfilepath });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        console.log(error, 'errorerrorerrorerror17');

        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
      });
  };

  const deleteCauseOfDeath = (id: number, callback?: (_data: any) => void) => {
    APIService.delete(`${ApiRoutes.causeOfDeath}/${id}`)
      .then((res: any) => {
        const { causeOfDeathDelete } = res;

        dispatch({ type: 'DELETECAUSEOFDEATH', payload: causeOfDeathDelete });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const deleteTerminateReason = (id: number, callback?: (_data: any) => void) => {
    APIService.delete(`${ApiRoutes.terminationreasons}/${id}`)
      .then((res: any) => {
        dispatch({ type: 'DELETETERMINATEREASON' });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const deleteOrgans = (id: number, callback?: (_data: any) => void) => {
    APIService.delete(`${ApiRoutes.organs}/${id}`)
      .then((res: any) => {
        dispatch({ type: 'DELETEORGANS' });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const deleteZones = (id: number, callback?: (_data: any) => void) => {
    APIService.delete(`${ApiRoutes.zones}/${id}`)
      .then((res: any) => {
        dispatch({ type: 'DELETEZONES' });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const deleteDepartment = (id: number, callback?: (_data: any) => void) => {
    APIService.delete(`${ApiRoutes.departments}/${id}`)
      .then((res: any) => {
        dispatch({ type: 'DELETEBLOODGROUP' });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const postDepartment = (data: any, callback?: (_data: any) => void) => {
    APIService.post(`${ApiRoutes.departments}`, data)
      .then((res: any) => {
        dispatch({ type: 'POSTZONES', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const patchDepartment = (data: any, id: number, callback?: (_data: any) => void) => {
    console.log('id2345678987654', id);

    APIService.patch(`${ApiRoutes.departments}/${id}`, data)
      .then((res: any) => {
        dispatch({ type: 'PATCHCAUSEOFDEATH', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const restoreDepartment = (id: number, callback?: (_data: any) => void) => {
    APIService.patch(`${ApiRoutes.departments}/${id}/restore`)
      .then((res: any) => {
        dispatch({ type: 'RESTORECAUSEOFDEATH' });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };

  const deleteBloodGroup = (id: number, callback?: (_data: any) => void) => {
    APIService.delete(`${ApiRoutes.bloodGroup}/${id}`)
      .then((res: any) => {
        dispatch({ type: 'DELETEBLOODGROUP' });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  // const getHospitaldeletereason = (params: any, callback?: (_data: any) => void) => {
  //   APIService.get(`${ApiRoutes.hospitalDeleteReasons}?${queryString.stringify(params)}`)
  //     .then((res: any) => {
  //       const { hospitalDeleteReasons } = res;

  //       dispatch({ type: 'GETHOSPITALDELETEREASON', payload: hospitalDeleteReasons });
  //       if (typeof callback === 'function') {
  //         callback(res);
  //       }
  //     })
  //     .catch((error: any) => {
  //       if (typeof error === 'object' && error.status) {
  //         toast(error.message, 'error');
  //       }
  //       console.log(error);
  //     });
  // };

  const getAadhaarResponse = (aadhaarNumber: string, callBack?: (_data: any) => void) => {
    return APIService.get(`${ApiRoutes.auth}${ApiRoutes.verifyAadhaar}?aadhaarNumber=${aadhaarNumber}`)
      .then((res: any) => {
        console.log('response from aadhaar ', res);
        const { aadhaarResponse } = res;
        dispatch({ type: 'GETAADHAARRESPONSE', payload: aadhaarResponse });
        if (typeof callBack === 'function') {
          console.log('response from aadhaar ', res);

          callBack(res);
        }
        return res;
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        throw error;
      });
  };

  // const postKycAadharOtp = (data: any, callBack?: (_data: any) => void) => {
  //   APIService.post(`${ApiRoutes.auth}${ApiRoutes.kycAadhaarOtp}`, data)
  //     .then((res: any) => {
  //       // console.log('response from aadhaar ', res);
  //       // const { aadhaarResponse } = res;
  //       dispatch({ type: 'AUTHKYCAADHAROTP', payload: res });

  //       if (typeof callBack === 'function') {
  //         callBack(res);
  //       }
  //       console.log(res);

  //       return res;
  //     })
  //     .catch((error: any) => {
  //       if (typeof error === 'object' && error.status) {
  //         toast(error.message, 'error');
  //       }
  //     });
  // };
  const postKycAadharOtp = async (data: any): Promise<any> => {
    try {
      const res = await APIService.post(`${ApiRoutes.auth}${ApiRoutes.kycAadhaarOtp}`, data);
      dispatch({ type: 'AUTHKYCAADHAROTP', payload: res });
      return res;
    } catch (error: any) {
      if (typeof error === 'object' && error.status) {
        toast(error.message, 'error');
      }
      return null;
    }
  };

  // const getHospitaldeletereason = (params: any, callback?: (_data: any) => void) => {
  //   APIService.get(`${ApiRoutes.hospitalDeleteReasons}?${queryString.stringify(params)}`)
  //     .then((res: any) => {
  //       const { hospitalDeleteReasons } = res;

  //       dispatch({ type: 'GETHOSPITALDELETEREASON', payload: hospitalDeleteReasons });
  //       if (typeof callback === 'function') {
  //         callback(res);
  //       }
  //     })
  //     .catch((error: any) => {
  //       if (typeof error === 'object' && error.status) {
  //         toast(error.message, 'error');
  //       }
  //       console.log(error);
  //     });
  // };
  //////////////////////////////////////////////////////////////////
  //for multi organ
  const getMultiOrgansList = (params?: any, callBack?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.multiOrganCombinations}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { multiOrganCombinations, total } = res || {};
        dispatch({ type: 'GET_MULTIORGAN', payload: { multiOrganCombinations, total } });
        if (typeof callBack === 'function') {
          callBack(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
      });
  };
  const postMultiOrgan = (data?: any, callBack?: (_data: any) => void) => {
    APIService.post(`${ApiRoutes.multiOrganCombinations}`, data)
      .then((res: any) => {
        dispatch({ type: 'POST_MULTIORGAN', payload: res });
        if (typeof callBack === 'function') {
          callBack(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
      });
  };
  const editMultiOrgan = (id: number, data: any, callBack?: (_data: any) => void) => {
    APIService.patch(`${ApiRoutes.multiOrganCombinations}/${id}`, data)
      .then((res: any) => {
        dispatch({ type: '', payload: res });
        if (typeof callBack === 'function') {
          callBack(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
      });
  };
  const deleteMultiOrgan = (id: number, callBack?: (_data: any) => void) => {
    APIService.delete(`${ApiRoutes.multiOrganCombinations}/${id}`)
      .then((res: any) => {
        dispatch({ type: 'DELETE_MULTIORGAN', payload: res });
        if (typeof callBack === 'function') {
          callBack(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
      });
  };
  const restoreMultiOrgan = (id: number, callBack?: (_data: any) => void) => {
    APIService.patch(`${ApiRoutes.multiOrganCombinations}/${id}${ApiRoutes.restore}`)
      .then((res: any) => {
        dispatch({ type: 'RESTORE_MULTIORGAN', payload: res });
        if (typeof callBack === 'function') {
          callBack(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
      });
  };
  const getAllOrganList = (params?: any, callBack?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.organs}${ApiRoutes.all}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { organs, total } = res || {};
        dispatch({ type: 'GET_ORGAN_LIST', payload: { organs, total } });
        if (typeof callBack === 'function') {
          callBack(res);
        }
      })
      .catch((error) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
      });
  };

  const getContactTypes = (params?: any, callBack?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.contactTypes}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { contactTypes } = res || {};
        dispatch({ type: 'GET_CONTACTTYPE', payload: contactTypes });
        if (typeof callBack === 'function') {
          callBack(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
      });
  };
  const addRelationType = (data: any, callBack?: (_data: any) => void) => {
    APIService.post(`${ApiRoutes.relationTypes}`, data)
      .then((res: any) => {
        dispatch({ type: 'ADD_RELATIONTYPE', payload: res });
        if (typeof callBack === 'function') {
          callBack(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
      });
  };
  const editRelationType = (id: number, data: any, callBack?: (_data: any) => void) => {
    APIService.patch(`${ApiRoutes.relationTypes}/${id}`, data)
      .then((res: any) => {
        dispatch({ type: 'EDIT_RELATIONTYPE', payload: res });
        if (typeof callBack === 'function') {
          callBack(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
      });
  };
  const deleteRelationType = (id: number, callBack?: (_data: any) => void) => {
    APIService.delete(`${ApiRoutes.relationTypes}/${id}`)
      .then((res: any) => {
        dispatch({ type: 'DELETE_RELATIONTYPE', payload: res });
        if (typeof callBack === 'function') {
          callBack(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
      });
  };
  const restoreRelationType = (id: number, callBack?: (_data: any) => void) => {
    APIService.patch(`${ApiRoutes.relationTypes}/${id}${ApiRoutes.restore}`)
      .then((res: any) => {
        dispatch({ type: 'RESTORE_RELATIONTYPE', payload: res });
        if (typeof callBack === 'function') {
          callBack(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
      });
  };
  const getFileData = (data: any, callback?: (_data: any) => void) => {
    APIService.getFile(`${ApiRoutes.files}?path=${data}`)
      .then((res: any) => {
        dispatch({ type: 'GETFILE', payload: URL.createObjectURL(res) });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (error.response.status === 404) {
          toast('Files not Found', 'error');
        } else if (error.request) {
          toast('No response from the server. Please try again later.', 'error');
        } else {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };

  // Fetch gender data when component mounts
  useEffect(() => {
    getGenders({ _all: true });
    getDesignation({ _all: true });
    getQualifications({ _all: true });
    getestablishedyears({ _all: true });
    getDepartments({ _all: true });
    getRoles({ _all: true });
    getZones({ _all: true });
    getTerminationReason({ _all: true });
    getHospitalTypes({ _all: true });
    getOrgans({ _all: true });
    getCauseOfDeath({ _all: true });
    getCountries({ _all: true });
    getPayment();
    // getHospitaldeletereason({ _all: true });
    getCities({ _all: true });
    getStates({ _all: true });
    getHospitalNames({ _all: true });
    getBloodGroupList({ _all: true });
    getCMInsuranceList({ _all: true });
    getAgeList({ _all: true });
    getRecipientStatus({ _all: true });
    getRelationTypeList({ _all: true });
    getPeriodCategoryList({ _all: true });
    getVaccinationList({ _all: true });
    getHistoryOfComplicationsList({ _all: true });
    getCancerScreeningList({ _all: true });
    getLungDieseList({ _all: true });
    getALFListingList({ _all: true });
    getMultiOrgans({ _all: true });
    getConsultantList({ _all: true });
    getMultiOrgansList({ _all: true });
    getContactTypes({ _all: true });
  }, []);

  return {
    state,
    action: {
      getConsultantByHospitalId,
      getFiles,
      fileUpload,
      dispatch,
      getRoles,
      postCauseOfDeath,
      patchCauseOfDeath,
      patchPayment,
      deleteCauseOfDeath,
      deleteTerminateReason,
      postTerminateReason,
      patchTerminateReason,
      deleteOrgans,
      deleteZones,
      postZones,
      patchZones,
      restoreCauseOfDeath,
      restoreTerminationReason,
      restoreZoens,
      restoreOrgan,
      patchOrgans,
      postOrgans,
      patchBloodGroup,
      postBloodGroup,
      deleteBloodGroup,
      restoreBloodGroup,
      restoreDepartment,
      patchDepartment,
      postDepartment,
      deleteDepartment,
      getCauseOfDeath,
      getAadhaarResponse,
      postKycAadharOtp,
      getMultiOrgansList,
      postMultiOrgan,
      editMultiOrgan,
      deleteMultiOrgan,
      restoreMultiOrgan,
      getOrgans,
      getTerminationReason,
      getBloodGroupList,
      getDepartments,
      getDesignation,
      getRelationTypeList,
      getAllOrganList,
      getContactTypes,
      addRelationType,
      editRelationType,
      deleteRelationType,
      restoreRelationType,
      getZones,
      getFileData
    }
  };
});
