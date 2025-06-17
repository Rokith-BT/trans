import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

interface TableItem {
  label: string;
  value: string | number | undefined;
  fullWidth?: boolean;
}

interface DetailsTableProps {
  PDFData?: Array<TableItem>;
}

const DetailsTable: React.FC<DetailsTableProps> = ({ PDFData = [] }) => {
  const pairedData = [];
  for (let i = 0; i < PDFData.length; i++) {
    if (PDFData[i].fullWidth) {
      pairedData.push([PDFData[i]]);
    } else if (i + 1 < PDFData.length && !PDFData[i + 1].fullWidth) {
      pairedData.push([PDFData[i], PDFData[i + 1]]);
      i++;
    } else {
      pairedData.push([PDFData[i]]);
    }
  }

  return (
    <View>
      {pairedData.map((row, rowIndex) => (
        <View key={rowIndex} style={[row.length === 1 ? styles.fullWidthRow : styles.twoColumnRow]}>
          <View style={styles.column}>
            <Text style={[row.length === 1 ? styles.labelFw : styles.label]}>{row[0].label}</Text>
            <Text style={[row.length === 1 ? styles.valueFw : styles.value]}>{row[0].value}</Text>
          </View>
          {row.length > 1 && (
            <View style={styles.column}>
              <Text style={[row.length === 1 ? styles.labelFw : styles.label]}>{row[1].label}</Text>
              <Text style={[row.length === 1 ? styles.valueFw : styles.value]}>{row[1].value}</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  fullWidthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 4
  },
  twoColumnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: '22px'
  },
  column: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row'
  },
  label: {
    fontWeight: 'extrabold',
    color: '#333',
    marginBottom: 4,
    fontSize: 8,
    textTransform: 'uppercase',
    display: 'flex',
    width: '35%',
    flexDirection: 'column',
    marginTop: '6px'
  },
  value: {
    backgroundColor: '#A6017926',
    padding: 4,
    textAlign: 'left',
    fontSize: 8,
    display: 'flex',
    width: '65%',
    flexDirection: 'column',
    alignItems: 'center'
  },
  labelFw: {
    fontWeight: 'extrabold',
    color: '#333',
    marginBottom: 4,
    fontSize: 8,
    textTransform: 'uppercase',
    display: 'flex',
    width: '17%',
    flexDirection: 'column',
    marginTop: '6px'
  },
  valueFw: {
    backgroundColor: '#A6017926',
    padding: 4,
    textAlign: 'left',
    fontSize: 8,
    display: 'flex',
    width: '83%',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    left: '-1.4px'
  }
});

export default DetailsTable;
