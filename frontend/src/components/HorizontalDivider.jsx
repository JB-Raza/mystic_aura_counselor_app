import { View, Text } from 'react-native'
import React from 'react'

export default function HorizontalDivider({ className }) {
    return (
        <View className={`h-[1px] bg-themeColor ${className}`}>
        </View>
    )
}