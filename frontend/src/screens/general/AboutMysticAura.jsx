import React, { useCallback, useMemo, memo } from 'react';
import { View, Text, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { GradientContainer } from '@/components';

// Move constants outside component
const APP_FEATURES = [
    {
        id: 1,
        icon: 'shield-checkmark',
        title: 'Secure & Confidential',
        description: 'End-to-end encryption and strict privacy protocols'
    },
    {
        id: 2,
        icon: 'accessibility',
        title: 'Accessible Care',
        description: 'Affordable mental health support for everyone'
    },
    {
        id: 3,
        icon: 'heart',
        title: 'Compassionate Approach',
        description: 'Personalized care with empathy and understanding'
    },
    {
        id: 4,
        icon: 'star',
        title: 'Verified Professionals',
        description: 'All counselors are licensed and background-checked'
    }
];

const TEAM_MEMBERS = [
    {
        id: 1,
        name: 'Dr. Sarah Chen',
        role: 'Clinical Psychologist',
        specialization: 'Anxiety & Trauma',
        experience: '12+ years'
    },
    {
        id: 2,
        name: 'Michael Rodriguez',
        role: 'Licensed Therapist',
        specialization: 'Relationship Counseling',
        experience: '8+ years'
    },
    {
        id: 3,
        name: 'Dr. Emily Watson',
        role: 'Psychiatrist',
        specialization: 'Medication Management',
        experience: '15+ years'
    },
    {
        id: 4,
        name: 'James Kim',
        role: 'Mental Health Coach',
        specialization: 'Mindfulness & Stress',
        experience: '6+ years'
    }
];

const SOCIAL_LINKS = [
    {
        id: 1,
        name: 'Website',
        icon: 'globe',
        url: 'https://mysticaura.com'
    },
    {
        id: 2,
        name: 'Twitter',
        icon: 'logo-twitter',
        url: 'https://twitter.com/mysticaura'
    },
    {
        id: 3,
        name: 'Instagram',
        icon: 'logo-instagram',
        url: 'https://instagram.com/mysticaura'
    },
    {
        id: 4,
        name: 'LinkedIn',
        icon: 'logo-linkedin',
        url: 'https://linkedin.com/company/mysticaura'
    }
];

// Memoized FeatureCard component
const FeatureCard = memo(({ feature }) => (
    <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 shadow-sm">
        <View className="flex-row items-start gap-3">
            <View className="w-10 h-10 rounded-lg bg-themeColor/10 items-center justify-center">
                <Ionicons name={feature.icon} size={20} color={COLORS.themeColor} />
            </View>
            <View className="flex-1">
                <Text className="font-InterSemibold text-base text-slate-800 mb-1">{feature.title}</Text>
                <Text className="font-Inter text-gray-500 text-sm">{feature.description}</Text>
            </View>
        </View>
    </View>
));

// Memoized TeamMemberCard component
const TeamMemberCard = memo(({ member }) => {
    const initials = useMemo(() => 
        member.name.split(' ').map(n => n[0]).join(''),
        [member.name]
    );

    const avatarStyle = useMemo(() => ({
        borderRadius: 50,
        marginBottom: 0,
        padding: 0,
        width: 50,
        height: 50,
        maxWidth: 50,
        maxHeight: 50,
        alignItems: 'center',
        justifyContent: 'center'
    }), []);

    return (
        <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 shadow-sm">
            <View className="flex-row items-start gap-3">
                <GradientContainer style={avatarStyle}>
                    <Text className="font-InterBold text-white text-sm">
                        {initials}
                    </Text>
                </GradientContainer>
                <View className="flex-1">
                    <Text className="font-InterSemibold text-base text-slate-800">{member.name}</Text>
                    <Text className="font-InterMedium text-themeColor text-sm mt-1">{member.role}</Text>
                    <Text className="font-Inter text-gray-500 text-sm mt-1">{member.specialization}</Text>
                    <Text className="font-Inter text-gray-400 text-xs mt-1">{member.experience} experience</Text>
                </View>
            </View>
        </View>
    );
});

// Memoized SocialLinkItem component
const SocialLinkItem = memo(({ social, onPress }) => (
    <TouchableOpacity
        className="w-12 h-12 bg-white rounded-xl border border-gray-200 items-center justify-center shadow-sm"
        onPress={onPress}
    >
        <Ionicons name={social.icon} size={24} color={COLORS.themeColor} />
    </TouchableOpacity>
));

// Memoized AppInfoRow component
const AppInfoRow = memo(({ label, value, onPress }) => (
    <View className={`flex-row justify-between items-center py-3 ${onPress ? '' : 'border-b border-gray-100'}`}>
        <Text className="font-InterMedium text-gray-600">{label}</Text>
        {onPress ? (
            <TouchableOpacity onPress={onPress}>
                <Text className="font-InterSemibold text-themeColor">View</Text>
            </TouchableOpacity>
        ) : (
            <Text className="font-InterSemibold text-slate-800">{value}</Text>
        )}
    </View>
));

const AboutMysticAuraScreen = () => {
    // Memoize handlers
    const handlePrivacyPolicyPress = useCallback(() => {
        Linking.openURL('https://mysticaura.com/privacy');
    }, []);

    const handleSocialLinkPress = useCallback((url) => {
        Linking.openURL(url);
    }, []);

    return (
        <>
            <ScrollView
                className="flex-1 bg-gray-50"
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Section */}
                <View className="px-4 my-6">
                    <GradientContainer>
                        <View className="items-center">
                            <View className="w-16 h-16 bg-white/20 rounded-2xl items-center justify-center mb-3">
                                <Ionicons name="heart" size={32} color="white" />
                            </View>
                            <Text className="font-InterBold text-white text-xl text-center mb-2">
                                Mental Wellness Made Accessible
                            </Text>
                            <Text className="font-InterRegular text-white/90 text-center text-sm leading-5">
                                MysticAura is dedicated to providing compassionate, professional mental health support to everyone, anywhere.
                            </Text>
                        </View>
                    </GradientContainer>
                </View>

                {/* Mission Statement */}
                <View className="px-4 mb-6">
                    <View className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                        <Text className="font-InterSemibold text-lg text-slate-800 mb-3">Our Mission</Text>
                        <Text className="font-Inter text-gray-600 leading-6">
                            To break down barriers to mental healthcare by providing accessible, affordable, and stigma-free counseling services. We believe everyone deserves support on their mental health journey, and we're committed to making that support available whenever and wherever it's needed.
                        </Text>
                    </View>
                </View>

                {/* Features */}
                <View className="px-4 mb-6">
                    <Text className="font-InterSemibold text-xl text-slate-800 mb-4">Why Choose MysticAura?</Text>
                    {APP_FEATURES.map((feature) => (
                        <FeatureCard key={feature.id} feature={feature} />
                    ))}
                </View>

                {/* Team Section */}
                <View className="px-4 mb-6">
                    <Text className="font-InterSemibold text-xl text-slate-800 mb-4">Our Expert Team</Text>
                    <Text className="font-Inter text-gray-500 text-sm mb-4">
                        Licensed professionals dedicated to your mental wellbeing
                    </Text>
                    {TEAM_MEMBERS.map((member) => (
                        <TeamMemberCard key={member.id} member={member} />
                    ))}
                </View>

                {/* App Info */}
                <View className="px-4 mb-6">
                    <View className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                        <Text className="font-InterSemibold text-lg text-slate-800 mb-4">App Information</Text>

                        <AppInfoRow label="Version" value="1.0.0" />
                        <AppInfoRow label="Last Updated" value="December 2024" />
                        <AppInfoRow label="Privacy Policy" onPress={handlePrivacyPolicyPress} />
                    </View>
                </View>

                {/* Social Links */}
                <View className="px-4 mb-8">
                    <Text className="font-InterSemibold text-lg text-slate-800 mb-4 text-center">Connect With Us</Text>
                    <View className="flex-row justify-center gap-4">
                        {SOCIAL_LINKS.map((social) => (
                            <SocialLinkItem
                                key={social.id}
                                social={social}
                                onPress={() => handleSocialLinkPress(social.url)}
                            />
                        ))}
                    </View>
                </View>

                {/* Footer */}
                <View className="px-4 mb-8">
                    <Text className="font-Inter text-gray-400 text-xs text-center">
                        © 2024 MysticAura. All rights reserved.{'\n'}
                        Making mental healthcare accessible to all.
                    </Text>
                </View>
            </ScrollView>
        </>
    );
};

export default AboutMysticAuraScreen;
