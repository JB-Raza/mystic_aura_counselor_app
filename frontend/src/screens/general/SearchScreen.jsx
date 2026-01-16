import { Backdrop, FilterBottomSheet, SearchBar, VerticalCouncelorCard } from '@/components';

import { View, Pressable, FlatList, Text, ScrollView, Keyboard } from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { sampleCategories, sampleCouncelors } from '@/sampleData';
import { addToSearchHistory, getSearchHistory } from '@/utils/searchHistoryUtils';

export default function SearchScreen({ route }) {
  const bottomSheetRef = useRef(null);
  const { query } = route?.params || '';

  const [searchQuery, setSearchQuery] = useState(query || '');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [filter, setFilter] = useState(null);
  const [searchResult, setSearchResult] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // filters
  const handleOpenPress = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(1);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      // Simulate search delay for better UX
      const timer = setTimeout(() => {
        const filteredSearchData = sampleCouncelors.filter(
          (councelor) =>
            councelor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            councelor.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
            councelor.speciality.some((speciality) => speciality.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setSearchResult(filteredSearchData);
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSearchResult([]);
      setIsSearching(false);
    }
  }, [searchQuery]);

  const renderItem = ({ item }) => (
    <View className="mb-3 px-4">
      <VerticalCouncelorCard item={item} />
    </View>
  );

  // loadSearchHistory
  const loadSearchHistory = useCallback(async () => {
    try {
      const history = await getSearchHistory();
      setSearchHistory(history);
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  }, []);

  // Load search history on mount
  useEffect(() => {
    loadSearchHistory();
  }, [loadSearchHistory]);

  // search
  const handleSearchSubmit = useCallback(async () => {
    if (!searchQuery.trim()) return;

    try {
      // Add to search history
      await addToSearchHistory(searchQuery.trim());
      // Reload history to update suggestions
      await loadSearchHistory();
      // Close search suggestions
      setIsSearchActive(false);
    } catch (error) {
      console.error('Error submitting search:', error);
    }
  }, [searchQuery, loadSearchHistory]);

  // Generate all possible suggestions
  const allSuggestions = useMemo(() => {
    const counselorSuggestions = sampleCouncelors.map((c) => ({
      text: c.name,
      type: 'counselor',
      icon: 'person',
    }));
    const categorySuggestions = sampleCategories.map((c) => ({
      text: c.name,
      type: 'category',
      icon: c.icon,
    }));
    return [...counselorSuggestions, ...categorySuggestions];
  }, []);

  // Filter and prioritize suggestions
  // const filteredSuggestions = useMemo(() => {
  //   if (!searchQuery.trim()) {
  //     return [];
  //   }

  //   const query = searchQuery.toLowerCase().trim();
  //   const historyMatches = searchHistory
  //     .filter((item) => item.toLowerCase().includes(query))
  //     .map((item) => ({
  //       text: item,
  //       type: 'history',
  //       icon: 'time-outline',
  //     }));

  //   const otherMatches = allSuggestions.filter((suggestion) => {
  //     const isInHistory = searchHistory.some(
  //       (h) => h.toLowerCase() === suggestion.text.toLowerCase()
  //     );
  //     return !isInHistory && suggestion.text.toLowerCase().includes(query);
  //   });

  //   return [...historyMatches, ...otherMatches].slice(0, 8);
  // }, [searchQuery, searchHistory, allSuggestions]);

  // Handle backdrop press - dismiss keyboard and close suggestions
  // const handleBackdropPress = useCallback(() => {
  //   Keyboard.dismiss();
  //   setIsSearchActive(false);
  // }, []);

  return (
    <View className="flex-1">
      {/* <Backdrop isSearchActive={isSearchActive} onPress={handleBackdropPress} /> */}
      {/* search/filter section */}
      <View className={`relative z-[20] bg-themeColor px-5 pt-3 pb-4 shadow-xl shadow-themeColor`}>
        <View className={`flex-row gap-3 relative`}>
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
        </View>

        {/* search suggestions section - absolutely positioned below search bar */}
        {/* {isSearchActive && (
          <View 
            className={`absolute max-h-80 overflow-hidden rounded-2xl bg-white shadow-lg z-[30] `}
            style={{ top: '100%', left: "4%", right: "4%", marginTop: 20 }}>
            {searchQuery.trim() ? (
              // Show suggestions when typing
              filteredSuggestions.length > 0 ? (
                <ScrollView 
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingVertical: 8 }}
                  keyboardShouldPersistTaps={"handled"}
                  nestedScrollEnabled={true}>
                  {filteredSuggestions.map((suggestion, index) => (
                    <Pressable
                      key={`${suggestion.type}-${suggestion.text}-${index}`}
                      className="flex-row items-center gap-3 px-4 py-3 active:bg-gray-50"
                      onPress={async () => {
                        const selectedText = suggestion.text;
                        // Set the search query first
                        setSearchQuery(selectedText);
                        // Add to history and reload
                        await addToSearchHistory(selectedText);
                        await loadSearchHistory();
                        // Close suggestions after a small delay to ensure state update
                        setTimeout(() => {
                          setIsSearchActive(false);
                        }, 100);
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
        )} */}
      </View>

      {/* Main Content Area */}
      <View className="flex-1 bg-gray-50">
        {searchQuery.trim() && searchResult.length > 0 && (
          // Results Header
          <View className="border-b border-gray-200 bg-white px-4 py-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="h-8 w-8 items-center justify-center rounded-lg bg-themeColor/10">
                  <Ionicons name="checkmark-circle" size={18} color={COLORS.themeColor} />
                </View>
                <Text className="font-InterSemibold text-[16px] text-slate-800">
                  Search Results
                </Text>
                <View className="rounded-full bg-themeColor/10 px-2.5 py-0.5">
                  <Text className="font-InterMedium text-[12px] text-themeColor">
                    {searchResult.length} {searchResult.length === 1 ? 'result' : 'results'}
                  </Text>
                </View>
              </View>
              {filter && (
                <Pressable
                  onPress={handleOpenPress}
                  className="flex-row items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5">
                  <Ionicons name="filter" size={14} color={COLORS.grey} />
                  <Text className="font-InterMedium text-[12px] text-gray-600">Filtered</Text>
                </Pressable>
              )}
            </View>
          </View>
        )}

        {/* Search Results Content */}
        {isSearching ? (
          // Loading state
          <View className="flex-1 items-center justify-center px-4">
            <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-themeColor/10">
              <Ionicons name="search" size={28} color={COLORS.themeColor} />
            </View>
            <Text className="font-InterMedium text-[15px] text-slate-700">Searching...</Text>
            <Text className="mt-1 text-center font-Inter text-[13px] text-gray-500">
              Finding the best matches for you
            </Text>
          </View>
        ) : searchResult.length > 0 ? (
          // Results List
          <FlatList
            data={searchResult}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id || item.name}
            removeClippedSubviews={true}
            maxToRenderPerBatch={5}
            initialNumToRender={4}


            contentContainerStyle={{ paddingTop: 8, paddingBottom: 20 }}
            // getItemLayout={(data, index) => ({
            //   length: 280,
            //   offset: 280 * index,
            //   index,
            // })}
            renderItem={renderItem}
          />
        ) : searchQuery.trim() ? (
          // Empty state - no results found
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
            <View className="flex-1 items-center justify-center px-6 py-12">
              <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-themeColor/10">
                <Ionicons name="search-outline" size={40} color={COLORS.themeColor} />
              </View>
              <Text className="mb-2 font-InterBold text-[20px] text-slate-800">
                No Results Found
              </Text>
              <Text className="mb-6 max-w-sm text-center font-Inter text-[14px] leading-5 text-gray-600">
                We couldn't find any counselors matching "{searchQuery}". Try adjusting your search
                terms or filters.
              </Text>
              <View className="flex-row gap-3">
                <Pressable
                  onPress={handleOpenPress}
                  className="flex-row items-center gap-2 rounded-xl border border-themeColor bg-white px-4 py-2.5">
                  <Ionicons name="options" size={16} color={COLORS.themeColor} />
                  <Text className="font-InterSemibold text-[13px] text-themeColor">
                    Adjust Filters
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setSearchQuery('')}
                  className="rounded-xl bg-themeColor px-4 py-2.5">
                  <Text className="font-InterSemibold text-[13px] text-white">Clear Search</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        ) : (
          // Initial state - no search query yet
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
            <View className="flex-1 items-center justify-center px-6 py-12">
              <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-themeColor/10">
                <Ionicons name="search" size={40} color={COLORS.themeColor} />
              </View>
              <Text className="mb-2 text-center font-InterBold text-[22px] text-slate-800">
                Discover Your Perfect Counselor
              </Text>
              <Text className="mb-8 max-w-sm text-center font-Inter text-[14px] leading-6 text-gray-600">
                Search by name, specialty, or topic to find the right mental health professional for
                your journey
              </Text>
              {searchHistory.length > 0 && (
                <View className="w-full max-w-sm">
                  <Text className="mb-3 px-1 font-InterSemibold text-[13px] text-slate-700">
                    Recent Searches
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {searchHistory.slice(0, 5).map((item, index) => (
                      <Pressable
                        key={index}
                        onPress={() => setSearchQuery(item)}
                        className="flex-row items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5">
                        <Ionicons name="time-outline" size={14} color={COLORS.grey} />
                        <Text className="font-InterMedium text-[12px] text-slate-700">{item}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        )}
      </View>

      {/* filter bottom sheet */}
      <FilterBottomSheet sheetRef={bottomSheetRef} filter={filter} setFilter={setFilter} />
    </View>
  );
}
