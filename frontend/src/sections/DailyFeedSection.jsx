import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';

const DailyFeedSection = () => {

    return (
        <View className="mb-8">
            {/* Section Header */}
            <View className="flex-row justify-between items-center mb-4">
                <View>
                    <Text className="font-InterBold text-[18px] text-slate-800">Feed</Text>
                    <Text className="font-Inter text-[12px] text-gray-500 mt-1">
                        Your daily dose of mental wellness
                    </Text>
                </View>

                <TouchableOpacity className="flex-row items-center">
                    <Text className="font-InterSemibold text-themeColor text-[12px]">See All</Text>
                    <Ionicons name="chevron-forward" size={12} color={COLORS.themeColor} />
                </TouchableOpacity>
            </View>

            {/* daily feed */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={{ gap: 16 }}
            >
                {feedData.map((item) => (
                    <FeedCard key={item.id} item={item} />
                ))}
            </ScrollView>
        </View>
    );
};

export default DailyFeedSection;

const FeedCard = ({ item }) => {

    return (
        <>
            <TouchableOpacity
                // className="w-72 mr-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm active:scale-95 transition-all"
                className='w-80 bg-white rounded-2xl p-5 border border-themeColor/20'
                activeOpacity={0.8}
            >
                {/* Header */}
                <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-row items-center">
                        <Text className="text-xl mr-2">{item.icon}</Text>
                        <View>
                            <Text className="font-InterMedium text-[12px] text-themeColor uppercase tracking-wide">
                                {item.category}
                            </Text>
                            <Text className="font-InterBold text-[15px] text-slate-800">
                                {item.title}
                            </Text>
                        </View>
                    </View>

                    {/* Duration Badge */}
                    <View className="px-2 py-1 rounded-xl border border-themeColor/60">
                        <Text className="font-InterSemibold text-[10px] text-themeColor">
                            {item.duration}
                        </Text>
                    </View>
                </View>

                {/* Content */}
                <Text className="font-Inter text-[12px] text-gray-500 leading-5 mb-4">
                    {item.content}
                </Text>

                {/* Footer */}
                <View className="flex-row items-center justify-between border-t border-gray-100 pt-3">
                    <Text className="font-Inter text-[12px] text-lightGrey">
                        Daily Wellness
                    </Text>

                    <View className="flex-row items-center">
                        <View className="w-1.5 h-1.5 rounded-full bg-themeColor mr-1.5" />
                        <Text className="font-InterSemibold text-[12px] text-themeColor">
                            Read Now
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </>

    );
};


const feedData = [
    {
        id: 1,
        type: 'tip',
        title: 'Mindfulness Minute',
        content: 'Try the 4-7-8 breathing technique: Inhale 4s, hold 7s, exhale 8s',
        duration: '2 min read',
        icon: '🧘‍♀️',
        category: 'Exercise'
    },
    {
        id: 2,
        type: 'quote',
        title: 'Daily Affirmation',
        content: '"You are capable of amazing things. Take it one step at a time."',
        duration: '1 min read',
        icon: '💫',
        category: 'Motivation'
    },
    {
        id: 3,
        type: 'story',
        title: 'Wellness Journey',
        content: 'How meditation transformed my morning routine',
        duration: '3 min read',
        icon: '📖',
        category: 'Inspiration'
    },
    {
        id: 4,
        type: 'event',
        title: 'Live Session Today',
        content: 'Group meditation at 6 PM with Dr. Sarah',
        duration: '45 mins',
        icon: '🔴',
        category: 'Live'
    }
];