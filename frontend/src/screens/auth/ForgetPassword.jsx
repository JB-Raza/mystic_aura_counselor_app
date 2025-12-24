import { Text, View, TextInput, TouchableOpacity, StyleSheet, Animated } from "react-native";

import { useEffect, useRef, useState, useCallback, useMemo, memo } from "react";
import { AnimatedStarBg, ButtonFullWidth } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { useNavigation } from '@react-navigation/native';

// confirmation-code-field
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ROUTES from "@/constants/routes";

// Constants moved outside component
const PASSWORD_REQUIREMENTS = [
    "At least 8 characters",
    "One uppercase letter",
    "One number",
    "One special character"
];

const STEPS = [1, 2, 3];

// Memoized EmailIcon component
const EmailIcon = memo(() => (
    <Ionicons
        name="mail"
        size={20}
        color="#6B7280"
        style={{ position: 'absolute', right: 16, top: 14 }}
    />
));

// Memoized StepIndicator component
const StepIndicator = memo(({ stepNumber, currentStep }) => {
    const isActive = currentStep >= stepNumber;
    const isCompleted = currentStep > stepNumber;

    return (
        <View className="items-center">
            <View className={`w-8 h-8 rounded-full items-center justify-center ${isActive ? "bg-themeColor" : "bg-gray-700"}`}>
                <Text className={`font-InterSemibold text-[14px] ${isActive ? "text-white" : "text-gray-400"}`}>
                    {stepNumber}
                </Text>
            </View>
            {stepNumber < 3 && (
                <View className={`h-0.5 flex-1 mx-2 ${isCompleted ? "bg-themeColor" : "bg-gray-700"}`} />
            )}
        </View>
    );
});

// Memoized PasswordRequirement component
const PasswordRequirement = memo(({ requirement }) => (
    <View className="flex-row items-center gap-2">
        <Ionicons name="checkmark-circle" size={16} color="#10B981" />
        <Text className="text-gray-400 font-Inter text-[13px]">
            {requirement}
        </Text>
    </View>
));

const AnimatedText = Animated.createAnimatedComponent(Text);

// Memoized OTPSection component
const OTPSection = memo(({ otp, setOtp, hasError = false }) => {
    const otpRef = useBlurOnFulfill({ otp, cellCount: 6 })
    const [_, getCellOnLayoutHandler] = useClearByFocusCell({
        otp, setOtp
    })
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (otp.length > 0) {
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 3,
                tension: 40,
                useNativeDriver: true,
            }).start();
        }
    }, [otp, scaleAnim]);

    const renderCell = useCallback(({ index, symbol, isFocused }) => {
        const cellScale = symbol ? scaleAnim : 1;

        return (
            <AnimatedText
                key={index}
                style={[
                    styles.cell,
                    isFocused && styles.focusCell,
                    symbol && styles.filledCell,
                    hasError && styles.errorCell,
                    { transform: [{ scale: cellScale }] }
                ]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : '')}
            </AnimatedText>
        );
    }, [scaleAnim, hasError, getCellOnLayoutHandler]);

    return (
        <CodeField
            ref={otpRef}
            value={otp}
            onChangeText={setOtp}
            cellCount={5}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={renderCell}
        />
    );
});

