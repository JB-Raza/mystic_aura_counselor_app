import { View, Text, Image, ScrollView, Alert } from 'react-native'
import React, { useState, useCallback, useMemo, memo } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS } from '@/constants/theme'
import { ButtonFullWidth, InputBox, RadioButton } from '@/components'
import { IMAGES } from '@/constants/images'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Toast } from 'toastify-react-native'

// Memoized ErrorMessage component
const ErrorMessage = memo(({ error }) => {
    if (!error) return null;
    return (
        <View className='flex-row items-center gap-1.5 mt-1.5'>
            <Ionicons name="alert-circle" size={14} color="#EF4444" />
            <Text className='font-Inter text-[11px] text-red-500'>{error}</Text>
        </View>
    );
});

// Memoized PriceRow component
const PriceRow = memo(({ label, amount, isTotal = false }) => (
    <View className={`flex-row justify-between items-center ${isTotal ? 'pt-4 mt-2 border-t-2 border-gray-200' : 'py-2'}`}>
        <Text className={`font-Inter${isTotal ? 'Bold' : ''} ${isTotal ? 'text-[16px] text-slate-800' : 'text-[14px] text-gray-600'}`}>
            {label}
        </Text>
        <View className='flex-row items-center gap-1.5'>
            {IMAGES?.Coin_Icon && (
                <Image source={IMAGES.Coin_Icon} className={isTotal ? 'w-6 h-6' : 'w-5 h-5'} />
            )}
            <Text className={`font-InterSemibold ${isTotal ? 'text-[18px] text-themeColor' : 'text-[14px] text-slate-800'}`}>
                {amount}
            </Text>
        </View>
    </View>
));

