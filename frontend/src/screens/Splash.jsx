import React, { useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import ROUTES from '@/constants/routes';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

const SplashScreen = ({ navigation }) => {
    // const navigationRef = useRef(navigation);


    // fade animation custom
    const fadeAnimation = useSharedValue(0.3)
    const rotateAnimation = useSharedValue(0)


    const fadeStyle = useAnimatedStyle(() => ({
        opacity: fadeAnimation.value,
    }))

    const rotateStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotateAnimation.value}deg` }]
    }))

    useEffect(() => {
        fadeAnimation.value = withRepeat(withTiming(1, { duration: 1500 }), -1, true)
        rotateAnimation.value = withRepeat(withTiming(360, { duration: 8000, easing: Easing.linear }), -1, false )

        setTimeout(() => {
            // navigation.navigate(ROUTES.LANDING)
        }, 2000)
    }, [])



    return (
        <>
            <LinearGradient
                colors={[COLORS.themeColor, '#7A72FF', COLORS.themeColor]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className='flex-1'
            >
                <View className='flex-1 justify-center items-center px-6'>

                    {/* Logo Container */}
                    <Animated.View
                        style={fadeStyle}
                        className='items-center mb-8'
                    >
                        {/* Icon with Pulse Animation */}
                        <Animated.View
                            className='w-32 h-32 rounded-3xl bg-white/20 items-center justify-center mb-6'
                        >
                            <View
                                className='w-24 h-24 rounded-2xl bg-white/30 items-center justify-center'>
                                <Animated.View style={rotateStyle}>
                                    <Ionicons name="sparkles" size={50} color="white" />
                                </Animated.View>
                            </View>
                        </Animated.View>

                        {/* App Name */}
                        <Text className='font-InterBold text-[36px] text-white mb-2 text-center'>
                            MysticAura
                        </Text>

                        {/* Tagline */}
                        <Text className='font-Inter text-[16px] text-white/90 text-center leading-6'>
                            Your Mental Wellness Companion
                        </Text>
                    </Animated.View>

                    {/* Loading Indicator */}
                    <Animated.View
                        className='absolute bottom-16 items-center'
                    >
                        <ActivityIndicator size="small" color="white" />
                        <Text className='font-Inter text-[13px] text-white/80 mt-3'>
                            Loading...
                        </Text>
                    </Animated.View>
                </View>
            </LinearGradient>
        </>
    );
};

export default SplashScreen;
