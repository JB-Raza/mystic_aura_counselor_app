import { View, Text, Pressable, Image, TextInput, Switch, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS } from '@/constants/theme'
import { useNavigation } from '@react-navigation/native'
import { IMAGES } from '@/constants/images'
import { Controller, useForm } from 'react-hook-form'

export default function EditProfile() {
    const { control, handleSubmit, formState: { errors } } = useForm()
    const [enableNotification, setEnableNotification] = useState(false)
    const [enableSMS, setEnableSMS] = useState(true)
    const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false })
    const navigation = useNavigation()

    const onSumbit = (data) => {
        console.log("data - ", data)
        // Handle form submission
    }

    return (
        <View className='flex-1 bg-gray-50'>
            <ScrollView
                showsVerticalScrollIndicator={false}
                className='flex-1'
                contentContainerStyle={{ paddingBottom: 20 }}
            >
                <View className='px-4 pt-4 gap-4'>
                    {/* Enhanced Profile Photo Section */}
                    <View className='items-center mb-4'>
                        <View className='relative mb-3'>
                            <Image
                                source={IMAGES.ProfileAvatar}
                                className='w-28 h-28 rounded-2xl'
                            />
                            <Pressable
                                className='absolute -bottom-1 -right-1 w-10 h-10 bg-themeColor rounded-xl items-center justify-center active:opacity-80'
                                style={{
                                    shadowColor: COLORS.themeColor,
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 4,
                                    elevation: 3,
                                }}
                            >
                                <Ionicons name='camera' size={18} color="white" />
                            </Pressable>
                        </View>
                        <Text className='font-InterBold text-[19px] text-slate-800'>John Doe</Text>
                        <Text className='font-Inter text-[13px] text-gray-500 mt-1'>Premium Member</Text>
                    </View>

                    {/* Personal Information Card */}
                    <View className='bg-white rounded-2xl p-5 border border-gray-100'
                        style={{
                            shadowColor: COLORS.themeColor,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.08,
                            shadowRadius: 8,
                            elevation: 3,
                        }}
                    >
                        <View className='flex-row items-center gap-3 mb-5'>
                            <View className='w-10 h-10 rounded-xl bg-themeColor/10 items-center justify-center'>
                                <Ionicons name="person" size={20} color={COLORS.themeColor} />
                            </View>
                            <View>
                                <Text className='font-InterBold text-[17px] text-slate-800'>Personal Information</Text>
                                <Text className='font-Inter text-[12px] text-gray-500 mt-0.5'>Update your details</Text>
                            </View>
                        </View>

                        <View className='gap-4'>
                            {/* Name Field */}
                            <View>
                                <Text className='font-InterSemibold text-[14px] text-slate-700 mb-2'>Full Name</Text>
                                <Controller
                                    name='name'
                                    control={control}
                                    rules={{ required: 'Name is required' }}
                                    render={({ field: { onChange, value } }) => (
                                        <View>
                                            <TextInput
                                                value={value || "John Doe"}
                                                placeholder="Enter your full name"
                                                placeholderTextColor="#9CA3AF"
                                                onChangeText={onChange}
                                                className='bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 font-Inter text-[15px] text-slate-800'
                                            />
                                            {errors.name && (
                                                <Text className='font-Inter text-[11px] text-red-500 mt-1.5'>{errors.name.message}</Text>
                                            )}
                                        </View>
                                    )}
                                />
                            </View>

                            {/* Email Field */}
                            <View>
                                <Text className='font-InterSemibold text-[14px] text-slate-700 mb-2'>Email Address</Text>
                                <Controller
                                    name='email'
                                    control={control}
                                    rules={{ 
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address'
                                        }
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <View>
                                            <TextInput
                                                value={value || "john@gmail.com"}
                                                keyboardType='email-address'
                                                autoCapitalize='none'
                                                placeholder="Enter your email"
                                                placeholderTextColor="#9CA3AF"
                                                onChangeText={onChange}
                                                className='bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 font-Inter text-[15px] text-slate-800'
                                            />
                                            {errors.email && (
                                                <Text className='font-Inter text-[11px] text-red-500 mt-1.5'>{errors.email.message}</Text>
                                            )}
                                        </View>
                                    )}
                                />
                            </View>

                            {/* Phone Field */}
                            <View>
                                <Text className='font-InterSemibold text-[14px] text-slate-700 mb-2'>Phone Number</Text>
                                <Controller
                                    name='phone'
                                    control={control}
                                    rules={{ required: 'Phone number is required' }}
                                    render={({ field: { onChange, value } }) => (
                                        <View>
                                            <TextInput
                                                value={value || "+1 (555) 123-4567"}
                                                keyboardType='phone-pad'
                                                placeholder="Enter your phone number"
                                                placeholderTextColor="#9CA3AF"
                                                onChangeText={onChange}
                                                className='bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 font-Inter text-[15px] text-slate-800'
                                            />
                                            {errors.phone && (
                                                <Text className='font-Inter text-[11px] text-red-500 mt-1.5'>{errors.phone.message}</Text>
                                            )}
                                        </View>
                                    )}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Security Card */}
                    <View className='bg-white rounded-2xl p-5 border border-gray-100'
                        style={{
                            shadowColor: COLORS.themeColor,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.08,
                            shadowRadius: 8,
                            elevation: 3,
                        }}
                    >
                        <View className='flex-row items-center gap-3 mb-5'>
                            <View className='w-10 h-10 rounded-xl bg-themeColor/10 items-center justify-center'>
                                <Ionicons name="lock-closed" size={20} color={COLORS.themeColor} />
                            </View>
                            <View>
                                <Text className='font-InterBold text-[17px] text-slate-800'>Security</Text>
                                <Text className='font-Inter text-[12px] text-gray-500 mt-0.5'>Change your password</Text>
                            </View>
                        </View>

                        <View className='gap-4'>
                            {/* Current Password */}
                            <View>
                                <Text className='font-InterSemibold text-[14px] text-slate-700 mb-2'>Current Password</Text>
                                <Controller
                                    name='currentPassword'
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <View className='relative'>
                                            <TextInput
                                                value={value}
                                                placeholder="Enter current password"
                                                placeholderTextColor="#9CA3AF"
                                                secureTextEntry={!showPassword.current}
                                                onChangeText={onChange}
                                                className='bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 pr-12 font-Inter text-[15px] text-slate-800'
                                            />
                                            <Pressable
                                                onPress={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                                                className='absolute right-3 top-3.5'
                                            >
                                                <Ionicons 
                                                    name={showPassword.current ? 'eye-off' : 'eye'} 
                                                    size={20} 
                                                    color={COLORS.grey} 
                                                />
                                            </Pressable>
                                        </View>
                                    )}
                                />
                            </View>

                            {/* New Password */}
                            <View>
                                <Text className='font-InterSemibold text-[14px] text-slate-700 mb-2'>New Password</Text>
                                <Controller
                                    name='newPassword'
                                    control={control}
                                    rules={{ 
                                        minLength: {
                                            value: 8,
                                            message: 'Password must be at least 8 characters'
                                        }
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <View>
                                            <View className='relative'>
                                                <TextInput
                                                    value={value}
                                                    placeholder="Enter new password"
                                                    placeholderTextColor="#9CA3AF"
                                                    secureTextEntry={!showPassword.new}
                                                    onChangeText={onChange}
                                                    className='bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 pr-12 font-Inter text-[15px] text-slate-800'
                                                />
                                                <Pressable
                                                    onPress={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                                                    className='absolute right-3 top-3.5'
                                                >
                                                    <Ionicons 
                                                        name={showPassword.new ? 'eye-off' : 'eye'} 
                                                        size={20} 
                                                        color={COLORS.grey} 
                                                    />
                                                </Pressable>
                                            </View>
                                            {errors.newPassword && (
                                                <Text className='font-Inter text-[11px] text-red-500 mt-1.5'>{errors.newPassword.message}</Text>
                                            )}
                                        </View>
                                    )}
                                />
                            </View>

                            {/* Confirm Password */}
                            <View>
                                <Text className='font-InterSemibold text-[14px] text-slate-700 mb-2'>Confirm Password</Text>
                                <Controller
                                    name='confirmPassword'
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <View className='relative'>
                                            <TextInput
                                                value={value}
                                                placeholder="Confirm new password"
                                                placeholderTextColor="#9CA3AF"
                                                secureTextEntry={!showPassword.confirm}
                                                onChangeText={onChange}
                                                className='bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 pr-12 font-Inter text-[15px] text-slate-800'
                                            />
                                            <Pressable
                                                onPress={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                                                className='absolute right-3 top-3.5'
                                            >
                                                <Ionicons 
                                                    name={showPassword.confirm ? 'eye-off' : 'eye'} 
                                                    size={20} 
                                                    color={COLORS.grey} 
                                                />
                                            </Pressable>
                                        </View>
                                    )}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Notification Settings Card */}
                    <View className='bg-white rounded-2xl p-5 border border-gray-100'
                        style={{
                            shadowColor: COLORS.themeColor,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.08,
                            shadowRadius: 8,
                            elevation: 3,
                        }}
                    >
                        <View className='flex-row items-center gap-3 mb-5'>
                            <View className='w-10 h-10 rounded-xl bg-themeColor/10 items-center justify-center'>
                                <Ionicons name="notifications" size={20} color={COLORS.themeColor} />
                            </View>
                            <View>
                                <Text className='font-InterBold text-[17px] text-slate-800'>Notification Settings</Text>
                                <Text className='font-Inter text-[12px] text-gray-500 mt-0.5'>Manage your preferences</Text>
                            </View>
                        </View>

                        <View className='gap-1'>
                            {/* Email notifications */}
                            <View className='flex-row justify-between items-center py-3 border-b border-gray-100'>
                                <View className='flex-1 pr-4'>
                                    <Text className='font-InterSemibold text-[15px] text-slate-800'>Email Notifications</Text>
                                    <Text className='font-Inter text-[12px] text-gray-500 mt-1'>Receive updates via email</Text>
                                </View>
                                <Switch
                                    value={enableNotification}
                                    onValueChange={setEnableNotification}
                                    thumbColor="#FFFFFF"
                                    trackColor={{ false: '#D1D5DB', true: COLORS.themeColor }}
                                    ios_backgroundColor="#D1D5DB"
                                />
                            </View>

                            {/* SMS notifications */}
                            <View className='flex-row justify-between items-center py-3 border-b border-gray-100'>
                                <View className='flex-1 pr-4'>
                                    <Text className='font-InterSemibold text-[15px] text-slate-800'>SMS Notifications</Text>
                                    <Text className='font-Inter text-[12px] text-gray-500 mt-1'>Receive text messages</Text>
                                </View>
                                <Switch
                                    value={enableSMS}
                                    onValueChange={setEnableSMS}
                                    thumbColor="#FFFFFF"
                                    trackColor={{ false: '#D1D5DB', true: COLORS.themeColor }}
                                    ios_backgroundColor="#D1D5DB"
                                />
                            </View>

                            {/* Push notifications */}
                            <View className='flex-row justify-between items-center py-3'>
                                <View className='flex-1 pr-4'>
                                    <Text className='font-InterSemibold text-[15px] text-slate-800'>Push Notifications</Text>
                                    <Text className='font-Inter text-[12px] text-gray-500 mt-1'>App notifications</Text>
                                </View>
                                <Switch
                                    value={true}
                                    onValueChange={() => {}}
                                    thumbColor="#FFFFFF"
                                    trackColor={{ false: '#D1D5DB', true: COLORS.themeColor }}
                                    ios_backgroundColor="#D1D5DB"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Preferences Card */}
                    <View className='bg-white rounded-2xl p-5 border border-gray-100'
                        style={{
                            shadowColor: COLORS.themeColor,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.08,
                            shadowRadius: 8,
                            elevation: 3,
                        }}
                    >
                        <View className='flex-row items-center gap-3 mb-5'>
                            <View className='w-10 h-10 rounded-xl bg-themeColor/10 items-center justify-center'>
                                <MaterialIcons name="settings" size={20} color={COLORS.themeColor} />
                            </View>
                            <View>
                                <Text className='font-InterBold text-[17px] text-slate-800'>Preferences</Text>
                                <Text className='font-Inter text-[12px] text-gray-500 mt-0.5'>Customize your experience</Text>
                            </View>
                        </View>

                        <View>
                            {[
                                { icon: 'language', label: 'Language', value: 'English' },
                                { icon: 'access-time', label: 'Time Zone', value: 'EST (UTC-5)' },
                                { icon: 'visibility', label: 'Profile Visibility', value: 'Public' },
                                { icon: 'calendar-today', label: 'Session Reminders', value: '30 minutes before' },
                            ].map((pref, index) => (
                                <Pressable
                                    key={index}
                                    className={`flex-row justify-between items-center py-3.5 ${
                                        index < 3 ? 'border-b border-gray-100' : ''
                                    } active:bg-gray-50`}
                                >
                                    <View className='flex-row items-center gap-3 flex-1'>
                                        <View className='w-9 h-9 rounded-lg bg-gray-100 items-center justify-center'>
                                            <MaterialIcons name={pref.icon} size={18} color={COLORS.themeColor} />
                                        </View>
                                        <View className='flex-1'>
                                            <Text className='font-InterSemibold text-[15px] text-slate-800'>{pref.label}</Text>
                                            <Text className='font-Inter text-[12px] text-gray-500 mt-0.5'>{pref.value}</Text>
                                        </View>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color={COLORS.grey} />
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Enhanced Action Buttons */}
            <View className='px-4 pb-6 pt-4 bg-white border-t border-gray-100'>
                <View className='flex-row gap-3'>
                    <Pressable
                        className='flex-1 border border-gray-300 rounded-xl py-3.5 items-center justify-center active:bg-gray-50'
                        onPress={() => navigation.goBack()}
                    >
                        <Text className='font-InterSemibold text-[15px] text-gray-700'>Cancel</Text>
                    </Pressable>
                    <LinearGradient
                        colors={[COLORS.themeColor, '#7A72FF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className='flex-1 rounded-xl overflow-hidden'
                        style={{
                            shadowColor: COLORS.themeColor,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                            elevation: 3,
                        }}
                    >
                        <Pressable
                            className='py-3.5 items-center justify-center active:opacity-90'
                            onPress={handleSubmit(onSumbit)}
                        >
                            <Text className='font-InterSemibold text-[15px] text-white'>Save Changes</Text>
                        </Pressable>
                    </LinearGradient>
                </View>
            </View>
        </View>
    )
}
