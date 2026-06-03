import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/components/appHeaderStyles';

export default function AppHeader({ title, onBack = null }) {
  return (
    <View style={styles.header}>
      <View style={styles.sideAction}>
        {onBack ? (
          <TouchableOpacity onPress={onBack}>
            <Text style={styles.back}>‹</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.sideAction} />
    </View>
  );
}
