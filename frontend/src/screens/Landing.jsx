import React, { useCallback } from 'react'
import { View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from './main/HomeScreen'
import UserProfile from './userSide/UserProfile'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/theme'
import MyBookingsScreen from '@/screens/userSide/MyBookings'
import AllChatsScreen from './general/AllChatsScreen'

const Tab = createBottomTabNavigator()

// Icon mapping for better performance
const ICON_MAP = {
    Home: { focused: 'home', unfocused: 'home-outline' },
    MyBookings: { focused: 'bookmarks', unfocused: 'bookmarks-outline' },
    AllChats: { focused: 'chatbubbles', unfocused: 'chatbubbles-outline' },
    UserProfile: { focused: 'person-circle', unfocused: 'person-circle-outline' },
};

// icon component
const TabBarIcon = React.memo(({ routeName, focused }) => {
    const iconConfig = ICON_MAP[routeName] || { focused: 'ellipse-outline', unfocused: 'ellipse-outline' };
    const iconName = focused ? iconConfig.focused : iconConfig.unfocused;
    
    return (
        <View className="items-center justify-center relative w-full mb-0.5">
            <View className={`items-center justify-center w-11 h-11 rounded-[14px] mb-1 ${focused ? 'bg-themeColor/12' : ''}`}>
                <Ionicons
                    name={iconName}
                    size={focused ? 23 : 20}
                    color={focused ? COLORS.themeColor : '#9CA3AF'}
                />
            </View>
        </View>
    );
});

TabBarIcon.displayName = 'TabBarIcon';

export default function Landing() {
    // screen options
    const screenOptions = useCallback(({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => {
            const routeName = route?.name || '';
            return <TabBarIcon routeName={routeName} focused={focused} />;
        },
        tabBarStyle: {
            position: "absolute",
            backgroundColor: "#ffffff",
            height: 72,
            paddingBottom: 10,
            paddingTop: 6,
            borderTopWidth: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 10,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            zIndex: 1000,
        },
        tabBarLabelStyle: {
            fontSize: 11,
            fontFamily: "Inter-SemiBold",
            marginTop: 6,
            marginBottom: 0,
        },
        tabBarActiveTintColor: COLORS.themeColor,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarItemStyle: {
            paddingVertical: 2,
        },
        // Performance optimizations
        animationEnabled: true,
        swipeEnabled: false, // Disable swipe for better performance
        detachInactiveScreens: true, // Detach inactive screens to free memory
    }), []);

    return (
        <Tab.Navigator
            initialRouteName='Home'
            screenOptions={screenOptions}
        >
            <Tab.Screen
                name='Home'
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home',
                }}
            />
            <Tab.Screen
                name='MyBookings'
                component={MyBookingsScreen}
                options={{
                    title: "My Bookings",
                    tabBarLabel: 'Bookings',
                }}
            />
            <Tab.Screen
                name='AllChats'
                component={AllChatsScreen}
                options={{
                    title: "Chats",
                    tabBarLabel: 'Chats',
                }}
            />
            <Tab.Screen
                name='UserProfile'
                component={UserProfile}
                options={{
                    title: "Profile",
                    tabBarLabel: 'Profile',
                }}
            />
        </Tab.Navigator>
    )
}
