import React from 'react';
import { Document, Page, StyleSheet, Text, View, Image as PdfImage } from '@react-pdf/renderer';
import { BasicDetails, OrganLicenceItem } from '@/types/hospital';
import { HospitalInfraStructure } from '../../add/validators';
import logo from '@/assets/imgs/PdfLogo.png';
import OrganInfoRow from './OrganInfoRow';
interface HospitalDetailsProps {
  BasicDetails: BasicDetails;
  HospitalInfra: HospitalInfraStructure;
  OrganLicense: OrganLicenceItem;
}
const styles = StyleSheet.create({
  page: {
    padding: '24px',
    fontFamily: 'Helvetica'
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'flex-start'
  },
  image: {
    width: 140,
    height: 30
  },
  section: {
    marginBottom: 10
  },
  borderContainer: {
    flexDirection: 'row',
    borderRadius: '0px',
    backgroundColor: '#A60179',
    borderWidth: 0,
    borderColor: 'red',
    marginTop: 12,
    textAlign: 'left'
    // background: #A6017926;
  },
  borderText: {
    fontSize: 12,
    color: 'white',
    marginLeft: 10,
    textAlign: 'center',
    marginTop: 3,
    fontWeight: 'light',
    textTransform: 'uppercase'
  },
  yellowSection: {
    width: 8,
    height: 20,
    backgroundColor: '#FEBC3D'
    // background: #FEBC3D;
  },
  hospitalName: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    textTransform: 'uppercase'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  column: {
    flexDirection: 'column',
    flex: 1,
    padding: 5
  },
  text: {
    fontSize: 12,
    textTransform: 'uppercase'
  },
  label: {
    fontWeight: 'bold'
  },
  table: {
    paddingTop: 10,
    marginTop: 20,
    borderWidth: 1,
    // borderColor: 'none',
    width: '100%'
  },
  tableCell: {
    // borderWidth: 1,
    borderColor: 'none',
    padding: 5,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  cellText: {
    fontSize: 9,
    textTransform: 'uppercase'
  },
  emailText: {
    fontSize: 9,
    textTransform: 'lowercase'
  }
});
const HospitalDetailsPdf: React.FC<HospitalDetailsProps> = ({ BasicDetails, HospitalInfra, OrganLicense }) => {
  console.log('baisc details ', BasicDetails);
  console.log('baisc details ', HospitalInfra);
  console.log('organ license daata ', OrganLicense);

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.imageContainer}>
          <PdfImage src={logo} style={styles.image} />
        </View>
        <View style={[styles.borderContainer, { marginTop: '30px' }]}>
          <View style={styles.yellowSection}></View>
          <Text style={styles.borderText}>HOSPITAL BASIC DETAILS</Text>
        </View>
        <View style={[styles.row, { paddingLeft: 5, paddingTop: 10, paddingRight: 5 }]}>
          <Text style={[styles.tableCell, styles.cellText]}>HOSPITAL NAME</Text>
          <Text
            style={[
              styles.tableCell,
              styles.cellText,
              { backgroundColor: '#A6017926', width: 424, textAlign: 'left', paddingRight: 10 }
            ]}
          >
            {BasicDetails?.hospitalName}
          </Text>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <View style={styles.row}>
              <Text style={[styles.tableCell, styles.cellText, { width: 100, textAlign: 'left' }]}>Type</Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.cellText,
                  { backgroundColor: '#A6017926', width: 152, textAlign: 'left' }
                ]}
              >
                {BasicDetails?.hospitalType?.name}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.tableCell, styles.cellText, { width: 100, textAlign: 'left' }]}>
                Year Established
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.cellText,
                  { backgroundColor: '#A6017926', width: 152, textAlign: 'left' }
                ]}
              >
                {BasicDetails?.yearOfEstablishment}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.tableCell, styles.cellText, { width: 100, textAlign: 'left' }]}>Phone</Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.cellText,
                  { backgroundColor: '#A6017926', width: 152, textAlign: 'left' }
                ]}
              >
                {BasicDetails?.phoneNumber1}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.tableCell, styles.cellText, { width: 100, textAlign: 'left' }]}>Email</Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.emailText,
                  { backgroundColor: '#A6017926', width: 152, textAlign: 'left' }
                ]}
              >
                {BasicDetails?.email}
              </Text>
            </View>
          </View>
          <View style={styles.column}>
            <View style={styles.row}>
              <Text style={[styles.tableCell, styles.cellText, { width: 100, textAlign: 'left' }]}>Zone</Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.cellText,
                  { backgroundColor: '#A6017926', width: 152, textAlign: 'left' }
                ]}
              >
                {BasicDetails?.zone?.name}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.tableCell, styles.cellText, { width: 100, textAlign: 'left' }]}>Website</Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.cellText,
                  { backgroundColor: '#A6017926', width: 152, textAlign: 'left' }
                ]}
              >
                {BasicDetails?.websiteUrl}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.tableCell, styles.cellText, { width: 100, textAlign: 'left' }]}>
                Alternate Phone
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.cellText,
                  { backgroundColor: '#A6017926', width: 152, textAlign: 'left' }
                ]}
              >
                {BasicDetails?.phoneNumber2}
              </Text>
            </View>
          </View>
        </View>
        <View style={[styles.borderContainer, { marginTop: '30px' }]}>
          <View style={styles.yellowSection}></View>
          <Text style={styles.borderText}>HOSPITAL ADDRESS</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <View style={styles.row}>
              <Text style={[styles.tableCell, styles.cellText, { width: 100, textAlign: 'left' }]}>ADDRESS LINE 1</Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.cellText,
                  { backgroundColor: '#A6017926', width: 152, textAlign: 'left' }
                ]}
              >
                {BasicDetails?.addressLine1}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.tableCell, styles.cellText, { width: 100, textAlign: 'left' }]}>TOWN/VILLAGE</Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.cellText,
                  { backgroundColor: '#A6017926', width: 152, textAlign: 'left' }
                ]}
              >
                {BasicDetails?.townVillage}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.tableCell, styles.cellText, { width: 100, textAlign: 'left' }]}>PIN CODE</Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.cellText,
                  { backgroundColor: '#A6017926', width: 152, textAlign: 'left' }
                ]}
              >
                {BasicDetails?.pincode}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.tableCell, styles.cellText, { width: 100, textAlign: 'left' }]}>STATE</Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.cellText,
                  { backgroundColor: '#A6017926', width: 152, textAlign: 'left' }
                ]}
              >
                {BasicDetails?.state?.name}
              </Text>
            </View>
          </View>

          <View style={styles.column}>
            <View style={styles.row}>
              <Text style={[styles.tableCell, styles.cellText, { width: 100, textAlign: 'left' }]}>ADDRESS LINE 1</Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.cellText,
                  { backgroundColor: '#A6017926', width: 152, textAlign: 'left' }
                ]}
              >
                {BasicDetails?.addressLine2}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.tableCell, styles.cellText, { width: 100, textAlign: 'left' }]}>LANDMARK</Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.cellText,
                  { backgroundColor: '#A6017926', width: 152, textAlign: 'left' }
                ]}
              >
                {BasicDetails?.landmark}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.tableCell, styles.cellText, { width: 100, textAlign: 'left' }]}>CITY</Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.cellText,
                  { backgroundColor: '#A6017926', width: 152, textAlign: 'left' }
                ]}
              >
                {BasicDetails?.city?.name}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={[styles.tableCell, styles.cellText, { width: 100, textAlign: 'left' }]}>COUNTRY</Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.cellText,
                  { backgroundColor: '#A6017926', width: 152, textAlign: 'left' }
                ]}
              >
                {BasicDetails?.country?.name}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.borderContainer, { marginTop: '30px' }]}>
          <View style={styles.yellowSection}></View>
          <Text style={styles.borderText}>HOSPITAL INFRASTRUCTURE</Text>
        </View>

        <View style={[styles.row, { paddingLeft: 5, paddingTop: 10, paddingRight: 5 }]}>
          <Text style={[styles.tableCell, styles.cellText]}>departments</Text>
          <Text
            style={[
              styles.tableCell,
              styles.cellText,
              { backgroundColor: '#A6017926', width: 424, textAlign: 'left', paddingRight: 10 }
            ]}
          >
            {Array.isArray(HospitalInfra?.departments) && HospitalInfra.departments.length > 0
              ? HospitalInfra.departments.map((item) => item?.name).join(', ')
              : 'Not have any Departments'}
          </Text>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <View style={styles.row}>
              <Text style={[styles.tableCell, styles.cellText, { width: 100, textAlign: 'left' }]}>NUMBER OF BED</Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.cellText,
                  { backgroundColor: '#A6017926', width: 152, textAlign: 'left' }
                ]}
              >
                {HospitalInfra?.numberOfBeds}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.tableCell, styles.cellText, { width: 100, textAlign: 'left' }]}>
                MEDICAL COLLEGE
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.cellText,
                  { backgroundColor: '#A6017926', width: 152, textAlign: 'left' }
                ]}
              >
                {HospitalInfra?.isMedicalCollegeAttached ? 'Yes' : 'No'}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.tableCell, styles.cellText, { width: 100, textAlign: 'left' }]}>
                CLINICAL ESTABLISHMENT ACT
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.cellText,
                  { backgroundColor: '#A6017926', width: 152, textAlign: 'left' }
                ]}
              >
                {HospitalInfra?.isRegistredClinicalEstablishmentAct ? 'Yes' : 'No'}
              </Text>
            </View>
          </View>
          <View style={styles.column}>
            <View style={styles.row}>
              <Text style={[styles.tableCell, styles.cellText, { width: 100, textAlign: 'left' }]}>TRAUMA UNIT</Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.cellText,
                  { backgroundColor: '#A6017926', width: 152, textAlign: 'left' }
                ]}
              >
                {HospitalInfra?.isTraumaUnitAvailable ? 'Yes' : 'No'}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.tableCell, styles.cellText, { width: 100, textAlign: 'left' }]}>
                ISO/NABH ACCREDITED
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.cellText,
                  { backgroundColor: '#A6017926', width: 152, textAlign: 'left' }
                ]}
              >
                {HospitalInfra?.isIsoOrNabhAccredited ? 'Yes' : 'No'}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.tableCell, styles.cellText, { width: 100, textAlign: 'left' }]}>
                1st ORGAN LICENSE REG. DATE
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.cellText,
                  { backgroundColor: '#A6017926', width: 152, textAlign: 'left' }
                ]}
              >
                {HospitalInfra?.firstOrganLicenceRegDate}
              </Text>
            </View>
          </View>
        </View>

        {/* <View style={styles.borderContainer}>
          <View style={styles.yellowSection}></View>
          <Text style={styles.borderText}>APPROVED ORGANS</Text>
        </View> */}
        {/* <View style={[styles.row, { paddingLeft: 5, paddingTop: 10, paddingRight: 5 }]}>
          <Text style={[styles.tableCell, styles.cellText]}>APPROVED ORGANS</Text>
          <Text
            style={[
              styles.tableCell,
              styles.cellText,
              { backgroundColor: '#A6017926', width: 424, textAlign: 'left', paddingRight: 10 }
            ]}
          >
            {Array.isArray(OrganLicense) && OrganLicense.length > 0
              ? OrganLicense.map((item) => item.organ?.name).join(', ')
              : 'No organs available'}
          </Text>
        </View> */}
        {/* <View style={styles.row}>
          <View style={styles.column}>
            <View style={styles.row}>
              <Text style={[styles.tableCell, styles.cellText, { width: 100, textAlign: 'left' }]}>
                ORGAN 1 LEVEL REG. DATE
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.cellText,
                  { backgroundColor: '#A6017926', width: 152, textAlign: 'left' }
                ]}
              >
                {OrganLicense?.[0]?.firstLevelOrganLicenceRegDate}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.tableCell, styles.cellText, { width: 100, textAlign: 'left' }]}>
                ORGAN LICENSE NUMBER
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.cellText,
                  { backgroundColor: '#A6017926', width: 152, textAlign: 'left' }
                ]}
              >
                {OrganLicense?.[0]?.organLicenceNumber}
              </Text>
            </View>
          </View>
          <View style={styles.column}>
            <View style={styles.row}>
              <Text style={[styles.tableCell, styles.cellText, { width: 100, textAlign: 'left' }]}>
                LICENSE EXPIRY DATE
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.cellText,
                  { backgroundColor: '#A6017926', width: 152, textAlign: 'left' }
                ]}
              >
                {OrganLicense?.[0]?.licenceExpiryDate}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.tableCell, styles.cellText, { width: 100, textAlign: 'left' }]}>
                PAYMENT RECIPIENT NUMBER
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.cellText,
                  { backgroundColor: '#A6017926', width: 152, textAlign: 'left' }
                ]}
              >
                {OrganLicense?.[0]?.paymentReceiptNumber}
              </Text>
            </View>
          </View>
        </View> */}
      </Page>
      {/* <OrgansSection organLicenseData={organLicenseData} /> */}
      <Page style={styles.page}>
        <View style={styles.imageContainer}>
          <PdfImage src={logo} style={styles.image} />
        </View>
        {Array.isArray(OrganLicense) && OrganLicense?.length > 0 ? (
          OrganLicense.map((organ, index) => (
            <View key={index}>
              <View style={styles.borderContainer}>
                <View style={styles.yellowSection}></View>
                <Text style={styles.borderText}>
                  {`ORGAN ${index + 1}: ${organ.organ?.name?.toUpperCase() || 'N/A'}`}
                </Text>
              </View>
              <View style={styles.row}>
                <View style={styles.column}>
                  <OrganInfoRow label="Level Reg. Date" value={organ?.firstLevelOrganLicenceRegDate} />
                  <OrganInfoRow label="License Number" value={organ?.organLicenceNumber} />
                </View>
                <View style={styles.column}>
                  <OrganInfoRow label="Expiry Date" value={organ?.licenceExpiryDate} />
                  {BasicDetails?.hospitalType === 'Private' && (
                    <OrganInfoRow label="Payment Recipient" value={organ?.paymentReceiptNumber} />
                  )}
                </View>
              </View>
              {/* {index === 0 && (
                <>
                  <Text style={{ marginBottom: '70px' }} break />
                 
                   
                 
                </>
              )} */}
            </View>
          ))
        ) : (
          <Text style={{ marginTop: '10px' }}>No data available</Text>
        )}
      </Page>
      {/* <PaymentDetails
                    rows={hospitalDetail.payments.rows}
                    total={hospitalDetail.payments.total}
                    status={hospitalDetail.payments.status}
                /> */}
    </Document>
  );
};

export default HospitalDetailsPdf;
