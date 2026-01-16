import { View, Text, Image, Pressable, Dimensions } from 'react-native';
import React, { useState, useCallback, useMemo, memo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { useNavigation } from '@react-navigation/native';
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
    setReadMore((prev) => !prev);
  }, []);

  const readMoreText = useMemo(() => (readMore ? 'Less' : 'More'), [readMore]);

  return (
    <View className="rounded-2xl bg-white p-4" style={reviewCardShadowStyle}>
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Image
            contentFit="cover"
            source={review.user.avatar}
            className="mr-3 h-10 w-10 rounded-full"
          />
          <Text className="text-[14px] font-semibold text-neutral-800">{review.user.name}</Text>
        </View>

        <View className="flex-row items-center rounded-full bg-themeColor/10 px-2.5 py-1">
          <Ionicons name="star" size={12} color={COLORS.themeColor} />
          <Text className="ml-1 text-[12px] font-semibold text-themeColor">{review.rating}</Text>
        </View>
      </View>

      {/* Review Text */}
      <Text
        className={`mt-3 text-[12px] leading-5 text-neutral-600 ${readMore ? '' : 'line-clamp-2'}`}>
        {review.comment}
      </Text>
      <Pressable onPress={handleToggleReadMore} className="mt-2">
        <Text className="text-[12px] font-semibold text-themeColor">Read {readMoreText}</Text>
      </Pressable>

      {/* Footer */}
      <View className="mt-3 flex-row items-center justify-between">
        <Text className="text-[11px] text-neutral-400">{review.date}</Text>
        <View className="flex-row items-center">
          <Ionicons name="checkmark-circle" size={12} color={COLORS.themeColor} />
          <Text className="ml-1 text-[11px] text-neutral-500">Verified Patient</Text>
        </View>
      </View>
    </View>
  );
});

// Memoized ServiceCard component
export const ServiceCard = memo(({ service, onPress }) => {
  const patientServedText = useMemo(
    () => (service.patientServed > 0 ? `${service.patientServed} Served` : 'New'),
    [service.patientServed]
  );

  return (
    <View style={serviceCardShadowStyle} className="w-full rounded-2xl bg-white p-4">
      <View className="flex-row items-center gap-3">
        <View className="rounded-xl bg-themeColor/10 p-3">
          <Ionicons name={service.icon || 'medkit-outline'} size={22} color={COLORS.themeColor} />
        </View>

        <View className="flex-1">
          <Text className="font-Inter-Bold text-[15px] text-neutral-700">{service.name}</Text>
          <Text className="mt-0.5 text-[11px] text-neutral-400">{service.tagline}</Text>
        </View>

        {service.rating > 0 && (
          <View className="flex-row items-center rounded-full bg-themeColor/10 px-2 py-1">
            <Ionicons name="star" size={12} color={COLORS.themeColor} />
            <Text className="ml-1 text-[11px] font-semibold text-themeColor">{service.rating}</Text>
          </View>
        )}
      </View>

      {/* new */}
      <View className="mt-5 flex-row items-center justify-between">
        {/* Patients Served */}
        <View className="flex-row items-center rounded-full bg-themeColor/10 px-3 py-1">
          <Ionicons name="people" size={12} color={COLORS.themeColor} />
          <Text className="ml-1 text-[11px] font-medium text-themeColor">{patientServedText}</Text>
        </View>

        {/* CTA Button */}
        <Pressable
          onPress={onPress}
          className="rounded-xl bg-themeColor px-5 py-2.5"
          android_ripple={{ color: '#fff' }}
          style={serviceButtonShadowStyle}>
          <Text className="text-[13px] font-semibold text-white">Book Now</Text>
        </Pressable>
      </View>
    </View>
  );
});

