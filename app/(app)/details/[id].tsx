import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import DetailsScreen from '../../../src/screens/DetailsScreen';

export default function ProductDetailsRoute() {
  const { id } = useLocalSearchParams();
  return <DetailsScreen productId={String(id)} />;
}
