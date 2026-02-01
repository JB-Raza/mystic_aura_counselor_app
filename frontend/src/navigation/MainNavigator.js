import { TopHeader } from '@/components';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES, SCREEN_TITLES, shouldShowHeader } from '@/constants/routes';

import SplashScreen from '@/screens/Splash';
import Landing from '@/screens/Landing';
import LoginScreen from '@/screens/auth/Login';
import ForgetPassword from '@/screens/auth/ForgetPassword';
import IntroScreen from '@/screens/general/IntroScreen';
import NotificationScreen from '@/screens/main/NotificationScreen';
import SearchScreen from '@/screens/general/SearchScreen';

// user side
import EditProfile from '@/screens/userSide/EditProfile';
import BookApointment from '@/screens/userSide/BookApointment';
import ConfirmBooking from '@/screens/userSide/ConfirmBooking';
import FavoritesScreen from '@/screens/userSide/Favorites';
// counsellor side
import CouncelorProfile from '@/screens/councelorSide/CouncelorProfile';

// general screens
import AppearanceScreen from '@/screens/general/Appearance';
import HelpAndSupportScreen from '@/screens/general/Help&Support';
import AboutMysticAuraScreen from '@/screens/general/AboutMysticAura';
import AddCoins from '@/screens/general/AddCoins';
import WithdrawCoins from '@/screens/general/WithdrawCoins';
import ChatScreen from '@/screens/general/ChatScreen';

const Stack = createNativeStackNavigator();

const screenTitles = SCREEN_TITLES;

export default function MainNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.SPLASH}
      screenOptions={({ route }) => ({
        animation: 'flip',
        headerShown: shouldShowHeader(route?.name),
        header: ({ navigation, route }) => {
          const title = screenTitles[route?.name] || "";
          return <TopHeader title={title} />;
        },
      })}>
      <Stack.Screen name={ROUTES.SPLASH} component={SplashScreen} />
      <Stack.Screen name={ROUTES.LANDING} component={Landing} />
      <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
      <Stack.Screen name={ROUTES.FORGET_PASSWORD} component={ForgetPassword} />
      <Stack.Screen name={ROUTES.INTRO} component={IntroScreen} />
      <Stack.Screen name={ROUTES.NOTIFICATIONS} component={NotificationScreen} />
      {/* general screens */}
      <Stack.Screen name={ROUTES.APPEARANCE} component={AppearanceScreen} />
      <Stack.Screen name={ROUTES.HELP_AND_SUPPORT} component={HelpAndSupportScreen} />
      <Stack.Screen name={ROUTES.ABOUT_MYSTIC_AURA} component={AboutMysticAuraScreen} />
      <Stack.Screen name={ROUTES.ADD_COINS} component={AddCoins} />
      <Stack.Screen name={ROUTES.WITHDRAW_COINS} component={WithdrawCoins} />
      <Stack.Screen name={ROUTES.CHAT_SCREEN} component={ChatScreen} />
      <Stack.Screen name={ROUTES.SEARCH_SCREEN} component={SearchScreen} />
      {/* user part */}
      <Stack.Screen name={ROUTES.EDIT_PROFILE} component={EditProfile} />
      <Stack.Screen name={ROUTES.BOOK_APPOINTMENT} component={BookApointment} />
      <Stack.Screen name={ROUTES.CONFIRM_BOOKING} component={ConfirmBooking} />
      <Stack.Screen name={ROUTES.FAVORITES} component={FavoritesScreen} />
      {/* councelor part */}
      <Stack.Screen name={ROUTES.COUNSELOR_PROFILE} component={CouncelorProfile} />
    </Stack.Navigator>
  );
}``