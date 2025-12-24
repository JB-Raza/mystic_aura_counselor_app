import { Loader, TopHeader } from '@/components';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { lazy, Suspense } from 'react';
import { NO_HEADER_SCREENS, ROUTES, SCREEN_TITLES, shouldShowHeader } from '@/constants/routes';

import SplashScreen from '@/screens/Splash'
import { ActivityIndicator, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { toggleFavorite } from '@/utils/favoritesUtils';

const Landing = lazy(() => import('@/screens/Landing'))
const LoginScreen = lazy(() => import('@/screens/auth/Login'))
const ForgetPassword = lazy(() => import('@/screens/auth/ForgetPassword'))
const IntroScreen = lazy(() => import('@/screens/general/IntroScreen'))
const NotificationScreen = lazy(() => import('@/screens/main/NotificationScreen'))



// user side
const EditProfile = lazy(() => import('@/screens/userSide/EditProfile'), 4000)
const BookApointment = lazy(() => import('@/screens/userSide/BookApointment'))
const ConfirmBooking = lazy(() => import('@/screens/userSide/ConfirmBooking'))
const FavoritesScreen = lazy(() => import('@/screens/userSide/Favorites'))
// counsellor side
const CouncelorProfile = lazy(() => import('@/screens/councelorSide/CouncelorProfile'))

// general screens
const AppearanceScreen = lazy(() => import('@/screens/general/Appearance'))
const HelpAndSupportScreen = lazy(() => import('@/screens/general/Help&Support'))
const AboutMysticAuraScreen = lazy(() => import('@/screens/general/AboutMysticAura'))
const AddCoins = lazy(() => import('@/screens/general/AddCoins'))
const WithdrawCoins =    lazy(() => import('@/screens/general/WithdrawCoins'))
const ChatScreen = lazy(() => import('@/screens/general/ChatScreen'))



const Stack = createNativeStackNavigator()

const screenTitles = SCREEN_TITLES


const LazyScreenWrapper = ({ LazyComponent, route, navigation, ...props }) => {
    return (
        <Suspense fallback={<Loader />}>
            <LazyComponent route={route} navigation={navigation} {...props} />
        </Suspense>
    );
};

// Create wrapper components outside render to avoid inline functions
const LandingWrapper = (props) => <LazyScreenWrapper LazyComponent={Landing} {...props} />;
const LoginScreenWrapper = (props) => <LazyScreenWrapper LazyComponent={LoginScreen} {...props} />;
const ForgetPasswordWrapper = (props) => <LazyScreenWrapper LazyComponent={ForgetPassword} {...props} />;
const IntroScreenWrapper = (props) => <LazyScreenWrapper LazyComponent={IntroScreen} {...props} />;
const NotificationScreenWrapper = (props) => <LazyScreenWrapper LazyComponent={NotificationScreen} {...props} />;
const AppearanceScreenWrapper = (props) => <LazyScreenWrapper LazyComponent={AppearanceScreen} {...props} />;
const HelpAndSupportScreenWrapper = (props) => <LazyScreenWrapper LazyComponent={HelpAndSupportScreen} {...props} />;
const AboutMysticAuraScreenWrapper = (props) => <LazyScreenWrapper LazyComponent={AboutMysticAuraScreen} {...props} />;
const AddCoinsWrapper = (props) => <LazyScreenWrapper LazyComponent={AddCoins} {...props} />;
const WithdrawCoinsWrapper = (props) => <LazyScreenWrapper LazyComponent={WithdrawCoins} {...props} />;
const ChatScreenWrapper = (props) => <LazyScreenWrapper LazyComponent={ChatScreen} {...props} />;
const EditProfileWrapper = (props) => <LazyScreenWrapper LazyComponent={EditProfile} {...props} />;
const BookApointmentWrapper = (props) => <LazyScreenWrapper LazyComponent={BookApointment} {...props} />;
const ConfirmBookingWrapper = (props) => <LazyScreenWrapper LazyComponent={ConfirmBooking} {...props} />;
const FavoritesScreenWrapper = (props) => <LazyScreenWrapper LazyComponent={FavoritesScreen} {...props} />;
const CouncelorProfileWrapper = (props) => <LazyScreenWrapper LazyComponent={CouncelorProfile} {...props} />;

export default function MainNavigator() {

    const topHeaderRightActions = [
        {
            route: ROUTES.COUNSELOR_PROFILE,
            action: (
                <Pressable
                    // onPress={() => toggleFavorite(councelor || "")}
                // disabled={isLoadingFavorite}
                // className={`p-2 rounded-full active:bg-white/10 ${isLoadingFavorite ? 'opacity-50' : ''}`}
                >
                    {/* {isLoadingFavorite ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Ionicons
                            name={isCounselorFavorite ? "heart" : "heart-outline"}
                            size={22}
                            color={isCounselorFavorite ? "#EF4444" : "white"}
                        />
                    )} */}
                </Pressable>
            )
        }
    ]

    return (
        <Stack.Navigator
            initialRouteName={ROUTES.LANDING}
            screenOptions={({ route }) => ({
                animation: "slide_from_right",
                headerShown: shouldShowHeader(route?.name),
                header: ({ navigation, route }) => {
                    const title = screenTitles[route?.name] || route?.name;
                    return <TopHeader title={title} />;
                }
            })}
        >
            <Stack.Screen name={ROUTES.SPLASH} component={SplashScreen} />
            <Stack.Screen
                name={ROUTES.LANDING}
                component={LandingWrapper}
            />
            <Stack.Screen
                name={ROUTES.LOGIN}
                component={LoginScreenWrapper}
            />
            <Stack.Screen
                name={ROUTES.FORGET_PASSWORD}
                component={ForgetPasswordWrapper}
            />
            <Stack.Screen
                name={ROUTES.INTRO}
                component={IntroScreenWrapper}
            />
            <Stack.Screen
                name={ROUTES.NOTIFICATIONS}
                component={NotificationScreenWrapper}
            />
            {/* general screens */}
            <Stack.Screen
                name={ROUTES.APPEARANCE}
                component={AppearanceScreenWrapper}
            />
            <Stack.Screen
                name={ROUTES.HELP_AND_SUPPORT}
                component={HelpAndSupportScreenWrapper}
            />
            <Stack.Screen
                name={ROUTES.ABOUT_MYSTIC_AURA}
                component={AboutMysticAuraScreenWrapper}
            />
            <Stack.Screen
                name={ROUTES.ADD_COINS}
                component={AddCoinsWrapper}
            />
            <Stack.Screen
                name={ROUTES.WITHDRAW_COINS}
                component={WithdrawCoinsWrapper}
            />
            <Stack.Screen
                name={ROUTES.CHAT_SCREEN}
                component={ChatScreenWrapper}
            />
            {/* user part */}
            <Stack.Screen
                name={ROUTES.EDIT_PROFILE}
                component={EditProfileWrapper}
            />
            <Stack.Screen
                name={ROUTES.BOOK_APPOINTMENT}
                component={BookApointmentWrapper}
            />
            <Stack.Screen
                name={ROUTES.CONFIRM_BOOKING}
                component={ConfirmBookingWrapper}
            />
            <Stack.Screen
                name={ROUTES.FAVORITES}
                component={FavoritesScreenWrapper}
            />
            {/* councelor part */}
            <Stack.Screen
                name={ROUTES.COUNSELOR_PROFILE}
                component={CouncelorProfileWrapper}
            />

        </Stack.Navigator>
    )
}
