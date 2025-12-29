import { useState, useEffect, useCallback, useMemo, memo, useRef } from "react";
import CustomBottomSheet from "./CustomBottomSheet";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { COLORS } from "@/constants/theme";
import { Pressable, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Toast } from 'toastify-react-native';
import { useConfirmationAlert } from '@/state/confirmationContext';

// Move constants outside component
const ALL_AVAILABLE_INTERESTS = [
    'Career Growth',
    'Relationships',
    'Self Development',
    'Stress Management',
    'Anxiety',
    'Motivation',
    'Depression',
    'Trauma',
    'Addiction',
    'Family Issues',
    'Grief & Loss',
    'Anger Management',
    'Sleep Issues',
    'Eating Disorders',
    'LGBTQ+ Support',
    'Work-Life Balance',
    'Confidence Building',
    'Life Transitions',
    'Parenting',
    'Marriage Counseling',
];

// Memoized InterestItem component with display name
const InterestItem = memo(({ interest, isSelected, onToggle }) => {
    const shadowStyle = useMemo(() => ({
        shadowColor: isSelected ? COLORS.themeColor : '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isSelected ? 0.2 : 0.05,
        shadowRadius: 4,
        elevation: isSelected ? 3 : 1,
    }), [isSelected]);

    return (
        <Pressable
            onPress={onToggle}
            className={`rounded-full px-4 py-2.5 flex-row items-center gap-2 border ${isSelected
                ? 'bg-themeColor border-themeColor'
                : 'bg-white border-gray-200'
                } active:opacity-70`}
            style={shadowStyle}
        >
            {isSelected && (
                <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color="white"
                />
            )}
            <Text
                className={`font-InterSemibold text-[13px] ${isSelected ? 'text-white' : 'text-slate-700'
                    }`}
            >
                {interest}
            </Text>
        </Pressable>
    );
}, (prevProps, nextProps) => {
    // Custom comparison function for better performance
    return prevProps.interest === nextProps.interest &&
           prevProps.isSelected === nextProps.isSelected &&
           prevProps.onToggle === nextProps.onToggle;
});

InterestItem.displayName = 'InterestItem';


// Memoized static content components
const HeaderSection = memo(() => (
    <View className="flex-row justify-between items-center mb-6">
        <View className="flex-row items-center gap-3 flex-1">
            <View className="bg-themeColor/10 p-2.5 rounded-xl">
                <Ionicons name="heart" size={20} color={COLORS.themeColor} />
            </View>
            <View className="flex-1">
                <Text className="font-InterBold text-slate-800 text-[18px]">
                    Edit Interests
                </Text>
                <Text className="font-Inter text-gray-500 text-[12px] mt-0.5">
                    Select topics you're interested in
                </Text>
            </View>
        </View>
    </View>
));
HeaderSection.displayName = 'HeaderSection';

const InfoSection = memo(() => (
    <View className="bg-blue-50 rounded-2xl p-4 border border-blue-200 mt-2">
        <View className="flex-row items-start gap-3">
            <Ionicons name="information-circle" size={18} color={COLORS.themeColor} />
            <View className="flex-1">
                <Text className="font-InterSemibold text-slate-800 text-[13px] mb-1">
                    Why select interests?
                </Text>
                <Text className="font-Inter text-gray-600 text-[12px] leading-4">
                    Your interests help us personalize your experience, recommend relevant counselors, and show you content that matches your wellness goals.
                </Text>
            </View>
        </View>
    </View>
));
InfoSection.displayName = 'InfoSection';