// Memoized CouncelorCard component
export const CouncelorCard = memo(({ item, isFavorite = false }) => {
  const navigation = useNavigation();

  // Memoize screen width
  const screenWidth = useMemo(() => Dimensions.get('screen').width - 140, []);

  const cardStyle = useMemo(
    () => ({
      width: screenWidth,
      backgroundColor: 'white',
    }),
    [screenWidth]
  );

  const handleNavigate = useCallback(() => {
    try {
      navigation.navigate(ROUTES.COUNSELOR_PROFILE, { data: item });
    } catch (error) {
      console.error('Navigation error:', error);
      navigation.navigate(ROUTES.LANDING);
    }
  }, [navigation, item]);

  const handleViewProfile = useCallback(() => {
    try {
      navigation.navigate(ROUTES.COUNSELOR_PROFILE, { data: item });
    } catch (error) {
      console.error('Navigation error:', error);
      navigation.navigate(ROUTES.LANDING);
    }
  }, [navigation, item]);

  const tagLowercase = useMemo(() => item.tag.toLowerCase(), [item.tag]);

  return (
    <Pressable
      onPress={handleNavigate}
      style={cardStyle}
      className="rounded-2xl shadow-card shadow-themeColor/50 transition-all active:scale-95">
      {/* Main Content */}
      <View className="p-4">
        {/* Header */}
        <View className="flex-row gap-3">
          {/* avatar */}
          <View className="relative">
            <Image contentFit="cover" source={item.avatar} className="h-16 w-16 rounded-2xl" />
            {/* is online */}
            <View className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-[2px] border-white bg-green-500" />
          </View>

          {isFavorite && (
            <View
              className="absolute -right-2 -top-2 h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm"
              style={favoriteIconShadowStyle}>
              <Ionicons name="heart" size={18} color="#EF4444" />
            </View>
          )}

          {/* Name and Specialization */}
          <View className="flex-1">
            <Text className="font-InterSemibold text-[15px] leading-tight text-slate-800">
              {item.name}
            </Text>
            <Text className="mt-0.5 font-InterMedium text-[12px] text-themeColor">
              {item.tag} Specialist
            </Text>

            {/* Rating and Experience */}
            <View className="mt-2 flex-row items-center gap-3">
              <View className="flex-row items-center gap-1">
                <Ionicons name="star" size={12} color="#F59E0B" />
                <Text className="font-InterSemibold text-[11px] text-slate-700">{item.rating}</Text>
              </View>
              <View className="h-3 w-px bg-gray-300" />
              <Text className="font-InterMedium text-[11px] text-gray-500">5y exp</Text>
            </View>
          </View>
        </View>

        {/* Bio Section */}
        <View className="mt-3">
          <Text className="mb-1.5 font-InterMedium text-[12px] text-slate-700">About</Text>
          <Text className="line-clamp-2 font-Inter text-[11px] leading-tight text-gray-600">
            Experienced professional specializing in {tagLowercase}. Helped 200+ clients achieve
            personal growth and mental wellness.
          </Text>
        </View>

        {/* Stats Row */}
        <View className="mt-4 flex-row items-center justify-between border-t border-gray-100 pt-3">
          {/* Sessions Completed */}
          <View className="flex-row items-center gap-1.5">
            <View className="h-6 w-6 items-center justify-center rounded-lg bg-blue-50">
              <Ionicons name="people" size={12} color={COLORS.themeColor} />
            </View>
            <View>
              <Text className="font-InterSemibold text-[11px] text-slate-800">200+</Text>
              <Text className="font-Inter text-[9px] text-gray-500">sessions</Text>
            </View>
          </View>

          {/* Response Time */}
          <View className="flex-row items-center gap-1.5">
            <View className="h-6 w-6 items-center justify-center rounded-lg bg-green-50">
              <Ionicons name="time" size={12} color="#10B981" />
            </View>
            <View>
              <Text className="font-InterSemibold text-[11px] text-slate-800">15min</Text>
              <Text className="font-Inter text-[9px] text-gray-500">response</Text>
            </View>
          </View>

          {/* Price */}
          <View className="flex-row items-center gap-1.5">
            <View className="h-6 w-6 items-center justify-center rounded-lg bg-amber-50">
              <Image contentFit="cover" source={IMAGES.Coin_Icon} className="h-3 w-3" />
            </View>
            <View>
              <Text className="font-InterSemibold text-[11px] text-slate-800">{item.rate}</Text>
              <Text className="font-Inter text-[9px] text-gray-500">/min</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Action Footer */}
      <View className="mt-auto rounded-b-2xl border-t border-gray-100 bg-gray-50 px-4 py-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1.5">
            <Ionicons name="checkmark-circle" size={12} color="#10B981" />
            <Text className="font-InterMedium text-[10px] text-gray-600">Available today</Text>
          </View>

          <Pressable
            onPress={handleViewProfile}
            className="rounded-xl bg-themeColor px-3 py-1.5 active:bg-themeColor/80">
            <Text className="font-InterSemibold text-[11px] text-white">View Profile</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
});

