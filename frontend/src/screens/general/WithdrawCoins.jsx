import React, { useState, useCallback, useMemo, memo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { IMAGES } from '@/constants/images';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { GradientContainer, ButtonFullWidth } from '@/components';
import { Toast } from 'toastify-react-native';


const QUICK_AMOUNTS = [50, 100, 200, 500];

const WITHDRAWAL_METHODS = [
    {
        id: 'bank',
        name: 'Bank Transfer',
        icon: 'business',
        description: 'Direct transfer to your bank account',
        processingTime: '3-5 business days',
        minAmount: 100
    },
    {
        id: 'paypal',
        name: 'PayPal',
        icon: 'logo-paypal',
        description: 'Withdraw to your PayPal account',
        processingTime: '1-2 business days',
        minAmount: 50
    },
    {
        id: 'crypto',
        name: 'Cryptocurrency',
        icon: 'logo-bitcoin',
        description: 'Withdraw via Bitcoin or USDT',
        processingTime: '24-48 hours',
        minAmount: 200
    }
];

const RECENT_WITHDRAWALS = [
    {
        id: 1,
        amount: 150,
        method: 'PayPal',
        date: '2024-01-15',
        status: 'completed',
        transactionId: 'TXN-123456'
    },
    {
        id: 2,
        amount: 300,
        method: 'Bank Transfer',
        date: '2024-01-10',
        status: 'processing',
        transactionId: 'TXN-123455'
    },
    {
        id: 3,
        amount: 100,
        method: 'PayPal',
        date: '2024-01-05',
        status: 'completed',
        transactionId: 'TXN-123454'
    }
];

// Status colors constant
const STATUS_COLORS = {
    completed: { bg: 'bg-green-50', text: 'text-green-600', icon: 'checkmark-circle', iconColor: '#10B981' },
    processing: { bg: 'bg-amber-50', text: 'text-amber-600', icon: 'time', iconColor: '#F59E0B' },
    failed: { bg: 'bg-red-50', text: 'text-red-600', icon: 'close-circle', iconColor: '#EF4444' }
};

// Memoized WithdrawalMethodCard component
const WithdrawalMethodCard = memo(({ method, isSelected, onSelect }) => {
    return (
        <TouchableOpacity
            className={`flex-row items-center gap-4 p-4 rounded-xl border mb-3 ${isSelected
                ? 'bg-themeColor/10 border-themeColor'
                : 'bg-white border-gray-200'
                }`}
            onPress={onSelect}
        >
            <View className="w-12 h-12 rounded-lg bg-gray-100 items-center justify-center">
                <Ionicons name={method.icon} size={24} color={COLORS.themeColor} />
            </View>

            <View className="flex-1">
                <Text className="font-InterSemibold text-slate-800 text-base">
                    {method.name}
                </Text>
                <Text className="font-Inter text-gray-500 text-sm mt-0.5">
                    {method.description}
                </Text>
                <View className="flex-row items-center gap-2 mt-1">
                    <Ionicons name="time-outline" size={12} color={COLORS.grey} />
                    <Text className="font-Inter text-gray-500 text-xs">
                        {method.processingTime}
                    </Text>
                    <Text className="text-gray-400 text-xs">•</Text>
                    <Text className="font-Inter text-gray-500 text-xs">
                        Min: {method.minAmount} coins
                    </Text>
                </View>
            </View>

            <View className={`w-6 h-6 rounded-full border-2 ${isSelected
                ? 'border-themeColor bg-themeColor'
                : 'border-gray-300'
                }`}>
                {isSelected && (
                    <Ionicons name="checkmark" size={16} color="white" />
                )}
            </View>
        </TouchableOpacity>
    );
});

// Memoized WithdrawalHistoryCard component
const WithdrawalHistoryCard = memo(({ withdrawal }) => {
    const status = STATUS_COLORS[withdrawal.status] || STATUS_COLORS.processing;

    return (
        <View className="bg-white rounded-xl p-4 border border-gray-100 mb-3">
            <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                        <Image source={IMAGES.Coin_Icon} className="w-4 h-4" />
                        <Text className="font-InterBold text-slate-800 text-base">
                            {withdrawal.amount} coins
                        </Text>
                    </View>
                    <Text className="font-Inter text-gray-600 text-sm">
                        {withdrawal.method}
                    </Text>
                    <Text className="font-Inter text-gray-500 text-xs mt-1">
                        {withdrawal.date}
                    </Text>
                </View>
                <View className={`${status.bg} rounded-full px-3 py-1.5 flex-row items-center gap-1.5`}>
                    <Ionicons name={status.icon} size={12} color={status.iconColor} />
                    <Text className={`font-InterSemibold ${status.text} text-xs capitalize`}>
                        {withdrawal.status}
                    </Text>
                </View>
            </View>
            <Text className="font-Inter text-gray-400 text-xs">
                ID: {withdrawal.transactionId}
            </Text>
        </View>
    );
});

// Memoized QuickAmountButton component
const QuickAmountButton = memo(({ amount, isSelected, isDisabled, onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            className={`rounded-xl px-4 py-3 border flex-1 min-w-[22%] items-center ${isSelected
                ? 'border-themeColor bg-themeColor/10'
                : isDisabled
                    ? 'border-gray-200 bg-gray-50 opacity-50'
                    : 'border-gray-200 bg-white'
                } active:opacity-70`}
        >
            <Text
                className={`font-InterSemibold text-sm ${isSelected
                    ? 'text-themeColor'
                    : isDisabled
                        ? 'text-gray-400'
                        : 'text-slate-700'
                    }`}
            >
                {amount}
            </Text>
        </TouchableOpacity>
    );
});

const WithdrawCoinsScreen = () => {
    const navigation = useNavigation();
    const [currentBalance, setCurrentBalance] = useState(240);
    const [withdrawalAmount, setWithdrawalAmount] = useState('');
    const [selectedMethod, setSelectedMethod] = useState('paypal');
    const [withdrawLoading, setWithdrawLoading] = useState(false);

    // Update status bar when screen is focused
    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(COLORS.themeColor, true);
            StatusBar.setBarStyle('light-content', true);
        }, [])
    );

    // Memoize selected method data
    const selectedMethodData = useMemo(() =>
        WITHDRAWAL_METHODS.find(m => m.id === selectedMethod),
        [selectedMethod]
    );

    // Memoize USD conversion
    const usdEquivalent = useMemo(() =>
        (currentBalance * 0.1).toFixed(2),
        [currentBalance]
    );

    // Memoize withdrawal amount USD
    const withdrawalAmountUSD = useMemo(() =>
        (parseFloat(withdrawalAmount || 0) * 0.1).toFixed(2),
        [withdrawalAmount]
    );

    // Memoize handlers
    const handleQuickAmount = useCallback((amount) => {
        if (amount > currentBalance) {
            Toast.show({
                type: "error",
                text2: `You only have ${currentBalance} coins available`
            });
            return;
        }
        setWithdrawalAmount(amount.toString());
    }, [currentBalance]);

    const handleMethodSelect = useCallback((methodId) => {
        setSelectedMethod(methodId);
    }, []);

    const handleAmountChange = useCallback((text) => {
        // Only allow numbers
        const numericValue = text.replace(/[^0-9]/g, '');
        setWithdrawalAmount(numericValue);
    }, []);

    const handleMaxAmount = useCallback(() => {
        if (currentBalance > 0) {
            setWithdrawalAmount(currentBalance.toString());
        }
    }, [currentBalance]);

    const handleViewAllHistory = useCallback(() => {
        Toast.show({
            type: "info",
            text2: 'Full history coming soon!'
        });
    }, []);

    // Validate and handle withdrawal
    const handleWithdraw = useCallback(async () => {
        const amount = parseFloat(withdrawalAmount);

        // Validation
        if (!withdrawalAmount || isNaN(amount) || amount <= 0) {
            Toast.show({
                type: "error",
                text2: 'Please enter a valid withdrawal amount',
            });
            return;
        }

        if (amount < selectedMethodData.minAmount) {
            Toast.show({
                type: "error",
                text2: `Minimum withdrawal for ${selectedMethodData.name} is ${selectedMethodData.minAmount} coins`,
            });
            return;
        }

        if (amount > currentBalance) {
            Toast.show({
                type: "error",
                text2: `You only have ${currentBalance} coins available`
            });
            return;
        }

        try {
            setWithdrawLoading(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            Toast.show({
                type: "success",
                text2: `Your request for ${amount} coins via ${selectedMethodData.name} is being processed. You'll receive it in ${selectedMethodData.processingTime}.`
            });

            // Update balance
            setCurrentBalance(prev => prev - amount);
            setWithdrawalAmount('');

            // In a real app, you would navigate to a confirmation screen or refresh withdrawal history
        } catch (error) {
            Toast.show({
                type: "error",
                text2: 'Please try again later'
            });
        } finally {
            setWithdrawLoading(false);
        }
    }, [withdrawalAmount, selectedMethodData, currentBalance]);

    // Memoize shadow style
    const stickyButtonShadowStyle = useMemo(() => ({
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    }), []);

    // Memoize button gradient
    const buttonGradient = useMemo(() => ({
        colors: [COLORS.themeColor, '#8B7FFF'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 0 }
    }), []);

    // Memoize render functions
    const renderQuickAmountButton = useCallback((amount) => {
        const isSelected = withdrawalAmount === amount.toString();
        const isDisabled = amount > currentBalance;

        return (
            <QuickAmountButton
                key={amount}
                amount={amount}
                isSelected={isSelected}
                isDisabled={isDisabled}
                onPress={() => !isDisabled && handleQuickAmount(amount)}
            />
        );
    }, [withdrawalAmount, currentBalance, handleQuickAmount]);

    const renderWithdrawalMethod = useCallback((method) => (
        <WithdrawalMethodCard
            key={method.id}
            method={method}
            isSelected={selectedMethod === method.id}
            onSelect={() => handleMethodSelect(method.id)}
        />
    ), [selectedMethod, handleMethodSelect]);

    const renderWithdrawalHistory = useCallback((withdrawal) => (
        <WithdrawalHistoryCard
            key={withdrawal.id}
            withdrawal={withdrawal}
        />
    ), []);

    // Memoize display conditions
    const showWithdrawButton = useMemo(() =>
        withdrawalAmount && parseFloat(withdrawalAmount) > 0,
        [withdrawalAmount]
    );

    return (
        <>
            <StatusBar backgroundColor={COLORS.themeColor} barStyle="light-content" />
            <View className="flex-1 bg-gray-50">
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
                    {/* Current Balance */}
                    <View className="px-4 my-6">
                        <GradientContainer>
                            <Text className="font-Inter text-white/90 text-sm mb-2">
                                Available Balance
                            </Text>
                            <View className="flex-row justify-between items-center">
                                <View className="flex-row items-center gap-2">
                                    {IMAGES?.Coin_Icon && (
                                        <Image source={IMAGES.Coin_Icon} className="w-7 h-7" />
                                    )}
                                    <Text className="font-InterBold text-white text-2xl">
                                        {currentBalance}
                                    </Text>
                                </View>
                                <View className="bg-white/20 rounded-full px-3 py-1">
                                    <Text className="font-InterMedium text-white text-sm">
                                        ≈ ${usdEquivalent}
                                    </Text>
                                </View>
                            </View>
                        </GradientContainer>
                    </View>

                    {/* Withdrawal Amount */}
                    <View className="px-4 mb-6">
                        <View className="bg-white rounded-2xl p-5 border border-gray-100">
                            <Text className="font-InterSemibold text-xl text-slate-800 mb-3">
                                Withdrawal Amount
                            </Text>

                            {/* Quick Amount Buttons */}
                            <View className="flex-row flex-wrap gap-2.5 mb-4">
                                {QUICK_AMOUNTS.map(renderQuickAmountButton)}
                            </View>

                            {/* Custom Amount Input */}
                            <View>
                                <Text className="font-InterMedium text-gray-600 text-sm mb-2">
                                    Or enter custom amount
                                </Text>
                                <View className="flex-row items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-200">
                                    {IMAGES?.Coin_Icon && (
                                        <Image source={IMAGES.Coin_Icon} className="w-5 h-5" />
                                    )}
                                    <TextInput
                                        value={withdrawalAmount}
                                        onChangeText={handleAmountChange}
                                        placeholder="Enter amount"
                                        placeholderTextColor="#9CA3AF"
                                        keyboardType="numeric"
                                        className="flex-1 font-InterSemibold text-slate-800 text-base"
                                    />
                                    <TouchableOpacity
                                        onPress={handleMaxAmount}
                                        className="bg-themeColor/10 rounded-lg px-3 py-1.5 active:opacity-70"
                                    >
                                        <Text className="font-InterSemibold text-themeColor text-xs">
                                            Max
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                {withdrawalAmount && (
                                    <View className="flex-row justify-between items-center mt-2">
                                        <Text className="font-Inter text-gray-500 text-xs">
                                            ≈ ${withdrawalAmountUSD}
                                        </Text>
                                        {selectedMethodData && (
                                            <Text className="font-Inter text-gray-500 text-xs">
                                                Min: {selectedMethodData.minAmount} coins
                                            </Text>
                                        )}
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>

                    {/* Withdrawal Methods */}
                    <View className="px-4 mb-6">
                        <Text className="font-InterSemibold text-xl text-slate-800 mb-3">
                            Withdrawal Method
                        </Text>
                        {WITHDRAWAL_METHODS.map(renderWithdrawalMethod)}
                    </View>

                    {/* Recent Withdrawals */}
                    {RECENT_WITHDRAWALS.length > 0 && (
                        <View className="px-4 mb-6">
                            <View className="flex-row justify-between items-center mb-3">
                                <Text className="font-InterSemibold text-xl text-slate-800">
                                    Recent Withdrawals
                                </Text>
                                <TouchableOpacity
                                    onPress={handleViewAllHistory}
                                    className="active:opacity-70"
                                >
                                    <Text className="font-InterSemibold text-themeColor text-sm">
                                        View All
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {RECENT_WITHDRAWALS.slice(0, 3).map(renderWithdrawalHistory)}
                        </View>
                    )}

                    {/* Info & Terms */}
                    <View className="px-4 mb-8">
                        <View className="bg-gray-100 rounded-2xl p-4">
                            <View className="flex-row items-center gap-2 mb-2">
                                <Ionicons name="information-circle" size={20} color={COLORS.themeColor} />
                                <Text className="font-InterSemibold text-slate-800">
                                    Important Information
                                </Text>
                            </View>
                            <View className="gap-2">
                                <Text className="font-Inter text-gray-600 text-sm leading-5">
                                    • Withdrawals are processed during business days (Monday-Friday)
                                </Text>
                                <Text className="font-Inter text-gray-600 text-sm leading-5">
                                    • Processing times vary by withdrawal method
                                </Text>
                                <Text className="font-Inter text-gray-600 text-sm leading-5">
                                    • A small processing fee may apply depending on the method
                                </Text>
                                <Text className="font-Inter text-gray-600 text-sm leading-5">
                                    • Minimum withdrawal amounts apply per method
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                {/* Sticky Withdraw Button */}
                {showWithdrawButton && (
                    <View
                        className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 py-4"
                        style={stickyButtonShadowStyle}
                    >
                        <View className="flex-row items-center justify-between mb-3">
                            <View>
                                <Text className="font-Inter text-gray-600 text-[13px] mb-1">
                                    Withdrawal Amount
                                </Text>
                                <View className="flex-row items-center gap-1.5">
                                    {IMAGES?.Coin_Icon && (
                                        <Image source={IMAGES.Coin_Icon} className="w-4 h-4" />
                                    )}
                                    <Text className="font-InterBold text-slate-800 text-[18px]">
                                        {withdrawalAmount} coins
                                    </Text>
                                </View>
                            </View>
                            <View className="items-end">
                                <Text className="font-Inter text-gray-600 text-[13px] mb-1">
                                    Processing Time
                                </Text>
                                <Text className="font-InterSemibold text-themeColor text-[14px]">
                                    {selectedMethodData?.processingTime || 'N/A'}
                                </Text>
                            </View>
                        </View>
                        <ButtonFullWidth
                            text={`Withdraw ${withdrawalAmount} Coins`}
                            gradient={buttonGradient}
                            onPress={handleWithdraw}
                            loading={withdrawLoading}
                            loadingText="Processing..."
                            icon="arrow-down"
                        />
                    </View>
                )}
            </View>
        </>
    );
};

export default WithdrawCoinsScreen;
