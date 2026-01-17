import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  Switch,
  ScrollView,
  RefreshControl,
  useWindowDimensions,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useRef, useState, useEffect, useMemo, memo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { IMAGES } from '@/constants/images';
import { COLORS } from '@/constants/theme';
import {
  Backdrop,
  CouncelorCard,
  CustomBottomSheet,
  FilterBottomSheet,
  GradientContainer,
  InputBox,
  SearchBar,
} from '@/components';
import { RecentlyViewedCouncelors } from '@/sections';
import { getFavorites } from '@/utils/favoritesUtils';
import { getSearchHistory, addToSearchHistory } from '@/utils/searchHistoryUtils';
import ROUTES from '@/constants/routes';

// Re Animated
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

// CategoryItem component
const CategoryItem = memo(({ category, onPress }) => (
  <Pressable
    onPress={onPress}
    className="flex-row items-center gap-2 rounded-2xl border border-gray-100 bg-white px-3 py-2 shadow-sm active:scale-95">
    <View className="h-8 w-8 items-center justify-center rounded-lg bg-themeColor/10">
      <Ionicons name={category.icon} size={14} color={COLORS.themeColor} />
    </View>
    <Text className="font-InterMedium text-[12px] text-slate-700">{category.name}</Text>
  </Pressable>
));
CategoryItem.displayName = 'CategoryItem';

// PriceOptionItem component
const PriceOptionItem = memo(({ option, isSelected, onPress }) => (
  <Pressable
    onPress={onPress}
    className={`flex-1 rounded-xl border-2 px-4 py-3 ${
      isSelected ? 'border-themeColor bg-themeColor/10' : 'border-gray-200 bg-white'
    } active:opacity-70`}>
    <Text
      className={`text-center font-InterSemibold text-[13px] ${
        isSelected ? 'text-themeColor' : 'text-gray-700'
      }`}>
      {option.label}
    </Text>
  </Pressable>
));
PriceOptionItem.displayName = 'PriceOptionItem';

// StarRatingItem component
const StarRatingItem = memo(({ isSelected, onPress }) => (
  <Pressable onPress={onPress} className="p-1 active:opacity-70">
    <Ionicons
      name={isSelected ? 'star' : 'star-outline'}
      size={22}
      color={isSelected ? '#F59E0B' : '#D1D5DB'}
    />
  </Pressable>
));
StarRatingItem.displayName = 'StarRatingItem';

