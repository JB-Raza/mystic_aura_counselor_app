import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { View, Text, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Keyboard, Pressable } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { useNavigation } from '@react-navigation/native';
import { InputBox } from '@/components';
import { Toast } from 'toastify-react-native';
import { useConfirmationAlert } from '@/state/confirmationContext';

const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
};

const MessageBubble = memo(({ message, onLongPress }) => {
    const isCustomer = useMemo(() => message.sender === 'customer', [message.sender]);
    const formattedTime = useMemo(() => formatTime(message.timestamp), [message.timestamp]);

    return (
        <TouchableOpacity onLongPress={onLongPress} delayLongPress={500} className={`rounded-xl`}>
            <View className={`bg-themeColor/20  rounded-2xl max-w-[80%] gap-2 ${isCustomer ? "self-end" : "self-start"}`}>
                {message.repliedToMsg?.trim() !== "" && message.repliedToMsg !== null && <View className={`px-4 pt-1.5`}>
                    <Text className='text-[11px] line-clamp-2 text-themeColor'>{message.repliedToMsg}</Text>
                </View>}
                <View>
                    <View
                        className={`rounded-2xl shadow-md p-3 ${isCustomer
                            ? 'bg-themeColor shadow-themeColor rounded-br-md'
                            : 'bg-gray-200 rounded-bl-md'
                            }  `}
                    >
                        <Text className={`text-sm ${isCustomer ? 'text-white' : 'text-slate-800'
                            } font-InterRegular`}>
                            {message.text}
                        </Text>
                    </View>
                </View>
            </View>

            <View className={`flex-row items-center gap-1 mt-1 ${isCustomer ? 'justify-end' : 'justify-start'
                }`}>
                <Text className="text-gray-400 text-xs font-InterRegular">
                    {formattedTime}
                </Text>
                {isCustomer && (
                    <Ionicons
                        name={message.read ? "checkmark-done" : "checkmark"}
                        size={12}
                        color={message.read ? COLORS.themeColor : "#9CA3AF"}
                    />
                )}
            </View>
        </TouchableOpacity>
    );
});

