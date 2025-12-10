import { View, Text, Image, ScrollView, Pressable, StatusBar } from 'react-native'
import React, { useCallback, useRef, useState, useMemo, memo, lazy, Suspense } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS } from '@/constants/theme'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { IMAGES } from '@/constants/images'
import { TopHeader, EditInterestsBottomSheet } from '@/components'
import ROUTES from '@/constants/routes'
const PrivacySecurityBottomSheet = lazy(() => import('@/components/PrivacySecurityBottomSheet'))

// Memoized InterestChip component
const InterestChip = memo(({ interest }) => (
  <View className='bg-themeColor/10 rounded-full px-3.5 py-2'>
    <Text className='font-InterSemibold text-[12px] text-themeColor'>{interest}</Text>
  </View>
));

// Memoized QuickActionItem component
const QuickActionItem = memo(({ action, onPress }) => (
  <Pressable
    onPress={onPress}
    className='w-1/2 p-3 items-center active:opacity-70'
  >
    <View
      className='w-12 h-12 rounded-xl items-center justify-center mb-2'
      style={{
        backgroundColor: `${action.color}10`,
      }}
    >
      <Ionicons name={action.icon} size={20} color={action.color} />
    </View>
    <Text className='font-InterSemibold text-[12px] text-slate-700 text-center'>{action.label}</Text>
  </Pressable>
));

// Memoized SettingMenuItem component
const SettingMenuItem = memo(({ item, isLast, onPress }) => (
  <Pressable
    className={`flex-row justify-between items-center px-5 py-4 ${isLast ? '' : 'border-b border-gray-100'
      } active:bg-gray-50`}
    onPress={onPress}
  >
    <View className='flex-row items-center gap-3 flex-1'>
      <View className='w-10 h-10 rounded-xl bg-themeColor/10 items-center justify-center'>
        <Ionicons name={item.icon} size={18} color={COLORS.themeColor} />
      </View>
      <Text className='font-InterSemibold text-[15px] text-slate-800'>{item.label}</Text>
    </View>

    <View className='flex-row items-center gap-2.5'>
      {item.badge && (
        <View className='bg-red-500 rounded-full w-5 h-5 items-center justify-center'>
          <Text className='text-white font-InterBold text-[10px]'>{item.badge}</Text>
        </View>
      )}
      <Ionicons name="chevron-forward" size={18} color={COLORS.grey} />
    </View>
  </Pressable>
));

