import { View, Text, FlatList } from 'react-native'
import React, { useMemo, memo, useCallback } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/theme'

// Move notification data outside component
const NOTIFICATIONS = [
    {
        id: '1',
        icon: 'gift-outline',
        iconColor: COLORS.themeColor,
        title: 'Holiday Voucher for You!',
        message: 'Use this voucher to get 15% when buying mystical coins.',
        time: '5h ago',
        hasUnread: true,
    },
    {
        id: '2',
        icon: 'checkmark-done',
        iconColor: COLORS.success,
        title: 'Your Flight Ticket Payment Success!',
        message: 'Your payment process has been completed. Click here to see your receipt.',
        time: '5h ago',
        hasUnread: true,
    },
    {
        id: '3',
        icon: 'wallet-outline',
        iconColor: '#C48A28',
        title: 'Complete Your Payment',
        message: 'We\'ve received your Dragon\'s Den Adventure Park\'s ticket order, please complete the payment within 5 minutes.',
        time: '5h ago',
        hasUnread: false,
    },
];

// Memoized NotificationItem component
const NotificationItem = memo(({ notification }) => {
    const iconStyle = useMemo(() => ({ 
        backgroundColor: notification.iconColor 
    }), [notification.iconColor]);

    return (
        <View className="flex-row items-center w-full gap-2">
            <View style={iconStyle} className="h-11 w-11 items-center justify-center rounded-full">
                <Ionicons name={notification.icon} size={20} color="white" />
            </View>
            <View className="flex-col flex-1 gap-2">
                <View className="flex-row items-center justify-between">
                    <Text className="max-w-[80%] line-clamp-1 whitespace-nowrap font-Inter-Bold text-[12px]">
                        {notification.title}
                    </Text>
                    <Text className="font-jakarta-regular text-[10px]">{notification.time}</Text>
                </View>
                <View className="flex-row items-center justify-between">
                    <Text className="max-w-[80%] line-clamp-2 font-jakarta-regular text-[10px] whitespace-nowrap">
                        {notification.message}
                    </Text>
                    {notification.hasUnread && (
                        <View className="h-[4px] w-[4px] bg-primary rounded-full" />
                    )}
                </View>
            </View>
        </View>
    );
});

export default function NotificationScreen() {
    // Memoize renderItem
    const renderNotificationItem = useCallback(({ item }) => (
        <NotificationItem notification={item} />
    ), []);

    // Memoize keyExtractor
    const keyExtractor = useCallback((item) => item.id, []);

    // Memoize contentContainerStyle
    const contentContainerStyle = useMemo(() => ({
        paddingHorizontal: 16,
        paddingVertical: 16,
        paddingBottom: 20,
        gap: 16,
    }), []);

    return (
        <View className="flex-1 w-full bg-gray-50">
            <FlatList
                data={NOTIFICATIONS}
                renderItem={renderNotificationItem}
                keyExtractor={keyExtractor}
                contentContainerStyle={contentContainerStyle}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}
                maxToRenderPerBatch={5}
                windowSize={5}
                initialNumToRender={3}
            />
        </View>
    )
}
