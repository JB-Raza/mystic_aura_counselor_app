import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS } from '@/constants/theme'

export default function GradientContainer({ colors, start, end, style, className, children }) {
    return (
        <LinearGradient
            colors={colors || [COLORS.themeColor, "rgb(59, 131, 255)"]}
            start={start || { x: 0.35, y: 0.1 }}
            end={end || { x: 0.65, y: 1 }}
            className={`rounded-2xl p-5 mb-6 ${className}`}
            style={{ flex: 1, borderRadius: 10, ...style }}

        >
            {children}
        </LinearGradient>
    )
}