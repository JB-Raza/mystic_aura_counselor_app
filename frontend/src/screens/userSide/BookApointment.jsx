import { View, Text, ScrollView, Pressable, TextInput, Image, StatusBar } from 'react-native'
import React, { useState, useRef, useCallback } from 'react'
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS } from '@/constants/theme'
import { IMAGES } from '@/constants/images'
import { CustomBottomSheet, ButtonFullWidth } from '@/components'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { AvailableBookingSlots } from '@/sampleData'
import { Toast } from 'toastify-react-native';
import ROUTES from '@/constants/routes'

export default function BookApointment() {
  const navigation = useNavigation()
  const route = useRoute()

  // Get counselor and service data from route params
  const counselorData = route?.params?.counselor || {}
  const serviceData = route?.params?.service || {}

  // State management
  const [sessionType, setSessionType] = useState('video') // 'video' | 'audio' | 'chat'
  const [duration, setDuration] = useState(60) // in minutes
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [issueDescription, setIssueDescription] = useState('')
  const [availableTimeSlots, setAvailableTimeSlots] = useState([])

  // Bottom sheet refs
  const sessionTypeBottomSheetRef = useRef(null)

  // Update status bar when screen is focused
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(COLORS.themeColor, true);
      StatusBar.setBarStyle('light-content', true);
    }, [])
  );

  /**
   * Duration options in minutes
   */
  const durationOptions = [
    { value: 30, label: '30 min', price: 1.0 },
    { value: 45, label: '45 min', price: 1.2 },
    { value: 60, label: '60 min', price: 1.5 },
    { value: 90, label: '90 min', price: 2.0 },
  ]

  /**
   * Session type options
   */
  const sessionTypes = [
    {
      id: 'video',
      label: 'Video Call',
      icon: 'videocam',
      description: 'Face-to-face video session',
      priceMultiplier: 1.0,
    },
    {
      id: 'audio',
      label: 'Audio Call',
      icon: 'call',
      description: 'Voice-only session',
      priceMultiplier: 0.8,
    },
    {
      id: 'chat',
      label: 'Text Chat',
      icon: 'chatbubbles',
      description: 'Text-based messaging',
      priceMultiplier: 0.6,
    },
  ]

  /**
   * Calculate price based on selections
   */
  const calculatePrice = () => {
    const baseRate = counselorData.rate || serviceData.price || 30 // coins per minute
    const selectedDuration = durationOptions.find(d => d.value === duration)
    const selectedSessionType = sessionTypes.find(st => st.id === sessionType)

    if (!selectedDuration || !selectedSessionType) return 0

    // Base price = rate per minute * duration * session type multiplier
    const basePrice = baseRate * duration * selectedSessionType.priceMultiplier

    // Slot booking fee (fixed)
    const slotFee = 30

    // Platform fee (10% of base price, minimum 5 coins)
    const platformFee = Math.max(5, Math.round(basePrice * 0.1))

    return {
      basePrice: Math.round(basePrice),
      slotFee,
      platformFee,
      total: Math.round(basePrice) + slotFee + platformFee,
      ratePerMin: baseRate,
    }
  }

  const priceBreakdown = calculatePrice()

  /**
   * Handle date selection
   */
  const handleDateSelect = (slot) => {
    const day = slot.date.toLocaleDateString("en-US", { weekday: "short" })
    const date = slot.date.getDate()
    setSelectedDate({ day, date, fullDate: slot.date })
    setAvailableTimeSlots(slot.timeSlots.filter(ts => !ts.isBooked))
    setSelectedTimeSlot(null) // Reset time slot when date changes
  }

  /**
   * Handle continue to confirmation
   */
  const handleContinue = () => {
    // Validation
    if (!selectedDate) {
      Toast.show({
        type: "error",
        text2: "Please select a date for your session"
      })
      return
    }

    if (!selectedTimeSlot) {
      Toast.show({
        type: "error",
        text2: "Please select a time slot"
      })
      return
    }

    // Format date and time
    const formattedDate = selectedDate.fullDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })

    // Navigate to ConfirmBooking with all data
    navigation.navigate(ROUTES.CONFIRM_BOOKING, {
      counselor: counselorData,
      service: serviceData,
      sessionType,
      duration,
      date: formattedDate,
      time: selectedTimeSlot,
      issueDescription,
      slotFee: priceBreakdown.slotFee,
      platformFee: priceBreakdown.platformFee,
      ratePerMin: priceBreakdown.ratePerMin,
      totalAmount: priceBreakdown.total,
    })
  }

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar backgroundColor={COLORS.themeColor} barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        className="flex-1"
      >
        {/* Counselor Info Card */}
        <View className="px-4 pt-4 mb-4">
          <View className="bg-white rounded-2xl p-4 border border-gray-100"
            style={{
              shadowColor: COLORS.themeColor,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <View className="flex-row items-center gap-3">
              <Image
                source={counselorData.avatar || IMAGES.ProfileAvatar}
                className="w-16 h-16 rounded-2xl"
              />
              <View className="flex-1">
                <Text className="font-InterBold text-[17px] text-slate-800">
                  {counselorData.name || 'Counselor Name'}
                </Text>
                <Text className="font-InterMedium text-[13px] text-themeColor mt-0.5">
                  {counselorData.tag || 'Specialization'} Specialist
                </Text>
                <View className="flex-row items-center gap-1 mt-1">
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text className="font-InterSemibold text-[12px] text-slate-700">
                    {counselorData.rating || 4.5}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Service Info Card */}
        {serviceData.name && (
          <View className="px-4 mb-4">
            <View className="bg-themeColor/5 rounded-2xl p-4 border border-themeColor/20">
              <View className="flex-row items-start gap-3">
                <View className="w-10 h-10 rounded-xl bg-themeColor/10 items-center justify-center">
                  <Ionicons name="medical" size={20} color={COLORS.themeColor} />
                </View>
                <View className="flex-1">
                  <Text className="font-InterSemibold text-[15px] text-slate-800">
                    {serviceData.name}
                  </Text>
                  <Text className="font-Inter text-[13px] text-gray-600 mt-0.5">
                    {serviceData.tagline || serviceData.description || 'Professional counseling service'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Session Type Selection */}
        <View className="px-4 mb-4">
          <View className="bg-white rounded-2xl p-4 border border-gray-100"
            style={{
              shadowColor: COLORS.themeColor,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <View className="flex-row items-center justify-between mb-3">
              <View>
                <Text className="font-InterBold text-[16px] text-slate-800">
                  Session Type
                </Text>
                <Text className="font-Inter text-[12px] text-gray-500 mt-0.5">
                  Choose how you want to connect
                </Text>
              </View>
              <Pressable
                onPress={() => sessionTypeBottomSheetRef.current?.snapToIndex(0)}
                className="bg-themeColor/10 rounded-full px-3 py-1.5 active:opacity-70"
              >
                <Text className="font-InterSemibold text-[12px] text-themeColor">Change</Text>
              </Pressable>
            </View>

            {/* Selected Session Type Display */}
            {sessionTypes.find(st => st.id === sessionType) && (
              <Pressable
                onPress={() => sessionTypeBottomSheetRef.current?.snapToIndex(0)}
                className="bg-gray-50 rounded-xl p-3 border border-gray-200 active:opacity-70"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-lg bg-themeColor/10 items-center justify-center">
                    <Ionicons
                      name={sessionTypes.find(st => st.id === sessionType)?.icon || 'videocam'}
                      size={20}
                      color={COLORS.themeColor}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="font-InterSemibold text-[14px] text-slate-800">
                      {sessionTypes.find(st => st.id === sessionType)?.label}
                    </Text>
                    <Text className="font-Inter text-[12px] text-gray-500 mt-0.5">
                      {sessionTypes.find(st => st.id === sessionType)?.description}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={COLORS.grey} />
                </View>
              </Pressable>
            )}
          </View>
        </View>

        {/* Duration Selection */}
        <View className="px-4 mb-4">
          <View className="bg-white rounded-2xl p-4 border border-gray-100"
            style={{
              shadowColor: COLORS.themeColor,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Text className="font-InterBold text-[16px] text-slate-800 mb-3">
              Session Duration
            </Text>
            <View className="flex-row flex-wrap gap-2.5">
              {durationOptions.map((option) => {
                const isSelected = duration === option.value
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => setDuration(option.value)}
                    className={`rounded-xl px-4 py-3 border-2 flex-1 min-w-[30%] items-center ${isSelected
                      ? 'border-themeColor bg-themeColor/10'
                      : 'border-gray-200 bg-white'
                      } active:opacity-70`}
                  >
                    <Text
                      className={`font-InterSemibold text-[14px] ${isSelected ? 'text-themeColor' : 'text-slate-700'
                        }`}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                )
              })}
            </View>
          </View>
        </View>

        {/* Date Selection */}
        <View className="px-4 mb-4">
          <View className="bg-white rounded-2xl p-4 border border-gray-100"
            style={{
              shadowColor: COLORS.themeColor,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Text className="font-InterBold text-[16px] text-slate-800 mb-3">
              Select Date
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
            >
              {AvailableBookingSlots.map((slot, index) => {
                const day = slot.date.toLocaleDateString("en-US", { weekday: "short" })
                const date = slot.date.getDate()
                const month = slot.date.toLocaleDateString("en-US", { month: "short" })
                const isSelected = selectedDate?.date === date && selectedDate?.day === day

                return (
                  <Pressable
                    key={index}
                    onPress={() => handleDateSelect(slot)}
                    className={`w-16 rounded-2xl p-3 items-center mr-3 border ${isSelected
                      ? "bg-themeColor border-themeColor"
                      : "bg-white border-gray-200"
                      } active:opacity-70`}
                  >
                    <Text className={`font-InterMedium text-[11px] ${isSelected ? "text-white" : "text-gray-500"
                      }`}>
                      {day}
                    </Text>
                    <Text className={`font-InterBold text-[18px] mt-1 ${isSelected ? "text-white" : "text-slate-800"
                      }`}>
                      {date}
                    </Text>
                    <Text className={`font-Inter text-[10px] mt-0.5 ${isSelected ? "text-white/80" : "text-gray-400"
                      }`}>
                      {month}
                    </Text>
                  </Pressable>
                )
              })}
            </ScrollView>
          </View>
        </View>

        {/* Time Slot Selection */}
        {selectedDate && availableTimeSlots.length > 0 && (
          <View className="px-4 mb-4">
            <View className="bg-white rounded-2xl p-4 border border-gray-100"
              style={{
                shadowColor: COLORS.themeColor,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <Text className="font-InterBold text-[16px] text-slate-800 mb-3">
                Available Times
              </Text>
              <View className="flex-row flex-wrap gap-2.5">
                {availableTimeSlots.map((timeSlot, index) => {
                  const isSelected = selectedTimeSlot === timeSlot.time
                  return (
                    <Pressable
                      key={index}
                      onPress={() => setSelectedTimeSlot(timeSlot.time)}
                      className={`rounded-xl px-4 py-3 border-2 ${isSelected
                        ? "border-themeColor bg-themeColor/10"
                        : "border-gray-200 bg-white"
                        } active:opacity-70`}
                    >
                      <Text className={`font-InterSemibold text-[14px] ${isSelected ? "text-themeColor" : "text-slate-700"
                        }`}>
                        {timeSlot.time}
                      </Text>
                    </Pressable>
                  )
                })}
              </View>
            </View>
          </View>
        )}

        {/* Issue Description (Optional) */}
        <View className="px-4 mb-4">
          <View className="bg-white rounded-2xl p-4 border border-gray-100"
            style={{
              shadowColor: COLORS.themeColor,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <View className="flex-row items-center gap-2 mb-3">
              <Text className="font-InterBold text-[16px] text-slate-800">
                What brings you here? (Optional)
              </Text>
              <View className="bg-gray-100 rounded-full px-2 py-0.5">
                <Text className="font-Inter text-[10px] text-gray-600">Optional</Text>
              </View>
            </View>
            <Text className="font-Inter text-[12px] text-gray-500 mb-3">
              Share a brief description to help your counselor prepare
            </Text>
            <TextInput
              value={issueDescription}
              onChangeText={setIssueDescription}
              placeholder="E.g., I've been feeling anxious about work lately..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              maxLength={500}
              className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-slate-800 font-Inter text-[14px] min-h-[100px]"
              textAlignVertical="top"
            />
            <View className="flex-row justify-end mt-2">
              <Text className="font-Inter text-[11px] text-gray-400">
                {issueDescription.length}/500 characters
              </Text>
            </View>
          </View>
        </View>

        {/* Price Calculator Card */}
        <View className="px-4 mb-4">
          <LinearGradient
            colors={[`${COLORS.themeColor}15`, `${COLORS.themeColor}08`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-2xl p-4 border border-themeColor/20"
            style={{
              shadowColor: COLORS.themeColor,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <View className="flex-row items-center gap-2 mb-4">
              <View className="w-8 h-8 rounded-lg bg-themeColor/20 items-center justify-center">
                <Ionicons name="calculator" size={18} color={COLORS.themeColor} />
              </View>
              <Text className="font-InterBold text-[16px] text-slate-800">
                Price Breakdown
              </Text>
            </View>

            {/* Price Details */}
            <View className="gap-2.5 mb-4">
              <View className="flex-row justify-between items-center py-1.5">
                <Text className="font-Inter text-[13px] text-gray-600">
                  Session Fee ({duration} min × {priceBreakdown.ratePerMin} coins/min)
                </Text>
                <View className="flex-row items-center gap-1.5">
                  <Image source={IMAGES.Coin_Icon} className="w-4 h-4" />
                  <Text className="font-InterSemibold text-[13px] text-slate-800">
                    {priceBreakdown.basePrice}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center py-1.5">
                <Text className="font-Inter text-[13px] text-gray-600">
                  Slot Booking Fee
                </Text>
                <View className="flex-row items-center gap-1.5">
                  <Image source={IMAGES.Coin_Icon} className="w-4 h-4" />
                  <Text className="font-InterSemibold text-[13px] text-slate-800">
                    {priceBreakdown.slotFee}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center py-1.5">
                <Text className="font-Inter text-[13px] text-gray-600">
                  Platform Fee
                </Text>
                <View className="flex-row items-center gap-1.5">
                  <Image source={IMAGES.Coin_Icon} className="w-4 h-4" />
                  <Text className="font-InterSemibold text-[13px] text-slate-800">
                    {priceBreakdown.platformFee}
                  </Text>
                </View>
              </View>

              {/* Total */}
              <View className="flex-row justify-between items-center pt-3 mt-2 border-t-2 border-themeColor/30">
                <Text className="font-InterBold text-[16px] text-slate-800">
                  Total Amount
                </Text>
                <View className="flex-row items-center gap-2">
                  <Image source={IMAGES.Coin_Icon} className="w-5 h-5" />
                  <Text className="font-InterBold text-[18px] text-themeColor">
                    {priceBreakdown.total}
                  </Text>
                </View>
              </View>
            </View>

            {/* Info Note */}
            <View className="bg-amber-50 rounded-xl px-3 py-2.5 border border-amber-200">
              <View className="flex-row items-center gap-2">
                <Ionicons name="information-circle" size={16} color="#F59E0B" />
                <Text className="font-Inter text-[12px] text-amber-800 flex-1">
                  Once joined, {priceBreakdown.ratePerMin} coins/min will be charged during the session
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* Continue Button - Fixed at Bottom */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 shadow-lg">
        <ButtonFullWidth
          text="Continue to Payment"
          onPress={handleContinue}
          disabled={!selectedDate || !selectedTimeSlot}
          icon="arrow-forward"
          gradient={{
            colors: [COLORS.themeColor, '#7A72FF'],
            start: { x: 0, y: 0 },
            end: { x: 1, y: 0 }
          }}
          btnClassName={(!selectedDate || !selectedTimeSlot) ? 'opacity-50' : ''}
        />
      </View>

      {/* Session Type Selection Bottom Sheet */}
      <CustomBottomSheet
        ref={sessionTypeBottomSheetRef}
        onChange={() => { }}
      >
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
        >
          <View className="px-5 pb-6 pt-4">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="font-InterBold text-[18px] text-slate-800">
                  Select Session Type
                </Text>
                <Text className="font-Inter text-[12px] text-gray-500 mt-1">
                  Choose how you want to connect
                </Text>
              </View>
              <Pressable
                onPress={() => sessionTypeBottomSheetRef.current?.close()}
                className="p-2 rounded-full active:bg-gray-100"
              >
                <Ionicons name="close" size={22} color={COLORS.grey} />
              </Pressable>
            </View>

            {/* Session Type Options */}
            <View className="gap-3">
              {sessionTypes.map((type) => {
                const isSelected = sessionType === type.id
                return (
                  <Pressable
                    key={type.id}
                    onPress={() => {
                      setSessionType(type.id)
                      sessionTypeBottomSheetRef.current?.close()
                    }}
                    className={`rounded-2xl p-4 border-2 ${isSelected
                      ? 'border-themeColor bg-themeColor/10'
                      : 'border-gray-200 bg-white'
                      } active:opacity-70`}
                  >
                    <View className="flex-row items-center gap-4">
                      <View className={`w-12 h-12 rounded-xl items-center justify-center ${isSelected ? 'bg-themeColor' : 'bg-gray-100'
                        }`}>
                        <Ionicons
                          name={type.icon}
                          size={24}
                          color={isSelected ? 'white' : COLORS.grey}
                        />
                      </View>
                      <View className="flex-1">
                        <View className="flex-row items-center gap-2">
                          <Text className={`font-InterSemibold text-[15px] ${isSelected ? 'text-themeColor' : 'text-slate-800'
                            }`}>
                            {type.label}
                          </Text>
                          {isSelected && (
                            <Ionicons name="checkmark-circle" size={18} color={COLORS.themeColor} />
                          )}
                        </View>
                        <Text className="font-Inter text-[12px] text-gray-500 mt-0.5">
                          {type.description}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                )
              })}
            </View>
          </View>
        </BottomSheetScrollView>
      </CustomBottomSheet>
    </View>
  )
}
