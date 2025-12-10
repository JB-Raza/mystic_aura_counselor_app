import { View, Text, Image, Pressable, FlatList, Switch, ScrollView, RefreshControl, StatusBar } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useRef, useState, useEffect, useMemo, memo } from 'react'
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { IMAGES } from '@/constants/images';
import { COLORS } from '@/constants/theme';
import { CouncelorCard, CustomBackdrop, CustomBottomSheet, GradientContainer, InputBox } from '@/components';
import { RecentlyViewedCouncelors } from '@/sections';
import { getFavorites } from '@/utils/favoritesUtils';
import ROUTES from '@/constants/routes';


// Move constants outside component to prevent recreation
const recommendedCouncelors = [
  { id: 'counselor_1', avatar: IMAGES.ProfileAvatar, name: "Ben Smith", tag: "Self Growth", rating: 4.5, rate: 30 },
  { id: 'counselor_2', avatar: IMAGES.ProfileAvatar, name: "Gwen Taylor", tag: "Health & Fitness", rating: 4.8, rate: 45 },
  { id: 'counselor_3', avatar: IMAGES.ProfileAvatar, name: "Kevin Hart", tag: "Motivation", rating: 4.9, rate: 35 },
  { id: 'counselor_4', avatar: IMAGES.ProfileAvatar, name: "Sarah Wilson", tag: "Relationships", rating: 4.7, rate: 40 },
];

const categories = [
  { id: 'cat_1', name: "Anxiety", icon: "heart" },
  { id: 'cat_2', name: "Stress", icon: "fitness" },
  { id: 'cat_3', name: "Career", icon: "briefcase" },
  { id: 'cat_4', name: "Relationships", icon: "people" },
  { id: 'cat_5', name: "Motivation", icon: "rocket" },
  { id: 'cat_6', name: "Self Growth", icon: "trending-up" },
];

const priceOptions = [
  { label: "Low to High", value: "low_to_high" },
  { label: "High to Low", value: "high_to_low" },
];

const STARS = [1, 2, 3, 4, 5];

// Memoized CategoryItem component
const CategoryItem = memo(({ category, onPress }) => (
  <Pressable
    onPress={onPress}
    className='bg-white rounded-2xl px-3 py-2 flex-row items-center gap-2 shadow-sm border border-gray-100 active:scale-95'
  >
    <View className='w-8 h-8 rounded-lg bg-themeColor/10 items-center justify-center'>
      <Ionicons name={category.icon} size={14} color={COLORS.themeColor} />
    </View>
    <Text className='font-InterMedium text-slate-700 text-[12px]'>{category.name}</Text>
  </Pressable>
));

// Memoized PriceOptionItem component
const PriceOptionItem = memo(({ option, isSelected, onPress }) => (
  <Pressable
    onPress={onPress}
    className={`flex-1 rounded-xl px-4 py-3 border-2 ${isSelected
        ? 'border-themeColor bg-themeColor/10'
        : 'border-gray-200 bg-white'
      } active:opacity-70`}
  >
    <Text
      className={`font-InterSemibold text-center text-[13px] ${isSelected ? 'text-themeColor' : 'text-gray-700'
        }`}
    >
      {option.label}
    </Text>
  </Pressable>
));

// Memoized StarRatingItem component
const StarRatingItem = memo(({ star, isSelected, onPress }) => (
  <Pressable
    onPress={onPress}
    className='p-1 active:opacity-70'
  >
    <Ionicons
      name={isSelected ? 'star' : 'star-outline'}
      size={22}
      color={isSelected ? '#F59E0B' : '#D1D5DB'}
    />
  </Pressable>
));