export default function HomeScreen() {
  const navigation = useNavigation();
  // const router = useRoute();
  const [filter, setFilter] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [searchHistory, setSearchHistory] = useState([]);

  const bottomSheetRef = useRef(null);

  // searchbar
  const SCREEN_HEIGHT = useWindowDimensions().height;
  const SEARCH_BAR_TRANSLATE_Y = 70;
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchBarTranslateY = useSharedValue(0);

  useEffect(() => {
    if (isSearchActive) {
      // Move search bar down when active (adjust the value as needed)
      searchBarTranslateY.value = withTiming(-SEARCH_BAR_TRANSLATE_Y, {
        duration: 150,
        easing: Easing.out(Easing.ease),
      });
    } else {
      searchBarTranslateY.value = withTiming(0, {
        duration: 150,
        easing: Easing.out(Easing.ease),
      });
    }
  }, [isSearchActive, SCREEN_HEIGHT]);

  // Animated style for search bar
  const searchBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: searchBarTranslateY.value }],
    };
  });

  // loadFavorites to prevent recreation
  const loadFavorites = useCallback(async () => {
    try {
      const favorites = await getFavorites();
      const ids = new Set(favorites.map((fav) => fav.id || fav.name));
      setFavoriteIds(ids);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, []);

  // loadSearchHistory
  const loadSearchHistory = useCallback(async () => {
    try {
      const history = await getSearchHistory();
      setSearchHistory(history);
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  }, []);

  // handleRefresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadFavorites();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, [loadFavorites]);

  // handleOpenPress
  const handleOpenPress = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(1);
  }, []);

  // navigation handlers
  const handleNavigateToNotifications = useCallback(() => {
    navigation.navigate(ROUTES.NOTIFICATIONS);
  }, [navigation]);

  const handleNavigateToProfile = useCallback(() => {
    navigation.navigate('UserProfile');
  }, [navigation]);

  // Handle backdrop press - dismiss keyboard and close suggestions
  const handleBackdropPress = useCallback(() => {
    Keyboard.dismiss();
    setIsSearchActive(false);
  }, []);

  const handleSearchSubmit = useCallback(async () => {
    if (!searchQuery.trim()) return;

    try {
      // Add to search history
      await addToSearchHistory(searchQuery.trim());
      // Reload history to update suggestions
      await loadSearchHistory();
      // Navigate to search screen
      navigation.navigate(ROUTES.SEARCH_SCREEN, { query: searchQuery.trim() });
      // Close search suggestions
      setIsSearchActive(false);
    } catch (error) {
      console.error('Error submitting search:', error);
    }
  }, [searchQuery, navigation, loadSearchHistory]);

  // Load favorites and search history on mount
  useEffect(() => {
    loadFavorites();
    loadSearchHistory();
  }, [loadFavorites, loadSearchHistory]);

  // FlatList renderItem for recommended counselors
  const renderRecommendedCounselor = useCallback(
    ({ item }) => <CouncelorCard item={item} isFavorite={favoriteIds.has(item.id || item.name)} />,
    [favoriteIds]
  );

  // category press handler
  const handleCategoryPress = useCallback((category) => {
    console.log('Category selected:', category.name);
  }, []);

  // see all handlers
  const handleSeeAllRecommended = useCallback(() => {
    console.log('See all recommended');
  }, []);

  const handleSeeAllTopRated = useCallback(() => {
    console.log('See all top rated');
  }, []);

  // Generate all possible suggestions
  const allSuggestions = useMemo(() => {
    const counselorSuggestions = recommendedCouncelors.map((c) => ({
      text: c.name,
      type: 'counselor',
      icon: 'person',
    }));
    const categorySuggestions = categories.map((c) => ({
      text: c.name,
      type: 'category',
      icon: c.icon,
    }));
    return [...counselorSuggestions, ...categorySuggestions];
  }, []);

  // Filter and prioritize suggestions
  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    const query = searchQuery.toLowerCase().trim();
    const historyMatches = searchHistory
      .filter((item) => item.toLowerCase().includes(query))
      .map((item) => ({
        text: item,
        type: 'history',
        icon: 'time-outline',
      }));

    const otherMatches = allSuggestions.filter((suggestion) => {
      const isInHistory = searchHistory.some(
        (h) => h.toLowerCase() === suggestion.text.toLowerCase()
      );
      return !isInHistory && suggestion.text.toLowerCase().includes(query);
    });

    return [...historyMatches, ...otherMatches].slice(0, 8);
  }, [searchQuery, searchHistory, allSuggestions]);

  return (
    <View className="relative flex-1 bg-gray-50">
      {/* backdrop when search is active */}
      <Backdrop isSearchActive={isSearchActive} onPress={handleBackdropPress} />
      {/* Header */}
      <View className="border-b border-themeColor/70 bg-themeColor px-4 py-2.5 shadow-sm">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="mb-1 font-Inter text-[12px] text-lightTheme">Good morning!</Text>
            <Text className="font-InterBold text-[20px] text-white">Hello, John 👋</Text>
          </View>

          <View className="flex-row items-center gap-2">
            {/* Notification Bell with Badge */}
            <Pressable
              onPress={handleNavigateToNotifications}
              className="relative rounded-full p-2 active:bg-white/10">
              <Ionicons name="notifications-outline" size={20} color={'white'} />
              <View className="absolute -top-[2px] right-[3px] h-[8px] w-[8px] rounded-full bg-green-600" />
            </Pressable>

            {/* profile */}
            <Pressable
              onPress={() => navigation.navigate('UserProfile')}
              className="overflow-hidden rounded-full border-2 border-lightTheme p-0.5 transition-all active:scale-95">
              <Image
                source={IMAGES.ProfileAvatar}
                contentFit="contain"
                className="h-9 w-9 rounded-full"
              />
            </Pressable>
          </View>
        </View>
      </View>

      {/*  search section */}
      <Animated.View
        className={`z-[20] ${isSearchActive ? 'absolute left-0 right-0 top-[70px]' : 'relative'} bg-themeColor px-5 py-4 shadow-xl shadow-themeColor`}
        style={{ ...searchBarAnimatedStyle }}>
        <Animated.View className={`flex-row gap-3`}>
          {/* search bar */}
          <SearchBar
            setIsSearchActive={setIsSearchActive}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            returnKeyType="search"
            onSubmitEditing={handleSearchSubmit}
          />

          {/*  filters */}
          <Pressable
            onPress={handleOpenPress}
            className="items-center justify-center rounded-2xl border-2 border-white px-4 shadow-lg shadow-themeColor/25 transition-all active:scale-95">
            <Ionicons name="options" size={20} color="white" />
          </Pressable>
        </Animated.View>
        {/* suggestions dialogue */}
        {isSearchActive && (
          <View className="mt-3 max-h-80 overflow-hidden rounded-xl bg-white shadow-lg">
            {searchQuery.trim() ? (
              // Show suggestions when typing
              filteredSuggestions.length > 0 ? (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingVertical: 8 }}
                  nestedScrollEnabled={true}
                  keyboardShouldPersistTaps="handled"
                  scrollEventThrottle={16}>
                  {filteredSuggestions.map((suggestion, index) => (
                    <Pressable
                      key={`${suggestion.type}-${suggestion.text}-${index}`}
                      className="flex-row items-center gap-3 px-4 py-3 active:bg-gray-50"
                      onPress={async () => {
                        setSearchQuery(suggestion.text);
                        // Add to search history
                        await addToSearchHistory(suggestion.text);
                        // Reload history
                        await loadSearchHistory();
                        // Navigate to search screen
                        navigation.navigate(ROUTES.SEARCH_SCREEN, { query: suggestion.text });
                        // Close search suggestions
                        setIsSearchActive(false);
                      }}>
                      <View className="h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                        <Ionicons
                          name={suggestion.icon}
                          size={16}
                          color={suggestion.type === 'history' ? COLORS.themeColor : '#6B7280'}
                        />
                      </View>
                      <Text className="flex-1 font-InterMedium text-[14px] text-slate-700">
                        {suggestion.text}
                      </Text>
                      {suggestion.type === 'history' && (
                        <Ionicons name="arrow-up" size={16} color={COLORS.themeColor} />
                      )}
                    </Pressable>
                  ))}
                </ScrollView>
              ) : (
                // No matches found
                <View className="items-center justify-center px-4 py-6">
                  <Ionicons name="search-outline" size={24} color="#9CA3AF" />
                  <Text className="mt-2 font-InterMedium text-[13px] text-gray-500">
                    No results found
                  </Text>
                </View>
              )
            ) : (
              // Empty state - no search query
              <View className="items-center justify-center px-4 py-8">
                <View className="mb-3 h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <Ionicons name="search-outline" size={28} color="#9CA3AF" />
                </View>
                <Text className="mb-1 font-InterSemibold text-[15px] text-slate-700">
                  Start Your Search Journey
                </Text>
                <Text className="text-center font-Inter text-[12px] text-gray-500">
                  Search for counselors, topics, or categories
                </Text>
              </View>
            )}
          </View>
        )}
      </Animated.View>

      {/* main content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 pt-6"
        contentContainerStyle={{ paddingBottom: 90 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.themeColor}
            colors={[COLORS.themeColor]}
          />
        }>
        <View className="pb-8 pt-2">
          {/* recent viewed councelors */}
          <View className="mb-5 px-4">
            <RecentlyViewedCouncelors />
          </View>

          {/* recommended section */}
          <View className="mb-8">
            <View className="flex-row items-start justify-between px-4">
              <View>
                <Text className="font-InterBold text-[18px] text-slate-800">
                  Recommended for You
                </Text>
                <Text className="mt-1 font-Inter text-[12px] text-gray-500">
                  Based on your preferences
                </Text>
              </View>
              <Pressable
                onPress={handleSeeAllRecommended}
                className="mt-[3px] flex-row items-center">
                <Text className="font-InterSemibold text-[12px] text-themeColor">See All</Text>
                <Ionicons name="chevron-forward" size={12} color={COLORS.themeColor} />
              </Pressable>
            </View>

            <FlatList
              horizontal
              data={recommendedCouncelors}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16, gap: 16 }}
              keyExtractor={(item) => item.id || item.name}
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
          <View className="mb-8">
            <View className="flex-row items-start justify-between px-4">
              <View>
                <Text className="font-InterBold text-[18px] text-slate-800">
                  Top Rated Counselors
                </Text>
                <Text className="mt-1 font-Inter text-[12px] text-gray-500">
                  Most trusted by our community
                </Text>
              </View>
              <Pressable onPress={handleSeeAllTopRated} className="mt-[3px] flex-row items-center">
                <Text className="font-InterSemibold text-[12px] text-themeColor">See All</Text>
                <Ionicons name="chevron-forward" size={12} color={COLORS.themeColor} />
              </Pressable>
            </View>

            <FlatList
              horizontal
              data={recommendedCouncelors}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16, gap: 16 }}
              keyExtractor={(item) => item.id || item.name}
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
          <View className="mb-8 px-4">
            <View className="mb-4 flex-row items-center justify-between">
              <View>
                <Text className="font-InterBold text-[18px] text-slate-800">Browse Categories</Text>
                <Text className="mt-1 font-Inter text-[12px] text-gray-500">
                  Find help by category
                </Text>
              </View>
            </View>

            <View className="flex-row flex-wrap gap-3">
              {categories.map((category) => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  onPress={() => handleCategoryPress(category)}
                />
              ))}
            </View>

            {/* Quick Stats */}
            <GradientContainer className={'mt-10'}>
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="mb-1 font-InterBold text-[16px] text-white">
                    Your Wellness Journey
                  </Text>
                  <Text className="font-Inter  text-[13px] text-white/70">
                    5 sessions completed this month..
                  </Text>
                </View>
                <View className="rounded-2xl bg-white/20 px-3 py-2">
                  <Text className="text-whie font-InterBold text-[14px] text-white">
                    View Stats
                  </Text>
                </View>
              </View>
            </GradientContainer>
          </View>
        </View>
      </ScrollView>

      {/* Filter Bottom Sheet */}
      <FilterBottomSheet sheetRef={bottomSheetRef} filter={filter} setFilter={setFilter} />
    </View>
  );
}

