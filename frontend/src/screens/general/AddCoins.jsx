import React, { useState, useCallback, useMemo, memo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { AddPaymentMethodModal, GradientContainer, ButtonFullWidth } from '@/components';

import { Toast } from 'toastify-react-native';
import { useConfirmationAlert } from '@/state/confirmationContext';

const COIN_PACKAGES = [
    {
        id: 1,
        coins: 50,
        price: 4.99,
        popular: false,
        bonus: 0,
        savings: 'Best value'
    },
    {
        id: 2,
        coins: 100,
        price: 8.99,
        popular: false,
        bonus: 10,
        savings: '10% off'
    },
    {
        id: 3,
        coins: 200,
        price: 15.99,
        popular: true,
        bonus: 30,
        savings: '20% off'
    },
    {
        id: 4,
        coins: 500,
        price: 34.99,
        popular: false,
        bonus: 100,
        savings: '30% off'
    }
];

const OFFERS = [
    {
        id: 1,
        title: "First Purchase Bonus",
        description: "Get 20% extra coins on your first purchase",
        validUntil: "2024-12-31",
        code: "WELCOME20"
    },
    {
        id: 2,
        title: "Weekly Special",
        description: "Double coins on packages above 200",
        validUntil: "2024-12-25",
        code: null
    }
];

const AVAILABLE_PAYMENT_METHODS = [
    {
        id: 'card',
        name: 'Credit/Debit Card',
        icon: 'card',
        description: 'Pay with Visa, Mastercard, or Amex'
    },
    {
        id: 'paypal',
        name: 'PayPal',
        icon: 'logo-paypal',
        description: 'Pay with your PayPal account'
    },
    {
        id: 'googlepay',
        name: 'Google Pay',
        icon: 'phone-portrait',
        description: 'Fast and secure payment'
    },
    {
        id: 'applepay',
        name: 'Apple Pay',
        icon: 'logo-apple',
        description: 'Pay with Apple Pay'
    }
];

//  CoinPackageCard component
const CoinPackageCard = memo(({ packageItem, isSelected, onSelect }) => {
    return (
        <TouchableOpacity
            onPress={onSelect}
            className={`relative rounded-2xl p-5 border-2 mb-4 ${isSelected
                ? 'bg-themeColor/5 border-themeColor'
                : packageItem.popular
                    ? 'bg-white border-themeColor/30'
                    : 'bg-white border-gray-200'
                }`}
        >
            {packageItem.popular && (
                <View className="absolute -top-3 left-1/2 -translate-x-1/2 bg-themeColor px-3 py-1 rounded-full">
                    <Text className="text-white font-InterBold text-xs">MOST POPULAR</Text>
                </View>
            )}

            {isSelected && (
                <View className="absolute top-2 right-2 w-5 h-5 rounded-full bg-themeColor items-center justify-center">
                    <Ionicons name="checkmark" size={12} color="white" />
                </View>
            )}

            <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-3">
                    <View className="w-12 h-12 rounded-xl bg-themeColor/10 items-center justify-center">
                        <Ionicons name="diamond" size={24} color={COLORS.themeColor} />
                    </View>
                    <View>
                        <Text className="font-InterBold text-lg text-slate-800">
                            {packageItem.coins} Coins
                        </Text>
                        {packageItem.bonus > 0 && (
                            <Text className="font-InterMedium text-green-600 text-sm">
                                + {packageItem.bonus} bonus coins
                            </Text>
                        )}
                    </View>
                </View>

                <View className="items-end">
                    <Text className="font-InterBold text-lg text-slate-800">
                        ${packageItem.price}
                    </Text>
                    <Text className="font-InterMedium text-themeColor text-sm">
                        {packageItem.savings}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
});

// OfferCard component
const OfferCard = memo(({ offer }) => (
    <TouchableOpacity className="">
        <GradientContainer>
            <View className="flex-row justify-between items-start">
                <View className="flex-1">
                    <Text className="font-InterBold text-white text-base mb-1">
                        {offer.title}
                    </Text>
                    <Text className="font-Inter text-white/90 text-sm mb-2">
                        {offer.description}
                    </Text>
                    <Text className="font-InterMedium text-white/80 text-xs">
                        Valid until {offer.validUntil}
                    </Text>
                </View>
                {offer.code && (
                    <View className="bg-white/20 rounded-lg px-2 py-1">
                        <Text className="font-InterBold text-white text-xs">{offer.code}</Text>
                    </View>
                )}
            </View>
        </GradientContainer>
    </TouchableOpacity>
));

// PaymentMethodCard component
const PaymentMethodCard = memo(({ method, isSelected, onSelect }) => (
    <TouchableOpacity
        className={`flex-row items-center gap-4 p-4 rounded-xl border-2 mb-3 ${isSelected
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
            <Text className="font-Inter text-gray-500 text-sm">
                {method.description}
            </Text>
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
));

const CoinPurchaseScreen = () => {
    const [currentBalance, setCurrentBalance] = useState(150);
    const [selectedPackage, setSelectedPackage] = useState(COIN_PACKAGES[0]);
    const [selectedPayment, setSelectedPayment] = useState('card');
    const [paymentMethods, setPaymentMethods] = useState(AVAILABLE_PAYMENT_METHODS);
    const [addPaymentModalVisible, setAddPaymentModalVisible] = useState(false);
    const [purchaseLoading, setPurchaseLoading] = useState(false);

    const { showConfirmation, hideConfirmation } = useConfirmationAlert()

    const sessionsAvailable = useMemo(() =>
        Math.floor(currentBalance / 10),
        [currentBalance]
    );

    const totalCoins = useMemo(() =>
        selectedPackage ? selectedPackage.coins + (selectedPackage.bonus || 0) : 0,
        [selectedPackage]
    );

    // handlers
    const handlePackageSelect = useCallback((packageItem) => {
        setSelectedPackage(packageItem);
    }, []);

    const handlePaymentSelect = useCallback((methodId) => {
        setSelectedPayment(methodId);
    }, []);

    const handleAddPaymentPress = useCallback(() => {
        setAddPaymentModalVisible(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setAddPaymentModalVisible(false);
    }, []);

    const handleAddPayment = useCallback(() => {
        setPaymentMethods(prev => [...prev, {
            id: `newmethod-${Date.now()}`,
            name: 'New Payment Method',
            icon: 'card',
            description: 'Description of new method'
        }]);
        setAddPaymentModalVisible(false);
    }, []);

    const handlePurchase = useCallback(async () => {
        if (!selectedPackage) {
            Toast.show({ type: "error", text2: "No Package Selected" });
            return;
        }

        try {
            setPurchaseLoading(true);

            await new Promise(resolve => setTimeout(resolve, 1500));

            Toast.show({
                type: "success",
                text2: `You've received ${totalCoins} coins`,
                position: 'top',
                visibilityTime: 5000,
                autoHide: true,
            });
            setCurrentBalance(prev => prev + totalCoins);
        } catch (error) {
            Toast.show({ type: "error", text2: error.message || "something went wrong" });
        } finally {
            setPurchaseLoading(false);
        }
    }, [selectedPackage, totalCoins]);

    //  shadow style
    const stickyButtonShadowStyle = useMemo(() => ({
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    }), []);

    //  button gradient
    const buttonGradient = useMemo(() => ({
        colors: [COLORS.themeColor, '#8B7FFF'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 0 }
    }), []);

    // render functions
    const renderCoinPackage = useCallback((packageItem) => (
        <CoinPackageCard
            key={packageItem.id}
            packageItem={packageItem}
            isSelected={selectedPackage?.id === packageItem.id}
            onSelect={() => handlePackageSelect(packageItem)}
        />
    ), [selectedPackage, handlePackageSelect]);

    const renderOffer = useCallback((offer) => (
        <OfferCard key={offer.id} offer={offer} />
    ), []);

    const renderPaymentMethod = useCallback((method) => (
        <PaymentMethodCard
            key={method.id}
            method={method}
            isSelected={selectedPayment === method.id}
            onSelect={() => handlePaymentSelect(method.id)}
        />
    ), [selectedPayment, handlePaymentSelect]);

    return (
        <>
            <View className="flex-1 bg-white">
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                >

                    {/* Current Balance */}
                    <View className="px-4 my-6">
                        <GradientContainer>
                            <Text className="font-Inter text-white/90 text-sm mb-2">
                                Your Coin Balance
                            </Text>
                            <View className="flex-row justify-between items-center">
                                <View className="flex-row items-center gap-2">
                                    <Ionicons name="diamond" size={28} color="white" />
                                    <Text className="font-InterBold text-white text-2xl">
                                        {currentBalance}
                                    </Text>
                                </View>
                                <View className="bg-white/20 rounded-full px-3 py-1">
                                    <Text className="font-InterMedium text-white text-sm">
                                        {sessionsAvailable} sessions available
                                    </Text>
                                </View>
                            </View>
                        </GradientContainer>

                    </View>

                    {/* Active Offers */}
                    <View className="px-4 mb-6">
                        <Text className="font-InterSemibold text-xl text-slate-800 mb-3">
                            Special Offers
                        </Text>
                        {OFFERS.map(renderOffer)}
                    </View>

                    {/* Coin Packages */}
                    <View className="px-4 mb-6">
                        <Text className="font-InterSemibold text-xl text-slate-800 mb-3">
                            Choose a Package
                        </Text>
                        {COIN_PACKAGES.map(renderCoinPackage)}
                    </View>

                    {/* Payment Methods */}
                    <View className="px-4 mb-6">
                        <Text className="font-InterSemibold text-xl text-slate-800 mb-3">
                            Payment Method
                        </Text>
                        {paymentMethods.map(renderPaymentMethod)}
                    </View>

                    {/* Add New Payment Method */}
                    <TouchableOpacity
                        onPress={handleAddPaymentPress}
                        className="mx-4 mb-6 p-4 bg-white rounded-2xl border border-gray-200 border-dashed">
                        <View className="flex-row items-center gap-3 justify-center">
                            <Ionicons name="add-circle" size={24} color={COLORS.themeColor} />
                            <Text className="font-InterSemibold text-themeColor text-base">
                                Add New Payment Method
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Security & Info */}
                    <View className="px-4 mb-8">
                        <View className="bg-gray-100 rounded-2xl p-4">
                            <View className="flex-row items-center gap-2 mb-2">
                                <Ionicons name="shield-checkmark" size={20} color={COLORS.themeColor} />
                                <Text className="font-InterSemibold text-slate-800">
                                    Secure Payment
                                </Text>
                            </View>
                            <Text className="font-Inter text-gray-600 text-sm leading-5">
                                All payments are encrypted and secure. Your financial information is never stored on our servers.
                                Coins are non-refundable and expire after 12 months.
                            </Text>
                        </View>
                    </View>
                    <AddPaymentMethodModal
                        visible={addPaymentModalVisible}
                        onClose={handleCloseModal}
                        onAdd={handleAddPayment}
                    />
                </ScrollView>

                {/* Sticky Purchase Button */}
                {selectedPackage && (
                    <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 py-4"
                        style={stickyButtonShadowStyle}
                    >
                        <View className="flex-row items-center justify-between mb-3">
                            <View>
                                <Text className="font-Inter text-gray-600 text-[13px] mb-1">
                                    Total Coins
                                </Text>
                                <Text className="font-InterBold text-slate-800 text-[18px]">
                                    {totalCoins} coins
                                </Text>
                            </View>
                            <View className="items-end">
                                <Text className="font-Inter text-gray-600 text-[13px] mb-1">
                                    Total Cost
                                </Text>
                                <Text className="font-InterBold text-themeColor text-[20px]">
                                    ${selectedPackage.price}
                                </Text>
                            </View>
                        </View>
                        <ButtonFullWidth
                            text={`Purchase ${totalCoins} Coins`}
                            gradient={buttonGradient}
                            onPress={() => {
                                showConfirmation({
                                    title: "Purchase Confirmation",
                                    message: "Are you sure you want to purchase this package?",
                                    onConfirm: () => {
                                        handlePurchase()
                                        hideConfirmation()
                                    },
                                    onCancel: () => {
                                        hideConfirmation()
                                    },
                                    confirmText: "Purchase",
                                    cancelText: "Cancel",
                                    type: "info"
                                })
                            }}
                            loading={purchaseLoading}
                            loadingText="Processing..."
                            icon="diamond"
                        />
                    </View>
                )}
            </View>
        </>
    );
};

export default CoinPurchaseScreen;
