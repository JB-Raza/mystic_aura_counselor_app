import React, { useState, useMemo, useCallback, memo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { SettingSection } from '@/components';

const THEMES = [
    { id: 'system', name: 'Follow System', icon: 'phone-portrait' },
    { id: 'light', name: 'Light Mode', icon: 'sunny' },
    { id: 'dark', name: 'Dark Mode', icon: 'moon' },
];

const ACCENT_COLORS = [
    { id: 'purple', name: 'Calm Purple', value: '#6C63FF' },
    { id: 'blue', name: 'Serene Blue', value: '#4A90E2' },
    { id: 'green', name: 'Peaceful Green', value: '#10B981' },
    { id: 'teal', name: 'Tranquil Teal', value: '#14B8A6' },
    { id: 'indigo', name: 'Mindful Indigo', value: '#6366F1' },
    { id: 'rose', name: 'Compassionate Rose', value: '#F43F5E' },
];

const FONT_SIZES = [
    { id: 'small', name: 'Small', previewSize: 12 },
    { id: 'medium', name: 'Medium', previewSize: 14 },
    { id: 'large', name: 'Large', previewSize: 16 },
    { id: 'xlarge', name: 'Extra Large', previewSize: 18 },
];

// ThemeOption component
const ThemeOption = memo(({ option, isSelected, accentColor, onPress }) => {
    const iconColor = useMemo(() => 
        isSelected ? accentColor : COLORS.grey,
        [isSelected, accentColor]
    );

    return (
        <TouchableOpacity
            className={`flex-row items-center justify-between p-4 rounded-xl mb-2 ${isSelected ? 'bg-themeColor/5 border border-themeColor/90' : 'bg-white'
                }`}
            onPress={onPress}
        >
            <View className="flex-row items-center gap-3">
                <View className={`w-10 h-10 rounded-lg items-center justify-center ${isSelected ? 'bg-themeColor/10' : 'bg-gray-100'
                    }`}>
                    <Ionicons
                        name={option.icon}
                        size={20}
                        color={iconColor}
                    />
                </View>
                <View>
                    <Text className={`font-InterMedium text-base ${isSelected ? 'text-slate-800' : 'text-slate-600'
                        }`}>
                        {option.name}
                    </Text>
                </View>
            </View>

            {isSelected && (
                <View className="w-6 h-6 rounded-full border-2 border-themeColor items-center justify-center">
                    <View className="w-3 h-3 rounded-full" style={{ backgroundColor: accentColor }} />
                </View>
            )}
        </TouchableOpacity>
    );
});

// ToggleSetting component
const ToggleSetting = memo(({ title, description, value, accentColor, onValueChange }) => {
    const trackColor = useMemo(() => ({ 
        false: '#f1f5f9', 
        true: accentColor 
    }), [accentColor]);

    return (
        <View className="flex-row justify-between items-center py-3 px-2">
            <View className="flex-1">
                <Text className="font-InterMedium text-base text-slate-800">{title}</Text>
                {description && (
                    <Text className="text-gray-500 text-sm mt-1 font-InterRegular">
                        {description}
                    </Text>
                )}
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={trackColor}
                thumbColor={value ? '#ffffff' : '#f8fafc'}
            />
        </View>
    );
});

// AccentColorItem component
const AccentColorItem = memo(({ color, isSelected, onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        className="w-14 h-14 rounded-2xl mb-3 justify-center items-center shadow-sm"
        style={{ backgroundColor: color.value }}
    >
        {isSelected && (
            <Ionicons name="checkmark" size={24} color="white" />
        )}
    </TouchableOpacity>
));

// FontSizeItem component
const FontSizeItem = memo(({ size, isSelected, accentColor, onPress }) => (
    <TouchableOpacity
        className={`flex-row justify-between items-center py-3 px-2 rounded-lg ${isSelected ? 'bg-themeColor/10' : ''
            }`}
        onPress={onPress}
    >
        <Text
            style={{ fontSize: size.previewSize }}
            className={`font-InterMedium ${isSelected ? 'text-themeColor/90' : 'text-slate-700'
                }`}
        >
            {size.name}
        </Text>
        {isSelected && (
            <Ionicons name="checkmark" size={20} color={accentColor} />
        )}
    </TouchableOpacity>
));

const AppearanceScreen = () => {
    const [theme, setTheme] = useState('system');
    const [accentColor, setAccentColor] = useState(COLORS.themeColor);
    const [fontSize, setFontSize] = useState('medium');
    const [reduceMotion, setReduceMotion] = useState(false);
    const [boldText, setBoldText] = useState(false);
    const [highContrast, setHighContrast] = useState(false);

    // handlers
    const handleThemeChange = useCallback((themeId) => {
        setTheme(themeId);
    }, []);

    const handleAccentColorChange = useCallback((colorValue) => {
        setAccentColor(colorValue);
    }, []);

    const handleFontSizeChange = useCallback((sizeId) => {
        setFontSize(sizeId);
    }, []);

    const handleReset = useCallback(() => {
        setTheme('system');
        setAccentColor(COLORS.themeColor);
        setFontSize('medium');
        setReduceMotion(false);
        setBoldText(false);
        setHighContrast(false);
    }, []);

    // computed values
    const currentAccentColorName = useMemo(() => 
        ACCENT_COLORS.find(c => c.value === accentColor)?.name || 'Default',
        [accentColor]
    );

    const currentFontSize = useMemo(() => 
        FONT_SIZES.find(f => f.id === fontSize),
        [fontSize]
    );

    const previewTextStyle = useMemo(() => ({
        fontSize: currentFontSize?.previewSize || 14,
        fontWeight: '700',
        color: highContrast ? '#000000' : '#374151'
    }), [currentFontSize, highContrast]);

    return (
        <>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Theme Selection */}
                <SettingSection title="Theme Preference">
                    {THEMES.map((themeOption) => (
                        <ThemeOption
                            key={themeOption.id}
                            option={themeOption}
                            isSelected={theme === themeOption.id}
                            accentColor={accentColor}
                            onPress={() => handleThemeChange(themeOption.id)}
                        />
                    ))}
                </SettingSection>

                {/* Accent Color */}
                <SettingSection title="Accent Color">
                    <Text className="text-gray-500 text-sm px-2 mb-3 font-InterRegular">
                        Choose a color that resonates with your healing journey
                    </Text>
                    <View className="flex-row flex-wrap justify-between px-2">
                        {ACCENT_COLORS.map((color) => (
                            <AccentColorItem
                                key={color.id}
                                color={color}
                                isSelected={accentColor === color.value}
                                onPress={() => handleAccentColorChange(color.value)}
                            />
                        ))}
                    </View>
                    <View className="px-2 mt-1">
                        <Text className="text-center text-gray-500 text-xs font-InterMedium">
                            Current: {currentAccentColorName}
                        </Text>
                    </View>
                </SettingSection>

                {/* Text Size */}
                <SettingSection title="Text Size">
                    <Text className="text-gray-500 text-sm px-2 mb-3 font-InterRegular">
                        Adjust text size for comfortable reading
                    </Text>
                    {FONT_SIZES.map((size) => (
                        <FontSizeItem
                            key={size.id}
                            size={size}
                            isSelected={fontSize === size.id}
                            accentColor={accentColor}
                            onPress={() => handleFontSizeChange(size.id)}
                        />
                    ))}
                </SettingSection>

                {/* Accessibility */}
                <SettingSection title="Accessibility">
                    <ToggleSetting
                        title="Reduce Motion"
                        description="Minimize animations for a calmer experience"
                        value={reduceMotion}
                        accentColor={accentColor}
                        onValueChange={setReduceMotion}
                    />
                    <View className="border-t border-gray-100">
                        <ToggleSetting
                            title="Bold Text"
                            description="Use heavier font weights for better readability"
                            value={boldText}
                            accentColor={accentColor}
                            onValueChange={setBoldText}
                        />
                    </View>
                    <View className="border-t border-gray-100">
                        <ToggleSetting
                            title="High Contrast"
                            description="Increase contrast for better visibility"
                            value={highContrast}
                            accentColor={accentColor}
                            onValueChange={setHighContrast}
                        />
                    </View>
                </SettingSection>

                {/* Preview Section */}
                <SettingSection title="Preview">
                    <View className="p-4 bg-gray-100 rounded-xl">
                        <Text className="font-InterMedium text-base text-slate-800 mb-2">
                            This is how your text will appear
                        </Text>
                        <Text
                            style={previewTextStyle}
                            className="font-Inter leading-6"
                        >
                            Your mental health journey is unique and important. Take your time and be kind to yourself.
                        </Text>
                        <View className="flex-row items-center gap-2 mt-3">
                            <View className="w-4 h-4 rounded-full" style={{ backgroundColor: accentColor }} />
                            <Text className="text-gray-500 text-sm font-InterRegular">
                                Accent color applied throughout the app
                            </Text>
                        </View>
                    </View>
                </SettingSection>

                {/* Reset Button */}
                <TouchableOpacity
                    className="mx-4 my-6 py-4 bg-white rounded-2xl border border-gray-200 items-center"
                    onPress={handleReset}
                >
                    <Text className="font-InterSemiBold text-red-500 text-base">
                        Reset to Default Settings
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </>
    );
};

export default AppearanceScreen;
