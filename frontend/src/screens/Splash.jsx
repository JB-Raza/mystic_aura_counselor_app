import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { IMAGES } from '@/constants/images';

const SplashScreen = ({ onFinish }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.5)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Fade in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        // Scale animation with spring
        Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
        }).start();

        // Subtle rotation animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(rotateAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Pulse animation for icon
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Navigate after delay
        const timer = setTimeout(() => {
            onFinish();
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <>
            <StatusBar backgroundColor={COLORS.themeColor} style='light' />
            <LinearGradient
                colors={[COLORS.themeColor, '#7A72FF', COLORS.themeColor]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className='flex-1'
            >
            <View className='flex-1 justify-center items-center px-6'>
                {/* Logo Container */}
                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    }}
                    className='items-center mb-8'
                >
                    {/* Icon with Pulse Animation */}
                    <Animated.View
                        style={{
                            transform: [{ scale: pulseAnim }, { rotate }],
                        }}
                        className='w-32 h-32 rounded-3xl bg-white/20 items-center justify-center mb-6'
                    >
                        <View className='w-24 h-24 rounded-2xl bg-white/30 items-center justify-center'>
                            <Ionicons name="sparkles" size={50} color="white" />
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
                    style={{ opacity: fadeAnim }}
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
