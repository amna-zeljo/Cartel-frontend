import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { useShopping } from '../context/ShoppingContext';
import AppHeader from '../components/AppHeader';
import AppCard from '../components/AppCard';
import PrimaryButton from '../components/PrimaryButton';
import ProductHero from '../components/ProductHero';
import PriceComparisonTable from '../components/PriceComparisonTable';
import SaleHighlightCard from '../components/SaleHighlightCard';
import styles from '../styles/screens/productViewScreenStyles';

export default function ProductViewScreen({ onBack = () => {}, onChooseMarket = () => {} }) {
  const { product, cheapestProductMarket } = useShopping();

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader title="Product View" onBack={onBack} />

      <AppCard style={styles.card}>
        <ProductHero
          name={product.name}
          description={product.description}
          imageUrl={product.imageUrl}
        />

        <View style={styles.sectionDivider} />

        <Text style={styles.sectionTitle}>Price Comparison:</Text>

        <PriceComparisonTable prices={product.prices} />

        <SaleHighlightCard market={cheapestProductMarket.market} price={cheapestProductMarket.price} />

        <PrimaryButton label="Choose Market" onPress={onChooseMarket} style={styles.actionButton} />
      </AppCard>
    </SafeAreaView>
  );
}
