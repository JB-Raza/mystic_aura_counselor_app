import React, { memo } from 'react';
import { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
const CustomBackdrop = (props) => {
  return (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      style={[{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 100 }, props.style]}
    />
  );
};

const MemoizedCustomBackdrop = memo(CustomBackdrop);
MemoizedCustomBackdrop.displayName = 'CustomBackdrop';

export default MemoizedCustomBackdrop;
