import { View, Text, Image, Pressable, Dimensions } from 'react-native'
import React, { useState, useCallback, useMemo, memo } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { useNavigation } from '@react-navigation/native'
import { IMAGES } from '@/constants/images';

import { ROUTES } from '@/constants/routes';

// Memoized shadow styles
const reviewCardShadowStyle = {
    shadowColor: COLORS.themeColor,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
};

const serviceCardShadowStyle = {
    shadowColor: COLORS.themeColor,
    shadowOpacity: 0.15,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 6,
    elevation: 4,
};

const serviceButtonShadowStyle = {
    shadowColor: COLORS.themeColor,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
};

const favoriteIconShadowStyle = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
};

const favoriteIconShadowStyleVertical = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
};

// Memoized ReviewCard component
export const ReviewCard = memo(({ review }) => {
    const [readMore, setReadMore] = useState(false);

    const handleToggleReadMore = useCallback(() => {
        setReadMore(prev => !prev);
    }, []);

    const readMoreText = useMemo(() =>
        readMore ? "Less" : "More",
        [readMore]
    );

    return (
        <View
            className="bg-white rounded-2xl p-4"
            style={reviewCardShadowStyle}
        >
            {/* Header */}
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                    
                    <Image
                        contentFit='cover'
                        source={review.user.avatar}
                        className="w-10 h-10 rounded-full mr-3"
                    />
                    <Text className="font-semibold text-neutral-800 text-[14px]">
                        {review.user.name}
                    </Text>
                </View>

                <View className="flex-row items-center bg-themeColor/10 px-2.5 py-1 rounded-full">
                    <Ionicons name="star" size={12} color={COLORS.themeColor} />
                    <Text className="ml-1 font-semibold text-[12px] text-themeColor">
                        {review.rating}
                    </Text>
                </View>
            </View>

            {/* Review Text */}
            <Text className={`mt-3 text-[12px] leading-5 text-neutral-600 ${readMore ? "" : "line-clamp-2"}`}>
                {review.comment}
            </Text>
            <Pressable
                onPress={handleToggleReadMore}
                className='mt-2'>
                <Text className='text-themeColor font-semibold text-[12px]'>Read {readMoreText}</Text>
            </Pressable>

            {/* Footer */}
            <View className="flex-row items-center justify-between mt-3">
                <Text className="text-[11px] text-neutral-400">{review.date}</Text>
                <View className="flex-row items-center">
                    <Ionicons name="checkmark-circle" size={12} color={COLORS.themeColor} />
                    <Text className="ml-1 text-[11px] text-neutral-500">
                        Verified Patient
                    </Text>
                </View>
            </View>
        </View>
    )
});

// Memoized ServiceCard component
export const ServiceCard = memo(({ service, onPress }) => {
    const patientServedText = useMemo(() =>
        service.patientServed > 0 ? `${service.patientServed} Served` : "New",
        [service.patientServed]
    );

    return (
        <View
            style={serviceCardShadowStyle}
            className="bg-white rounded-2xl p-4 w-full"
        >
            <View className="flex-row items-center gap-3">
                <View className="bg-themeColor/10 p-3 rounded-xl">
                    <Ionicons
                        name={service.icon || "medkit-outline"}
                        size={22}
                        color={COLORS.themeColor}
                    />
                </View>

                <View className="flex-1">
                    <Text className="text-[15px] font-Inter-Bold text-neutral-700">
                        {service.name}
                    </Text>
                    <Text className="text-[11px] text-neutral-400 mt-0.5">
                        {service.tagline}
                    </Text>
                </View>

                {service.rating > 0 && (
                    <View className="flex-row items-center bg-themeColor/10 px-2 py-1 rounded-full">
                        <Ionicons
                            name="star"
                            size={12}
                            color={COLORS.themeColor}
                        />
                        <Text className="ml-1 text-[11px] text-themeColor font-semibold">
                            {service.rating}
                        </Text>
                    </View>
                )}
            </View>

            {/* new */}
            <View className="flex-row items-center justify-between mt-5">
                {/* Patients Served */}
                <View className="flex-row items-center bg-themeColor/10 px-3 py-1 rounded-full">
                    <Ionicons name="people" size={12} color={COLORS.themeColor} />
                    <Text className="ml-1 text-[11px] font-medium text-themeColor">
                        {patientServedText}
                    </Text>
                </View>

                {/* CTA Button */}
                <Pressable
                    onPress={onPress}
                    className="bg-themeColor rounded-xl py-2.5 px-5"
                    android_ripple={{ color: "#fff" }}
                    style={serviceButtonShadowStyle}
                >
                    <Text className="text-white font-semibold text-[13px]">
                        Book Now
                    </Text>
                </Pressable>
            </View>
        </View>
    );
});