// Move constants outside component to prevent recreation
const recommendedCouncelors = [
  {
    id: 'counselor_1',
    avatar: IMAGES.ProfileAvatar,
    name: 'Ben Smith',
    tag: 'Self Growth',
    rating: 4.5,
    rate: 30,
  },
  {
    id: 'counselor_2',
    avatar: IMAGES.ProfileAvatar,
    name: 'Gwen Taylor',
    tag: 'Health & Fitness',
    rating: 4.8,
    rate: 45,
  },
  {
    id: 'counselor_3',
    avatar: IMAGES.ProfileAvatar,
    name: 'Kevin Hart',
    tag: 'Motivation',
    rating: 4.9,
    rate: 35,
  },
  {
    id: 'counselor_4',
    avatar: IMAGES.ProfileAvatar,
    name: 'Sarah Wilson',
    tag: 'Relationships',
    rating: 4.7,
    rate: 40,
  },
];

const categories = [
  { id: 'cat_1', name: 'Anxiety', icon: 'heart' },
  { id: 'cat_2', name: 'Stress', icon: 'fitness' },
  { id: 'cat_3', name: 'Career', icon: 'briefcase' },
  { id: 'cat_4', name: 'Relationships', icon: 'people' },
  { id: 'cat_5', name: 'Motivation', icon: 'rocket' },
  { id: 'cat_6', name: 'Self Growth', icon: 'trending-up' },
];
