import React, { memo } from 'react'
import BottomSheet from '@gorhom/bottom-sheet'
import CustomBackdrop from './CustomBackdrop'
import { COLORS } from '@/constants/theme'
import { Dimensions } from 'react-native'

const CustomBottomSheet = ({ ref = null, onChange = null, children, snapPoints = ['45%', "80%"] }) => {
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
            maxDynamicContentSize={Dimensions.get('window').height * 0.80}
        // enableHandlePanningGesture={false}
        // enableContentPanningGesture={false}
        >
            {children}
        </BottomSheet>

    )
}


export default memo(CustomBottomSheet);