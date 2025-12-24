import { ImageBackground } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import React, { useEffect } from 'react'
import { IMAGES } from '@/constants/images.js';


const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);


export default function AnimatedStarBg() {
    const translateY = useSharedValue(0);
    const scale = useSharedValue(1.4);
    const rotate = useSharedValue(0);

    useEffect(() => {
        translateY.value = withRepeat(
            withTiming(15, {
                duration: 4000,
                easing: Easing.inOut(Easing.sin)
            }),
            -1,
            true
        );

        scale.value = withRepeat(
            withTiming(1, { duration: 30000 }),
            -1,
            true
        );

        rotate.value = withRepeat(
            withTiming(20, { duration: 10000 }),
            -1,
            true
        );
    }, []);

    const combinedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: translateY.value },
            { scale: scale.value },
            { rotate: `${rotate.value}deg` }
        ],
    }));


    return (
        <AnimatedImageBackground
            source={IMAGES.Login_Bg_stars}
            className="absolute w-full h-full rounded-lg opacity-30"
            style={combinedStyle}
        />
    )
}