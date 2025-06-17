/* eslint-disable react/prop-types */
import { Document, Page, StyleSheet, View, Image as PdfImage } from '@react-pdf/renderer';
import SectionHeader from '@/pages/components/pdf/SelectionHeader';
import DetailsTable from '@/pages/components/pdf/DetailsTable';
import PropTypes from 'prop-types';
import logo from '@/assets/imgs/PdfLogo.png';

interface InfoType {
  label: string;
  value?: string;
  fullWidth?: boolean;
}

interface PreviewType {
  donarDetails?: InfoType[];
  apnoeaDetails?: InfoType[];
  organConsent?: InfoType[];
  injuriesDetail?: InfoType[];
  abgTest?: InfoType[];
  fiodetails?: InfoType[];
  inotropes: InfoType[];
  // attachmentDetail?: InfoType[];
}

const styles = StyleSheet.create({
  page: {
    padding: 24,
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
  horizontalLine: {
    borderTop: 1,
    borderColor: '#888',
    marginTop: 4,
    marginBottom: 8
  }
});

const PreviewPDF: React.FC<PreviewType> = ({
  donarDetails = [],
  apnoeaDetails = [],
  organConsent = [],
  injuriesDetail = [],
  abgTest = [],
  fiodetails = [],
  inotropes = []
  // attachmentDetail = []
}) => (
  <>
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Basic Info Section */}
        <View style={styles.imageContainer}>
          <PdfImage src={logo} style={styles.image} />
        </View>
        <SectionHeader title="DONOR DETAILS" />
        <DetailsTable PDFData={donarDetails} />
        {apnoeaDetails.map((el, i) => {
          return (
            <>
              <SectionHeader title={`${i + 1}. APNOEA DETAILS`} />
              <DetailsTable PDFData={el} />
            </>
          );
        })}
        <SectionHeader title="ORGAN CONSENT" />
        <DetailsTable PDFData={organConsent} />
        <SectionHeader title="INJURIES DETAILS" />
        <DetailsTable PDFData={injuriesDetail} />
        <SectionHeader title="ABG DETAILS" />
        <DetailsTable PDFData={abgTest} />
        {fiodetails.map((el, i) => {
          return (
            <>
              <SectionHeader title={`${i + 1}. Fio`} />
              <DetailsTable PDFData={el} />
            </>
          );
        })}
        {inotropes.map((el, i) => {
          return (
            <>
              <SectionHeader title={`${i + 1}. Inotropes`} />
              <DetailsTable PDFData={el} />
            </>
          );
        })}
        {/* <SectionHeader title="Attachment DETAILS" />
        <DetailsTable PDFData={attachmentDetail} /> */}

        {/* Address Section */}
        {/* {basicAddress.map((el, i) => (
          <div key={`address-${i}`}>
            <SectionHeader title={`${i + 1}. RECIPIENT ADDRESS11`} />
            <DetailsTable PDFData={el} />
          </div>
        ))}
        {familyContInfo.map(
          (el, i) =>
            i == 0 && (
              <div key={`family-${i}`}>
                <SectionHeader title={`${i + 1}. FAMILY CONTACT`} />
                <DetailsTable PDFData={el} />
              </div>
            )
        )}
      </Page>
      <Page size="A4" style={styles.page}>
        <View style={styles.imageContainer}>
          <PdfImage src={logo} style={styles.image} />
        </View>
       
        {familyContInfo.map(
          (el, i) =>
            i > 0 && (
              <div key={`family-${i}`}>
                <SectionHeader title={`${i + 1}. FAMILY CONTACT`} />
                <DetailsTable PDFData={el} />
              </div>
            )
        )}
     
        <SectionHeader title="PHYSICAL DETAILS" />
        <DetailsTable PDFData={physicalInfo} />

        <SectionHeader title="MEDICAL HISTORY" />
        <DetailsTable PDFData={medicalInfo} />
      </Page>
      <Page size="A4" style={styles.page}>
        <View style={styles.imageContainer}>
          <PdfImage src={logo} style={styles.image} />
        </View>
        <SectionHeader title="MALIGNANCY STATUS" />
        <DetailsTable PDFData={malignancyInfo} />
        <SectionHeader title="VIROLOGY STATUS" />
        <DetailsTable PDFData={viralogyInfo} />
   
        {vaccinationInfo.map((el, i) => (
          <div key={`vaccination-${i}`}>
            <SectionHeader title={`${i + 1}. VACCINATION STATUS`} />
            <DetailsTable PDFData={el} />
          </div>
        ))}
      </Page>
      <Page size="A4" style={styles.page}>
        <View style={styles.imageContainer}>
          <PdfImage src={logo} style={styles.image} />
        </View>
        {organreqInfo.map((el, i) => (
          <div key={`organ-${i}`}>
            <SectionHeader title="ORGAN REQUESTED" />
            <DetailsTable PDFData={el} />
            <View style={styles.horizontalLine} />
            {el?.map((e: { label: string; value: string }) => (
              <>
                {e.value === 'Heart' && <DetailsTable PDFData={heartInfo} />}
                {e.value === 'Kidney' && <DetailsTable PDFData={kidneyInfo} />}
                {e.value === 'Liver' && <DetailsTable PDFData={liverInfo} />}
                {e.value === 'Pancreas' && <DetailsTable PDFData={pancreasInfo} />}
                {e.value === 'Dual lungs' && <DetailsTable PDFData={dualLungsInfo} />}
              </>
            ))}
          </div>
        ))} */}
      </Page>
    </Document>
  </>
);

PreviewPDF.propTypes = {
  donarDetails: PropTypes.array,
  apnoeaDetails: PropTypes.array,
  organConsent: PropTypes.array,
  injuriesDetails: PropTypes.array,
  abgTest: PropTypes.array,
  fiodetails: PropTypes.array,
  inotropes: PropTypes.array
};

export default PreviewPDF;
