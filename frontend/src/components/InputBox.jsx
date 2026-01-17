import { View, TextInput, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/theme'

export default function InputBox({ label = "", value, setValue, icon, showClearBtn, placeholder, parentClassName, className = "", keyboardType="default", ...args }) {
    return (
        <View className={parentClassName}>
            {label && <Text className="font-InterMedium text-slate-700 mb-2">{label}</Text>}
            <View className={`bg-gray-100 rounded-xl px-4 py-1 flex-row items-center gap-3 ${className}`}>
                {icon && <Ionicons name={icon || ""} size={20} color={COLORS.grey} />}
                <TextInput
                    value={value}
                    onChangeText={setValue}
                    placeholder={placeholder}
                    className="font-InterRegular text-slate-800 text-base flex-1"
                    placeholderTextColor="#9CA3AF"
                    keyboardType={keyboardType}
                    blurOnSubmit={true}
                    {...args}
                />
                {showClearBtn && value?.length > 0 && (
                    <TouchableOpacity onPress={() => setValue('')}>
                        <Ionicons name="close-circle" size={20} color={COLORS.grey} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}

