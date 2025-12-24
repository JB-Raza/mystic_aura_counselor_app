import React, { useState, useEffect, useCallback, useMemo, memo, Suspense } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Alert,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { Loader, TopHeader } from '@/components';
import { useFocusEffect } from '@react-navigation/native';

// Move constants outside component to prevent recreation
const sampleBookings = [
    {
        id: '1',
        counselor: {
            name: 'Dr. Sarah Chen',
            specialization: 'Anxiety & Trauma',
            image: null,
        },
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        time: '14:30',
        duration: 60,
        status: 'confirmed',
        type: 'video',
        price: 85,
        meetingLink: 'https://meet.mysticaura.com/session-123',
    },
    {
        id: '2',
        counselor: {
            name: 'Michael Rodriguez',
            specialization: 'Relationship Counseling',
            image: null,
        },
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        time: '10:00',
        duration: 45,
        status: 'confirmed',
        type: 'audio',
        price: 75,
    },
    {
        id: '3',
        counselor: {
            name: 'Dr. Emily Watson',
            specialization: 'Psychiatry',
            image: null,
        },
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        time: '16:00',
        duration: 30,
        status: 'completed',
        type: 'video',
        price: 95,
    },
    {
        id: '4',
        counselor: {
            name: 'James Kim',
            specialization: 'Mindfulness Coach',
            image: null,
        },
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        time: '11:30',
        duration: 60,
        status: 'cancelled',
        type: 'chat',
        price: 65,
    },
];

