import { Text, View, StyleSheet } from '@react-pdf/renderer';

// Define styles
const styles = StyleSheet.create({
  section: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 10
  },
  textHeading: {
    color: '#804595',
    fontWeight: 600,
    fontSize: 11,
    marginBottom: 7
  },
  textSubHeading: {
    color: '#80459580',
    fontWeight: 600,
    fontSize: 11,
    marginBottom: 7
  },
  textContent: {
    color: '#804595',
    fontWeight: 600,
    fontSize: 9,
    marginBottom: 7
  },
  textTotal: {
    color: '#C967A2',
    fontWeight: 600,
    fontSize: 9,
    marginBottom: 7
  },
  horizontalLine: {
    borderTop: 1,
    borderColor: '#000',
    marginTop: 10
  }
});

// PDF Component
const PaymentDetailsPDF = () => (
  <>
    <View style={styles.section}>
      <Text style={styles.textHeading}>Payment Details</Text>
      <Text style={styles.textSubHeading}>Amount</Text>
    </View>

    <View style={[styles.section, { marginTop: 10 }]}>
      <Text style={styles.textContent}>Recipient Registration Fee</Text>
      <Text style={styles.textContent}>5,000.00</Text>
    </View>

    <View style={styles.horizontalLine} />

    <View style={[styles.section, { marginTop: 10 }]}>
      <Text style={styles.textTotal}>Total Amount Paid</Text>
      <Text style={styles.textTotal}>5,000.00</Text>
    </View>
  </>
);

export default PaymentDetailsPDF;
