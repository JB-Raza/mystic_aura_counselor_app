import { Ionicons } from "@expo/vector-icons";
import { useState, useCallback, useMemo, memo } from "react";
import { Text, View, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { AnimatedStarBg, ButtonFullWidth } from "@/components";
import { COLORS } from "@/constants/theme";
import ROUTES from "@/constants/routes";

// Memoized PasswordToggle component
const PasswordToggle = memo(({ showPassword, onToggle }) => (
    <TouchableOpacity
        className="absolute right-4 top-4"
        onPress={onToggle}
    >
        <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color="#6B7280"
        />
    </TouchableOpacity>
));

// Memoized EmailIcon component
const EmailIcon = memo(() => (
    <Ionicons
        name="mail"
        size={20}
        color="#6B7280"
        style={{ position: 'absolute', right: 16, top: 14 }}
    />
));

export default function LoginScreen() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigation = useNavigation();

    // Memoize KeyboardAvoidingView props
    const keyboardBehavior = useMemo(() =>
        Platform.OS === "ios" ? "padding" : "height",
        []
    );

    const keyboardVerticalOffset = useMemo(() =>
        Platform.OS === "ios" ? 90 : 200,
        []
    );

    // Memoize contentContainerStyle
    const scrollViewContentStyle = useMemo(() => ({ flexGrow: 1 }), []);

    // Memoize handlers
    const handleEmailChange = useCallback((text) => {
        setFormData(prev => ({ ...prev, email: text }));
    }, []);

    const handlePasswordChange = useCallback((text) => {
        setFormData(prev => ({ ...prev, password: text }));
    }, []);

    const handleTogglePassword = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    const handleForgotPassword = useCallback(() => {
        navigation.navigate(ROUTES.FORGET_PASSWORD);
    }, [navigation]);

    const handleGoogleLogin = useCallback(() => {
        console.log('Google login');
    }, []);

    const handleLogin = useCallback(() => {
        // console.log('Login pressed');
        navigation.navigate(ROUTES.LANDING)
    }, []);

    return (
        <View className="flex-1 bg-slate-900">
            {/* Background Animation */}
            <AnimatedStarBg />

            <KeyboardAvoidingView
                behavior={keyboardBehavior}
                className="flex-1"
                keyboardVerticalOffset={keyboardVerticalOffset}
            >
                <ScrollView
                    contentContainerStyle={scrollViewContentStyle}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex-1 justify-center px-6 pb-10">
                        {/* Header Section */}
                        <View className="items-center mb-12">
                            <View className="w-16 h-16 rounded-2xl bg-themeColor/10 items-center justify-center mb-4">
                                <Ionicons name="lock-closed" size={28} color={COLORS.themeColor} />
                            </View>
                            <Text className="text-white font-InterBold text-[28px] text-center mb-2">
                                Welcome Back
                            </Text>
                            <Text className="text-gray-400 font-Inter text-[16px] text-center">
                                Sign in to continue your wellness journey
                            </Text>
                        </View>

                        {/* Social Login */}
                        <View className="mb-8">
                            <ButtonFullWidth
                                text={"Continue with Google"}
                                icon={"logo-google"}
                                iconColor={"#DB4437"}
                                btnClassName={"bg-white border border-gray-200 rounded-xl"}
                                textClassName={"text-slate-800 font-InterSemibold"}
                                onPress={handleGoogleLogin}
                            />
                        </View>

                        {/* Divider */}
                        <View className="flex-row items-center mb-8">
                            <View className="flex-1 h-px bg-gray-700" />
                            <Text className="text-gray-500 font-InterMedium text-[14px] mx-4">or</Text>
                            <View className="flex-1 h-px bg-gray-700" />
                        </View>

                        {/* Login Form */}
                        <View>
                            {/* Email Input */}
                            <View className="mb-4">
                                <Text className="text-white font-InterMedium text-[14px] mb-2 ml-1">
                                    Email Address
                                </Text>
                                <View className="relative">
                                    <TextInput
                                        className="bg-slate-800 border border-gray-700 rounded-xl py-4 px-5 text-white font-Inter text-[16px]"
                                        placeholder="Enter your email"
                                        placeholderTextColor="#9CA3AF"
                                        value={formData.email}
                                        onChangeText={handleEmailChange}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                    <EmailIcon />
                                </View>
                            </View>

                            {/* Password Input */}
                            <View className="mb-1">
                                <Text className="text-white font-InterMedium text-[14px] mb-2 ml-1">
                                    Password
                                </Text>
                                <View className="relative">
                                    <TextInput
                                        className="bg-slate-800 border border-gray-700 rounded-xl py-4 px-5 text-white font-Inter text-[16px]"
                                        placeholder="Enter your password"
                                        placeholderTextColor="#9CA3AF"
                                        value={formData.password}
                                        onChangeText={handlePasswordChange}
                                        secureTextEntry={!showPassword}
                                    />
                                    <PasswordToggle
                                        showPassword={showPassword}
                                        onToggle={handleTogglePassword}
                                    />
                                </View>
                            </View>

                            {/* Forgot Password */}
                            <TouchableOpacity
                                onPress={handleForgotPassword}
                                className="self-end"
                            >
                                <Text className="text-themeColor font-InterMedium text-[14px]">
                                    Forgot Password?
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Terms */}
                        <Text className="text-gray-400 text-[12px] leading-[16px] mt-8 text-center">
                            By continuing, you agree to Mystic Aura's{" "}
                            <Text className="text-themeColor underline">Terms of Use</Text>{" "}
                            &{" "}
                            <Text className="text-themeColor underline">Privacy Policy</Text>
                        </Text>
                    </View>
                </ScrollView>

                {/* Login Button - Fixed at bottom */}
                <View className="px-6 pb-6 pt-4 bg-slate-900 border-t border-gray-800">
                    <ButtonFullWidth
                        text={"Sign In"}
                        icon={"log-in"}
                        btnClassName={"bg-themeColor rounded-xl shadow-lg shadow-themeColor/25"}
                        iconColor={"white"}
                        textClassName={"text-white font-InterSemibold text-[16px]"}
                        onPress={handleLogin}
                    />
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}
