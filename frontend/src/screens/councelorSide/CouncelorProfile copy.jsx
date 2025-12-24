import { View, Text, Pressable, Image, ScrollView, Dimensions, ActivityIndicator } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import React, { useRef, useState, useCallback, useEffect, useMemo, memo, lazy, Suspense } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons';
import { ReviewCard, TopHeader } from '@/components';
import { ServiceCard } from '@/components/Cards';
import { REVIEWS, SERVICES } from '@/sampleData';
import { AboutCouncelorSection } from '@/sections';
import { isFavorite, toggleFavorite } from '@/utils/favoritesUtils';
import { Toast } from 'toastify-react-native';
import { IMAGES } from '@/constants/images';
import ROUTES from '@/constants/routes';
const BookServiceBottomSheet = lazy(() => import('@/components/BookServiceBottomSheet'))


const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Memoize tabs array to prevent recreation on every render
const TABS = [
  { id: 'services', label: 'Services', icon: 'grid' },
  { id: 'reviews', label: 'Reviews', icon: 'star' },
  { id: 'about', label: 'About', icon: 'person' }
];

export default function CouncelorProfile({ route }) {
  const navigation = useNavigation()
  const { data } = route?.params || {}

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [bookServiceData, setBookServiceData] = useState({ name: "", category: "", description: "", duration: "", price: "" });
  const [isCounselorFavorite, setIsCounselorFavorite] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);

  const bookServiceBottomSheetRef = useRef()
  const horizontalScrollRef = useRef(null)

  // Memoize loadFavoriteStatus to prevent recreation
  const loadFavoriteStatus = useCallback(async () => {
    if (!data) return
    try {
      const counselorId = data?.id || data?.name
      const favoriteStatus = await isFavorite(counselorId)
      setIsCounselorFavorite(favoriteStatus)
    } catch (error) {
      console.error('Error loading favorite status:', error)
    }
  }, [data?.id, data?.name])

  useEffect(() => {
    loadFavoriteStatus()
  }, [loadFavoriteStatus])

  useFocusEffect(
    useCallback(() => {
      loadFavoriteStatus()
    }, [loadFavoriteStatus])
  )

  const handleToggleFavorite = useCallback(async () => {
    if (!data) return

    try {
      setIsLoadingFavorite(true)
      const newStatus = await toggleFavorite(data)
      setIsCounselorFavorite(newStatus)

      Toast.show({
        type: "success",
        text2: newStatus
          ? `${data.name || 'Counselor'} added to your favorites`
          : `${data.name || "Counselor"} removed from favorites`
      })
    } catch (error) {
      console.error('Error toggling favorite:', error)
      Toast.show({
        type: "error",
        text2: "Failed to update favorites"
      })
    } finally {
      setIsLoadingFavorite(false)
    }
  }, [data])

  useEffect(() => {
    if (!data) {
      console.warn('No counselor data provided, navigating to Home')
      try {
        navigation.navigate(ROUTES.LANDING)
      } catch (error) {
        navigation.navigate(ROUTES.LANDING)
      }
    }
  }, [data, navigation])

  const handleBottomSheetChange = useCallback(() => {
    console.log("bottom sheet book now")
  }, [])

  // Memoize navigation function to prevent re-renders
  const handleNavigate = useCallback((screenName) => {
    navigation.navigate(screenName)
  }, [navigation])

  // const handleTabPress = useCallback((index) => {
  //   setActiveTabIndex(index)
  //   console.log("ref -- ", horizontalScrollRef)
  //   if (horizontalScrollRef.current) {

  //     horizontalScrollRef.current?.scrollTo({
  //       x: index * SCREEN_WIDTH,
  //       animated: true
  //     })
  //   }
  // }, [])

  // handling click tab to switch between tabs
  useEffect(() => {
    console.log("ref -- ", horizontalScrollRef)
    if (horizontalScrollRef.current) {
      horizontalScrollRef.current?.scrollTo({
        x: activeTabIndex * SCREEN_WIDTH,
        animated: true
      })
    }
  }, [activeTabIndex])

  const handleScroll = useCallback((event) => {
    const offsetX = event.nativeEvent.contentOffset.x
    const index = Math.round(offsetX / SCREEN_WIDTH)
    if (index !== activeTabIndex && index >= 0 && index < TABS.length) {
      setActiveTabIndex(index)
    }
  }, [activeTabIndex])

  // Memoize the render section function - FIXED: Now correctly uses activeTabIndex
  const renderSection = useCallback((tabId) => {
    switch (tabId) {
      case 'services':
        return <ServicesSection
          services={SERVICES}
          bottomSheetRef={bookServiceBottomSheetRef}
          setBookServiceData={setBookServiceData}
        />;
      case 'about':
        return <AboutCouncelorSection counselor={data} />;
      case 'reviews':
        return <ReviewSection reviews={REVIEWS} />;
      default:
        return <ServicesSection bottomSheetRef={bookServiceBottomSheetRef} setBookServiceData={setBookServiceData} />;
    }
  }, [data])

  // Memoize header content to prevent unnecessary re-renders
  const headerContent = useMemo(() => {
    if (!data) return null;

    return (
      <LinearGradient
        colors={[COLORS.themeColor, '#7A72FF']}
        start={{ x: 0.8, y: 0 }}
        end={{ x: 1, y: 1 }}
        className='pb-6 pt-4 px-5'
      >
        <View className="flex-row items-start gap-4 mt-2">
          {/* Profile Image */}
          <View className="relative">
            <View className="absolute inset-0 rounded-2xl border-2 border-white/30" />
            <Image
              source={data?.avatar || IMAGES.ProfileAvatar}
              contentFit='cover'
              className="w-24 h-24 rounded-2xl"
            />
            {/* Online Status */}
            <View className='absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white items-center justify-center'>
              <View className='w-2 h-2 bg-white rounded-full' />
            </View>
          </View>

          {/* Name and Info */}
          <View className="flex-1 pt-1">
            <View className="flex-row items-start justify-between mb-2">
              <View className="flex-1">
                <Text className="font-InterBold text-[20px] text-white leading-tight">
                  {data?.name}
                </Text>
                <Text className="font-InterMedium text-[13px] text-white/90 mt-1">
                  {data?.tag} Specialist
                </Text>
              </View>

              {/* Rating Badge */}
              <View className="bg-white/20 backdrop-blur rounded-full px-3 py-1.5 flex-row items-center gap-1.5">
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text className='text-white font-InterBold text-[13px]'>{data?.rating || 4.5}</Text>
              </View>
            </View>

            {/* Stats Row */}
            <View className="flex-row gap-3 mt-3">
              <View className="flex-row items-center gap-1.5 bg-white/20 rounded-full px-2.5 py-1.5">
                <Ionicons name="time" size={12} color="white" />
                <Text className="font-InterSemibold text-[11px] text-white">15min</Text>
              </View>

              <View className="flex-row items-center gap-1.5 bg-white/20 rounded-full px-2.5 py-1.5">
                <Ionicons name="calendar" size={12} color="white" />
                <Text className="font-InterSemibold text-[11px] text-white">10y exp</Text>
              </View>

              <View className="flex-row items-center gap-1.5 bg-white/20 rounded-full px-2.5 py-1.5">
                <Ionicons name="heart" size={12} color="white" />
                <Text className="font-InterSemibold text-[11px] text-white">100%</Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    );
  }, [data])


  return (
    <>
      {/* <TopHeader
        title={"Counselor Profile"}
        rightAction={
          <Pressable
            onPress={handleToggleFavorite}
            disabled={isLoadingFavorite}
            className={`p-2 rounded-full active:bg-white/10 ${isLoadingFavorite ? 'opacity-50' : ''}`}
          >
            {isLoadingFavorite ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons
                name={isCounselorFavorite ? "heart" : "heart-outline"}
                size={22}
                color={isCounselorFavorite ? "#EF4444" : "white"}
              />
            )}
          </Pressable>
        }
      /> */}
      <View className='absolute z-10 right-2 top-3'>
        <Pressable
          onPress={handleToggleFavorite}
          disabled={isLoadingFavorite}
          className={`p-2 rounded-full active:bg-white/10 ${isLoadingFavorite ? 'opacity-50' : ''}`}
        >
          {isLoadingFavorite ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons
              name={isCounselorFavorite ? "heart" : "heart-outline"}
              size={22}
              color={isCounselorFavorite ? "#EF4444" : "white"}
            />
          )}
        </Pressable>
      </View>
      <View className='flex-1 bg-gray-50'>
        {headerContent}

        {/* Modern Tabs */}
        <View className='bg-white border-b border-gray-100'>
          <View className='flex-row px-4'>
            {TABS.map((tab, index) => (
              <Pressable
                key={tab.id}
                // onPress={() => handleTabPress(index)}
                onPress={() => setActiveTabIndex(index)}
                className={`flex-1 py-4 items-center relative`}
              >
                <View className={`flex-row items-center gap-1.5 ${activeTabIndex === index ? '' : 'opacity-60'}`}>
                  <Ionicons
                    name={tab.icon}
                    size={16}
                    color={activeTabIndex === index ? COLORS.themeColor : COLORS.grey}
                  />
                  <Text className={`font-InterSemibold text-[13px] ${activeTabIndex === index ? 'text-themeColor' : 'text-gray-600'}`}>
                    {tab.label}
                  </Text>
                </View>
                {activeTabIndex === index && (
                  <View className='absolute bottom-0 left-0 right-0 h-0.5 bg-themeColor rounded-full' />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        <ScrollView
          ref={horizontalScrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          // scrollEventThrottle={16}
          style={{ width: SCREEN_WIDTH }}
          className='flex-1'
        >
          {TABS.map((tab, index) => (
            <ScrollView
              key={tab.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              style={{ width: SCREEN_WIDTH }}
              // Only render content for active tab or adjacent tabs for smoother scrolling
              removeClippedSubviews={index !== activeTabIndex && index !== activeTabIndex - 1 && index !== activeTabIndex + 1}
            >
              <View className='bg-gray-50'>
                {renderSection(tab.id)}
              </View>
            </ScrollView>
          ))}
        </ScrollView>
      </View>

      {/* Bottom Sheets */}
      <Suspense fallback={null}>
        <BookServiceBottomSheet
          ref={bookServiceBottomSheetRef}
          navigateTo={handleNavigate}
          onChange={handleBottomSheetChange}
          data={bookServiceData}
        />
      </Suspense>
    </>
  )
}

// Memoize ServicesSection to prevent unnecessary re-renders
const ServicesSection = memo(function ServicesSection({ services, bottomSheetRef, setBookServiceData }) {
  const defaultServices = services || SERVICES;

  const handlePressService = useCallback((serviceData) => {
    setBookServiceData(serviceData)
    bottomSheetRef.current?.snapToIndex(1)
  }, [setBookServiceData, bottomSheetRef])

  return (
    <View className="px-4 pt-6">
      <View className="flex-row items-center gap-2 mb-5">
        <View className="w-1 h-5 bg-themeColor rounded-full" />
        <Text className='font-InterBold text-[18px] text-slate-800'>Services Offered</Text>
      </View>

      <View className="gap-3">
        {defaultServices.map((service, index) => (
          <ServiceCard
            key={service.id || `service-${index}-${service.name}`}
            service={service}
            onPress={() => handlePressService(service)}
          />
        ))}
      </View>
    </View>
  )
})

// Memoize ReviewSection to prevent unnecessary re-renders
const ReviewSection = memo(function ReviewSection({ reviews }) {
  return (
    <View className='px-4 pt-6'>
      <View className="flex-row items-center justify-between mb-5">
        <View className="flex-row items-center gap-2">
          <View className="w-1 h-5 bg-themeColor rounded-full" />
          <Text className='font-InterBold text-[18px] text-slate-800'>Patient Reviews</Text>
        </View>
        <View className="bg-themeColor/10 rounded-full px-3 py-1">
          <Text className='font-InterSemibold text-themeColor text-[12px]'>{reviews.length}</Text>
        </View>
      </View>

      <View className="gap-3">
        {reviews.map((review, index) => {
          // Create unique key from available data
          const uniqueKey = review.id
            || review.userId
            || `review-${index}-${review.user?.name || 'user'}-${review.date || index}`;
          return (
            <ReviewCard key={uniqueKey} review={review} />
          );
        })}
      </View>
    </View>
  )
})
