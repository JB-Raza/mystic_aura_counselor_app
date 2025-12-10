import { View, Text } from 'react-native'
import React from 'react'

const SettingSection = ({ title, children }) => (
    <View className="bg-white rounded-2xl mx-4 mt-4 overflow-hidden">
        <View className="px-4 py-3 border-b border-gray-100">
            <Text className="font-InterSemibold text-lg text-slate-800">{title}</Text>
        </View>
        <View className="p-2">
            {children}
        </View>
    </View>
);
export default SettingSection;