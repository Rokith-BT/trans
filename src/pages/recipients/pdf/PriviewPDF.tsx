import { Document, Page, StyleSheet, View, Image as PdfImage } from '@react-pdf/renderer';
import SectionHeader from '@/pages/components/pdf/SelectionHeader';
import DetailsTable from '@/pages/components/pdf/DetailsTable';
import PropTypes from 'prop-types';
import logo from '@/assets/imgs/PdfLogo.png';
import PaymentDetailsPDF from '@/pages/components/pdf/PaymentPrint';

interface InfoType {
  label?: string;
  value?: string | number;
  fullWidth?: boolean;
}

interface PreviewType {
  basicInfo?: InfoType[];
  basicAddress?: InfoType[];
  familyContInfo?: InfoType[];
  physicalInfo?: InfoType[];
  medicalInfo?: InfoType[];
  malignancyInfo?: InfoType[];
  viralogyInfo?: InfoType[];
  vaccinationInfo?: InfoType[];
  organreqInfo?: InfoType[];
  heartInfo?: InfoType[];
  kidneyInfo?: InfoType[];
  liverInfo?: InfoType[];
  pancreasInfo?: InfoType[];
  dualLungsInfo?: InfoType[];
  transferRecipientInfo?: InfoType[];
  organReciTraInfo?: InfoType[];
  isTransferReciient?: boolean;
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
  basicInfo = [],
  basicAddress = [],
  familyContInfo = [],
  physicalInfo = [],
  medicalInfo = [],
  malignancyInfo = [],
  viralogyInfo = [],
  vaccinationInfo = [],
  organreqInfo = [],
  heartInfo = [],
  kidneyInfo = [],
  liverInfo = [],
  pancreasInfo = [],
  dualLungsInfo = [],
  transferRecipientInfo = [],
  organReciTraInfo = [],
  isTransferReciient = false
}) => (
  <>
    {!isTransferReciient ? (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Basic Info Section */}
          <View style={styles.imageContainer}>
            <PdfImage src={logo} style={styles.image} />
          </View>
          <SectionHeader title="RECIPIENT BASIC DETAILS" />
          <DetailsTable PDFData={basicInfo} />

          {/* Address Section */}
          {basicAddress.map((el, i) => (
            <div key={`address-${i}`}>
              <SectionHeader title={`${i + 1}. RECIPIENT ADDRESS`} />
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
          {/* Family Contact Section */}
          {familyContInfo.map(
            (el, i) =>
              i > 0 && (
                <div key={`family-${i}`}>
                  <SectionHeader title={`${i + 1}. FAMILY CONTACT`} />
                  <DetailsTable PDFData={el} />
                </div>
              )
          )}
          {/* Other Sections */}
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
          {/* Vaccination Info */}
          {vaccinationInfo.map((el, i) => (
            <div key={`vaccination-${i}`}>
              <SectionHeader title={`${i + 1}. VACCINATION STATUS`} />
              <DetailsTable PDFData={el} />
            </div>
          ))}
        </Page>
        <Page size="A4" style={styles.page}>
          {/* Organ Request Info */}
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
          ))}
          <PaymentDetailsPDF />
        </Page>
      </Document>
    ) : (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Basic Info Section */}
          <View style={styles.imageContainer}>
            <PdfImage src={logo} style={styles.image} />
          </View>
          <SectionHeader title="RECIPIENT BASIC DETAILS" />
          <DetailsTable PDFData={transferRecipientInfo} />
          {organReciTraInfo.map((el, i) => (
            <div key={`organ-${i}`}>
              <SectionHeader title="ORGAN REQUESTED" />
              <DetailsTable PDFData={el} />
              <View style={styles.horizontalLine} />
            </div>
          ))}
        </Page>
      </Document>
    )}
  </>
);

PreviewPDF.propTypes = {
  basicInfo: PropTypes.array,
  basicAddress: PropTypes.array,
  familyContInfo: PropTypes.array,
  physicalInfo: PropTypes.array,
  medicalInfo: PropTypes.array,
  malignancyInfo: PropTypes.array,
  viralogyInfo: PropTypes.array,
  vaccinationInfo: PropTypes.array,
  organreqInfo: PropTypes.array,
  heartInfo: PropTypes.array,
  kidneyInfo: PropTypes.array,
  liverInfo: PropTypes.array,
  pancreasInfo: PropTypes.array,
  dualLungsInfo: PropTypes.array,
  transferRecipientInfo: PropTypes.array,
  organReciTraInfo: PropTypes.array,
  isTransferReciient: PropTypes.bool
};

export default PreviewPDF;
