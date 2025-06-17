import React from 'react';
import { StyleSheet, View, Text } from '@react-pdf/renderer';

const OrganInfoRow: React.FC<{ label: string; value: string | undefined; bgColor?: string }> = ({
  label,
  value,
  bgColor
}) => (
  <View style={styles.row}>
    <Text style={[styles.tableCell, styles.cellText, { width: 100, textAlign: 'left' }]}>{label}</Text>
    <Text
      style={[
        styles.tableCell,
        styles.cellText,
        { backgroundColor: bgColor || '#A6017926', width: 152, textAlign: 'left' }
      ]}
    >
      {value || 'N/A'}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  borderContainer: {
    flexDirection: 'row',
    borderRadius: '0px',
    backgroundColor: '#A60179',
    borderWidth: 0,
    borderColor: 'red',
    marginTop: 8,
    textAlign: 'left'
  },
  yellowSection: {
    width: 8,
    height: 20,
    backgroundColor: '#FEBC3D'
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
  row: {
    flexDirection: 'row',
    marginBottom: 5
  },
  column: {
    flexDirection: 'column',
    flex: 1,
    padding: 5
  },
  tableCell: {
    borderColor: 'none',
    padding: 5,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  cellText: {
    fontSize: 9,
    textTransform: 'uppercase'
  }
});

export default OrganInfoRow;
