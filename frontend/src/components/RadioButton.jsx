import { COLORS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

export default function RadioButton({ selected=null, onPress, label }) {
    return (
        <TouchableOpacity
            className="w-full"
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View
                className={`px-4 py-3 rounded-xl flex-row gap-2 items-center justify-center ${
                    selected 
                        ? 'bg-themeColor' 
                        : 'bg-gray-100 border border-gray-200'
                }`}
                style={selected ? { backgroundColor: COLORS.themeColor } : {}}
            >
                {selected && (
                    <Ionicons 
                        name='checkmark' 
                        color="white" 
                        size={18} 
                    />
                )}
                <Text 
                    className={`font-InterMedium text-[14px] ${
                        selected ? "text-white" : "text-gray-700"
                    }`}
                >
                    {label}
                </Text>
            </View>
        </TouchableOpacity>
    );
}