const MessageActionSheet = memo(({ selectedMessage, onClose, onAction }) => {
    if (!selectedMessage) return null;

    return (
        <View className="absolute inset-0 bg-black/50 justify-end">
            <TouchableOpacity
                className="flex-1"
                onPress={onClose}
            />

            <View className="bg-white rounded-t-3xl p-4">
                <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-4" />

                <Text className="font-InterMedium text-gray-500 text-center mb-4">
                    Message Options
                </Text>

                <View className="bg-gray-50 rounded-xl p-3 mb-3">
                    <Text className="font-InterRegular text-slate-700 text-sm">
                        {selectedMessage.text}
                    </Text>
                </View>

                <View className="flex-row justify-between">
                    {MESSAGE_ACTIONS.map((item) => (
                        <TouchableOpacity
                            key={item.action}
                            className="items-center py-2 flex-1"
                            onPress={() => onAction(item.action, selectedMessage)}
                        >
                            <View className={`w-12 h-12 rounded-full items-center justify-center mb-1 ${item.destructive ? 'bg-red-100' : 'bg-purple-100'
                                }`}>
                                <Ionicons
                                    name={item.icon}
                                    size={20}
                                    color={item.destructive ? '#EF4444' : COLORS.themeColor}
                                />
                            </View>
                            <Text className={`font-InterMedium text-xs ${item.destructive ? 'text-red-600' : 'text-slate-700'
                                }`}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    className="bg-white border border-gray-200 rounded-xl py-4 mt-3"
                    onPress={onClose}
                >
                    <Text className="font-InterSemiBold text-slate-800 text-center">
                        Cancel
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
});

const ChatHeader = memo(({ host, onBack }) => {
    return (
        <View className="bg-white relative z-10 border-b border-gray-200 px-4 py-4 flex-row items-center justify-between">
            <Pressable className='p-2 rounded-full active:bg-white/10' onPress={onBack}>
                <Ionicons name="arrow-back" size={20} color={COLORS.themeColor} />
            </Pressable>
            <View className="flex-row flex-1 justify-between items-center gap-3">
                <View className='flex-1 flex-row gap-2'>
                    <View className="w-10 h-10 rounded-full bg-themeColor/10 items-center justify-center">
                        <Ionicons name="person" size={20} color={COLORS.themeColor} />
                    </View>

                    <View className="">
                        <Text className="font-InterBold text-slate-800 text-base" maxLength={15}>
                            {host.name}
                        </Text>
                        <Text className="font-InterRegular text-green-600 text-xs">
                            {host.isOnline ? 'Online' : 'Offline'}
                        </Text>
                    </View>
                </View>

                <View className="flex-row flex- justify-end gap-3">
                    <TouchableOpacity>
                        <Ionicons name="videocam" size={24} color={COLORS.themeColor} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="call" size={24} color={COLORS.themeColor} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
});

export default function ChatScreen({ route }) {
    const { host, customer, chatType = 'user' } = route?.params || {};
    const navigation = useNavigation();

    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [newMessage, setNewMessage] = useState('');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyingToMsg, setReplyingToMsg] = useState("")
    const messagesFlatListRef = useRef(null);
    const aiResponseTimeoutRef = useRef(null);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const { showConfirmation, hideConfirmation } = useConfirmationAlert();

    // placeholder chatData
    const chatData = useMemo(() => ({
        host: host || {
            id: 'host_1',
            name: 'Dr. Sarah Chen',
            type: 'counselor',
            avatar: null,
            isOnline: true,
            specialty: 'Anxiety & Stress Management'
        },
        customer: customer || {
            id: 'customer_1',
            name: 'You',
            type: 'user',
            avatar: null
        },
        chatType: chatType
    }), [host, customer, chatType]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (aiResponseTimeoutRef.current) {
                clearTimeout(aiResponseTimeoutRef.current);
            }
        };
    }, []);

    const handleContentSizeChange = () => {
        messagesFlatListRef.current?.scrollToEnd({ animated: true });
    }



    const sendMessage = useCallback(() => {
        if (newMessage.trim() === '') return;

        let currReplyingToMsg = replyingToMsg
        const message = {
            id: Date.now().toString(),
            text: newMessage.trim(),
            sender: 'customer',
            timestamp: new Date(),
            type: 'text',
            read: false,
            repliedToMsg: currReplyingToMsg || ""
        };

        setMessages(prev => [message, ...prev]);
        if (replyingToMsg) {
            setReplyingToMsg("")
            currReplyingToMsg = ""
        }
        setNewMessage('');

        // Simulate AI/Counselor response after 2 seconds
        if (chatData.chatType === 'ai_chat' || chatData.chatType === 'user') {
            // Clear any existing timeout
            if (aiResponseTimeoutRef.current) {
                clearTimeout(aiResponseTimeoutRef.current);
            }

            aiResponseTimeoutRef.current = setTimeout(() => {
                const aiResponse = {
                    id: (Date.now() + 1).toString(),
                    text: AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)],
                    sender: 'host',
                    timestamp: new Date(),
                    type: 'text',
                    read: false,
                    repliedToMsg: currReplyingToMsg || ""
                };

                setMessages(prev => [aiResponse, ...prev]);
            }, 2000);
        }
    }, [newMessage, chatData.chatType, replyingToMsg]);

    const handleMessageLongPress = useCallback((message) => {
        setSelectedMessage(message);
    }, []);

    const handleMessageAction = useCallback((action, message) => {
        setSelectedMessage(null);

        switch (action) {
            case 'copy':
                Clipboard.setStringAsync(message.text).then(() => {
                    Toast.show({
                        type: "success",
                        text2: "Message copied to clipboard"
                    });
                }).catch(() => {
                    Toast.show({
                        type: "error",
                        text2: "Failed to copy message"
                    });
                });
                break;
            case 'reply':
                setReplyingToMsg(message.text)
                break;
            case 'select':
                Toast.show({
                    type: "info",
                    text2: "Select multiple messages"
                });
                break;
            case 'delete':
                showConfirmation({
                    title: "Delete Message",
                    message: "Are you sure! You want to delete this message?",
                    onConfirm: () => {
                        setMessages(prev => prev.filter(msg => msg.id !== message.id));
                        Toast.show({
                            type: "success",
                            text2: "Message deleted!"
                        });
                        hideConfirmation();
                    },
                    onCancel: () => {
                        hideConfirmation();
                    },
                    confirmText: "Delete",
                    cancelText: "Cancel",
                    type: "danger"
                });
                break;
        }
    }, []);

    const handleCloseActionSheet = useCallback(() => {
        setSelectedMessage(null);
    }, []);

    const handleBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const renderMessage = useCallback(({ item }) => (
        <MessageBubble
            message={item}
            onLongPress={() => handleMessageLongPress(item)}
        />
    ), [handleMessageLongPress]);


    const sendButtonStyle = useMemo(() =>
        newMessage.trim() ? 'bg-themeColor' : 'bg-gray-200',
        [newMessage]
    );

    const sendIconColor = useMemo(() =>
        newMessage.trim() ? 'white' : COLORS.grey,
        [newMessage]
    );

    useEffect(() => {
        if (Platform.OS !== 'android') return;

        const showSub = Keyboard.addListener('keyboardDidShow', e => {
            setKeyboardHeight(e.endCoordinates.height + 60);
        });

        const hideSub = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardHeight(0);
        });

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);


    return (
        <View className='flex-1'>
            <ChatHeader host={chatData.host} onBack={handleBack} />

            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 130 : undefined}
            >
                <View className='flex-1 justify-between'>
                    {/* Messages List */}
                    <View className="flex-1 bg-gray-50">
                        <FlatList
                            inverted
                            ref={messagesFlatListRef}
                            data={messages}
                            keyExtractor={(item) => item.id}
                            renderItem={renderMessage}
                            className="px-4 py-5"
                            ItemSeparatorComponent={<View className='h-[7px]'></View>}
                            contentContainerStyle={{ paddingBottom: 30 }}
                            showsVerticalScrollIndicator={false}
                            onContentSizeChange={handleContentSizeChange}
                            initialNumToRender={10}
                        />
                    </View>

                    {/* Input Area */}
                    <View className={`bg-white border-t border-gray-200 px-4 pt-3`} style={{ paddingBottom: keyboardHeight || 10 }}>
                        {/* show only when replying */}
                        {replyingToMsg !== "" && <View className='mb-4 relative px-4'>
                            <Pressable className='absolute right-2' onPress={() => setReplyingToMsg("")}>
                                <Ionicons name='close' color={COLORS.themeColor} size={16} />
                            </Pressable>
                            <Text className='text-[11px] line-clamp-2 text-gray-500'>{replyingToMsg}</Text>
                        </View>}
                        <View className="flex-row items-center gap-2">
                            <TouchableOpacity className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
                                <Ionicons name="add" size={20} color={COLORS.grey} />
                            </TouchableOpacity>

                            <View className="flex-1">
                                <InputBox
                                    value={newMessage}
                                    setValue={setNewMessage}
                                    placeholder="Type a message..."
                                    multiline
                                />
                            </View>

                            <TouchableOpacity
                                className={`w-10 h-10 rounded-full items-center justify-center ${sendButtonStyle}`}
                                onPress={sendMessage}
                                disabled={!newMessage.trim()}
                            >
                                <Ionicons
                                    name="send"
                                    size={18}
                                    color={sendIconColor}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>

            </KeyboardAvoidingView>

            {/* Message Action Sheet */}
            <MessageActionSheet
                selectedMessage={selectedMessage}
                onClose={handleCloseActionSheet}
                onAction={handleMessageAction}
            />
        </View>
    );
}







