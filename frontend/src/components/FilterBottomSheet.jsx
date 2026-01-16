import CustomBottomSheet from '@/components/CustomBottomSheet';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { View, Text, Pressable, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { memo } from 'react';

const FilterBottomSheet = memo(({ sheetRef, filter, setFilter }) => {
  // handleResetFilters
  const handleResetFilters = () => {
    setFilter(null);
    sheetRef.current?.close();
  };

  return (
    <CustomBottomSheet ref={sheetRef}>
      <BottomSheetView className="px-5 pb-6 pt-1">
        {/* Header */}
        <View className="mb-6 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="rounded-xl bg-themeColor/10 p-2.5">
              <Ionicons name="filter" size={20} color={COLORS.themeColor} />
            </View>
            <View>
              <Text className="font-InterBold text-[18px] text-slate-800">Filter Options</Text>
              <Text className="mt-0.5 font-Inter text-[12px] text-gray-500">
                Refine your search
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => sheetRef.current.close()}
            className="rounded-full p-2 active:bg-gray-100">
            <Ionicons name="close" size={22} color={COLORS.grey} />
          </Pressable>
        </View>

        {/* Price Filter */}
        <View className="mb-6">
          <Text className="mb-3 font-InterSemibold text-[15px] text-slate-800">Price Range</Text>
          <View className="flex-row gap-2.5">
            {priceOptions.map((option) => (
              <PriceOptionItem
                key={option.value}
                option={option}
                isSelected={filter?.priceFilter === option.value}
                onPress={() => setFilter((prev) => ({ ...prev, priceFilter: option.value }))}
              />
            ))}
          </View>
        </View>

        {/* Rating Filter */}
        <View className="mb-6">
          <Text className="mb-3 font-InterSemibold text-[15px] text-slate-800">Minimum Rating</Text>
          <View className="rounded-xl bg-gray-50 px-4 py-3.5">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-1.5">
                {STARS.map((star) => (
                  <StarRatingItem
                    key={star}
                    star={star}
                    isSelected={(filter?.rating || 1) >= star}
                    onPress={() => setFilter((prev) => ({ ...prev, rating: star }))}
                  />
                ))}
              </View>
              <View className="rounded-lg border border-gray-200 bg-white px-3 py-1.5">
                <Text className="font-InterSemibold text-[12px] text-slate-700">
                  {filter?.rating || 1 + " Star's"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Availability Filter */}
        <View className="mb-6">
          <Text className="mb-3 font-InterSemibold text-[15px] text-slate-800">Availability</Text>
          <View className="rounded-xl bg-gray-50 px-4 py-3.5">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <Ionicons name="wifi" size={18} color="#10B981" />
                </View>
                <View className="flex-1">
                  <Text className="font-InterSemibold text-[14px] text-slate-700">Online Now</Text>
                  <Text className="mt-0.5 font-Inter text-[11px] text-gray-500">
                    Currently available
                  </Text>
                </View>
                <Switch
                  value={filter?.online || false}
                  onValueChange={() => setFilter((prev) => ({ ...prev, online: !filter.online }))}
                  thumbColor="#FFFFFF"
                  trackColor={{ false: '#D1D5DB', true: COLORS.themeColor }}
                  ios_backgroundColor="#D1D5DB"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="mt-2 flex-row gap-3">
          <Pressable
            onPress={handleResetFilters}
            className="flex-1 rounded-xl border-2 border-gray-300 py-3.5 active:bg-gray-50">
            <Text className="text-center font-InterSemibold text-[14px] text-gray-700">
              Reset All
            </Text>
          </Pressable>
          <Pressable
            onPress={() => sheetRef.current?.close()}
            className="flex-1 rounded-xl bg-themeColor py-3.5 active:opacity-90"
            style={{
              shadowColor: COLORS.themeColor,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
            }}>
            <Text className="text-center font-InterSemibold text-[14px] text-white">
              Apply Filters
            </Text>
          </Pressable>
        </View>
      </BottomSheetView>
    </CustomBottomSheet>
  );
});

FilterBottomSheet.displayName = 'FilterBottomSheet';

export default FilterBottomSheet;

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

PriceOptionItem.displayName = 'PriceOptionItem';
StarRatingItem.displayName = 'StarRatingItem';

const categories = [
  { id: 'cat_1', name: 'Anxiety', icon: 'heart' },
  { id: 'cat_2', name: 'Stress', icon: 'fitness' },
  { id: 'cat_3', name: 'Career', icon: 'briefcase' },
  { id: 'cat_4', name: 'Relationships', icon: 'people' },
  { id: 'cat_5', name: 'Motivation', icon: 'rocket' },
  { id: 'cat_6', name: 'Self Growth', icon: 'trending-up' },
];

const priceOptions = [
  { label: 'Low to High', value: 'low_to_high' },
  { label: 'High to Low', value: 'high_to_low' },
];

const STARS = [1, 2, 3, 4, 5];
