// import React from 'react';
// import { Document, Page, View, StyleSheet } from '@react-pdf/renderer';
// import HospitalDetails from './HospitalDetailsPdf';
// import { BasicDetails, OrganLicenceItem } from '@/types/hospital';
// import { HospitalInfraStructure } from '../../add/validators';

// const styles = StyleSheet.create({
//   page: {
//     padding: 20,
//     fontFamily: 'Helvetica'
//   }
// });
// interface PdfDocumentProps {
//   basicDetail: BasicDetails;
//   hospitalInfra?: HospitalInfraStructure;
//   organLicense?: OrganLicenceItem;
// }

// const PdfDocument: React.FC<PdfDocumentProps> = ({ basicDetail }) => (
//   <Document>
//     <Page style={styles.page}>
//       <HospitalDetails
//         BasicDetails={{
//           hospitalName: basicDetail?.hospitalName,
//           hospitalType: basicDetail?.hospitalType?.name,
//           yearOfEstablishment: basicDetail?.yearOfEstablishment,
//           phoneNumber1: basicDetail?.phoneNumber1,
//           email: basicDetail?.email
//         }}
//       />
     
//     </Page>
//   </Document>
// );

// export default PdfDocument;