// Memoized CouncelorCard component
export const CouncelorCard = memo(({ item, isFavorite = false }) => {
    const navigation = useNavigation();

    // Memoize screen width
    const screenWidth = useMemo(() =>
        Dimensions.get("screen").width - 140,
        []
    );

    const cardStyle = useMemo(() => ({
        width: screenWidth,
        backgroundColor: "white",
    }), [screenWidth]);

    const handleNavigate = useCallback(() => {
        try {
            navigation.navigate(ROUTES.COUNSELOR_PROFILE, { data: item })
        } catch (error) {
            console.error('Navigation error:', error)
            navigation.navigate(ROUTES.LANDING)
        }
    }, [navigation, item]);

    const handleViewProfile = useCallback(() => {
        try {
            navigation.navigate(ROUTES.COUNSELOR_PROFILE, { data: item })
        } catch (error) {
            console.error('Navigation error:', error)
            navigation.navigate(ROUTES.LANDING)
        }
    }, [navigation, item]);

    const tagLowercase = useMemo(() =>
        item.tag.toLowerCase(),
        [item.tag]
    );

    return (
        <Pressable
            onPress={handleNavigate}
            style={cardStyle}
            className="rounded-2xl shadow-card shadow-themeColor/50 active:scale-95 transition-all"
        >
            {/* Main Content */}
            <View className="p-4">
                {/* Header */}
                <View className="flex-row gap-3">
                    {/* avatar */}
                    <View className="relative">
                        <Image
                             
                            contentFit='cover'
                            source={item.avatar}
                            className="w-16 h-16 rounded-2xl"
                        />
                        {/* is online */}
                        <View className='absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-[2px] border-white' />
                    </View>

                    {isFavorite && (
                        <View className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white/90 items-center justify-center shadow-sm"
                            style={favoriteIconShadowStyle}
                        >
                            <Ionicons
                                name="heart"
                                size={18}
                                color="#EF4444"
                            />
                        </View>
                    )}

                    {/* Name and Specialization */}
                    <View className="flex-1">
                        <Text className="font-InterSemibold text-[15px] text-slate-800 leading-tight">
                            {item.name}
                        </Text>
                        <Text className="font-InterMedium text-[12px] text-themeColor mt-0.5">
                            {item.tag} Specialist
                        </Text>

                        {/* Rating and Experience */}
                        <View className="flex-row items-center gap-3 mt-2">
                            <View className="flex-row items-center gap-1">
                                <Ionicons name="star" size={12} color="#F59E0B" />
                                <Text className="font-InterSemibold text-[11px] text-slate-700">
                                    {item.rating}
                                </Text>
                            </View>
                            <View className="w-px h-3 bg-gray-300" />
                            <Text className="font-InterMedium text-[11px] text-gray-500">
                                5y exp
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Bio Section */}
                <View className="mt-3">
                    <Text className="font-InterMedium text-[12px] text-slate-700 mb-1.5">
                        About
                    </Text>
                    <Text className="font-Inter text-[11px] text-gray-600 leading-tight line-clamp-2">
                        Experienced professional specializing in {tagLowercase}. Helped 200+ clients achieve personal growth and mental wellness.
                    </Text>
                </View>

                {/* Stats Row */}
                <View className="flex-row justify-between items-center mt-4 pt-3 border-t border-gray-100">
                    {/* Sessions Completed */}
                    <View className="flex-row items-center gap-1.5">
                        <View className="w-6 h-6 rounded-lg bg-blue-50 items-center justify-center">
                            <Ionicons name="people" size={12} color={COLORS.themeColor} />
                        </View>
                        <View>
                            <Text className="font-InterSemibold text-[11px] text-slate-800">200+</Text>
                            <Text className="font-Inter text-[9px] text-gray-500">sessions</Text>
                        </View>
                    </View>

                    {/* Response Time */}
                    <View className="flex-row items-center gap-1.5">
                        <View className="w-6 h-6 rounded-lg bg-green-50 items-center justify-center">
                            <Ionicons name="time" size={12} color="#10B981" />
                        </View>
                        <View>
                            <Text className="font-InterSemibold text-[11px] text-slate-800">15min</Text>
                            <Text className="font-Inter text-[9px] text-gray-500">response</Text>
                        </View>
                    </View>

                    {/* Price */}
                    <View className="flex-row items-center gap-1.5">
                        <View className="w-6 h-6 rounded-lg bg-amber-50 items-center justify-center">
                            <Image
                                 
                                contentFit='cover'
                                source={IMAGES.Coin_Icon}
                                className="w-3 h-3"
                            />
                        </View>
                        <View>
                            <Text className="font-InterSemibold text-[11px] text-slate-800">{item.rate}</Text>
                            <Text className="font-Inter text-[9px] text-gray-500">/min</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Action Footer */}
            <View className="border-t mt-auto border-gray-100 px-4 py-3 bg-gray-50 rounded-b-2xl">
                <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center gap-1.5">
                        <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                        <Text className="font-InterMedium text-[10px] text-gray-600">
                            Available today
                        </Text>
                    </View>

                    <Pressable
                        onPress={handleViewProfile}
                        className="bg-themeColor rounded-xl px-3 py-1.5 active:bg-themeColor/80"
                    >
                        <Text className="font-InterSemibold text-[11px] text-white">
                            View Profile
                        </Text>
                    </Pressable>
                </View>
            </View>
        </Pressable>
    )
});

