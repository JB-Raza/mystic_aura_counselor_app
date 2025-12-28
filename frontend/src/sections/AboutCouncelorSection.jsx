import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";

export default function AboutCouncelorSection({ counselor }) {
    const [readMore, setReadMore] = useState(false);

    // Sample counselor data - you can pass this as prop
    const counselorData = {
        name: "Dr. Sarah Johnson",
        specialty: "Clinical Psychologist",
        experience: "8 years",
        education: [
            "PhD in Clinical Psychology - Stanford University",
            "Masters in Counseling Psychology - UCLA",
            "Licensed Clinical Psychologist (LCP)"
        ],
        approaches: [
            "Cognitive Behavioral Therapy (CBT)",
            "Mindfulness-Based Therapy",
            "Solution-Focused Brief Therapy",
            "Trauma-Informed Care"
        ],
        specialties: [
            "Anxiety & Stress Management",
            "Depression & Mood Disorders",
            "Relationship Issues",
            "Trauma & PTSD",
            "Self-Esteem & Personal Growth"
        ],
        languages: ["English", "Spanish"],
        about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
    };

    const StatCard = ({ icon, value, label }) => (
        <View className="bg-gray-50 rounded-xl p-4 flex-1 items-center">
            <Ionicons name={icon} size={24} color={COLORS.themeColor} />
            <Text className="font-InterBold text-slate-800 text-lg mt-2">{value}</Text>
            <Text className="font-Inter text-gray-500 text-xs text-center mt-1">{label}</Text>
        </View>
    );

    const InfoSection = ({ title, items, icon }) => (
        <View className="mb-6">
            <View className="flex-row items-center gap-2 mb-3">
                <Ionicons name={icon} size={20} color={COLORS.themeColor} />
                <Text className="font-InterBold text-slate-800 text-base">{title}</Text>
            </View>
            <View className="bg-gray-50 rounded-xl p-4">
                {items.map((item, index) => (
                    <View key={index} className="flex-row items-start gap-2 mb-2 last:mb-0">
                        <Ionicons name="checkmark-circle" size={16} color="#10B981" style={{ marginTop: 2 }} />
                        <Text className="font-Inter text-slate-700 text-sm flex-1">{item}</Text>
                    </View>
                ))}
            </View>
        </View>
    );

    return (
        <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
            <View className="p-4">
                {/* Quick Stats */}
                <View className="flex-row gap-3 mb-6">
                    <StatCard
                        icon="school"
                        value={counselorData.experience}
                        label="Experience"
                    />
                    <StatCard
                        icon="people"
                        value="500+"
                        label="Clients Helped"
                    />
                    <StatCard
                        icon="chatbubble-ellipses"
                        value="4.9"
                        label="Rating"
                    />
                </View>

                {/* About Me Section */}
                <View className="mb-6">
                    <View className="flex-row items-center gap-2 mb-3">
                        <Ionicons name="person" size={20} color={COLORS.themeColor} />
                        <Text className="font-InterBold text-slate-800 text-lg">About Me</Text>
                    </View>
                    <View className="bg-gray-50 rounded-xl p-4">
                        <Text
                            className={`font-Inter text-slate-700 text-sm leading-6 ${readMore ? "" : "line-clamp-3"
                                }`}
                        >
                            {counselorData.about}
                        </Text>
                        <Pressable
                            onPress={() => setReadMore(!readMore)}
                            className="mt-3"
                        >
                            <Text className="text-themeColor font-InterSemiBold text-sm">
                                Read {readMore ? "Less" : "More"}
                            </Text>
                        </Pressable>
                    </View>
                </View>

                {/* Therapeutic Approaches */}
                <InfoSection
                    title="Therapeutic Approaches"
                    items={counselorData.approaches}
                    icon="compass"
                />

                {/* Specialties */}
                <InfoSection
                    title="Areas of Specialization"
                    items={counselorData.specialties}
                    icon="medkit"
                />

                {/* Education & Credentials */}
                <View className="mb-6">
                    <View className="flex-row items-center gap-2 mb-3">
                        <Ionicons name="ribbon" size={20} color={COLORS.themeColor} />
                        <Text className="font-InterBold text-slate-800 text-base">Education & Credentials</Text>
                    </View>
                    <View className="bg-gray-50 rounded-xl p-4">
                        {counselorData.education.map((item, index) => (
                            <View key={index} className="flex-row items-start gap-2 mb-3 last:mb-0">
                                <Ionicons name="checkmark-circle" size={16} color={COLORS.themeColor} style={{ marginTop: 2 }} />
                                <Text className="font-Inter text-slate-700 text-sm flex-1">{item}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Languages */}
                <View className="mb-6">
                    <View className="flex-row items-center gap-2 mb-3">
                        <Ionicons name="language" size={20} color={COLORS.themeColor} />
                        <Text className="font-InterBold text-slate-800 text-base">Languages Spoken</Text>
                    </View>
                    <View className="flex-row gap-2">
                        {counselorData.languages.map((language, index) => (
                            <View key={index} className="bg-themeColor/10 rounded-full px-3 py-2">
                                <Text className="font-InterMedium text-themeColor text-sm">{language}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Philosophy */}
                <View className="mb-6">
                    <View className="flex-row items-center gap-2 mb-3">
                        <Ionicons name="heart" size={20} color={COLORS.themeColor} />
                        <Text className="font-InterBold text-slate-800 text-base">My Philosophy</Text>
                    </View>
                    <View className="bg-themeColor/10 rounded-xl p-4 border border-themeColor">
                        <Text className="font-Inter text-slate-700 text-sm leading-6 italic">
                            "I believe in creating a safe, non-judgmental space where clients can explore their thoughts and feelings. My approach is collaborative, and I'm committed to helping you develop the tools and insights needed for meaningful change."
                        </Text>
                    </View>
                </View>

                {/* Session Style */}
                <View className="mb-2">
                    <View className="flex-row items-center gap-2 mb-3">
                        <Ionicons name="time" size={20} color={COLORS.themeColor} />
                        <Text className="font-InterBold text-slate-800 text-base">What to Expect</Text>
                    </View>
                    <View className="bg-gray-50 rounded-xl p-4">
                        <View className="flex-row items-start gap-2 mb-2">
                            <Ionicons name="checkmark-circle" size={16} color="#10B981" style={{ marginTop: 2 }} />
                            <Text className="font-Inter text-slate-700 text-sm flex-1">
                                Collaborative goal-setting in first session
                            </Text>
                        </View>
                        <View className="flex-row items-start gap-2 mb-2">
                            <Ionicons name="checkmark-circle" size={16} color="#10B981" style={{ marginTop: 2 }} />
                            <Text className="font-Inter text-slate-700 text-sm flex-1">
                                Evidence-based therapeutic techniques
                            </Text>
                        </View>
                        <View className="flex-row items-start gap-2">
                            <Ionicons name="checkmark-circle" size={16} color="#10B981" style={{ marginTop: 2 }} />
                            <Text className="font-Inter text-slate-700 text-sm flex-1">
                                Practical tools and coping strategies
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
