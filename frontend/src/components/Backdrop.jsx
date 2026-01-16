import { memo, useEffect } from "react";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { View, Pressable } from "react-native";

const SearchBackdrop = memo(({ isSearchActive, onPress }) => {
    const opacity = useSharedValue(0);
  
    useEffect(() => {
      opacity.value = withTiming(isSearchActive ? 1 : 0, {
        duration: 150,
        easing: Easing.out(Easing.ease),
      });
    }, [isSearchActive, opacity]);
  
    const backdropStyle = useAnimatedStyle(() => {
      return {
        opacity: opacity.value,
      };
    }, []);
  
    return (
      <Animated.View
        className={`absolute inset-0 z-10 ${isSearchActive ? '' : 'translate-x-full'}`}
        style={backdropStyle}>
        <Pressable className="flex-1 bg-black/50" onPress={onPress} />
      </Animated.View>
    );
  });
  
  export default SearchBackdrop