// Memoized VerticalCouncelorCard component
const VerticalCouncelorCard = memo(({ item, isFavorite = false, onRemoveFavorite }) => {
    const navigation = useNavigation();

    /**
     * Handle heart icon press to remove from favorites
     * Prevents navigation when heart is clicked
     */
    const handleHeartPress = useCallback((e) => {
        e.stopPropagation()
        if (onRemoveFavorite) {
            onRemoveFavorite()
        }
    }, [onRemoveFavorite]);

    /**
     * Handle navigation to counselor profile with error handling
     */
    const handleNavigate = useCallback(() => {
        try {
            navigation.navigate(ROUTES.COUNSELOR_PROFILE, { data: item })
        } catch (error) {
            console.error('Navigation error:', error)
            // Fallback to Home if route doesn't exist
            try {
                navigation.navigate(ROUTES.LANDING)
            } catch (e) {
                navigation.navigate(ROUTES.LANDING)
            }
        }
    }, [navigation, item]);

    const handleViewProfile = useCallback(() => {
        try {
            navigation.navigate(ROUTES.COUNSELOR_PROFILE, { data: item })
        } catch (error) {
            console.error('Navigation error:', error)
            navigation.navigate(ROUTES.LANDING)
        }
    }, [navigation, item]);

    const tagLowercase = useMemo(() =>
        item.tag.toLowerCase(),
        [item.tag]
    );

    return (
        <Pressable
            onPress={handleNavigate}
            className="flex-1 bg-white rounded-2xl shadow-card my-2 active:scale-95 transition-all border border-gray-100"
        >
            <View className="flex-row p-4">
                {/* Left Section - Profile Image and Basic Info */}
                <View className="flex-row flex-1 gap-3">
                    {/* Profile Image */}
                    <View className="relative">
                        <Image
                             
                            contentFit='cover'
                            source={item.avatar}
                            className="w-16 h-16 rounded-2xl"
                        />
                        {/* Online Status */}
                        <View className='absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-[2px] border-white' />
                    </View>

                    {/* Favorite Heart Icon - Top Right */}
                    {isFavorite && (
                        <Pressable
                            onPress={handleHeartPress}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 items-center justify-center shadow-sm active:scale-90 z-10"
                            style={favoriteIconShadowStyleVertical}
                        >
                            <Ionicons
                                name="heart"
                                size={18}
                                color="#EF4444"
                            />
                        </Pressable>
                    )}

                    {/* Main Content */}
                    <View className="flex-1">
                        {/* Name and Specialization */}
                        <View className="mb-2">
                            <Text className="font-InterSemiBold text-[16px] text-slate-800">
                                {item.name}
                            </Text>
                            <Text className="font-InterMedium text-[13px] text-themeColor mt-0.5">
                                {item.tag} Specialist
                            </Text>
                        </View>

                        {/* Rating and Experience */}
                        <View className="flex-row items-center gap-3 mb-3">
                            <View className="flex-row items-center gap-1">
                                <Ionicons name="star" size={14} color="#F59E0B" />
                                <Text className="font-InterSemiBold text-[12px] text-slate-700">
                                    {item.rating}
                                </Text>
                            </View>
                            <View className="w-px h-3 bg-gray-300" />
                            <Text className="font-InterMedium text-[12px] text-gray-500">
                                5y exp
                            </Text>
                            <View className="w-px h-3 bg-gray-300" />
                            <View className="flex-row items-center gap-1">
                                <Ionicons name="time" size={12} color="#10B981" />
                                <Text className="font-InterMedium text-[12px] text-gray-500">
                                    15min
                                </Text>
                            </View>
                        </View>

                        {/* Bio Preview */}
                        <Text
                            numberOfLines={1}
                            className="font-Inter text-[12px] text-gray-600 leading-tight mb-3">
                            Experienced professional specializing in {tagLowercase}. Helped 200+ clients achieve personal growth.
                        </Text>

                        {/* Stats and Action */}
                        <View className="flex-row justify-between items-center">
                            {/* Price */}
                            <View className="flex-row items-center gap-2">
                                <View className="flex-row items-center gap-1 bg-amber-50 rounded-lg px-2 py-1">
                                    <Image
                                         
                                        contentFit='cover'
                                        source={IMAGES.Coin_Icon} className="w-3 h-3"
                                    />
                                    <Text className="font-InterSemiBold text-[12px] text-slate-800">
                                        {item.rate}/min
                                    </Text>
                                </View>
                            </View>
                            {/* View Profile Button */}
                            <Pressable
                                onPress={handleViewProfile}
                                className="bg-themeColor rounded-xl px-4 py-2 active:bg-themeColor/80"
                            >
                                <Text className="font-InterSemiBold text-[12px] text-white">
                                    View Profile
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </Pressable>
    );
});

// Set displayName for better debugging
VerticalCouncelorCard.displayName = 'VerticalCouncelorCard';

// Export the component
export { VerticalCouncelorCard };
