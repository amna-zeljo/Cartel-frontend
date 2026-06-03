import React from 'react';
import { View, Text, Image } from 'react-native';
import styles from '../styles/components/productHeroStyles';

export default function ProductHero({ name, description, imageUrl }) {
  return (
    <>
      <View style={styles.imageWrap}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
      </View>
      <Text style={styles.productName}>{name}</Text>
      <Text style={styles.description}>{description}</Text>
    </>
  );
}
