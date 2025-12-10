  {/* Header Section */}
        <View className="py-5 mx-auto mb-0 w-full px-3">

          <Animated.View
            className={`relative gap-3 items-center pt-5`}>
            {/* profile image */}
            <Animated.View
              style={animatedImageStyle}
              className="relative  shadow-md mx-auto rounded-full justify-center">
              <Animated.Image
                source={data.avatar}
                className="w-full h-full border-[4px] border-themeColor  rounded-full"
              />

              {/* online dot */}
              <View className='h-[8px] w-[8px] !rounded-full bg-green-500 absolute right-4 bottom-0'></View>
            </Animated.View>

            {/* rating */}
            <Animated.View
              style={ratingCapsuleStyle}
              className={`absolute right-0 top-5 px-3 py-1 rounded-full bg-themeColor flex-row items-center gap-1`}>
              <Ionicons name="star" size={13} color="white" />
              <Text className='text-white font-semibold text-[12px]'>{data.rating}</Text>
            </Animated.View>
            {/* name and tag */}
            <Animated.View
              style={nameSectionStyle}
            >
              <Text className="text-[18px] text- font-Inter-Bold font-bold text-neutral-800">
                {data?.name}
              </Text>
              <Text className="text-[12px] text-themeColor font-semibold mt-0.5">
                {data?.tag} Expert
              </Text>
            </Animated.View>

            {/* highlight section */}
            <Animated.View
              style={animatedHighlightSection}

              className="flex-row w-full justify-between items-center mt-10 px-3 gap-4">
              {/* wait time */}
              <View className='py-0.5 items-center'>
                <Text className="text-[12px] text-slate-700 font-semibold text-center">Under 15 Min</Text>
                <Text className="text-[11px] text-themeColor/80 font-semibold">Wait Time</Text>
              </View>

              {/* vertical divider */}
              <View className='h-[95%] rounded-full w-[2px] bg-themeColor/80'></View>

              {/* experience */}
              <View className='py-0.5 items-center'>
                <Text className="text-[12px] text-slate-700 font-semibold text-center">10 Years</Text>
                <Text className="text-[11px] text-themeColor/80 font-semibold">Experience</Text>
              </View>

              {/* vertical divider */}
              <View className='h-[95%] rounded-full w-[2px] bg-themeColor/80'></View>

              {/* satisfication rate */}
              <View className='py-0.5 items-center'>
                <Text className="text-[12px] text-slate-700 font-semibold text-center">100% (16)</Text>
                <Text className="text-[11px] text-themeColor/80 font-semibold">Satisfied</Text>
              </View>

            </Animated.View>
          </Animated.View>
        </View>