
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, TouchableHighlight, TouchableOpacity, View, ActivityIndicator } from 'react-native';

export default function ButtonFullWidth({
  text,
  gradient,
  btnClassName,
  textClassName,
  icon,
  iconColor,
  flexDirection = "flex-row",
  onPress = null,
  disabled = false,
  loading = false,
  loadingText = "Loading..."
}) {

  // Handle gradient button
  if (gradient) {
    return (
      <TouchableHighlight
        disabled={disabled || loading}
        onPress={onPress}
        underlayColor="rgba(0,0,0,0.1)"
        className={`w-full active:bg-themeColor/60 rounded-xl overflow-hidden ${btnClassName} ${(disabled || loading) ? 'opacity-60' : 'opacity-100'
          }`}
      >
        <LinearGradient
          colors={gradient.colors}
          start={gradient.start || { x: 0, y: 0 }}
          end={gradient.end || { x: 1.5, y: 1 }}
          className={`w-full py-4 ${flexDirection} items-center justify-center gap-3`}
        >
          {loading ? (
            <View className="flex-row items-center gap-2">
              <ActivityIndicator size="small" color="white" />
              <Text className={`text-white text-center font-bold ${textClassName}`}>
                {loadingText}
              </Text>
            </View>
          ) : (
            <>
              {icon && <Ionicons name={icon} size={22} color={iconColor || "white"} />}
              <Text className={`text-white text-center font-bold ${textClassName}`}>
                {text}
              </Text>
            </>
          )}
        </LinearGradient>
      </TouchableHighlight>
    );
  }

  // Handle non-gradient button
  return (
    <TouchableOpacity
      disabled={disabled || loading}
      onPress={onPress}
      activeOpacity={0.8}
      className={`w-full rounded-xl overflow-hidden ${btnClassName} ${(disabled || loading) ? 'opacity-60' : 'opacity-100'
        }`}
    >
      <View
        className={`${flexDirection} py-4 gap-3 items-center justify-center rounded-xl ${disabled || loading ? 'bg-gray-400' : ''
          }`}
        style={[
          !btnClassName?.includes('bg-') && !disabled && !loading && { backgroundColor: COLORS.themeColor }
        ]}
      >
        {loading ? (
          <>
            <ActivityIndicator size="small" color="white" />
            <Text className={`text-white text-center font-bold ${textClassName}`}>
              {loadingText}
            </Text>
          </>
        ) : (
          <>
            {icon && <Ionicons name={icon} size={22} color={iconColor || "white"} />}
            <Text className={`text-center font-Inter-Bold ${textClassName}`}>
              {text}
            </Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}