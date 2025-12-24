import { View, StyleSheet, Dimensions } from 'react-native';
import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import { COLORS } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIZE = SCREEN_WIDTH * 0.6;

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function Loader() {
  const progress = useSharedValue(0);
  const progress2 = useSharedValue(0);
  const progress3 = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    progress2.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 300 }),
        withTiming(1, {
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );

    progress3.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 600 }),
        withTiming(1, {
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );
  }, []);

  // 3D brain neural network paths - creating depth with layers
  const brainPaths = [
    // Front layer - main neural connections
    {
      path: 'M 150 80 Q 180 100 200 130 Q 190 160 160 180 Q 130 160 120 130 Q 130 100 150 80',
      delay: 0,
      progress: progress,
    },
    {
      path: 'M 120 130 L 100 100 L 80 120 L 90 150 L 110 160',
      delay: 0.2,
      progress: progress2,
    },
    {
      path: 'M 200 130 L 220 100 L 240 120 L 230 150 L 210 160',
      delay: 0.2,
      progress: progress2,
    },
    // Middle layer - depth connections
    {
      path: 'M 150 100 Q 170 120 180 140 Q 175 155 155 170 Q 135 155 140 140 Q 145 120 150 100',
      delay: 0.4,
      progress: progress3,
    },
    {
      path: 'M 110 140 L 90 110 L 70 130 L 80 160 L 100 170',
      delay: 0.3,
      progress: progress2,
    },
    {
      path: 'M 210 140 L 230 110 L 250 130 L 240 160 L 220 170',
      delay: 0.3,
      progress: progress2,
    },
    // Back layer - deeper connections
    {
      path: 'M 140 120 Q 160 135 170 150 Q 165 165 145 175 Q 125 165 130 150 Q 135 135 140 120',
      delay: 0.6,
      progress: progress3,
    },
    // Branching connections
    {
      path: 'M 150 80 L 140 60 L 130 50 L 120 60 L 130 80',
      delay: 0.1,
      progress: progress,
    },
    {
      path: 'M 150 80 L 160 60 L 170 50 L 180 60 L 170 80',
      delay: 0.1,
      progress: progress,
    },
    {
      path: 'M 160 180 L 150 200 L 140 210 L 130 200 L 140 180',
      delay: 0.5,
      progress: progress3,
    },
    {
      path: 'M 160 180 L 170 200 L 180 210 L 190 200 L 180 180',
      delay: 0.5,
      progress: progress3,
    },
  ];

  // Neural nodes (connection points)
  const nodes = [
    { x: 150, y: 80, size: 6, progress: progress },
    { x: 200, y: 130, size: 5, progress: progress },
    { x: 120, y: 130, size: 5, progress: progress },
    { x: 160, y: 180, size: 6, progress: progress },
    { x: 100, y: 100, size: 4, progress: progress2 },
    { x: 220, y: 100, size: 4, progress: progress2 },
    { x: 80, y: 120, size: 4, progress: progress2 },
    { x: 240, y: 120, size: 4, progress: progress2 },
    { x: 90, y: 150, size: 4, progress: progress2 },
    { x: 230, y: 150, size: 4, progress: progress2 },
    { x: 150, y: 100, size: 5, progress: progress3 },
    { x: 180, y: 140, size: 5, progress: progress3 },
    { x: 140, y: 120, size: 4, progress: progress3 },
  ];

  const pathAnimatedProps = (prog, delay) => {
    return useAnimatedProps(() => {
      const offset = interpolate(
        prog.value,
        [0, 1],
        [300, 0],
        'clamp'
      );
      return {
        strokeDashoffset: offset,
        opacity: interpolate(prog.value, [0, 0.3, 1], [0, 1, 1], 'clamp'),
      };
    });
  };

  const nodeAnimatedProps = (prog) => {
    return useAnimatedProps(() => {
      return {
        opacity: interpolate(prog.value, [0, 0.5, 1], [0, 1, 1], 'clamp'),
        r: interpolate(prog.value, [0, 0.5, 1], [0, 4, 6], 'clamp'),
      };
    });
  };

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE} viewBox="0 0 300 250">
        <Defs>
          <LinearGradient id="brainGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={COLORS.themeColor} stopOpacity="1" />
            <Stop offset="50%" stopColor={COLORS.lightThemeColor} stopOpacity="0.9" />
            <Stop offset="100%" stopColor={COLORS.themeColor} stopOpacity="0.7" />
          </LinearGradient>
          <LinearGradient id="brainGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={COLORS.lightThemeColor} stopOpacity="0.8" />
            <Stop offset="100%" stopColor={COLORS.themeColor} stopOpacity="0.6" />
          </LinearGradient>
          <LinearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={COLORS.themeColor} stopOpacity="1" />
            <Stop offset="100%" stopColor={COLORS.lightThemeColor} stopOpacity="0.9" />
          </LinearGradient>
        </Defs>

        {/* Back layer paths - darker/lower opacity for depth */}
        {brainPaths.slice(6, 8).map((pathData, index) => {
          const animatedProps = pathAnimatedProps(pathData.progress, pathData.delay);
          return (
            <AnimatedPath
              key={`back-${index}`}
              d={pathData.path}
              fill="none"
              stroke="url(#brainGradient2)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="300"
              animatedProps={animatedProps}
              opacity={0.5}
            />
          );
        })}

        {/* Middle layer paths */}
        {brainPaths.slice(3, 6).map((pathData, index) => {
          const animatedProps = pathAnimatedProps(pathData.progress, pathData.delay);
          return (
            <AnimatedPath
              key={`mid-${index}`}
              d={pathData.path}
              fill="none"
              stroke="url(#brainGradient1)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="300"
              animatedProps={animatedProps}
              opacity={0.7}
            />
          );
        })}

        {/* Front layer paths - brightest */}
        {brainPaths.slice(0, 3).map((pathData, index) => {
          const animatedProps = pathAnimatedProps(pathData.progress, pathData.delay);
          return (
            <AnimatedPath
              key={`front-${index}`}
              d={pathData.path}
              fill="none"
              stroke="url(#brainGradient1)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="300"
              animatedProps={animatedProps}
            />
          );
        })}

        {/* Branching connections */}
        {brainPaths.slice(7).map((pathData, index) => {
          const animatedProps = pathAnimatedProps(pathData.progress, pathData.delay);
          return (
            <AnimatedPath
              key={`branch-${index}`}
              d={pathData.path}
              fill="none"
              stroke="url(#brainGradient2)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="200"
              animatedProps={animatedProps}
              opacity={0.6}
            />
          );
        })}

        {/* Neural nodes - connection points with pulsing effect */}
        {nodes.map((node, index) => {
          const animatedProps = nodeAnimatedProps(node.progress);
          return (
            <AnimatedCircle
              key={`node-${index}`}
              cx={node.x}
              cy={node.y}
              r={node.size}
              fill="url(#nodeGradient)"
              animatedProps={animatedProps}
            />
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});
