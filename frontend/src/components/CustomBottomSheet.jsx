import React from 'react'
import BottomSheet from '@gorhom/bottom-sheet'
import CustomBackdrop from './CustomBackdrop'
import { COLORS } from '@/constants/theme'

export default function CustomBottomSheet({ ref = null, onChange = null, children, snapPoints = ['50%', "90%"] }) {
    return (
        <BottomSheet
            ref={ref}
            index={-1}
            snapPoints={snapPoints}
            onChange={onChange}
            style={{ borderRadius: 20 }}
            backdropComponent={CustomBackdrop}
            handleIndicatorStyle={{ backgroundColor: COLORS.themeColor, width: 50 }}
            enablePanDownToClose={true}
        // enableHandlePanningGesture={false}
        // enableContentPanningGesture={false}
        >
            {children}
        </BottomSheet>

    )
}