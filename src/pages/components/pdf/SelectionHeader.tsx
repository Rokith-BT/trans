import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    height: '34px'
  },
  bar: {
    width: 8,
    height: '24px',
    backgroundColor: '#FEBC3D'
  },
  title: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#A60179',
    padding: 5,
    flex: 1,
    textTransform: 'uppercase'
  }
});

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => (
  <View style={styles.container}>
    <View style={styles.bar} />
    <Text style={styles.title}>{title}</Text>
  </View>
);

export default SectionHeader;
