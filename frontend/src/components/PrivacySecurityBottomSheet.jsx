import { useState, useEffect, useCallback, useMemo, memo, useRef } from "react";
import CustomBottomSheet from "./CustomBottomSheet";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { COLORS } from "@/constants/theme";
import { Pressable, Text, View, Switch } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Toast } from 'toastify-react-native';
import { useConfirmationAlert } from '@/state/confirmationContext';

// Memoized SettingItem component with custom comparison
const SettingItem = memo(({ icon, title, description, value, onToggle, onPress, rightComponent, isLast }) => {
    const switchTrackColor = useMemo(() => ({
        false: '#E5E7EB',
        true: COLORS.themeColor
    }), []);

    return (
        <Pressable
            onPress={onPress}
            className={`flex-row items-center justify-between px-4 py-4 active:bg-gray-50 ${!isLast ? 'border-b border-gray-100' : ''
                }`}
        >
            <View className="flex-row items-center gap-3 flex-1">
                <View className="w-10 h-10 rounded-xl bg-themeColor/10 items-center justify-center">
                    <Ionicons name={icon} size={18} color={COLORS.themeColor} />
                </View>
                <View className="flex-1">
                    <Text className="font-InterSemibold text-slate-800 text-[15px]">
                        {title}
                    </Text>
                    {description && (
                        <Text className="font-Inter text-gray-500 text-[12px] mt-0.5">
                            {description}
                        </Text>
                    )}
                </View>
            </View>
            {rightComponent || (
                <Switch
                    value={value}
                    onValueChange={onToggle}
                    trackColor={switchTrackColor}
                    thumbColor="#FFFFFF"
                />
            )}
        </Pressable>
    );
}, (prevProps, nextProps) => {
    return prevProps.icon === nextProps.icon &&
           prevProps.title === nextProps.title &&
           prevProps.description === nextProps.description &&
           prevProps.value === nextProps.value &&
           prevProps.onToggle === nextProps.onToggle &&
           prevProps.onPress === nextProps.onPress &&
           prevProps.isLast === nextProps.isLast &&
           prevProps.rightComponent === nextProps.rightComponent;
});

SettingItem.displayName = 'SettingItem';

// Memoized VisibilityOption component with custom comparison
const VisibilityOption = memo(({ value, label, description, isSelected, onPress }) => (
    <Pressable
        onPress={onPress}
        className={`p-4 rounded-xl border mb-3 ${isSelected
            ? 'bg-themeColor/10 border-themeColor'
            : 'bg-white border-gray-200'
            } active:opacity-70`}
    >
        <View className="flex-row items-center justify-between">
            <View className="flex-1">
                <Text className={`font-InterSemibold text-[14px] ${isSelected ? 'text-themeColor' : 'text-slate-800'
                    }`}>
                    {label}
                </Text>
                {description && (
                    <Text className="font-Inter text-gray-500 text-[12px] mt-1">
                        {description}
                    </Text>
                )}
            </View>
            {isSelected && (
                <View className="w-5 h-5 rounded-full bg-themeColor items-center justify-center ml-3">
                    <Ionicons name="checkmark" size={14} color="white" />
                </View>
            )}
        </View>
    </Pressable>
), (prevProps, nextProps) => {
    return prevProps.value === nextProps.value &&
           prevProps.label === nextProps.label &&
           prevProps.description === nextProps.description &&
           prevProps.isSelected === nextProps.isSelected &&
           prevProps.onPress === nextProps.onPress;
});

VisibilityOption.displayName = 'VisibilityOption';

// Default settings constant
const DEFAULT_SETTINGS = {
    profileVisibility: 'public',
    showOnlineStatus: true,
    allowMessages: true,
    showActivityStatus: true,
    shareDataForAnalytics: false,
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: true,
    biometricAuth: false,
    dataDownload: false,
    deleteAccount: false,
};