const EditInterestsBottomSheet = ({ ref, onChange, currentInterests = [], onSave }) => {
    // Local state for managing selected interests
    const [selectedInterests, setSelectedInterests] = useState([]);
    
    // Use ref to track if component is mounted to prevent state updates after unmount
    const isMountedRef = useRef(true);

    const { showConfirmation, hideConfirmation } = useConfirmationAlert();
    
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    // Initialize with current interests when bottom sheet opens or currentInterests changes
    useEffect(() => {
        if (!isMountedRef.current) return;
        
        // Use functional update to ensure we get the latest currentInterests
        setSelectedInterests(prev => {
            const current = Array.isArray(currentInterests) && currentInterests.length > 0 
                ? [...currentInterests] 
                : [];
            
            // Only update if different to prevent unnecessary re-renders
            if (prev.length !== current.length || 
                prev.some((item, idx) => item !== current[idx])) {
                return current;
            }
            return prev;
        });
    }, [currentInterests]);

    // Memoize toggleInterest handler - optimized with Set for O(1) lookup
    const toggleInterest = useCallback((interest) => {
        setSelectedInterests(prev => {
            const prevSet = new Set(prev);
            if (prevSet.has(interest)) {
                return prev.filter(item => item !== interest);
            } else {
                return [...prev, interest];
            }
        });
    }, []);

    // Create a memoized map of toggle handlers to prevent creating new functions on each render
    const toggleHandlers = useMemo(() => {
        const handlers = {};
        ALL_AVAILABLE_INTERESTS.forEach(interest => {
            handlers[interest] = () => toggleInterest(interest);
        });
        return handlers;
    }, [toggleInterest]);

    // Memoize handleSave
    const handleSave = useCallback(() => {
        if (!isMountedRef.current) return;
        
        if (onSave) {
            onSave(selectedInterests);
        }

        const count = selectedInterests.length;
        Toast.show({
            type: "success",
            text2: `${count} interest${count !== 1 ? 's' : ''} selected`,
        });

        if (ref?.current) {
            ref.current.close();
        }
    }, [selectedInterests, onSave, ref]);

    // Memoize handleCancel
    const handleCancel = useCallback(() => {
        if (!isMountedRef.current) return;
        
        const resetInterests = Array.isArray(currentInterests) && currentInterests.length > 0
            ? [...currentInterests]
            : [];
        setSelectedInterests(resetInterests);

        if (ref?.current) {
            ref.current.close();
        }
    }, [currentInterests, ref]);

    // Memoize handleClearAll
    const handleClearAll = useCallback(() => {
        showConfirmation({
            title: "Clear All Interests",
            message: "Are you sure! You want to clear all selected interests?",
            onConfirm: () => {
                setSelectedInterests([]);
                hideConfirmation();
            },
            onCancel: () => {
                hideConfirmation();
            },
            confirmText: "Clear All",
            cancelText: "Cancel",
            type: "warning"
        });
    }, [showConfirmation, hideConfirmation]);

    // Memoize selected count text
    const selectedCountText = useMemo(() => 
        `${selectedInterests.length} Selected`,
        [selectedInterests.length]
    );

    // Memoize save button disabled state
    const isSaveDisabled = useMemo(() => 
        selectedInterests.length === 0,
        [selectedInterests.length]
    );

    return (
        <CustomBottomSheet
            ref={ref}
            onChange={onChange}
            snapPoints={['60%', '85%']}
        >
            <View className="flex-1">
                <BottomSheetScrollView
                    showsVerticalScrollIndicator={false}
                    className="flex-1"
                >
                    <View className="px-5 pb-6 pt-4">
                        {/* Header Section */}
                        <View className="flex-row justify-between items-center mb-6">
                            <HeaderSection />
                            <Pressable
                                onPress={handleCancel}
                                className="p-2 rounded-full active:bg-gray-100"
                            >
                                <Ionicons name="close" size={22} color={COLORS.grey} />
                            </Pressable>
                        </View>

                        {/* Selected Count Badge */}
                        <View className="bg-themeColor/10 rounded-2xl p-4 mb-6 border border-themeColor/20">
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center gap-2">
                                    <Ionicons name="checkmark-circle" size={18} color={COLORS.themeColor} />
                                    <Text className="font-InterSemibold text-slate-800 text-[14px]">
                                        {selectedCountText}
                                    </Text>
                                </View>
                                {selectedInterests.length > 0 && (
                                    <Pressable
                                        onPress={handleClearAll}
                                        className="bg-white rounded-full px-3 py-1.5 border border-gray-200 active:bg-gray-50"
                                    >
                                        <Text className="font-InterMedium text-gray-600 text-[12px]">
                                            Clear All
                                        </Text>
                                    </Pressable>
                                )}
                            </View>
                        </View>

                        {/* Instructions */}
                        <View className="mb-6">
                            <Text className="font-InterMedium text-slate-700 text-[13px] leading-5">
                                Choose the topics that matter to you. This helps us recommend the right counselors and content for your wellness journey.
                            </Text>
                        </View>

                        {/* Interests Grid */}
                        <View className="mb-4">
                            <Text className="font-InterSemibold text-slate-800 text-[16px] mb-4">
                                Available Interests
                            </Text>
                            <View className="flex-row flex-wrap gap-3">
                                {ALL_AVAILABLE_INTERESTS.map((interest) => {
                                    const isSelected = selectedInterests.includes(interest);
                                    return (
                                        <InterestItem
                                            key={interest}
                                            interest={interest}
                                            isSelected={isSelected}
                                            onToggle={toggleHandlers[interest]}
                                        />
                                    );
                                })}
                            </View>
                        </View>

                        {/* Info Section */}
                        <InfoSection />
                    </View>
                </BottomSheetScrollView>

                {/* Fixed Action Buttons */}
                <View className="bg-white border-t border-gray-200 px-5 py-4 shadow-lg">
                    <View className="flex-row gap-3">
                        {/* Cancel Button */}
                        <Pressable
                            onPress={handleCancel}
                            className="flex-1 border-2 border-gray-300 rounded-xl py-3.5 items-center active:bg-gray-50"
                        >
                            <Text className="text-gray-700 font-InterSemibold text-center text-[14px]">
                                Cancel
                            </Text>
                        </Pressable>

                        {/* Save Button */}
                        <TouchableOpacity
                            onPress={handleSave}
                            disabled={isSaveDisabled}
                            className={`flex-1 rounded-xl py-3.5 items-center justify-center ${!isSaveDisabled
                                ? 'bg-themeColor'
                                : 'bg-gray-300'
                                }`}
                            style={{
                                shadowColor: !isSaveDisabled ? COLORS.themeColor : '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: !isSaveDisabled ? 0.2 : 0,
                                shadowRadius: 4,
                                elevation: !isSaveDisabled ? 3 : 0,
                            }}
                        >
                            <View className="flex-row items-center gap-2">
                                <Ionicons
                                    name="checkmark-circle"
                                    size={18}
                                    color="white"
                                />
                                <Text className="text-white font-InterSemibold text-center text-[14px]">
                                    Save Changes
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </CustomBottomSheet>
    );
};

// Export memoized component
const MemoizedComponent = memo(EditInterestsBottomSheet);
MemoizedComponent.displayName = 'EditInterestsBottomSheet';

export default MemoizedComponent;
