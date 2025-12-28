import React, { useState, useCallback, memo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';

const FAQ_DATA = [
    {
        id: 1,
        question: "How do I book a counseling session?",
        answer: "Go to the 'Find Counselors' section, browse available professionals, select a time slot that works for you, and confirm your booking. You'll receive a confirmation with session details."
    },
    {
        id: 2,
        question: "Is my information kept confidential?",
        answer: "Yes, we take your privacy seriously. All sessions are encrypted and your personal information is protected in compliance with healthcare privacy regulations. Your counselor is also bound by confidentiality agreements."
    },
    {
        id: 3,
        question: "What if I need immediate help?",
        answer: "If you're experiencing a mental health emergency, please contact emergency services immediately. For crisis support, we recommend reaching out to local crisis hotlines which are available 24/7."
    },
    {
        id: 4,
        question: "Can I change or cancel my session?",
        answer: "Yes, you can reschedule or cancel sessions up to 12 hours before the scheduled time without any charges. Late cancellations may be subject to our cancellation policy."
    },
    {
        id: 5,
        question: "How do I know which counselor is right for me?",
        answer: "Each counselor has a detailed profile with their specialization, experience, and approach. You can also schedule a brief introductory call with potential counselors to find the best fit."
    }
];

const EMERGENCY_CONTACTS = [
    {
        id: 1,
        name: "National Suicide Prevention Lifeline",
        number: "988",
        description: "24/7 free and confidential support"
    },
    {
        id: 2,
        name: "Crisis Text Line",
        number: "Text HOME to 741741",
        description: "Free crisis support via text"
    },
    {
        id: 3,
        name: "SAMHSA Helpline",
        number: "1-800-662-4357",
        description: "Substance abuse and mental health services"
    }
];

const SUPPORT_OPTIONS = [
    {
        id: 1,
        icon: 'chatbubble-ellipses',
        title: 'Live Chat Support',
        description: 'Get instant help from our support team',
        action: () => Alert.alert('Live Chat', 'Connecting you with our support team...')
    },
    {
        id: 2,
        icon: 'call',
        title: 'Schedule a Call',
        description: 'Book a callback from our support specialists',
        action: () => Alert.alert('Schedule Call', 'Opening callback scheduling...')
    },
    {
        id: 3,
        icon: 'mail',
        title: 'Email Support',
        description: 'Send us a detailed message',
        action: () => Linking.openURL('mailto:support@mysticaura.com?subject=Help%20&%20Support')
    },
    {
        id: 4,
        icon: 'document-text',
        title: 'Help Articles',
        description: 'Browse our comprehensive guides',
        action: () => Alert.alert('Help Articles', 'Opening knowledge base...')
    }
];

// ContactCard component
const ContactCard = memo(({ contact, onPress }) => (
    <TouchableOpacity
        className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 shadow-sm"
        onPress={onPress}
    >
        <View className="flex-row items-start gap-3">
            <View className="w-10 h-10 rounded-full bg-red-100 items-center justify-center">
                <Ionicons name="warning" size={20} color="#EF4444" />
            </View>
            <View className="flex-1">
                <Text className="font-InterSemiBold text-base text-slate-800">{contact.name}</Text>
                <Text className="font-InterMedium text-red-500 text-sm mt-1">{contact.number}</Text>
                <Text className="font-InterRegular text-gray-500 text-xs mt-1">{contact.description}</Text>
            </View>
            <Ionicons name="call" size={20} color={COLORS.themeColor} />
        </View>
    </TouchableOpacity>
));

// SupportOptionCard component
const SupportOptionCard = memo(({ option, onPress }) => (
    <TouchableOpacity
        className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 shadow-sm"
        onPress={onPress}
    >
        <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 rounded-xl bg-themeColor/10 items-center justify-center">
                <Ionicons name={option.icon} size={24} color={COLORS.themeColor} />
            </View>
            <View className="flex-1">
                <Text className="font-InterSemiBold text-base text-slate-800">{option.title}</Text>
                <Text className="font-InterRegular text-gray-500 text-sm mt-1">{option.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </View>
    </TouchableOpacity>
));

// FAQItem component
const FAQItem = memo(({ item, isExpanded, onToggle }) => (
    <View className="bg-white rounded-2xl mb-3 border border-gray-100 shadow-sm overflow-hidden">
        <TouchableOpacity
            className="p-4 flex-row justify-between items-center"
            onPress={onToggle}
        >
            <Text className="font-InterMedium text-slate-800 flex-1 pr-2">{item.question}</Text>
            <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={COLORS.grey}
            />
        </TouchableOpacity>

        {isExpanded && (
            <View className="px-4 pb-4 border-t border-gray-100 pt-3">
                <Text className="font-Inter text-gray-600 leading-6">{item.answer}</Text>
            </View>
        )}
    </View>
));

const HelpSupportScreen = () => {
    const [expandedSection, setExpandedSection] = useState(null);

    // Memoize toggleSection handler
    const toggleSection = useCallback((id) => {
        setExpandedSection(prev => prev === id ? null : id);
    }, []);

    // Memoize contact press handler
    const handleContactPress = useCallback((contact) => {
        if (contact.number.includes('Text')) {
            Alert.alert('Crisis Text Line', 'Please text HOME to 741741 for support');
        } else {
            Linking.openURL(`tel:${contact.number}`);
        }
    }, []);

    // Memoize support option handlers
    const handleSupportOptionPress = useCallback((option) => {
        option.action();
    }, []);

    // Memoize FAQ toggle handlers
    const handleFAQToggle = useCallback((id) => {
        toggleSection(id);
    }, [toggleSection]);

    return (
        <>
            <ScrollView className="flex-1 py-4 mt-2" showsVerticalScrollIndicator={false}>
                {/* Emergency Contacts */}
                <View className="px-4 mb-6">
                    <Text className="font-InterSemibold text-xl text-slate-800 mb-4">Emergency Contacts</Text>
                    {EMERGENCY_CONTACTS.map((contact) => (
                        <ContactCard
                            key={contact.id}
                            contact={contact}
                            onPress={() => handleContactPress(contact)}
                        />
                    ))}
                </View>

                {/* Support Options */}
                <View className="px-4 mb-6">
                    <Text className="font-InterSemibold text-xl text-slate-800 mb-4">Get Help</Text>
                    {SUPPORT_OPTIONS.map((option) => (
                        <SupportOptionCard
                            key={option.id}
                            option={option}
                            onPress={() => handleSupportOptionPress(option)}
                        />
                    ))}
                </View>

                {/* FAQ Section */}
                <View className="px-4 mb-6">
                    <Text className="font-InterSemibold text-xl text-slate-800 mb-4">Frequently Asked Questions</Text>
                    {FAQ_DATA.map((item) => (
                        <FAQItem
                            key={item.id}
                            item={item}
                            isExpanded={expandedSection === item.id}
                            onToggle={() => handleFAQToggle(item.id)}
                        />
                    ))}
                </View>

                {/* Additional Resources */}
                <View className="px-4 mb-8">
                    <View className="bg-themeColor/10 rounded-2xl p-4 border border-themeColor">
                        <Text className="font-InterSemibold text-lg text-themeColor mb-2">Additional Resources</Text>
                        <Text className="font-InterRegular text-themeColor text-sm mb-3">
                            Explore our library of mental health resources, articles, and self-help tools.
                        </Text>
                        <TouchableOpacity className="bg-white rounded-xl py-3 px-4 border border-themeColor">
                            <Text className="font-InterSemibold text-themeColor/90 text-center">Browse Resources</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </>
    );
};

export default HelpSupportScreen;