// Move helper functions outside component
const getStatusColor = (status) => {
    switch (status) {
        case 'confirmed':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'completed':
            return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'cancelled':
            return 'bg-red-100 text-red-800 border-red-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const getStatusText = (status) => {
    switch (status) {
        case 'confirmed':
            return 'Confirmed';
        case 'completed':
            return 'Completed';
        case 'cancelled':
            return 'Cancelled';
        default:
            return status;
    }
};

const getTypeIcon = (type) => {
    switch (type) {
        case 'video':
            return 'videocam';
        case 'audio':
            return 'call';
        case 'chat':
            return 'chatbubble-ellipses';
        default:
            return 'calendar';
    }
};

// Memoized BookingCard component
const BookingCard = memo(({ booking, onJoinSession, onCancelBooking }) => {
    const bookingDate = useMemo(() => new Date(booking.date), [booking.date]);
    const now = useMemo(() => new Date(), []);
    const isUpcoming = useMemo(() =>
        booking.status === 'confirmed' && bookingDate > now,
        [booking.status, bookingDate, now]
    );

    const formattedDate = useMemo(() =>
        bookingDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        }),
        [bookingDate]
    );

    return (
        <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-100">
            {/* Header */}
            <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                    <Text className="font-InterSemibold text-[16px] text-slate-800 mb-1">
                        {booking.counselor.name}
                    </Text>
                    <Text className="font-InterRegular text-gray-500 text-[12px]">
                        {booking.counselor.specialization}
                    </Text>
                </View>
                <View className={`px-2 py-1 rounded-full border ${getStatusColor(booking.status)}`}>
                    <Text className="font-InterMedium text-[11px]">
                        {getStatusText(booking.status)}
                    </Text>
                </View>
            </View>

            {/* Session Details */}
            <View className="flex-row items-center gap-3 mb-3">
                <View className="flex-row items-center gap-1.5">
                    <Ionicons name="calendar" size={13} color={COLORS.themeColor} />
                    <Text className="font-InterMedium text-[12px] text-slate-700">
                        {formattedDate}
                    </Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                    <Ionicons name="time" size={13} color={COLORS.themeColor} />
                    <Text className="font-InterMedium text-[12px] text-slate-700">
                        {booking.time}
                    </Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                    <Ionicons name={getTypeIcon(booking.type)} size={13} color={COLORS.themeColor} />
                    <Text className="font-InterMedium text-[12px] text-slate-700 capitalize">
                        {booking.type}
                    </Text>
                </View>
            </View>

            {/* Duration & Price */}
            <View className="flex-row justify-between items-center mb-3">
                <Text className="font-InterRegular text-gray-500 text-[13px]">
                    {booking.duration} min
                </Text>
                <Text className="font-InterSemibold text-slate-800 text-[15px]">
                    ${booking.price}
                </Text>
            </View>

            {/* Actions */}
            {isUpcoming && (
                <View className="flex-row gap-2">
                    <TouchableOpacity
                        className="flex-1 bg-themeColor rounded-xl py-2.5 items-center"
                        onPress={() => onJoinSession(booking)}
                    >
                        <Text className="font-InterSemibold text-white text-[13px]">
                            Join Session
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="px-3 py-2.5 border border-gray-300 rounded-xl"
                        onPress={() => onCancelBooking(booking)}
                    >
                        <Text className="font-InterMedium text-gray-600 text-[13px]">
                            Cancel
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {booking.status === 'completed' && (
                <TouchableOpacity
                    disabled={!booking?.notesAvailable}
                    className="bg-themeColor disabled:bg-gray-200 rounded-xl py-2.5 items-center"
                >
                    <Text className={`font-InterMedium text-[13px] ${booking?.notesAvailable ? 'text-white' : 'text-gray-400'}`}>
                        View Session Notes
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
});

// Memoized EmptyBookings component
const EmptyBookings = memo(({ activeTab }) => {
    const emptyText = useMemo(() => {
        if (activeTab === 'upcoming') {
            return "Book your first session to start your mental wellness journey.";
        } else if (activeTab === 'completed') {
            return "Your completed sessions will appear here.";
        } else {
            return "No cancelled sessions found.";
        }
    }, [activeTab]);

    return (
        <View className="flex-1 items-center justify-center py-20 px-6">
            <View className="w-20 h-20 rounded-full bg-themeColor/10 items-center justify-center mb-5">
                <Ionicons name="calendar" size={32} color={COLORS.themeColor} />
            </View>
            <Text className="font-InterSemibold text-[20px] text-slate-800 text-center mb-2">
                No {activeTab} sessions
            </Text>
            <Text className="font-InterRegular text-gray-500 text-center text-[15px] leading-6 mb-6">
                {emptyText}
            </Text>
            {activeTab === 'upcoming' && (
                <TouchableOpacity className="bg-themeColor rounded-xl px-6 py-3">
                    <Text className="font-InterSemibold text-white text-[15px]">
                        Find a Counselor
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
});

// Memoized TabButton component
const TabButton = memo(({ title, count, isActive, onPress }) => (
    <TouchableOpacity
        className={`flex-1 py-2.5 px-3 rounded-xl items-center ${isActive ? 'bg-themeColor' : 'bg-gray-100'}`}
        onPress={onPress}
    >
        <Text
            className={`font-InterSemibold text-[12px] ${isActive ? 'text-white' : 'text-gray-600'}`}
        >
            {title} {count > 0 && `(${count})`}
        </Text>
    </TouchableOpacity>
));

const BookingsScreen = () => {
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    // Update status bar when screen is focused
    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(COLORS.themeColor, true);
            StatusBar.setBarStyle('light-content', true);
        }, [])
    );

    // Memoize loadBookings
    const loadBookings = useCallback(async () => {
        setLoading(true);
        setTimeout(() => {
            setBookings(sampleBookings);
            setLoading(false);
        }, 1000);
    }, []);

    useEffect(() => {
        loadBookings();
    }, [loadBookings]);

    // Memoize onRefresh
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadBookings();
        setRefreshing(false);
    }, [loadBookings]);

    // Memoize filteredBookings
    const filteredBookings = useMemo(() => {
        const now = new Date();
        return bookings.filter(booking => {
            const bookingDate = new Date(booking.date);

            switch (activeTab) {
                case 'upcoming':
                    return booking.status === 'confirmed' && bookingDate > now;
                case 'completed':
                    return booking.status === 'completed';
                case 'cancelled':
                    return booking.status === 'cancelled';
                default:
                    return true;
            }
        });
    }, [bookings, activeTab]);

    // Memoize tab counts
    const tabCounts = useMemo(() => {
        const now = new Date();
        return {
            upcoming: bookings.filter(b => b.status === 'confirmed' && new Date(b.date) > now).length,
            completed: bookings.filter(b => b.status === 'completed').length,
            cancelled: bookings.filter(b => b.status === 'cancelled').length,
        };
    }, [bookings]);

    // Memoize handleJoinSession
    const handleJoinSession = useCallback((booking) => {
        if (booking.type === 'video' && booking.meetingLink) {
            Alert.alert(
                'Join Session',
                `Ready to join your session with ${booking.counselor.name}?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Join Now', onPress: () => console.log('Join session:', booking.meetingLink) },
                ]
            );
        } else {
            Alert.alert('Session Info', 'Your session details have been sent to your email.');
        }
    }, []);

    // Memoize handleCancelBooking
    const handleCancelBooking = useCallback((booking) => {
        Alert.alert(
            'Cancel Session',
            `Are you sure you want to cancel your session with ${booking.counselor.name}?`,
            [
                { text: 'Keep Booking', style: 'cancel' },
                {
                    text: 'Cancel Session',
                    style: 'destructive',
                    onPress: () => {
                        setBookings(prev => prev.map(b =>
                            b.id === booking.id ? { ...b, status: 'cancelled' } : b
                        ));
                    },
                },
            ]
        );
    }, []);

    // Memoize tab change handlers
    const handleTabChange = useCallback((tab) => {
        setActiveTab(tab);
    }, []);

    // Memoize FlatList renderItem
    const renderBookingCard = useCallback(({ item }) => (
        <BookingCard
            booking={item}
            onJoinSession={handleJoinSession}
            onCancelBooking={handleCancelBooking}
        />
    ), [handleJoinSession, handleCancelBooking]);

    // Memoize keyExtractor
    const keyExtractor = useCallback((item) => item.id, []);

    // Memoize ListEmptyComponent
    const renderEmpty = useCallback(() => (
        <EmptyBookings activeTab={activeTab} />
    ), [activeTab]);

    useEffect(() => {
        loadBookings();
    }, [loadBookings]);

    return (
        <View className="flex-1 bg-gray-50">
            <StatusBar backgroundColor={COLORS.themeColor} barStyle="light-content" />
            <TopHeader title="My Bookings" showBackButton={false} />

            {/* <Suspense fallback={Loader}> */}
            {loading ? (
                <Loader />
            ) : (
                <View className="flex-1">
                    {/* stats */}
                    <View className="px-4 pt-4 pb-3">
                        <View className="flex-row items-center justify-between bg-white rounded-2xl p-3 border border-gray-100">
                            <View>
                                <Text className="font-InterSemibold text-slate-800 text-[15px] mb-1">
                                    Session Overview
                                </Text>
                                <View className="flex-row items-center gap-4">
                                    <View className="flex-row items-center gap-1.5">
                                        <View className="w-2 h-2 bg-green-500 rounded-full" />
                                        <Text className="font-InterMedium text-gray-700 text-[13px]">
                                            {tabCounts.upcoming} upcoming
                                        </Text>
                                    </View>
                                    <View className="flex-row items-center gap-1.5">
                                        <View className="w-2 h-2 bg-blue-500 rounded-full" />
                                        <Text className="font-InterMedium text-gray-700 text-[13px]">
                                            {tabCounts.completed} completed
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <Ionicons name="stats-chart" size={20} color={COLORS.themeColor} />
                        </View>
                    </View>

                    {/* Tab Navigation */}
                    <View className="px-4 mb-3">
                        <View className="flex-row gap-2 bg-gray-100 rounded-2xl p-1">
                            <TabButton
                                title="Upcoming"
                                count={tabCounts.upcoming}
                                isActive={activeTab === 'upcoming'}
                                onPress={() => handleTabChange('upcoming')}
                            />
                            <TabButton
                                title="Completed"
                                count={tabCounts.completed}
                                isActive={activeTab === 'completed'}
                                onPress={() => handleTabChange('completed')}
                            />
                            <TabButton
                                title="Cancelled"
                                count={tabCounts.cancelled}
                                isActive={activeTab === 'cancelled'}
                                onPress={() => handleTabChange('cancelled')}
                            />
                        </View>
                    </View>

                    {/* Bookings List */}
                    <FlatList
                        data={filteredBookings}
                        renderItem={renderBookingCard}
                        keyExtractor={keyExtractor}
                        ListEmptyComponent={renderEmpty}
                        contentContainerStyle={{
                            paddingHorizontal: 16,
                            paddingBottom: 90,
                            flexGrow: filteredBookings.length === 0 ? 1 : 0
                        }}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[COLORS.themeColor]}
                            />
                        }
                        removeClippedSubviews={true}
                        maxToRenderPerBatch={10}
                        windowSize={10}
                        initialNumToRender={10}
                        getItemLayout={(data, index) => ({
                            length: 200, // Approximate card height + margin
                            offset: 200 * index,
                            index,
                        })}
                    />
                </View>
            )}
            {/* </Suspense> */}
        </View>
    );
};

export default BookingsScreen;