const INITIAL_MESSAGES = [
    {
        id: '1',
        text: 'Hello! How can I help you today?',
        sender: 'host',
        timestamp: new Date(Date.now() - 3600000),
        type: 'text',
        read: true,
        repliedToMsg: null

    },
    {
        id: '2',
        text: 'Hi, I\'ve been feeling anxious lately and would like some guidance.',
        sender: 'customer',
        timestamp: new Date(Date.now() - 3500000),
        type: 'text',
        read: true,
        repliedToMsg: null
    },
    {
        id: '3',
        text: 'I understand. Let\'s start by exploring what might be triggering these feelings. Can you tell me more about when you typically feel anxious?',
        sender: 'host',
        timestamp: new Date(Date.now() - 3400000),
        type: 'text',
        read: true,
        repliedToMsg: null
    },
    {
        id: '4',
        text: 'It usually happens in social situations or when I have work deadlines.',
        sender: 'customer',
        timestamp: new Date(Date.now() - 3300000),
        type: 'text',
        read: true,
        repliedToMsg: null
    },
    {
        id: '5',
        text: 'Thank you for sharing that. Many people experience anxiety in similar situations. Would you like to learn some breathing techniques that can help?',
        sender: 'host',
        timestamp: new Date(Date.now() - 3200000),
        type: 'text',
        read: false,
        repliedToMsg: null
    },
    {
        id: '6',
        text: 'Thank you for sharing that. Many people experience anxiety in similar situations. Would you like to learn some breathing techniques that can help?',
        sender: 'host',
        timestamp: new Date(Date.now() - 3200000),
        type: 'text',
        read: false,
        repliedToMsg: null
    },
    {
        id: '7',
        text: 'Thank you for sharing that. Many people experience anxiety in similar situations. Would you like to learn some breathing techniques that can help?',
        sender: 'host',
        timestamp: new Date(Date.now() - 3200000),
        type: 'text',
        read: false,
        repliedToMsg: null
    },
    {
        id: '8',
        text: 'Thank you for sharing that. Many people experience anxiety in similar situations. Would you like to learn some breathing techniques that can help?',
        sender: 'customer',
        timestamp: new Date(Date.now() - 3200000),
        type: 'text',
        read: false,
        repliedToMsg: null
    },
];

const AI_RESPONSES = [
    "I understand how you're feeling. Let's work through this together.",
    "That's a common concern. Many people experience similar thoughts.",
    "Thank you for sharing that with me. It takes courage to open up.",
    "Let me help you explore some coping strategies for that situation.",
    "I'm here to support you. Would you like to discuss this further?"
];

const MESSAGE_ACTIONS = [
    { icon: 'copy', label: 'Copy', action: 'copy' },
    // { icon: 'arrow-redo', label: 'Forward', action: 'forward' },
    { icon: 'arrow-undo', label: 'Reply', action: 'reply' },
    // { icon: 'checkbox', label: 'Select', action: 'select' },
    { icon: 'trash', label: 'Delete', action: 'delete', destructive: true },
];
