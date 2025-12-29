import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import InputBox from './InputBox';

// add payment method modal
export const AddPaymentMethodModal = ({ visible, onClose, onAdd }) => {
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


export const ConfirmationDialog = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger" // 'danger', 'warning', 'info'
}) => {
  // Color variants based on type
  const buttonColors = {
    danger: {
      confirm: 'bg-red-500 active:bg-red-600',
      cancel: 'bg-gray-100 active:bg-gray-200',
      confirmText: 'text-white',
      cancelText: 'text-gray-700'
    },
    warning: {
      confirm: 'bg-amber-500 active:bg-amber-600',
      cancel: 'bg-gray-100 active:bg-gray-200',
      confirmText: 'text-white',
      cancelText: 'text-gray-700'
    },
    info: {
      confirm: 'bg-blue-500 active:bg-blue-600',
      cancel: 'bg-gray-100 active:bg-gray-200',
      confirmText: 'text-white',
      cancelText: 'text-gray-700'
    }
  };

  const colors = buttonColors[type];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      {/* Overlay with backdrop click */}
      <TouchableOpacity 
        activeOpacity={1}
        onPress={onCancel}
        className="flex-1 bg-black/40 justify-center items-center px-4"
      >
        {/* Dialog Container - prevent click through */}
        <TouchableOpacity 
          activeOpacity={1}
          className="w-full max-w-sm"
        >
          <View className="bg-white rounded-2xl p-6 shadow-lg">
            {/* Title */}
            <Text className="text-xl font-InterBold text-slate-800 text-center mb-3">
              {title}
            </Text>
            
            {/* Message */}
            <Text className="text-base font-Inter text-gray-600 text-center mb-6 leading-5">
              {message}
            </Text>
            
            {/* Buttons Container */}
            <View className="flex-row gap-3">
              {/* Cancel Button */}
              <TouchableOpacity 
                onPress={onCancel}
                className={`flex-1 rounded-xl py-3.5 ${colors.cancel}`}
              >
                <Text className={`text-center font-InterSemibold ${colors.cancelText}`}>
                  {cancelText}
                </Text>
              </TouchableOpacity>
              
              {/* Confirm Button */}
              <TouchableOpacity 
                onPress={onConfirm}
                className={`flex-1 rounded-xl py-3.5 ${colors.confirm}`}
              >
                <Text className={`text-center font-InterSemibold ${colors.confirmText}`}>
                  {confirmText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};