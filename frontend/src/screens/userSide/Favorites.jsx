import { View, Text, ScrollView, FlatList, RefreshControl, StatusBar, Pressable } from 'react-native'
import React, { useState, useCallback, useMemo, memo } from 'react'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/theme'
import { VerticalCouncelorCard } from '@/components'
import { getFavorites, removeFromFavorites } from '@/utils/favoritesUtils'
import { Toast } from 'toastify-react-native'
import { useConfirmationAlert } from '@/state/confirmationContext'
import ROUTES from '@/constants/routes'

//d EmptyFavorites component
const EmptyFavorites = memo(({ onNavigate }) => (
  <View className="flex-1 items-center justify-center py-20 px-6">
    <View className="w-24 h-24 rounded-full bg-themeColor/10 items-center justify-center mb-5">
      <Ionicons name="heart-outline" size={40} color={COLORS.themeColor} />
    </View>
    <Text className="font-InterBold text-[20px] text-slate-800 text-center mb-2">
      No Favorites Yet
    </Text>
    <Text className="font-Inter text-gray-500 text-center text-[15px] leading-6 mb-6">
      Start exploring counselors and tap the heart icon to save your favorites for quick access.
    </Text>
    <Pressable
      onPress={onNavigate}
      className="bg-themeColor rounded-xl px-6 py-3 active:opacity-90"
    >
      <Text className="font-InterSemibold text-white text-[15px]">
        Browse Counselors
      </Text>
    </Pressable>
  </View>
));

//d Loading component
const LoadingState = memo(() => (
  <View className="flex-1 items-center justify-center">
    <View className="w-14 h-14 rounded-full bg-themeColor/10 items-center justify-center mb-3">
      <Ionicons name="heart" size={28} color={COLORS.themeColor} />
    </View>
    <Text className="font-InterMedium text-gray-500 text-[15px]">Loading favorites...</Text>
  </View>
));

//d StatsHeader component
const StatsHeader = memo(({ count }) => {
  const counselorText = useMemo(() =>
    count === 1 ? 'counselor' : 'counselors',
    [count]
  );

  return (
    <View className="px-4 pt-4 pb-3">
      <View className="bg-white rounded-2xl p-4 border border-gray-100">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="font-InterSemibold text-slate-800 text-[15px] mb-1">
              Your Favorites
            </Text>
            <View className="flex-row items-center gap-1.5">
              <Ionicons name="heart" size={14} color="#EF4444" />
              <Text className="font-InterMedium text-gray-700 text-[13px]">
                {count} {counselorText}
              </Text>
            </View>
          </View>
          <View className="bg-themeColor/10 rounded-full px-3 py-2">
            <Ionicons name="heart" size={20} color="#EF4444" />
          </View>
        </View>
      </View>
    </View>
  );
});

export default function FavoritesScreen() {
  const navigation = useNavigation()
  const [favoriteCounselors, setFavoriteCounselors] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)

  const { showConfirmation, hideConfirmation } = useConfirmationAlert()

  // Update status bar when screen is focused
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(COLORS.themeColor, true);
      StatusBar.setBarStyle('light-content', true);
    }, [])
  );

  /**
   * Load favorites from AsyncStorage using utility function
   */
  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true)
      const favorites = await getFavorites()
      setFavoriteCounselors(favorites)
    } catch (error) {
      console.error('Error loading favorites:', error)
      setFavoriteCounselors([])
    } finally {
      setLoading(false)
    }
  }, []);

  /**
   * Handle pull-to-refresh
   */
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    await loadFavorites()
    setIsRefreshing(false)
  }, [loadFavorites]);

  // Load favorites when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadFavorites()
    }, [loadFavorites])
  )

  /**
   * Remove counselor from favorites using utility function
   */
  const handleRemoveFavorite = useCallback(async (counselorId) => {
    const counselor = favoriteCounselors.find(c => (c.id || c.name) === counselorId)
    const counselorName = counselor?.name || 'this counselor'

    showConfirmation({
      title: "Remove from Favorites",
      message: `Are you sure! You want to remove ${counselorName} from your favorites?`,
      onConfirm: async () => {
        try {
          const success = await removeFromFavorites(counselorId)
          if (success) {
            // Reload favorites to update the list
            await loadFavorites()

            Toast.show({
              type: "success",
              text2: "Counselor removed from your favorites list",
            })
          }
        } catch (error) {
          console.error('Error removing favorite:', error)
          Toast.show({
            type: "error",
            text2: "Failed to remove from favorites",
          })
        }
        hideConfirmation()
      },
      onCancel: () => {
        hideConfirmation()
      },
      confirmText: "Remove",
      cancelText: "Cancel",
      type: "warning"
    })
  }, [loadFavorites, favoriteCounselors, showConfirmation, hideConfirmation]);

  // navigation handler
  const handleNavigateToBrowse = useCallback(() => {
    try {
      navigation.navigate(ROUTES.LANDING)
    } catch (error) {
      navigation.navigate(ROUTES.LANDING)
    }
  }, [navigation]);

  // keyExtractor
  const keyExtractor = useCallback((item) =>
    item.id?.toString() || item.name,
    []
  );

  // renderItem
  const renderItem = useCallback(({ item }) => (
    <View className="px-4 mb-3">
      <VerticalCouncelorCard
        item={item}
        isFavorite={true}
        onRemoveFavorite={() => handleRemoveFavorite(item.id || item.name)}
      />
    </View>
  ), [handleRemoveFavorite]);

  // RefreshControl
  const refreshControl = useMemo(() => (
    <RefreshControl
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
      tintColor={COLORS.themeColor}
      colors={[COLORS.themeColor]}
    />
  ), [isRefreshing, handleRefresh]);

  // contentContainerStyle
  const flatListContentStyle = useMemo(() => ({
    paddingBottom: 90,
    paddingTop: 8
  }), []);

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar backgroundColor={COLORS.themeColor} barStyle="light-content" />

      {loading ? (
        <LoadingState />
      ) : favoriteCounselors.length === 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={refreshControl}
        >
          <EmptyFavorites onNavigate={handleNavigateToBrowse} />
        </ScrollView>
      ) : (
        <View className="flex-1">
          {/* Stats Header */}
          <StatsHeader count={favoriteCounselors.length} />

          {/* Favorites List */}
          <FlatList
            data={favoriteCounselors}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={flatListContentStyle}
            refreshControl={refreshControl}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={10}
            getItemLayout={(data, index) => ({
              length: 200, // Approximate item height
              offset: 200 * index,
              index,
            })}
          />
        </View>
      )}
    </View>
  )
}