export default function ConfirmBooking() {
    const navigation = useNavigation()
    const route = useRoute()

    // Get booking data from route params with fallback
    const bookingData = route?.params || {}

    const [formData, setFormData] = useState({
        name: bookingData.name || "",
        contact: bookingData.contact || "",
        gender: bookingData.gender || ""
    })
    const [formErrors, setFormErrors] = useState({})
    const [confirmBookingLoading, setConfirmBookingLoading] = useState(false)

    // Memoize computed values
    const slotFee = useMemo(() => bookingData.slotFee || 30, [bookingData.slotFee])
    const platformFee = useMemo(() => bookingData.platformFee || 4, [bookingData.platformFee])
    const totalAmount = useMemo(() => slotFee + platformFee, [slotFee, platformFee])
    const ratePerMin = useMemo(() => bookingData.ratePerMin || 30, [bookingData.ratePerMin])

    // Memoize shadow style
    const cardShadowStyle = useMemo(() => ({
        shadowColor: COLORS.themeColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    }), []);

    // Memoize LinearGradient props
    const gradientColors = useMemo(() => [COLORS.themeColor, '#7A72FF'], []);
    const gradientStart = useMemo(() => ({ x: 0, y: 0 }), []);
    const gradientEnd = useMemo(() => ({ x: 1, y: 0 }), []);

    // Memoize contentContainerStyle
    const scrollViewContentStyle = useMemo(() => ({ paddingBottom: 24 }), []);

    // Memoize session details text
    const sessionDetailsText = useMemo(() =>
        `${bookingData.date || 'Today'}, ${bookingData.time || '3:00 PM'} • ${bookingData.duration || '50 min'} • ${bookingData.type || 'Video Call'}`,
        [bookingData.date, bookingData.time, bookingData.duration, bookingData.type]
    );

    // Validate form fields
    const validateForm = useCallback(() => {
        const errors = {}

        if (!formData.name || formData.name.trim().length < 2) {
            errors.name = 'Please enter a valid name (at least 2 characters)'
        }

        if (!formData.contact || formData.contact.trim().length < 10) {
            errors.contact = 'Please enter a valid contact number'
        }

        if (!formData.gender) {
            errors.gender = 'Please select your gender'
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }, [formData.name, formData.contact, formData.gender])

    // Memoize form field handlers
    const handleNameChange = useCallback((text) => {
        setFormData(prev => ({ ...prev, name: text }))
        if (formErrors.name) {
            setFormErrors(prev => ({ ...prev, name: null }))
        }
    }, [formErrors.name])

    const handleContactChange = useCallback((text) => {
        setFormData(prev => ({ ...prev, contact: text }))
        if (formErrors.contact) {
            setFormErrors(prev => ({ ...prev, contact: null }))
        }
    }, [formErrors.contact])

    const handleGenderSelect = useCallback((gender) => {
        setFormData(prev => ({ ...prev, gender }))
        if (formErrors.gender) {
            setFormErrors(prev => ({ ...prev, gender: null }))
        }
    }, [formErrors.gender])

    const handleConfirmBooking = useCallback(async () => {
        try {
            // Validate form
            if (!validateForm()) {
                Toast.show({
                    type: "error",
                    text2: 'Please fill in all required fields correctly.'
                })
                return
            }

            // Step 1: Confirmation dialog using React Native Alert
            const isConfirmed = await new Promise((resolve) => {
                Alert.alert(
                    'Confirm Booking',
                    'Are you sure you want to book this counseling session?',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                            onPress: () => resolve(false)
                        },
                        {
                            text: 'Yes, Book Now',
                            onPress: () => resolve(true),
                            style: 'default'
                        }
                    ],
                    { cancelable: true, onDismiss: () => resolve(false) }
                )
            })

            if (!isConfirmed) return

            // Step 2: Process booking
            setConfirmBookingLoading(true)

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500))

            // Step 3: Success message using flash alert
            Toast.show({
                type: "success",
                text2: 'Your session has been scheduled successfully. You will receive a confirmation email shortly.',
            })

            // Navigate back after a short delay to show the success message
            setTimeout(() => {
                navigation.goBack()
            }, 500)

        } catch (err) {
            console.error('Booking error:', err)
            Toast.show({
                type: "error",
                text2: err?.message || 'Sorry, we could not process your booking. Please try again.'
            })
        } finally {
            setConfirmBookingLoading(false)
        }
    }, [validateForm, navigation])

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView
                className='flex-1'
                showsVerticalScrollIndicator={false}
                contentContainerStyle={scrollViewContentStyle}
            >
                <View className='px-4 pt-4 gap-4'>
                    {/* Personal Details Card */}
                    <View className='bg-white rounded-2xl shadow-sm px-5 py-5 border border-gray-100'
                        style={cardShadowStyle}
                    >
                        {/* Header */}
                        <View className='flex-row items-center gap-3 mb-5'>
                            <View className='w-10 h-10 rounded-xl bg-themeColor/10 items-center justify-center'>
                                <Ionicons name="person" size={20} color={COLORS.themeColor} />
                            </View>
                            <View className='flex-1'>
                                <Text className='font-InterBold text-[17px] text-slate-800'>Personal Details</Text>
                                <Text className='font-Inter text-[12px] text-gray-500 mt-0.5'>
                                    Shared with your counselor
                                </Text>
                            </View>
                        </View>

                        {/* Form Fields */}
                        <View className='gap-4'>
                            {/* Name Field */}
                            <View>
                                <InputBox
                                    parentClassName="mb-1"
                                    label="Patient's Name"
                                    placeholder='Enter full name'
                                    placeholderTextColor="#9CA3AF"
                                    value={formData.name}
                                    onChangeText={handleNameChange}
                                />
                                <ErrorMessage error={formErrors.name} />
                            </View>

                            {/* Phone Field */}
                            <View>
                                <InputBox
                                    label='Contact Number'
                                    parentClassName="mb-1"
                                    keyboardType='phone-pad'
                                    placeholder='Enter phone number'
                                    placeholderTextColor="#9CA3AF"
                                    value={formData.contact}
                                    onChangeText={handleContactChange}
                                />
                                <ErrorMessage error={formErrors.contact} />
                            </View>

                            {/* Gender Selection */}
                            <View>
                                <Text className='font-InterSemibold text-[14px] text-slate-700 mb-3'>
                                    Gender
                                </Text>
                                <View className='flex-row gap-3'>
                                    <View className='flex-1'>
                                        <RadioButton
                                            label="Male"
                                            selected={formData.gender === "male"}
                                            onPress={() => handleGenderSelect("male")}
                                        />
                                    </View>
                                    <View className='flex-1'>
                                        <RadioButton
                                            label="Female"
                                            selected={formData.gender === "female"}
                                            onPress={() => handleGenderSelect("female")}
                                        />
                                    </View>
                                </View>
                                <ErrorMessage error={formErrors.gender} />
                            </View>
                        </View>
                    </View>

                    {/* Payment Summary Card */}
                    <View className='bg-white rounded-2xl shadow-sm px-5 py-5 border border-gray-100'
                        style={cardShadowStyle}
                    >
                        {/* Header */}
                        <View className='flex-row items-center gap-3 mb-5'>
                            <View className='w-10 h-10 rounded-xl bg-themeColor/10 items-center justify-center'>
                                <Ionicons name="card" size={20} color={COLORS.themeColor} />
                            </View>
                            <View className='flex-1'>
                                <Text className='font-InterBold text-[17px] text-slate-800'>Payment Summary</Text>
                                <Text className='font-Inter text-[12px] text-gray-500 mt-0.5'>
                                    Secure payment to confirm your slot
                                </Text>
                            </View>
                        </View>

                        {/* Price Breakdown */}
                        <View className='gap-3 mb-5'>
                            <PriceRow label="Slot Booking Fee" amount={slotFee} />
                            <PriceRow label="Platform Fee" amount={platformFee} />
                            <PriceRow label="Total Amount" amount={totalAmount} isTotal />

                            <View className='bg-amber-50 rounded-xl px-3 py-2.5 mt-2 border border-amber-200'>
                                <View className='flex-row items-center gap-2'>
                                    <Ionicons name="information-circle" size={16} color="#F59E0B" />
                                    <Text className='font-Inter text-[12px] text-amber-800 flex-1'>
                                        Once joined, {ratePerMin} coins/min will be charged
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Security Note */}
                        <View className='flex-row items-center gap-2.5 bg-green-50 rounded-xl px-3 py-2.5 mb-5 border border-green-200'>
                            <Ionicons name="shield-checkmark" size={18} color="#10B981" />
                            <Text className='font-Inter text-[12px] text-green-800 flex-1'>
                                Your payment is secure and encrypted
                            </Text>
                        </View>

                        {/* Confirm Button */}
                        <LinearGradient
                            colors={gradientColors}
                            start={gradientStart}
                            end={gradientEnd}
                            className='rounded-xl overflow-hidden'
                        >
                            <ButtonFullWidth
                                text={confirmBookingLoading ? "Processing..." : "Confirm & Pay Now"}
                                icon={confirmBookingLoading ? null : "lock-closed"}
                                btnClassName="bg-transparent"
                                iconColor="white"
                                textClassName="text-white font-InterSemibold text-[15px]"
                                onPress={handleConfirmBooking}
                                loading={confirmBookingLoading}
                                disabled={confirmBookingLoading}
                            />
                        </LinearGradient>
                    </View>

                    {/* Session Details Card */}
                    <View className='bg-white rounded-2xl shadow-sm px-5 py-4 border border-gray-100'
                        style={cardShadowStyle}
                    >
                        <View className='flex-row items-center gap-3'>
                            <View className='w-10 h-10 rounded-xl bg-blue-50 items-center justify-center'>
                                <Ionicons name="calendar" size={20} color={COLORS.themeColor} />
                            </View>
                            <View className='flex-1'>
                                <Text className='font-InterSemibold text-[15px] text-slate-800 mb-1'>
                                    Session Details
                                </Text>
                                <Text className='font-Inter text-[13px] text-gray-600'>
                                    {sessionDetailsText}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Support Info */}
                    <View className='bg-themeColor/5 rounded-xl px-4 py-4 border border-themeColor/20'>
                        <View className='flex-row items-start gap-3'>
                            <View className='w-8 h-8 rounded-lg bg-themeColor/10 items-center justify-center mt-0.5'>
                                <Ionicons name="help-circle" size={18} color={COLORS.themeColor} />
                            </View>
                            <View className='flex-1'>
                                <Text className='font-InterSemibold text-[14px] text-slate-800 mb-1'>
                                    Need assistance?
                                </Text>
                                <Text className='font-Inter text-[12px] text-gray-600'>
                                    Contact support: support@mysticaura.com
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}
