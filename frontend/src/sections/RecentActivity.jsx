import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { IMAGES } from '@/constants/images'
import { COLORS } from '@/constants/theme'
import { sampleChats } from '@/sampleData'
import ROUTES from '@/constants/routes'

export default function RecentActivitySection() {
    const navigation = useNavigation()

    // Get the most recent activity (chat or article)
    const recentActivity = React.useMemo(() => {
        // Get most recent chat
        const recentChat = sampleChats
            .filter(chat => (chat.chatType === 'user' && chat.host.type === 'counselor') || chat.host.type === 'ai')
            .sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive))[0]

        // Sample article activity
        const articleActivity = {
            id: 'article_1',
            type: 'article',
            title: 'Managing Daily Anxiety',
            subtitle: 'Wellness Tips',
            preview: 'Learn practical techniques to manage anxiety in your daily routine and build resilience...',
            timestamp: new Date(Date.now() - 1800000), // 30 min ago
        }

        // Compare timestamps and return most recent
        if (recentChat) {
            const chatTime = new Date(recentChat.lastActive)
            const articleTime = new Date(articleActivity.timestamp)

            if (chatTime > articleTime) {
                return {
                    id: recentChat.id,
                    type: 'chat',
                    counselor: {
                        name: recentChat.host.name,
                        specialty: recentChat.host.specialty || 'AI Assistant',
                        avatar: recentChat.host.avatar || IMAGES.ProfileAvatar,
                        isOnline: recentChat.host.isOnline,
                    },
                    lastMessage: recentChat.lastMessage.text,
                    timestamp: recentChat.lastActive,
                    unreadCount: recentChat.unreadCount,
                    hasUnread: recentChat.lastMessage.unread,
                    icon: recentChat.host.type === 'ai' ? 'sparkles' : 'chatbubble-ellipses',
                    color: recentChat.host.type === 'ai' ? '#F59E0B' : COLORS.themeColor,
                }
            }
        }

        return {
            ...articleActivity,
            icon: 'document-text',
            color: '#10B981',
        }
    }, [])

    const formatTime = (timestamp) => {
        const now = new Date()
        const time = new Date(timestamp)
        const diffMs = now - time
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return 'Just now'
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        if (diffDays === 1) return 'Yesterday'
        return `${diffDays}d ago`
    }

    const handleActivityPress = () => {
        if (recentActivity.type === 'chat') {
            navigation.navigate(ROUTES.CHAT_SCREEN, {
                chatId: recentActivity.id,
                counselor: recentActivity.counselor
            })
        } else if (recentActivity.type === 'article') {
            console.log('Open article:', recentActivity.id)
        }
    }

    if (!recentActivity) return null

    return (
        <View className="mb-6 px-">
            {/* Section Header */}
            <View className="flex-row justify-between items-center mb-3">
                <View>
                    <Text className="font-InterBold text-[18px] text-slate-800">Recent Activity</Text>
                    <Text className="font-Inter text-[12px] text-gray-500 mt-0.5">
                        Continue where you left off
                    </Text>
                </View>
            </View>

            {/* Single Activity Card */}
            <Pressable
                onPress={handleActivityPress}
                className="bg-white rounded-2xl overflow-hidden active:scale-95 mb-2"
                style={{
                    shadowColor: COLORS.themeColor,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 4,
                }}
            >
                {/* Header */}
                <View className="px-4 py-3 border-b border-gray-100">
                    <View className="flex-row items-center gap-3">
                        {/* Icon/Avatar */}
                        {recentActivity.type === 'chat' ? (
                            <View className="relative">
                                <View className="absolute inset-0 rounded-xl border-2 border-themeColor/30" />
                                <Image
                                    source={recentActivity.counselor.avatar}
                                    className="w-12 h-12 rounded-xl"
                                />
                                {recentActivity.counselor.isOnline && (
                                    <View className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                                )}
                                {recentActivity.hasUnread && recentActivity.unreadCount > 0 && (
                                    <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center border-2 border-white">
                                        <Text className="text-white font-InterBold text-[9px]">
                                            {recentActivity.unreadCount > 9 ? '9+' : recentActivity.unreadCount}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        ) : (
                            <View
                                className="w-12 h-12 rounded-xl items-center justify-center"
                                style={{ backgroundColor: `${recentActivity.color}15` }}
                            >
                                <Ionicons name={recentActivity.icon} size={20} color={recentActivity.color} />
                            </View>
                        )}

                        {/* Title & Subtitle */}
                        <View className="flex-1">
                            <Text className="font-InterSemibold text-[14px] text-slate-800" numberOfLines={1}>
                                {recentActivity.type === 'chat' ? recentActivity.counselor.name : recentActivity.title}
                            </Text>
                            <View className="flex-row items-center gap-1.5 mt-0.5">
                                <Ionicons
                                    name={recentActivity.type === 'chat' ? 'chatbubble-ellipses' : 'document-text'}
                                    size={11}
                                    color={recentActivity.color}
                                />
                                <Text className="font-InterMedium text-[11px] text-themeColor" numberOfLines={1}>
                                    {recentActivity.type === 'chat' ? recentActivity.counselor.specialty : recentActivity.subtitle}
                                </Text>
                            </View>
                        </View>

                        {/* Time */}
                        <View className="bg-gray-100 rounded-full px-2.5 py-1">
                            <Text className="font-InterMedium text-[10px] text-gray-600">
                                {formatTime(recentActivity.timestamp)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Preview */}
                <View className="px-4 py-3">
                    <Text
                        className="font-Inter text-[12px] text-gray-600 leading-4"
                        numberOfLines={2}
                    >
                        {recentActivity.type === 'chat' ? recentActivity.lastMessage : recentActivity.preview}
                    </Text>
                </View>

                {/* CTA */}
                <View className="px-4 pb-4">
                    <LinearGradient
                        colors={[COLORS.themeColor, '#8B7FFF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="rounded-xl overflow-hidden"
                    >
                        <Pressable
                            onPress={handleActivityPress}
                            className="py-2.5 items-center active:opacity-90"
                        >
                            <View className="flex-row items-center gap-2">
                                <Ionicons
                                    name={recentActivity.type === 'chat' ? 'arrow-forward-circle' : 'book-outline'}
                                    size={16}
                                    color="white"
                                />
                                <Text className="font-InterSemibold text-white text-[12px]">
                                    {recentActivity.type === 'chat' ? 'Continue Chat' : 'Read More'}
                                </Text>
                            </View>
                        </Pressable>
                    </LinearGradient>
                </View>
            </Pressable>
        </View>
    )
}
