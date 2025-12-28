import React, { useState, useCallback, useMemo, memo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '@/constants/theme';
import { sampleChats } from '@/sampleData';
import { InputBox } from '@/components';
import ROUTES from '@/constants/routes';

const FILTERS = [
  { id: 'all', label: 'All Chats' },
  { id: 'unread', label: 'Unread' },
  { id: 'counselors', label: 'Counselors' },
  { id: 'ai', label: 'AI Chat' }
];

const formatTime = (timestamp) => {
  const now = new Date();
  const messageTime = new Date(timestamp);
  const diffInHours = (now - messageTime) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    const minutes = Math.floor(diffInHours * 60);
    return minutes < 1 ? 'now' : `${minutes}m ago`;
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else if (diffInHours < 168) {
    return `${Math.floor(diffInHours / 24)}d ago`;
  } else {
    return messageTime.toLocaleDateString();
  }
};

const getHostIcon = (hostType) => {
  switch (hostType) {
    case 'counselor':
      return 'person';
    case 'ai':
      return 'sparkles';
    case 'support':
      return 'headset';
    default:
      return 'chatbubble';
  }
};

// ChatItem component
const ChatItem = memo(({ chat, onPress }) => {
  const formattedTime = useMemo(() => formatTime(chat.lastMessage.timestamp), [chat.lastMessage.timestamp]);
  const hostIcon = useMemo(() => getHostIcon(chat.host.type), [chat.host.type]);
  const chatTypeLabel = useMemo(() =>
    chat.chatType === 'ai_chat' ? 'AI Assistant' : 'Professional',
    [chat.chatType]
  );

  return (
    <TouchableOpacity
      className={`bg-white mx-4 mb-2 rounded-2xl p-3 shadow-sm`}
      onPress={onPress}
    >
      <View className="flex-row items-start gap-3">
        {/* Avatar */}
        <View className="relative">
          <View className={`w-12 h-12 rounded-xl bg-themeColor/10 items-center justify-center`}>
            <Ionicons
              name={hostIcon}
              size={24}
              color={COLORS.themeColor}
            />
          </View>

          {/* Online Status */}
          {chat.host.isOnline && (
            <View className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white" />
          )}
        </View>

        {/* Chat Content */}
        <View className="flex-1">
          <View className="flex-row justify-between items-start mb-1">
            <Text className="font-InterSemibold text-slate-800 text-base flex-1">
              {chat.host.name}
            </Text>
            <View className="flex-row items-center gap-2">
              <Text className="font-Inter text-gray-400 text-xs">
                {formattedTime}
              </Text>
              {chat.unreadCount > 0 && (
                <View className="bg-themeColor rounded-full w-5 h-5 items-center justify-center">
                  <Text className="text-white font-InterBold text-xs">
                    {chat.unreadCount}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <Text
            className={`font-Inter text-sm mb-1 ${chat.unreadCount > 0 ? 'text-slate-500 font-InterMedium' : 'text-gray-500'
              }`}
            numberOfLines={2}
          >
            {chat.lastMessage.text}
          </Text>

          <View className="flex-row items-center gap-2">
            <Text className="font-InterMedium text-themeColor text-xs">
              {chat.host.specialty}
            </Text>
            <View className="w-1 h-1 bg-gray-300 rounded-full" />
            <Text className="font-Inter text-gray-400 text-xs">
              {chatTypeLabel}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

// Memoized FilterChip component
const FilterChip = memo(({ filter, isActive, onPress }) => (
  <TouchableOpacity
    className={`px-4 py-2 rounded-full border ${isActive
      ? 'bg-themeColor border-themeColor'
      : 'bg-white border-gray-300'
      }`}
    onPress={onPress}
  >
    <Text className={`font-InterMedium text-sm ${isActive ? 'text-white' : 'text-gray-600'
      }`}>
      {filter.label}
    </Text>
  </TouchableOpacity>
));

// Memoized EmptyState component
const EmptyState = memo(({ onNavigate }) => (
  <View className="flex-1 justify-center items-center px-4">
    <View className="w-24 h-24 rounded-full bg-themeColor/10 items-center justify-center mb-4">
      <Ionicons name="chatbubble-ellipses" size={40} color={COLORS.themeColor} />
    </View>
    <Text className="font-InterBold text-slate-800 text-xl text-center mb-2">
      No conversations yet
    </Text>
    <Text className="font-InterRegular text-gray-500 text-center text-sm leading-5">
      Start your mental health journey by booking a session with one of our professional counselors or chat with our AI assistant.
    </Text>
    <TouchableOpacity
      className="bg-themeColor rounded-xl px-6 py-3 mt-6"
      onPress={onNavigate}
    >
      <Text className="text-white font-InterSemiBold text-base">
        Find Counselors
      </Text>
    </TouchableOpacity>
  </View>
));

export default function AllChatsScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Sample chats data
  const [chats, setChats] = useState(sampleChats);

  // Memoize filteredChats
  const filteredChats = useMemo(() => {
    return chats.filter(chat => {
      const lowerSearchQuery = searchQuery.toLowerCase();
      const matchesSearch = chat.host.name.toLowerCase().includes(lowerSearchQuery) ||
        chat.lastMessage.text.toLowerCase().includes(lowerSearchQuery);

      const matchesFilter = activeFilter === 'all' ? true :
        activeFilter === 'unread' ? chat.unreadCount > 0 :
          activeFilter === 'counselors' ? chat.host.type === 'counselor' :
            activeFilter === 'ai' ? chat.host.type === 'ai' : true;

      return matchesSearch && matchesFilter;
    });
  }, [chats, searchQuery, activeFilter]);

  // Memoize handlers
  const handleFilterPress = useCallback((filterId) => {
    setActiveFilter(filterId);
  }, []);

  const handleChatPress = useCallback((chat) => {
    navigation.navigate(ROUTES.CHAT_SCREEN, {
      host: chat.host,
      customer: { id: 'user_1', name: 'You' },
      chatType: chat.chatType
    });
  }, [navigation]);

  const handleFindCounselors = useCallback(() => {
    // navigation.navigate('FindCounselors');
  }, [navigation]);

  // Memoize FlatList renderItem for chats
  const renderChatItem = useCallback(({ item }) => (
    <ChatItem chat={item} onPress={() => handleChatPress(item)} />
  ), [handleChatPress]);

  // Memoize FlatList renderItem for filters
  const renderFilterChip = useCallback(({ item }) => (
    <FilterChip
      filter={item}
      isActive={activeFilter === item.id}
      onPress={() => handleFilterPress(item.id)}
    />
  ), [activeFilter, handleFilterPress]);

  // Memoize keyExtractors
  const chatKeyExtractor = useCallback((item) => item.id, []);
  const filterKeyExtractor = useCallback((item) => item.id, []);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <View className='bg-gray-100 flex-1'>
        {/* Header */}
        <View className="bg-white px-3 py-4 border-b border-gray-200">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="font-InterBold text-2xl text-slate-800">Messages</Text>
            <TouchableOpacity className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
              <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.grey} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <InputBox value={searchQuery} setValue={setSearchQuery} icon={"search"} placeholder={"Search conversations..."} />
        </View>

        {/* Filter Chips */}
        <View className="px-3 py-3 bg-white">
          <FlatList
            data={FILTERS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={filterKeyExtractor}
            renderItem={renderFilterChip}
            contentContainerStyle={{ gap: 8 }}
            removeClippedSubviews={true}
            maxToRenderPerBatch={4}
            windowSize={5}
            initialNumToRender={4}
          />
        </View>

        {/* Chats List */}
        {filteredChats.length > 0 ? (
          <FlatList
            data={filteredChats}
            keyExtractor={chatKeyExtractor}
            renderItem={renderChatItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8, paddingBottom: 90 }}
            className="flex-1"
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={10}
            getItemLayout={(data, index) => ({
              length: 100, // Approximate item height
              offset: 100 * index,
              index,
            })}
          />
        ) : (
          <EmptyState onNavigate={handleFindCounselors} />
        )}
      </View>
    </>
  );
}