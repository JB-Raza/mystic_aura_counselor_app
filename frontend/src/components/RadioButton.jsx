import { COLORS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, View, Text } from 'react-native';

export default function RadioButton({ selected=null, onPress, label }) {
    const [isPressed, setIsPressed] = useState(false);

    return (
        <Pressable
            className="w-full"
            onPress={onPress}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
        >
            <View
                className={`px-4 py-3 rounded-xl flex-row gap-2 items-center justify-center ${
                    selected 
                        ? 'bg-themeColor' 
                        : 'bg-gray-100 border border-gray-200'
                }`}
                style={[
                    isPressed && {
                        opacity: 0.7,
                        transform: [{ scale: 0.98 }],
                    }
                ]}
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
        </Pressable>
    );
}