// Memoized VerticalCouncelorCard component
const VerticalCouncelorCard = memo(({ item, isFavorite = false, onRemoveFavorite = null }) => {
  const navigation = useNavigation();

  const handleHeartPress = useCallback(
    (e) => {
      e.stopPropagation();
      if (onRemoveFavorite) {
        onRemoveFavorite();
      }
    },
    [onRemoveFavorite]
  );

  /**
   * Handle navigation to counselor profile with error handling
   */
  const handleNavigate = useCallback(() => {
    try {
      navigation.navigate(ROUTES.COUNSELOR_PROFILE, { data: item });
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to Home if route doesn't exist
      try {
        navigation.navigate(ROUTES.LANDING);
      } catch (e) {
        navigation.navigate(ROUTES.LANDING);
      }
    }
  }, [navigation, item]);

  const handleViewProfile = useCallback(() => {
    try {
      navigation.navigate(ROUTES.COUNSELOR_PROFILE, { data: item });
    } catch (error) {
      console.error('Navigation error:', error);
      navigation.navigate(ROUTES.LANDING);
    }
  }, [navigation, item]);

  const tagLowercase = useMemo(() => item.tag.toLowerCase(), [item.tag]);

  return (
    <Pressable
      onPress={handleNavigate}
      className="flex-1 rounded-2xl border border-gray-100 bg-white shadow-card transition-all active:scale-95">
      <View className="flex-row p-4">
        {/* Left Section - Profile Image and Basic Info */}
        <View className="flex-1 flex-row gap-3">
          {/* Profile Image */}
          <View className="relative">
            <Image contentFit="cover" source={item.avatar} className="h-16 w-16 rounded-2xl" />
            {/* Online Status */}
            <View className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-[2px] border-white bg-green-500" />
          </View>

          {/* Favorite Heart Icon - Top Right */}
          {isFavorite && (
            <Pressable
              onPress={handleHeartPress}
              className="absolute right-2 top-2 z-10 h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm active:scale-90"
              style={favoriteIconShadowStyleVertical}>
              <Ionicons name="heart" size={18} color="#EF4444" />
            </Pressable>
          )}

          {/* Main Content */}
          <View className="flex-1">
            {/* Name and Specialization */}
            <View className="mb-2">
              <Text className="font-InterSemiBold text-[16px] text-slate-800">{item.name}</Text>
              <Text className="mt-0.5 font-InterMedium text-[13px] text-themeColor">
                {item.tag} Specialist
              </Text>
            </View>

            {/* Rating and Experience */}
            <View className="mb-3 flex-row items-center gap-3">
              <View className="flex-row items-center gap-1">
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text className="font-InterSemiBold text-[12px] text-slate-700">{item.rating}</Text>
              </View>
              <View className="h-3 w-px bg-gray-300" />
              <Text className="font-InterMedium text-[12px] text-gray-500">5y exp</Text>
              <View className="h-3 w-px bg-gray-300" />
              <View className="flex-row items-center gap-1">
                <Ionicons name="time" size={12} color="#10B981" />
                <Text className="font-InterMedium text-[12px] text-gray-500">15min</Text>
              </View>
            </View>

            {/* Bio Preview */}
            <Text
              numberOfLines={1}
              className="mb-3 font-Inter text-[12px] leading-tight text-gray-600">
              Experienced professional specializing in {tagLowercase}. Helped 200+ clients achieve
              personal growth.
            </Text>

            {/* Stats and Action */}
            <View className="flex-row items-center justify-between">
              {/* Price */}
              <View className="flex-row items-center gap-2">
                <View className="flex-row items-center gap-1 rounded-lg bg-amber-50 px-2 py-1">
                  <Image contentFit="cover" source={IMAGES.Coin_Icon} className="h-3 w-3" />
                  <Text className="font-InterSemiBold text-[12px] text-slate-800">
                    {item.rate}/min
                  </Text>
                </View>
              </View>
              {/* View Profile Button */}
              <Pressable
                onPress={handleViewProfile}
                className="rounded-xl bg-themeColor px-4 py-2 active:bg-themeColor/80">
                <Text className="font-InterSemiBold text-[12px] text-white">View Profile</Text>
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
