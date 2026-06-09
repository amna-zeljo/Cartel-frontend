import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginRegisterScreen from './screens/LoginRegisterScreen';
import SearchScreen from './screens/SearchScreen';
import MapScreen from './screens/MapScreen';
import CartScreen from './screens/CartScreen';
import OrderConfirmationScreen from './screens/OrderConfirmationScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import { CartProvider } from './context/CartContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="LoginRegister"
          screenOptions={{
            headerStyle: { backgroundColor: '#ffffff' },
            headerTitleStyle: { fontWeight: '600' },
            contentStyle: { backgroundColor: '#f5f7fb' },
          }}
        >
          <Stack.Screen
            name="LoginRegister"
            component={LoginRegisterScreen}
            options={{ title: 'Welcome' }}
          />
          <Stack.Screen
            name="Search"
            component={SearchScreen}
            options={{ title: 'Product Search' }}
          />
          <Stack.Screen
            name="Map"
            component={MapScreen}
            options={{ title: 'Nearby Stores' }}
          />
          <Stack.Screen
            name="Cart"
            component={CartScreen}
            options={{ title: 'Shopping Cart' }}
          />
          <Stack.Screen
            name="OrderConfirmation"
            component={OrderConfirmationScreen}
            options={{ title: 'Order Confirmation', headerBackVisible: false }}
          />
          <Stack.Screen
            name="OrderHistory"
            component={OrderHistoryScreen}
            options={{ title: 'Order History' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}
