import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { useCart } from '../context/CartContext';
import { useShopping } from '../context/ShoppingContext';
import AppHeader from '../components/AppHeader';
import AppCard from '../components/AppCard';
import PrimaryButton from '../components/PrimaryButton';
import MarketTotalsList from '../components/MarketTotalsList';
import CheapestOptionCard from '../components/CheapestOptionCard';
import styles from '../styles/screens/chooseMarketScreenStyles';

export default function ChooseMarketScreen({ onBack = () => {}, onSelectMarket = () => {} }) {
  const { total } = useCart();
  const { marketAdjustments } = useShopping();

  const marketTotals = marketAdjustments.map((item) => ({
    market: item.market,
    total: total + item.adjustment,
  }));

  const cheapest = marketTotals.reduce((min, item) => (item.total < min.total ? item : min), marketTotals[0]);
  const [selectedMarket, setSelectedMarket] = useState(cheapest.market);

  const selectedMarketDetails = marketTotals.find((item) => item.market === selectedMarket) || cheapest;

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader title="Choose Market" onBack={onBack} />

      <AppCard style={styles.card}>
        <MarketTotalsList
          marketTotals={marketTotals}
          selectedMarket={selectedMarket}
          onSelectMarket={setSelectedMarket}
        />

        <CheapestOptionCard market={cheapest.market} total={cheapest.total} />

        <PrimaryButton
          label={`Select ${selectedMarket}`}
          onPress={() => onSelectMarket(selectedMarketDetails)}
          style={styles.actionButton}
        />
      </AppCard>
    </SafeAreaView>
  );
}
