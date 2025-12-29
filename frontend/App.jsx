import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native'

import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import './global.css';
import MainNavigator from './src/navigation/MainNavigator'
import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { COLORS } from '@/constants/theme';

import ToastManager from 'toastify-react-native';

// state management
import { ConfirmationAlertProvider } from '@/state/confirmationContext';
// import { Provider } from 'react-redux';
// import store from '@/redux/store';
import { Text, View, StyleSheet } from 'react-native';

const loadFonts = async () => {
  await Font.loadAsync({
    "Inter-Bold": require("./assets/fonts/Inter_18pt-Bold.ttf"),
    "Inter-Semibold": require("./assets/fonts/Inter_18pt-SemiBold.ttf"),
    "Inter-Medium": require("./assets/fonts/Inter_18pt-Medium.ttf"),
    "Inter-Regular": require("./assets/fonts/Inter_18pt-Regular.ttf"),
  })
}

// Custom Toast Component with smaller font sizes
const CustomToast = ({ text1, text2, message, type, ...props }) => {
  const toastText = text2 || text1 || message || '';
  const backgroundColor = type === 'error' ? '#EF4444' : type === 'success' ? '#10B981' : '#3B82F6';

  return (
    <View style={[styles.toastContainer, { backgroundColor }]}>
      <Text style={styles.text2}>{toastText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    width: '90%',
    borderRadius: 10,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text2: {
    color: '#fff',
    fontSize: 13,
  },
});



export default function App() {
  const [appIsReady, setAppIsReady] = useState(false)

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts
        await loadFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        // Mark app as ready - custom splash screen will show via MainNavigator
        setAppIsReady(true);
      }
    }

    prepare();
  }, [])

  if (!appIsReady) return null

  return (
    <>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ConfirmationAlertProvider>
            <StatusBar backgroundColor={COLORS.themeColor} style='light' />
            <SafeAreaView className='flex-1 justify-start bg-gray-50'>
              {/* redux */}
              {/* <Provider store={store}> */}
              {/* navigation */}
              <NavigationContainer>
                <MainNavigator />
              </NavigationContainer>

              {/* tostify react native */}
              <ToastManager
                useModal={false}
                position="top"
                config={{
                  success: (props) => <CustomToast {...props} type="success" />,
                  error: (props) => <CustomToast {...props} type="error" />,
                  info: (props) => <CustomToast {...props} type="info" />,
                }}
              />
              {/* </Provider> */}

            </SafeAreaView>
          </ConfirmationAlertProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </>
  );
}
