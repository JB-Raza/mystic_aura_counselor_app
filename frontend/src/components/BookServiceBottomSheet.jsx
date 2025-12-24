import { useState, memo, useCallback, useMemo } from "react";
import CustomBottomSheet from "./CustomBottomSheet";
import { BottomSheetFlatList, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { COLORS } from "@/constants/theme";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { AvailableBookingSlots } from "@/sampleData";
import { Ionicons } from '@expo/vector-icons';

// Memoized DateSlotItem component to prevent re-renders
const DateSlotItem = memo(({ slot, isSelected, onPress }) => {
  // Memoize date formatting
  const dateInfo = useMemo(() => {
    const day = slot.date.toLocaleDateString("en-US", { weekday: "short" });
    const date = slot.date.getDate();
    const month = slot.date.toLocaleDateString("en-US", { month: "short" });
    return { day, date, month };
  }, [slot.date]);

  return (
    <Pressable
      onPress={onPress}
      className={`w-16 rounded-2xl p-3 items-center mr-3 ${
        isSelected
          ? "bg-themeColor border-themeColor"
          : "bg-white border-gray-200"
      } border`}
    >
      <Text className={`font-InterMedium text-[11px] ${
        isSelected ? "text-white" : "text-gray-500"
      }`}>
        {dateInfo.day}
      </Text>
      <Text className={`font-InterSemibold text-[18px] mt-1 ${
        isSelected ? "text-white" : "text-slate-800"
      }`}>
        {dateInfo.date}
      </Text>
      <Text className={`font-Inter text-[10px] mt-0.5 ${
        isSelected ? "text-white/80" : "text-gray-400"
      }`}>
        {dateInfo.month}
      </Text>
    </Pressable>
  );
});

// Memoized TimeSlotItem component
const TimeSlotItem = memo(({ timeSlot, isSelected, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-xl px-4 py-3 border ${
        isSelected
          ? "border-themeColor bg-themeColor/5"
          : "border-gray-200 bg-white"
      }`}
    >
      <Text className={`font-InterSemibold text-[14px] ${
        isSelected ? "text-themeColor" : "text-slate-700"
      }`}>
        {timeSlot.time}
      </Text>
    </Pressable>
  );
});

// Memoized ServiceInfoCard component
const ServiceInfoCard = memo(({ data }) => {
  return (
    <View className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-200">
      <View className="flex-row items-start gap-3">
        <View className="w-10 h-10 rounded-xl bg-themeColor/10 items-center justify-center">
          <Ionicons name="calendar" size={20} color={COLORS.themeColor} />
        </View>
        <View className="flex-1">
          <Text className="font-InterSemibold text-[15px] text-slate-800">
            {data?.name || "Individual Counseling"}
          </Text>
          <Text className="font-Inter text-[13px] text-gray-600 mt-0.5">
            {data?.tagline || "Mental Wellness • Online Session"}
          </Text>
          <View className="flex-row items-center gap-2 mt-2">
            <View className="flex-row items-center gap-1">
              <Ionicons name="time" size={12} color={COLORS.themeColor} />
              <Text className="font-InterMedium text-[11px] text-slate-700">50 min</Text>
            </View>
            <View className="w-1 h-1 bg-gray-400 rounded-full" />
            <View className="flex-row items-center gap-1">
              <Ionicons name="videocam" size={12} color={COLORS.themeColor} />
              <Text className="font-InterMedium text-[11px] text-slate-700">Video call</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
});

// Memoized SessionDetailsCard component
const SessionDetailsCard = memo(({ formData }) => {
  const sessionDate = useMemo(() => {
    if (!formData.day || !formData.date) return '';
    const month = new Date().toLocaleDateString('en-US', { month: 'short' });
    return `${formData.day}, ${formData.date} ${month} at ${formData.timeSlot}`;
  }, [formData.day, formData.date, formData.timeSlot]);

  if (!formData.timeSlot) return null;

  return (
    <View className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
      <View className="flex-row items-center gap-3">
        <Ionicons name="information-circle" size={20} color={COLORS.themeColor} />
        <View className="flex-1">
          <Text className="font-InterSemibold text-[14px] text-slate-800">
            Session Confirmed
          </Text>
          <Text className="font-Inter text-[13px] text-gray-600 mt-0.5">
            {sessionDate}
          </Text>
        </View>
      </View>
    </View>
  );
});

const BookServiceBottomSheet = ({ ref, onChange, data, navigateTo }) => {
  const [timeSlots, setTimeSlots] = useState(null);
  const [bookServiceFormData, setBookServiceFormData] = useState({
    service: "",
    date: "",
    day: "",
    timeSlot: "",
  });

  // Memoize available time slots to avoid re-filtering on every render
  const availableTimeSlots = useMemo(() => {
    return (timeSlots || []).filter(timeSlot => timeSlot.isBooked === false);
  }, [timeSlots]);

  // Memoize date slot selection handler
  const handleDateSelect = useCallback((slot) => {
    const day = slot.date.toLocaleDateString("en-US", { weekday: "short" });
    const date = slot.date.getDate();
    
    setTimeSlots(slot.timeSlots);
    setBookServiceFormData(prev => ({
      ...prev,
      day,
      date,
      timeSlot: slot.timeSlots[0]?.time || "",
    }));
  }, []);

  // Memoize time slot selection handler
  const handleTimeSlotSelect = useCallback((time) => {
    setBookServiceFormData(prev => ({ ...prev, timeSlot: time }));
  }, []);

  // Memoize confirm button handler
  const handleConfirm = useCallback(() => {
    if (bookServiceFormData?.timeSlot) {
      navigateTo("ConfirmBooking");
    }
  }, [bookServiceFormData?.timeSlot, navigateTo]);

  // Memoize renderItem for date slots
  const renderDateSlot = useCallback(({ item: slot, index }) => {
    const day = slot.date.toLocaleDateString("en-US", { weekday: "short" });
    const date = slot.date.getDate();
    const isSelected = day === bookServiceFormData.day && date === bookServiceFormData.date;

    return (
      <DateSlotItem
        slot={slot}
        isSelected={isSelected}
        onPress={() => handleDateSelect(slot)}
      />
    );
  }, [bookServiceFormData.day, bookServiceFormData.date, handleDateSelect]);

  // Memoize key extractor
  const keyExtractor = useCallback((item, index) => {
    return item.date?.getTime()?.toString() || `date-${index}`;
  }, []);

  return (
    <CustomBottomSheet
      ref={ref}
      onChange={onChange}
      snapPoints={['50%', '85%']}
    >
      <View className="flex-1">
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
        >
          <View className="px-5 pb-6">
            {/* Header */}
            <View className="items-center mb-6">
              <Text className="font-InterSemibold text-[18px] text-slate-800 text-center">
                Book Your Session
              </Text>
              <Text className="font-Inter text-[13px] text-gray-500 text-center mt-1">
                Select your preferred date and time
              </Text>
            </View>

            {/* Service Info Card */}
            <ServiceInfoCard data={data} />

            {/* Available Days */}
            <View className="mb-6">
              <Text className="font-InterSemibold text-[16px] text-slate-800 mb-3">
                Select Date
              </Text>
              <BottomSheetFlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={AvailableBookingSlots}
                keyExtractor={keyExtractor}
                contentContainerStyle={{ paddingRight: 20 }}
                renderItem={renderDateSlot}
                removeClippedSubviews={true}
                maxToRenderPerBatch={5}
                windowSize={5}
                initialNumToRender={5}
              />
            </View>

            {/* Time Slots */}
            {bookServiceFormData.date && (
              <View className="mb-6">
                <Text className="font-InterSemibold text-[16px] text-slate-800 mb-3">
                  Available Times
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {availableTimeSlots.map((timeSlot) => (
                    <TimeSlotItem
                      key={timeSlot.time}
                      timeSlot={timeSlot}
                      isSelected={bookServiceFormData.timeSlot === timeSlot.time}
                      onPress={() => handleTimeSlotSelect(timeSlot.time)}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* Session Details */}
            <SessionDetailsCard formData={bookServiceFormData} />
          </View>
        </BottomSheetScrollView>

        {/* Confirm Button */}
        <View className="bg-white border-t border-gray-200 px-5 py-4 shadow-lg">
          <TouchableOpacity
            onPress={handleConfirm}
            disabled={!bookServiceFormData?.timeSlot}
            className={`w-full rounded-2xl py-4 px-5 items-center justify-center bg-themeColor shadow-lg disabled:bg-gray-300 shadow-themeColor/25 disabled:shadow-none`}
          >
            <Text className="font-InterSemibold text-[16px] text-white text-center">
              {bookServiceFormData?.timeSlot ? "Confirm Booking" : "Select Time Slot"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </CustomBottomSheet>
  );
}

export default memo(BookServiceBottomSheet);
