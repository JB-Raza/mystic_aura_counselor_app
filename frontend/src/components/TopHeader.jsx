import { View, Text, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import React, { memo, useCallback } from 'react'
import { Ionicons } from '@expo/vector-icons'

const TopHeader = memo(({ title, showBackButton = true, rightAction = null }) => {
    const navigation = useNavigation()
    
    const handleGoBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    return (
        <View className='bg-themeColor pt-4 pb-4 px-5 shadow-lg shadow-themeColor border-b-2 border-themeColor/60'>
            <View className='flex-row items-center justify-center'>
                {showBackButton && (
                    <Pressable
                        className='absolute left-0 p-2 rounded-full active:bg-white/10'
                        onPress={handleGoBack}>
                        <Ionicons name="arrow-back" size={20} color={"white"} />
                    </Pressable>
                )}
                <Text className='font-InterBold text-[17px] text-white'>{title}</Text>
                {rightAction && (
                    <View className='absolute right-0'>
                        {rightAction}
                    </View>
                )}
            </View>
        </View>
    )
});

export default TopHeader;
