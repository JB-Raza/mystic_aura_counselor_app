import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from './main/HomeScreen'
import UserProfile from './userSide/UserProfile'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/theme'
import NotificationScreen from './main/NotificationScreen'
import { MyBookingsScreen } from '.'
import AllChatsScreen from './general/AllChatsScreen'

const Tab = createBottomTabNavigator()

export default function Landing() {

    return (
        <Tab.Navigator
            initialRouteName='Home'
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, size, color }) => {
                    let iconName;
                    switch (route.name) {
                        case "Home":
                            iconName = focused ? 'home' : 'home-outline';
                            break;
                        case "MyBookings":
                            iconName = focused ? 'bookmarks' : 'bookmarks-outline';
                            break;
                        case "AllChats":
                            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                            break;
                        case "UserProfile":
                            iconName = focused ? 'person-circle' : 'person-circle-outline';
                            break;
                        default:
                            iconName = 'ellipse-outline';
                    }
                    return (
                        <View style={styles.iconWrapper}>
                            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
                                <Ionicons
                                    name={iconName}
                                    size={focused ? 24 : 22}
                                    color={focused ? COLORS.themeColor : '#9CA3AF'}
                                />
                            </View>
                        </View>
                    );
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
            })}
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

const styles = StyleSheet.create({
    iconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '100%',
        marginBottom: 2,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 44,
        height: 44,
        borderRadius: 14,
        marginBottom: 4,
    },
    activeIconContainer: {
        backgroundColor: COLORS.themeColor + '12',
    },
});
