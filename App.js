import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginRegisterScreen from './screens/LoginRegisterScreen';
import SearchScreen from './screens/SearchScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
