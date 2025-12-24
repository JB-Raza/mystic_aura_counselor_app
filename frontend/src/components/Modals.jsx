import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import InputBox from './InputBox';

// add payment method modal
export const CustomModal = ({ visible, onClose, onAdd }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [name, setName] = useState('');

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View className="flex-1 p-4">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="font-InterBold text-xl text-slate-800">
                        Add Credit Card
                    </Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color={COLORS.grey} />
                    </TouchableOpacity>
                </View>

                {/* Form */}
                <View className="gap-4">
                    {/* card number */}
                    <InputBox
                        label={"Card Number"}
                        value={cardNumber}
                        setValue={setCardNumber}
                        placeholder={"1234 5678 9012 3456"}
                        maxLength={19}
                        keyboardType={"numeric"}
                    />

                    <View className="flex-row gap-4">
                        {/* expiry */}
                        <View className='flex-1'>
                            <InputBox
                                label={"Expiry Date"}
                                placeholder="MM/YY"
                                value={expiry}
                                onChangeText={setExpiry}
                                maxLength={5}
                            />
                        </View>
                        {/* cvv */}
                        <View className='flex-1'>
                            <InputBox
                                label={"CVV"}
                                value={cvv}
                                onChangeText={setCvv}
                                placeholder="123"
                                keyboardType="numeric"
                                maxLength={3}
                                secureTextEntry
                            />
                        </View>
                    </View>

                    <InputBox
                        label={"Cardholder Name"}
                        placeholder="John Doe"
                        value={name}
                        onChangeText={setName}
                    />

                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    className="bg-themeColor rounded-xl p-4 mt-8"
                    onPress={() => {
                        // Handle card addition
                        onAdd();
                        onClose();
                    }}
                >
                    <Text className="text-white font-InterSemibold text-center text-base">
                        Add Payment Method
                    </Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};