// Memoized static components
const HeaderSection = memo(() => (
    <View className="flex-row items-center gap-3 flex-1">
        <View className="bg-themeColor/10 p-2.5 rounded-xl">
            <Ionicons name="shield-checkmark" size={20} color={COLORS.themeColor} />
        </View>
        <View className="flex-1">
            <Text className="font-InterBold text-slate-800 text-[18px]">
                Privacy & Security
            </Text>
            <Text className="font-Inter text-gray-500 text-[12px] mt-0.5">
                Manage your account privacy and security
            </Text>
        </View>
    </View>
));
HeaderSection.displayName = 'HeaderSection';

const SectionHeader = memo(({ title }) => (
    <View className="flex-row items-center gap-2 mb-4">
        <View className="w-1 h-5 bg-themeColor rounded-full" />
        <Text className="font-InterSemibold text-slate-800 text-[16px]">
            {title}
        </Text>
    </View>
));
SectionHeader.displayName = 'SectionHeader';

const InfoSection = memo(() => (
    <View className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
        <View className="flex-row items-start gap-3">
            <Ionicons name="information-circle" size={18} color={COLORS.themeColor} />
            <View className="flex-1">
                <Text className="font-InterSemibold text-slate-800 text-[13px] mb-1">
                    Your Privacy Matters
                </Text>
                <Text className="font-Inter text-gray-600 text-[12px] leading-4">
                    We take your privacy seriously. All your data is encrypted and stored securely.
                    You can change these settings anytime.
                </Text>
            </View>
        </View>
    </View>
));
InfoSection.displayName = 'InfoSection';

