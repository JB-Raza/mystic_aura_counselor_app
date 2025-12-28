import React, { useEffect, memo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DOT_COUNT = 5;
const DOT_SIZE = 12;
const DOT_SPACING = 15;

export default memo(function Loader() {
  // Shared values for animation
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.dotsWrapper}>
        {Array.from({ length: DOT_COUNT }).map((_, index) => {
          const animatedStyle = useAnimatedStyle(() => {
            const scale = interpolate(
              (progress.value + index * 0.2) % 1,
              [0, 0.5, 1],
              [0.5, 1, 0.5]
            );
            const opacity = interpolate(
              (progress.value + index * 0.2) % 1,
              [0, 0.5, 1],
              [0.3, 1, 0.3]
            );
            return { transform: [{ scale }], opacity };
          });

          return (
            <Animated.View
              key={index}
              style={[styles.dot, animatedStyle]}
            />
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: COLORS.themeColor,
    marginHorizontal: DOT_SPACING / 2,
  },
});