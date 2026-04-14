import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './navigation/RootNavigator';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import { ShopProvider } from './store/shopStore';
import { PopupProvider } from './context/PopupContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <PopupProvider>
          <ShopProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </ShopProvider>
        </PopupProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