export default function HomeScreen() {
  const navigation = useNavigation()
  const [filter, setFilter] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("")
  const [favoriteIds, setFavoriteIds] = useState(new Set())

  const bottomSheetRef = useRef(null);

  // Memoize loadFavorites to prevent recreation
  const loadFavorites = useCallback(async () => {
    try {
      const favorites = await getFavorites()
      const ids = new Set(favorites.map(fav => fav.id || fav.name))
      setFavoriteIds(ids)
    } catch (error) {
      console.error('Error loading favorites:', error)
    }
  }, [])

  // Memoize handleRefresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadFavorites();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, [loadFavorites]);

  // Memoize handleOpenPress
  const handleOpenPress = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(1);
  }, []);

  // Memoize handleCloseBottomSheet
  const handleCloseBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  // Memoize handleResetFilters
  const handleResetFilters = useCallback(() => {
    setFilter(null);
    bottomSheetRef.current?.close();
  }, []);

  // Memoize handlePriceFilterChange
  const handlePriceFilterChange = useCallback((value) => {
    setFilter(prev => ({ ...prev, priceFilter: value }));
  }, []);

  // Memoize handleRatingChange
  const handleRatingChange = useCallback((rating) => {
    setFilter(prev => ({ ...prev, rating }));
  }, []);

  // Memoize handleOnlineToggle
  const handleOnlineToggle = useCallback((value) => {
    setFilter(prev => ({ ...prev, online: value }));
  }, []);

  // Memoize navigation handlers
  const handleNavigateToNotifications = useCallback(() => {
    navigation.navigate(ROUTES.NOTIFICATIONS);
  }, [navigation]);

  const handleNavigateToProfile = useCallback(() => {
    navigation.navigate("UserProfile");
  }, [navigation]);

  // Combine useFocusEffect hooks for better performance
  useFocusEffect(
    useCallback(() => {
      // Load favorites
      loadFavorites();
      // Update status bar
      StatusBar.setBackgroundColor(COLORS.themeColor, true);
      StatusBar.setBarStyle('light-content', true);
    }, [loadFavorites])
  );

  // Load favorites on mount
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Memoize FlatList renderItem for recommended counselors
  const renderRecommendedCounselor = useCallback(({ item }) => (
    <CouncelorCard
      item={item}
      isFavorite={favoriteIds.has(item.id || item.name)}
    />
  ), [favoriteIds]);

  // Memoize FlatList keyExtractor
  const keyExtractor = useCallback((item) => item.id || item.name, []);

  // Memoize category press handler
  const handleCategoryPress = useCallback((category) => {
    console.log('Category selected:', category.name);
  }, []);

  // Memoize see all handlers
  const handleSeeAllRecommended = useCallback(() => {
    console.log('See all recommended');
  }, []);

  const handleSeeAllTopRated = useCallback(() => {
    console.log('See all top rated');
  }, []);

  // Memoize filter rating display
  const filterRatingDisplay = useMemo(() => {
    return `${filter?.rating || 1}+ Stars`;
  }, [filter?.rating]);

  return (
    <View className='flex-1 bg-gray-50'>
      <StatusBar backgroundColor={COLORS.themeColor} barStyle="light-content" />
      {/* Header */}
      <View className='bg-themeColor p-4 shadow-sm border-b border-themeColor/70'>
        <View className='flex-row justify-between items-center'>
          <View className='flex-1'>
            <Text className='font-Inter text-[12px] text-lightTheme mb-1'>Good morning!</Text>
            <Text className='font-InterBold text-[20px] text-white'>Hello, John 👋</Text>
          </View>

          <View className='flex-row items-center gap-2'>
            {/* Notification Bell with Badge */}
            <Pressable
              onPress={handleNavigateToNotifications}
              className='relative p-2 rounded-full active:bg-white/10'
            >
              <Ionicons name='notifications-outline' size={20} color={"white"} />
              <View className='absolute -top-[2px] right-[3px] w-[8px] h-[8px] bg-green-600 rounded-full' />
            </Pressable>

            {/* profile */}
            <Pressable
              onPress={handleNavigateToProfile}
              className='border-2 border-lightTheme rounded-full p-0.5 overflow-hidden active:scale-95 transition-all'
            >
              <Image source={IMAGES.ProfileAvatar} contentFit='contain' className='w-9 h-9 rounded-full' />
            </Pressable>
          </View>
        </View>
      </View>

      {/*  search section */}
      <View className='px-5 pt- pb-4 bg-themeColor shadow-xl shadow-themeColor'>
        <View className='flex-row gap-3'>
          {/* search bar */}
          <InputBox
            parentClassName={"flex-1"}
            value={searchQuery}
            setValue={setSearchQuery}
            placeholder='Search for counselors, topics...'
            placeholderTextColor="#9CA3AF"
            icon={"search"}
            showClearBtn={true}
          />

          {/*  filters */}
          <Pressable
            onPress={handleOpenPress}
            className='border-2 border-white rounded-2xl px-4 items-center justify-center shadow-lg shadow-themeColor/25 active:scale-95 transition-all'
          >
            <Ionicons name='options' size={20} color="white" />
          </Pressable>
        </View>
      </View>

      {/* main content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        className='flex-1 pt-6'
        contentContainerStyle={{ paddingBottom: 90 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.themeColor}
            colors={[COLORS.themeColor]}
          />
        }
      >
        <View className='px- pt-2 pb-8'>
          {/* recent viewed councelors */}
          <View className='mb-5 px-4'>
            <RecentlyViewedCouncelors />
          </View>

          {/* recommended section */}
          <View className='mb-8'>
            <View className='flex-row justify-between items-start px-4'>
              <View>
                <Text className='font-InterBold text-[18px] text-slate-800'>Recommended for You</Text>
                <Text className='font-Inter text-[12px] text-gray-500 mt-1'>
                  Based on your preferences
                </Text>
              </View>
              <Pressable
                onPress={handleSeeAllRecommended}
                className='flex-row items-center mt-[3px]'
              >
                <Text className='font-InterSemibold text-themeColor text-[12px]'>See All</Text>
                <Ionicons name="chevron-forward" size={12} color={COLORS.themeColor} />
              </Pressable>
            </View>

            <FlatList
              horizontal
              data={recommendedCouncelors}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16, gap: 16 }}
              keyExtractor={keyExtractor}
              renderItem={renderRecommendedCounselor}
              removeClippedSubviews={true}
              maxToRenderPerBatch={3}
              windowSize={5}
              initialNumToRender={3}
              getItemLayout={(data, index) => ({
                length: 280, // Approximate card width + gap
                offset: 280 * index,
                index,
              })}
            />
          </View>

          {/* top rated councelors */}
          <View className='mb-8'>
            <View className='flex-row justify-between items-start px-4'>
              <View>
                <Text className='font-InterBold text-[18px] text-slate-800'>Top Rated Counselors</Text>
                <Text className='font-Inter text-[12px] text-gray-500 mt-1'>
                  Most trusted by our community
                </Text>
              </View>
              <Pressable
                onPress={handleSeeAllTopRated}
                className='flex-row items-center mt-[3px]'
              >
                <Text className='font-InterSemibold text-themeColor text-[12px]'>See All</Text>
                <Ionicons name="chevron-forward" size={12} color={COLORS.themeColor} />
              </Pressable>
            </View>

            <FlatList
              horizontal
              data={recommendedCouncelors}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16, gap: 16 }}
              keyExtractor={keyExtractor}
              renderItem={renderRecommendedCounselor}
              removeClippedSubviews={true}
              maxToRenderPerBatch={3}
              windowSize={5}
              initialNumToRender={3}
              getItemLayout={(data, index) => ({
                length: 280,
                offset: 280 * index,
                index,
              })}
            />
          </View>

          {/* categories */}
          <View className='mb-8 px-4'>
            <View className='flex-row justify-between items-center mb-4'>
              <View>
                <Text className='font-InterBold text-[18px] text-slate-800'>Browse Categories</Text>
                <Text className='font-Inter text-[12px] text-gray-500 mt-1'>
                  Find help by category
                </Text>
              </View>
            </View>

            <View className='flex-row flex-wrap gap-3'>
              {categories.map((category) => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  onPress={() => handleCategoryPress(category)}
                />
              ))}
            </View>

            {/* Quick Stats */}
            <GradientContainer className={"mt-10"}>
              <View className='flex-row justify-between items-center'>
                <View>
                  <Text className='font-InterBold text-[16px] mb-1 text-white'>Your Wellness Journey</Text>
                  <Text className='font-Inter  text-[13px] text-white/70'>
                    5 sessions completed this month..
                  </Text>
                </View>
                <View className='bg-white/20 rounded-2xl px-3 py-2'>
                  <Text className='font-InterBold text-whie text-[14px] text-white'>View Stats</Text>
                </View>
              </View>
            </GradientContainer>
          </View>
        </View>
      </ScrollView>

      {/* Filter Bottom Sheet */}
      <CustomBottomSheet
        ref={bottomSheetRef}
        snapPoints={['30%', '80%']}
        backdropComponent={CustomBackdrop}
      >
        <BottomSheetView className='px-5 pb-6 pt-5'>
          {/* Header */}
          <View className='flex-row justify-between items-center mb-6'>
            <View className='flex-row items-center gap-3'>
              <View className='bg-themeColor/10 p-2.5 rounded-xl'>
                <Ionicons name='filter' size={20} color={COLORS.themeColor} />
              </View>
              <View>
                <Text className='font-InterBold text-slate-800 text-[18px]'>Filter Options</Text>
                <Text className='font-Inter text-gray-500 text-[12px] mt-0.5'>Refine your search</Text>
              </View>
            </View>
            <Pressable
              onPress={handleCloseBottomSheet}
              className='p-2 rounded-full active:bg-gray-100'
            >
              <Ionicons name='close' size={22} color={COLORS.grey} />
            </Pressable>
          </View>

          {/* Price Filter */}
          <View className='mb-6'>
            <Text className='font-InterSemibold text-slate-800 text-[15px] mb-3'>Price Range</Text>
            <View className='flex-row gap-2.5'>
              {priceOptions.map((option) => (
                <PriceOptionItem
                  key={option.value}
                  option={option}
                  isSelected={filter?.priceFilter === option.value}
                  onPress={() => handlePriceFilterChange(option.value)}
                />
              ))}
            </View>
          </View>

          {/* Rating Filter */}
          <View className='mb-6'>
            <Text className='font-InterSemibold text-slate-800 text-[15px] mb-3'>Minimum Rating</Text>
            <View className='bg-gray-50 rounded-xl px-4 py-3.5'>
              <View className='flex-row justify-between items-center'>
                <View className='flex-row items-center gap-1.5'>
                  {STARS.map((star) => (
                    <StarRatingItem
                      key={star}
                      star={star}
                      isSelected={(filter?.rating || 1) >= star}
                      onPress={() => handleRatingChange(star)}
                    />
                  ))}
                </View>
                <View className='bg-white rounded-lg px-3 py-1.5 border border-gray-200'>
                  <Text className='font-InterSemibold text-slate-700 text-[12px]'>
                    {filterRatingDisplay}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Availability Filter */}
          <View className='mb-6'>
            <Text className='font-InterSemibold text-slate-800 text-[15px] mb-3'>Availability</Text>
            <View className='bg-gray-50 rounded-xl px-4 py-3.5'>
              <View className='flex-row justify-between items-center'>
                <View className='flex-row items-center gap-3'>
                  <View className='w-10 h-10 rounded-lg bg-green-100 items-center justify-center'>
                    <Ionicons name="wifi" size={18} color="#10B981" />
                  </View>
                  <View className='flex-1'>
                    <Text className='font-InterSemibold text-slate-700 text-[14px]'>Online Now</Text>
                    <Text className='font-Inter text-gray-500 text-[11px] mt-0.5'>
                      Currently available
                    </Text>
                  </View>
                  <Switch
                    value={filter?.online || false}
                    onValueChange={handleOnlineToggle}
                    thumbColor="#FFFFFF"
                    trackColor={{ false: '#D1D5DB', true: COLORS.themeColor }}
                    ios_backgroundColor="#D1D5DB"
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className='flex-row gap-3 mt-2'>
            <Pressable
              onPress={handleResetFilters}
              className='flex-1 border-2 border-gray-300 rounded-xl py-3.5 active:bg-gray-50'
            >
              <Text className='text-gray-700 font-InterSemibold text-center text-[14px]'>
                Reset All
              </Text>
            </Pressable>
            <Pressable
              onPress={handleCloseBottomSheet}
              className='flex-1 bg-themeColor rounded-xl py-3.5 active:opacity-90'
              style={{
                shadowColor: COLORS.themeColor,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Text className='text-white font-InterSemibold text-center text-[14px]'>
                Apply Filters
              </Text>
            </Pressable>
          </View>
        </BottomSheetView>
      </CustomBottomSheet>
    </View>
  )
}