const PrivacySecurityBottomSheet = ({ ref, onChange, currentSettings = {}, onSave }) => {
    // Local state for managing settings
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    
    // Use ref to track if component is mounted to prevent state updates after unmount
    const isMountedRef = useRef(true);

    const { showConfirmation, hideConfirmation } = useConfirmationAlert();
    
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    // Initialize with current settings when bottom sheet opens or currentSettings changes
    useEffect(() => {
        if (!isMountedRef.current) return;
        
        if (currentSettings && Object.keys(currentSettings).length > 0) {
            setSettings(prev => {
                // Only update if settings actually changed
                const hasChanges = Object.keys(currentSettings).some(
                    key => prev[key] !== currentSettings[key]
                );
                return hasChanges ? { ...prev, ...currentSettings } : prev;
            });
        } else {
            // Reset to defaults if no currentSettings provided
            setSettings(prev => {
                const hasChanges = Object.keys(DEFAULT_SETTINGS).some(
                    key => prev[key] !== DEFAULT_SETTINGS[key]
                );
                return hasChanges ? { ...DEFAULT_SETTINGS } : prev;
            });
        }
    }, [currentSettings]);

    // Memoize handleToggle
    const handleToggle = useCallback((key) => {
        setSettings(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    }, []);

    // Memoize handleProfileVisibilityChange
    const handleProfileVisibilityChange = useCallback((visibility) => {
        setSettings(prev => ({
            ...prev,
            profileVisibility: visibility
        }));
    }, []);

    // Memoize toggle handlers to prevent function recreation
    const toggleHandlers = useMemo(() => {
        const handlers = {};
        const settingKeys = [
            'showOnlineStatus',
            'allowMessages',
            'showActivityStatus',
            'shareDataForAnalytics',
            'loginAlerts',
            'sessionTimeout'
        ];
        settingKeys.forEach(key => {
            handlers[key] = () => handleToggle(key);
        });
        return handlers;
    }, [handleToggle]);

    // Memoize visibility change handlers
    const visibilityHandlers = useMemo(() => ({
        public: () => handleProfileVisibilityChange('public'),
        friends: () => handleProfileVisibilityChange('friends'),
        private: () => handleProfileVisibilityChange('private'),
    }), [handleProfileVisibilityChange]);

    // Memoize handleSave
    const handleSave = useCallback(() => {
        if (!isMountedRef.current) return;
        
        if (onSave) {
            onSave(settings);
        }

        Toast.show({
            type: "success",
            text2: "Your privacy and security settings have been updated",
        });

        if (ref?.current) {
            ref.current.close();
        }
    }, [settings, onSave, ref]);

    // Memoize handleCancel
    const handleCancel = useCallback(() => {
        if (!isMountedRef.current) return;
        
        const resetSettings = currentSettings && Object.keys(currentSettings).length > 0
            ? { ...DEFAULT_SETTINGS, ...currentSettings }
            : { ...DEFAULT_SETTINGS };
        setSettings(resetSettings);

        if (ref?.current) {
            ref.current.close();
        }
    }, [currentSettings, ref]);

    // Memoize handleTwoFactorToggle
    const handleTwoFactorToggle = useCallback(() => {
        setSettings(prev => {
            const newValue = !prev.twoFactorAuth;
            if (!newValue) {
                Toast.show({
                    type: "info",
                    text2: "You'll be prompted to set up 2FA after saving",
                });
            }
            return { ...prev, twoFactorAuth: newValue };
        });
    }, []);

    // Memoize handleBiometricToggle
    const handleBiometricToggle = useCallback(() => {
        setSettings(prev => {
            const newValue = !prev.biometricAuth;
            if (!newValue) {
                Toast.show({
                    type: "info",
                    text2: "You'll be prompted to enable biometrics after saving",
                });
            }
            return { ...prev, biometricAuth: newValue };
        });
    }, []);

    // Memoize handleDataDownload
    const handleDataDownload = useCallback(() => {
        Toast.show({
            type: "info",
            text2: "Your data export request has been submitted. You'll receive an email when it's ready.",
        });
    }, []);

    // Memoize handleDeleteAccount
    const handleDeleteAccount = useCallback(() => {
        showConfirmation({
            title: "Delete Account",
            message: "Are you sure! You want to permanently delete your account? This action cannot be undone.",
            onConfirm: () => {
                Toast.show({
                    type: "info",
                    text2: "Account deletion requires additional verification. Please contact support.",
                });
                hideConfirmation();
            },
            onCancel: () => {
                hideConfirmation();
            },
            confirmText: "Delete",
            cancelText: "Cancel",
            type: "danger"
        });
    }, [showConfirmation, hideConfirmation]);

    return (
        <CustomBottomSheet
            ref={ref}
            onChange={onChange}
            snapPoints={['75%', '90%']}
        >
            <View className="flex-1">
                <BottomSheetScrollView
                    showsVerticalScrollIndicator={false}
                    className="flex-1"
                >
                    <View className="px-5 pb-6 pt-4">
                        {/* Header Section */}
                        <View className="flex-row justify-between items-center mb-6">
                            <HeaderSection />
                            <Pressable
                                onPress={handleCancel}
                                className="p-2 rounded-full active:bg-gray-100"
                            >
                                <Ionicons name="close" size={22} color={COLORS.grey} />
                            </Pressable>
                        </View>

                        {/* Profile Visibility Section */}
                        <View className="mb-6">
                            <Text className="font-InterSemibold text-slate-800 text-[16px] mb-3">
                                Profile Visibility
                            </Text>
                            <VisibilityOption
                                value="public"
                                label="Public"
                                description="Anyone can view your profile"
                                isSelected={settings.profileVisibility === 'public'}
                                onPress={visibilityHandlers.public}
                            />
                            <VisibilityOption
                                value="friends"
                                label="Friends Only"
                                description="Only your connections can view your profile"
                                isSelected={settings.profileVisibility === 'friends'}
                                onPress={visibilityHandlers.friends}
                            />
                            <VisibilityOption
                                value="private"
                                label="Private"
                                description="Your profile is hidden from others"
                                isSelected={settings.profileVisibility === 'private'}
                                onPress={visibilityHandlers.private}
                            />
                        </View>

                        {/* Privacy Settings Section */}
                        <View className="mb-6">
                            <SectionHeader title="Privacy Settings" />
                            <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                <SettingItem
                                    icon="eye"
                                    title="Show Online Status"
                                    description="Let others see when you're online"
                                    value={settings.showOnlineStatus}
                                    onToggle={toggleHandlers.showOnlineStatus}
                                />
                                <SettingItem
                                    icon="chatbubbles"
                                    title="Allow Messages"
                                    description="Let others send you messages"
                                    value={settings.allowMessages}
                                    onToggle={toggleHandlers.allowMessages}
                                />
                                <SettingItem
                                    icon="pulse"
                                    title="Show Activity Status"
                                    description="Display your recent activity"
                                    value={settings.showActivityStatus}
                                    onToggle={toggleHandlers.showActivityStatus}
                                />
                                <SettingItem
                                    icon="analytics"
                                    title="Share Data for Analytics"
                                    description="Help improve our services"
                                    value={settings.shareDataForAnalytics}
                                    onToggle={toggleHandlers.shareDataForAnalytics}
                                    isLast={true}
                                />
                            </View>
                        </View>

                        {/* Security Settings Section */}
                        <View className="mb-6">
                            <SectionHeader title="Security Settings" />
                            <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                <SettingItem
                                    icon="lock-closed"
                                    title="Two-Factor Authentication"
                                    description="Add an extra layer of security"
                                    value={settings.twoFactorAuth}
                                    onToggle={handleTwoFactorToggle}
                                />
                                <SettingItem
                                    icon="notifications"
                                    title="Login Alerts"
                                    description="Get notified of new logins"
                                    value={settings.loginAlerts}
                                    onToggle={toggleHandlers.loginAlerts}
                                />
                                <SettingItem
                                    icon="time"
                                    title="Auto Session Timeout"
                                    description="Automatically log out after inactivity"
                                    value={settings.sessionTimeout}
                                    onToggle={toggleHandlers.sessionTimeout}
                                />
                                <SettingItem
                                    icon="finger-print"
                                    title="Biometric Authentication"
                                    description="Use fingerprint or face ID"
                                    value={settings.biometricAuth}
                                    onToggle={handleBiometricToggle}
                                    isLast={true}
                                />
                            </View>
                        </View>

                        {/* Data & Privacy Section */}
                        <View className="mb-6">
                            <SectionHeader title="Data & Privacy" />
                            <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                <SettingItem
                                    icon="download"
                                    title="Download My Data"
                                    description="Request a copy of your data"
                                    value={false}
                                    onPress={handleDataDownload}
                                    rightComponent={
                                        <Ionicons name="chevron-forward" size={18} color={COLORS.grey} />
                                    }
                                />
                                <SettingItem
                                    icon="trash"
                                    title="Delete Account"
                                    description="Permanently delete your account"
                                    value={false}
                                    onPress={handleDeleteAccount}
                                    rightComponent={
                                        <Ionicons name="chevron-forward" size={18} color={COLORS.grey} />
                                    }
                                    isLast={true}
                                />
                            </View>
                        </View>

                        {/* Info Section */}
                        <InfoSection />
                    </View>
                </BottomSheetScrollView>

                {/* Fixed Action Buttons */}
                <View className="bg-white border-t border-gray-200 px-5 py-4 shadow-lg">
                    <View className="flex-row gap-3">
                        {/* Cancel Button */}
                        <Pressable
                            onPress={handleCancel}
                            className="flex-1 border border-gray-300 rounded-xl py-3.5 items-center active:bg-gray-50"
                        >
                            <Text className="text-gray-700 font-InterSemibold text-center text-[14px]">
                                Cancel
                            </Text>
                        </Pressable>

                        {/* Save Button */}
                        <Pressable
                            onPress={handleSave}
                            className="flex-1 bg-themeColor rounded-xl py-3.5 items-center justify-center active:opacity-90"
                            style={{
                                shadowColor: COLORS.themeColor,
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.2,
                                shadowRadius: 4,
                                elevation: 3,
                            }}
                        >
                            <View className="flex-row items-center gap-2">
                                <Ionicons
                                    name="checkmark-circle"
                                    size={18}
                                    color="white"
                                />
                                <Text className="text-white font-InterSemibold text-center text-[14px]">
                                    Save Changes
                                </Text>
                            </View>
                        </Pressable>
                    </View>
                </View>
            </View>
        </CustomBottomSheet>
    );
};

// Export memoized component
const MemoizedComponent = memo(PrivacySecurityBottomSheet);
MemoizedComponent.displayName = 'PrivacySecurityBottomSheet';

export default MemoizedComponent;