export default function ForgetPassword() {
    const [email, setEmail] = useState("");
    const [step, setStep] = useState(1);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigation = useNavigation();

    const [otp, setOtp] = useState("");

    // Memoize step-based values
    const headerIcon = useMemo(() => {
        if (step === 1) return "key-outline";
        if (step === 2) return "lock-closed";
        return "checkmark-circle";
    }, [step]);

    const headerTitle = useMemo(() => {
        if (step === 1) return "Reset Password";
        if (step === 2) return "Verify Code";
        return "New Password";
    }, [step]);

    const headerDescription = useMemo(() => {
        if (step === 1) return "Enter your email to receive verification code";
        if (step === 2) return "Enter the 6-digit code sent to your email";
        return "Create your new password";
    }, [step]);

    const backButtonText = useMemo(() => 
        step > 1 ? "Go Back" : "Back to Login",
        [step]
    );

    // Memoize handlers
    const handleSendCode = useCallback(() => {
        setStep(2);
    }, []);

    const handleVerifyCode = useCallback(() => {
        setStep(3);
    }, []);

    const handleResetPassword = useCallback(() => {
        console.log("Password reset successfully");
        navigation.navigate(ROUTES.LOGIN);
    }, [navigation]);

    const handleBack = useCallback(() => {
        if (step > 1) {
            setStep(prev => prev - 1);
        } else {
            navigation.goBack();
        }
    }, [step, navigation]);

    const handleResendCode = useCallback(() => {
        // Handle resend code logic
        console.log('Resend code');
    }, []);

    return (
        <View className="flex-1 bg-slate-900">
            <AnimatedStarBg />

            <KeyboardAwareScrollView>
                <View className="flex-1 justify-center px-6 pb-10">
                    {/* header */}
                    <View className="items-center mb-8">
                        <View className="w-16 h-16 rounded-2xl bg-themeColor/10 items-center justify-center mb-4">
                            <Ionicons
                                name={headerIcon}
                                size={28}
                                color={COLORS.themeColor}
                            />
                        </View>
                        <Text className="text-white font-InterBold text-[28px] text-center mb-2">
                            {headerTitle}
                        </Text>
                        <Text className="text-gray-400 font-Inter text-[16px] text-center">
                            {headerDescription}
                        </Text>
                    </View>

                    {/* progress steps */}
                    <View className="flex-row justify-between items-center mb-8 px-4">
                        {STEPS.map((stepNumber) => (
                            <StepIndicator
                                key={stepNumber}
                                stepNumber={stepNumber}
                                currentStep={step}
                            />
                        ))}
                    </View>

                    {/* email */}
                    {step === 1 && (
                        <View className="space-y-6">
                            <View className="mb-4">
                                <Text className="text-white font-InterMedium text-[14px] mb-2 ml-1">
                                    Email Address
                                </Text>
                                <View className="relative">
                                    <TextInput
                                        className="bg-slate-800 border border-gray-700 rounded-xl py-4 px-5 text-white font-Inter text-[16px]"
                                        placeholder="Enter your email"
                                        placeholderTextColor="#9CA3AF"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                    <EmailIcon />
                                </View>
                            </View>

                            <ButtonFullWidth
                                text={"Send Verification Code"}
                                icon={"send"}
                                btnClassName={"bg-themeColor rounded-xl shadow-lg shadow-themeColor/25"}
                                iconColor={"white"}
                                textClassName={"text-white font-InterSemibold text-[16px]"}
                                onPress={handleSendCode}
                            />
                        </View>
                    )}

                    {/* OTP verification */}
                    {step === 2 && (
                        <View>
                            <View>
                                <Text className="text-white font-InterMedium text-[14px] mb-4 text-center">
                                    Enter 6-digit verification code
                                </Text>
                                <View className="flex-row mb-2 justify-between gap-2">
                                    <OTPSection otp={otp} setOtp={setOtp} hasError={false} />
                                </View>
                            </View>

                            <View className="flex-row justify-center items-center gap-1 mb-2">
                                <Text className="text-gray-400 font-Inter text-[14px]">
                                    Didn't receive code?
                                </Text>
                                <TouchableOpacity onPress={handleResendCode}>
                                    <Text className="text-themeColor font-InterSemibold text-[14px]">
                                        Resend
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <ButtonFullWidth
                                text={"Verify Code"}
                                disabled={otp.length < 5}
                                icon={"checkmark-circle"}
                                btnClassName={"bg-themeColor disabled:bg-gray-300 rounded-xl shadow-lg shadow-themeColor/25"}
                                iconColor={"white"}
                                textClassName={"text-white font-InterSemibold text-[16px]"}
                                onPress={handleVerifyCode}
                            />
                        </View>
                    )}

                    {/* new password */}
                    {step === 3 && (
                        <View className="flex-1 py-10 justify-between">
                            <View>
                                <View className="mb-4">
                                    <Text className="text-white font-InterMedium text-[14px] mb-2 ml-1">
                                        New Password
                                    </Text>
                                    <TextInput
                                        className="bg-slate-800 border border-gray-700 rounded-xl py-4 px-5 text-white font-Inter text-[16px]"
                                        placeholder="Enter new password"
                                        placeholderTextColor="#9CA3AF"
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                        secureTextEntry
                                    />
                                </View>

                                <View className="mb-4">
                                    <Text className="text-white font-InterMedium text-[14px] mb-2 ml-1">
                                        Confirm Password
                                    </Text>
                                    <TextInput
                                        className="bg-slate-800 border border-gray-700 rounded-xl py-4 px-5 text-white font-Inter text-[16px]"
                                        placeholder="Confirm new password"
                                        placeholderTextColor="#9CA3AF"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry
                                    />
                                </View>
                            </View>
                            {/* requirements */}
                            <View className="mt-10">
                                <View className="mb-4 bg-slate-800 rounded-xl p-4 border border-gray-700">
                                    <Text className="text-white font-InterMedium text-[14px] mb-2">
                                        Password must contain:
                                    </Text>
                                    <View className="space-y-1">
                                        {PASSWORD_REQUIREMENTS.map((requirement, index) => (
                                            <PasswordRequirement key={index} requirement={requirement} />
                                        ))}
                                    </View>
                                </View>

                                <ButtonFullWidth
                                    text={"Reset Password"}
                                    icon={"refresh"}
                                    btnClassName={"bg-themeColor rounded-xl shadow-lg shadow-themeColor/25"}
                                    iconColor={"white"}
                                    textClassName={"text-white font-InterSemibold text-[16px]"}
                                    onPress={handleResetPassword}
                                />
                            </View>
                        </View>
                    )}

                    <TouchableOpacity
                        onPress={handleBack}
                        className="self-center mt-6"
                    >
                        <Text className="text-themeColor font-InterMedium text-[14px]">
                            {backButtonText}
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    codeFieldRoot: {
        marginTop: 30,
        marginHorizontal: "auto",
        justifyContent: 'center',
        alignItems: 'center',
    },
    cell: {
        width: 40,
        height: 40,
        lineHeight: 44,
        fontSize: 18,
        fontFamily: 'Inter-Semibold',
        borderWidth: 2,
        borderColor: '#F3F4F6',
        borderRadius: 10,
        textAlign: 'center',
        color: '#111827',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 3,
    },
    focusCell: {
        borderColor: '#6C63FF',
        backgroundColor: '#FFFFFF',
        shadowColor: '#6C63FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    filledCell: {
        borderColor: '#6C63FF',
        backgroundColor: '#F8FAFF',
        shadowColor: '#6C63FF',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    errorCell: {
        borderColor: '#EF4444',
        backgroundColor: '#FEF2F2',
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
});
