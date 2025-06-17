import React from 'react';
import { Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    textTransform: 'uppercase',
    margin: 4
  },
  label: {
    fontWeight: 'bold'
  }
});

interface TextBlockProps {
  label?: string;
  value?: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  style?: any;
}

const TextBlock: React.FC<TextBlockProps> = ({ label, value, style }) => (
  <Text style={[styles.text, style]}>
    {label && <Text style={styles.label}>{label}: </Text>}
    {value}
  </Text>
);

export default TextBlock;