export default function ProfileScreen() {
  const navigation = useNavigation()

  // State for managing user interests
  const [myInterests, setMyInterests] = useState(['Career Growth', 'Relationships', 'Self Development', 'Stress Management', 'Anxiety', 'Motivation'])

  // State for privacy and security settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showOnlineStatus: true,
    allowMessages: true,
    showActivityStatus: true,
    shareDataForAnalytics: false,
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: true,
    biometricAuth: false,
  })

  // Reference for Edit Interests Bottom Sheet
  const editInterestsBottomSheetRef = useRef(null)

  // Reference for Privacy & Security Bottom Sheet
  const privacySecurityBottomSheetRef = useRef(null)

  // Update status bar when screen is focused
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(COLORS.themeColor, true);
      StatusBar.setBarStyle('light-content', true);
    }, [])
  );

  // Memoize handlers
  const handleEditInterests = useCallback(() => {
    editInterestsBottomSheetRef.current?.snapToIndex(1);
  }, []);

  const handleSaveInterests = useCallback((updatedInterests) => {
    setMyInterests(updatedInterests);
  }, []);

  const handleOpenPrivacySecurity = useCallback(() => {
    privacySecurityBottomSheetRef.current?.snapToIndex(1);
  }, []);

  const handleSavePrivacySettings = useCallback((updatedSettings) => {
    setPrivacySettings(updatedSettings);
  }, []);

  // Memoize navigation handlers
  const handleNavigateToEditProfile = useCallback(() => {
    navigation.navigate(ROUTES.EDIT_PROFILE);
  }, [navigation]);

  const handleNavigateToNotifications = useCallback(() => {
    navigation.navigate(ROUTES.NOTIFICATIONS);
  }, [navigation]);

  const handleNavigateToAppearance = useCallback(() => {
    navigation.navigate(ROUTES.APPEARANCE);
  }, [navigation]);

  const handleNavigateToHelpAndSupport = useCallback(() => {
    navigation.navigate(ROUTES.HELP_AND_SUPPORT);
  }, [navigation]);

  const handleNavigateToAbout = useCallback(() => {
    navigation.navigate(ROUTES.ABOUT_MYSTIC_AURA);
  }, [navigation]);

  const handleNavigateToHome = useCallback(() => {
    navigation.navigate(ROUTES.LANDING);
  }, [navigation]);

  const handleNavigateToMyBookings = useCallback(() => {
    navigation.navigate(ROUTES.MY_BOOKINGS);
  }, [navigation]);

  const handleNavigateToFavorites = useCallback(() => {
    navigation.navigate(ROUTES.FAVORITES);
  }, [navigation]);

  const handleNavigateToWithdrawCoins = useCallback(() => {
    navigation.navigate(ROUTES.WITHDRAW_COINS);
  }, [navigation]);

  const handleNavigateToAddCoins = useCallback(() => {
    navigation.navigate(ROUTES.ADD_COINS);
  }, [navigation]);

  const handleNavigateToLogin = useCallback(() => {
    navigation.navigate(ROUTES.LOGIN);
  }, [navigation]);

  const handleJoinSession = useCallback(() => {
    console.log('Join session');
  }, []);

  // Memoize settingMenu
  const settingMenu = useMemo(() => [
    { icon: 'person', label: 'Edit Profile', badge: null, onPress: handleNavigateToEditProfile },
    { icon: 'notifications', label: 'Notifications', badge: '3', onPress: handleNavigateToNotifications },
    { icon: 'shield-checkmark', label: 'Privacy & Security', badge: null, onPress: handleOpenPrivacySecurity },
    { icon: 'color-palette', label: 'Appearance', badge: null, onPress: handleNavigateToAppearance },
    { icon: 'help-circle', label: 'Help & Support', badge: null, onPress: handleNavigateToHelpAndSupport },
    { icon: 'information', label: 'About', badge: null, onPress: handleNavigateToAbout },
  ], [
    handleNavigateToEditProfile,
    handleNavigateToNotifications,
    handleOpenPrivacySecurity,
    handleNavigateToAppearance,
    handleNavigateToHelpAndSupport,
    handleNavigateToAbout,
  ]);

  // Memoize quickActions
  const quickActions = useMemo(() => [
    { icon: 'videocam', label: 'Book Session', color: COLORS.themeColor, onPress: handleNavigateToHome },
    { icon: 'document-text', label: 'My Bookings', color: '#10B981', onPress: handleNavigateToMyBookings },
    { icon: 'heart', label: 'Favorites', color: '#EF4444', onPress: handleNavigateToFavorites },
    { icon: 'download', label: 'Resources', color: '#8B5CF6', onPress: () => console.log('Resources') },
  ], [handleNavigateToHome, handleNavigateToMyBookings, handleNavigateToFavorites]);

  // Memoize shadow styles
  const cardShadowStyle = useMemo(() => ({
    shadowColor: COLORS.themeColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  }), []);

  const gradientCardShadowStyle = useMemo(() => ({
    shadowColor: COLORS.themeColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  }), []);

  return (
    <>
      <StatusBar backgroundColor={COLORS.themeColor} barStyle="light-content" />
      <TopHeader title="Profile" showBackButton={false} />
      {/* Header */}
      <LinearGradient
        colors={[COLORS.themeColor, '#7A72FF']}
        start={{ x: 0.9, y: 0 }}
        end={{ x: 1, y: 1.5 }}
        className='pb-6 pt- px-5'
      >
        <View className='flex-row justify-between items-start mt-2'>
          <View className='flex-row gap-4 items-center flex-1'>
            <View className='relative'>
              <Image source={IMAGES.ProfileAvatar} className='w-20 h-20 rounded-2xl' />
              <View className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border border-white items-center justify-center'>
                <View className='w-1.5 h-1.5 bg-white rounded-full' />
              </View>
            </View>
            <View className='flex-1'>
              <Text className='font-InterBold text-[20px] text-white leading-tight'>John Doe</Text>
              <View className='flex-row items-center gap-2 mt-1'>
                <View className='bg-amber-500/20 rounded-full px-2 py-0.5 flex-row items-center gap-1'>
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text className='text-white font-InterSemibold text-[11px]'>Premium</Text>
                </View>
              </View>
              <View className='flex-row items-center gap-1.5 mt-2'>
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text className='text-white/90 font-InterMedium text-[13px]'>4.8 • 12 reviews</Text>
              </View>
            </View>
          </View>
          <Pressable
            onPress={handleNavigateToEditProfile}
            className='w-10 h-10 rounded-xl bg-white/20 items-center justify-center active:bg-white/30'
          >
            <Ionicons name="create-outline" size={18} color="white" />
          </Pressable>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className='flex-1 bg-gray-50'
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        <View className='px-4 pt-4 gap-4'>
          {/* Enhanced Stats Cards */}
          <View className="flex-row flex-wrap gap-3">
            {/* Balance Card */}
            <Pressable
              onPress={handleNavigateToWithdrawCoins}
              className="flex-1 min-w-[48%] bg-white p-4 rounded-2xl border border-gray-100 active:opacity-90"
              style={cardShadowStyle}
            >
              <View className='flex-row items-center justify-between mb-2'>
                <View className='flex-row items-center gap-2'>
                  <View className='w-8 h-8 rounded-lg bg-amber-50 items-center justify-center'>
                    <Ionicons name="wallet" size={16} color="#F59E0B" />
                  </View>
                  <Text className='font-InterMedium text-[13px] text-gray-600'>Balance</Text>
                </View>
                <Ionicons name="arrow-forward" size={16} color={COLORS.grey} />
              </View>
              <View className='flex-row items-center gap-2 mb-1'>
                {IMAGES?.Coin_Icon && (
                  <Image source={IMAGES.Coin_Icon} className='w-7 h-7' />
                )}
                <Text className='font-InterBold text-[22px] text-slate-800'>240</Text>
              </View>
              <Text className='font-Inter text-[11px] text-gray-500'>Available coins</Text>
            </Pressable>

            {/* Add Coins Card */}
            <Pressable
              onPress={handleNavigateToAddCoins}
              className="flex-1 min-w-[48%] rounded-2xl overflow-hidden active:opacity-90"
              style={gradientCardShadowStyle}
            >
              <LinearGradient
                colors={[COLORS.themeColor, '#7A72FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className='p-5'
              >
                <View className='flex-row items-center justify-between mb-2'>
                  <View className='w-10 h-10 rounded-xl bg-white/20 items-center justify-center'>
                    <Ionicons name='add-circle' size={20} color="white" />
                  </View>
                  <View className='bg-white/20 rounded-full px-2 py-0.5'>
                    <Text className='text-white font-InterBold text-[10px]'>+20%</Text>
                  </View>
                </View>
                <Text className='text-white font-InterBold text-[15px] mb-0.5'>Add Coins</Text>
                <Text className='text-white/85 font-Inter text-[11px]'>Top up your balance</Text>
              </LinearGradient>
            </Pressable>

            {/* Sessions Card */}
            <View className="flex-1 min-w-[48%] bg-white p-4 rounded-2xl border border-gray-100"
              style={cardShadowStyle}
            >
              <View className='flex-row items-center gap-2 mb-2'>
                <View className='w-8 h-8 rounded-lg bg-blue-50 items-center justify-center'>
                  <Ionicons name='calendar' size={16} color={COLORS.themeColor} />
                </View>
                <Text className='font-InterMedium text-[13px] text-gray-600'>Scheduled</Text>
              </View>
              <Text className='font-InterBold text-[22px] text-slate-800 mb-1'>4</Text>
              <Text className='font-Inter text-[11px] text-gray-500'>Upcoming sessions</Text>
            </View>

            {/* History Card */}
            <View className="flex-1 min-w-[48%] bg-white p-4 rounded-2xl border border-gray-100"
              style={cardShadowStyle}
            >
              <View className='flex-row items-center gap-2 mb-2'>
                <View className='w-8 h-8 rounded-lg bg-green-50 items-center justify-center'>
                  <Ionicons name='checkmark-done' size={16} color="#10B981" />
                </View>
                <Text className='font-InterMedium text-[13px] text-gray-600'>Completed</Text>
              </View>
              <Text className='font-InterBold text-[22px] text-slate-800 mb-1'>24</Text>
              <Text className='font-Inter text-[11px] text-gray-500'>Total sessions</Text>
            </View>
          </View>

          {/* Enhanced Interests Section */}
          <View className='bg-white rounded-2xl p-5 border border-gray-100'
            style={cardShadowStyle}
          >
            <View className='flex-row justify-between items-center mb-4'>
              <View className='flex-row items-center gap-2'>
                <View className='w-1 h-5 bg-themeColor rounded-full' />
                <Text className='font-InterBold text-[17px] text-slate-800'>My Interests</Text>
              </View>
              <Pressable
                onPress={handleEditInterests}
                className='flex-row items-center gap-1.5 bg-themeColor/10 rounded-full px-3 py-1.5 active:opacity-70'
              >
                <Text className='font-InterSemibold text-[12px] text-themeColor'>Edit</Text>
                <Ionicons name="create-outline" size={12} color={COLORS.themeColor} />
              </Pressable>
            </View>

            <View className='flex-row flex-wrap gap-2.5'>
              {myInterests.length > 0 ? (
                myInterests.map((interest, index) => (
                  <InterestChip key={`${interest}-${index}`} interest={interest} />
                ))
              ) : (
                <View className='w-full py-3 items-center'>
                  <Text className='font-Inter text-gray-500 text-[13px]'>No interests selected yet</Text>
                  <Text className='font-Inter text-gray-400 text-[11px] mt-1'>Tap Edit to add interests</Text>
                </View>
              )}
            </View>
          </View>

          {/* Enhanced Upcoming Session */}
          <LinearGradient
            colors={[COLORS.themeColor, '#7A72FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className='rounded-2xl p-5 overflow-hidden'
            style={{
              shadowColor: COLORS.themeColor,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <View className='flex-row justify-between items-start'>
              <View className='flex-1'>
                <View className='flex-row items-center gap-2 mb-2'>
                  <Ionicons name="calendar" size={18} color="white" />
                  <Text className='text-white font-InterBold text-[16px]'>Next Session</Text>
                </View>
                <Text className='text-white font-InterSemibold text-[15px] mb-1'>Today, 3:00 PM</Text>
                <Text className='text-white/90 font-Inter text-[13px]'>With Dr. Sarah Wilson</Text>
                <View className='flex-row items-center gap-1.5 mt-2'>
                  <Ionicons name="time" size={12} color="white" />
                  <Text className='text-white/80 font-Inter text-[11px]'>50 min • Video Call</Text>
                </View>
              </View>
              <Pressable
                onPress={handleJoinSession}
                className='bg-white/25 rounded-xl px-4 py-2.5 active:bg-white/35'
              >
                <Text className='text-white font-InterSemibold text-[13px]'>Join</Text>
              </Pressable>
            </View>
          </LinearGradient>

          {/* Quick Actions */}
          <View className='bg-white rounded-2xl border border-gray-100'
            style={cardShadowStyle}
          >
            <View className='px-5 pt-5 pb-4'>
              <View className='flex-row items-center gap-2 mb-4'>
                <View className='w-1 h-5 bg-themeColor rounded-full' />
                <Text className='font-InterBold text-[17px] text-slate-800'>Quick Actions</Text>
              </View>
            </View>

            <View className='flex-row flex-wrap px-3 pb-4'>
              {quickActions.map((action, index) => (
                <QuickActionItem
                  key={`${action.icon}-${index}`}
                  action={action}
                  onPress={action.onPress}
                />
              ))}
            </View>
          </View>

          {/* Enhanced Settings Menu */}
          <View className='bg-white rounded-2xl border border-gray-100'
            style={cardShadowStyle}
          >
            {settingMenu.map((item, index) => (
              <SettingMenuItem
                key={`${item.icon}-${index}`}
                item={item}
                isLast={index === settingMenu.length - 1}
                onPress={item.onPress}
              />
            ))}
          </View>

          {/* Logout Button */}
          <Pressable
            onPress={handleNavigateToLogin}
            className='bg-red-50 rounded-2xl p-4 mt-4 border border-red-200 flex-row justify-center items-center gap-2 active:bg-red-100'
          >
            <Ionicons name="log-out" size={18} color="#EF4444" />
            <Text className='font-InterSemibold text-[15px] text-red-600'>Log Out</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Edit Interests Bottom Sheet */}
      <EditInterestsBottomSheet
        ref={editInterestsBottomSheetRef}
        onChange={() => { }}
        currentInterests={myInterests}
        onSave={handleSaveInterests}
      />

      {/* Privacy & Security Bottom Sheet */}
      <Suspense fallback={<View className='flex-1 bg-gray-50' />}>

        <PrivacySecurityBottomSheet
          ref={privacySecurityBottomSheetRef}
          onChange={() => { }}
          currentSettings={privacySettings}
          onSave={handleSavePrivacySettings}
        />
      </Suspense>
    </>
  )
}
