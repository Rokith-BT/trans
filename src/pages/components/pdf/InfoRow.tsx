import React from 'react';
import { View, StyleSheet } from '@react-pdf/renderer';
import TextBlock from './TextBlock';

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row'
  },
  rowTwo: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    width: '30%',
    marginBottom: 5
  },
  value: {
    width: '65%',
    backgroundColor: '#A6017926',
    padding: 5
  },
  column: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center'
  },
  columnLabel: {
    width: '100%',
    marginBottom: 5
  },
  columnValue: {
    width: '100%',
    backgroundColor: '#A6017926',
    padding: 5
  }
});

interface InfoRowProps {
  label: string;
  value: string | number | undefined;
  fullWidth?: boolean;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, fullWidth }) => (
  <View style={fullWidth ? styles.column : styles.rowTwo}>
    {fullWidth ? (
      <>
        <TextBlock style={styles.columnLabel} label={label} />
        <TextBlock style={styles.columnValue} value={value} />
      </>
    ) : (
      <>
        <View style={styles.row}>
          <TextBlock style={styles.label} label={label} />
          <TextBlock style={styles.value} value={value} />
        </View>
      </>
    )}
  </View>
);

export default InfoRow;
