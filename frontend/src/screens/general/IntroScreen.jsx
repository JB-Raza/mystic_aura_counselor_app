import { ButtonFullWidth } from '@/components';
import React, { useCallback, memo } from 'react';
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { useNavigation } from '@react-navigation/native';
import { IMAGES } from '@/constants/images';
import ROUTES from '@/constants/routes';


const { width, height } = Dimensions.get('window');

// Constants moved outside component
const SLIDES = [
    { id: 1, title: 'Welcome to MysticAura', desc: 'Find peace and connect with expert counselors.', image: IMAGES.Logo_Img },
    { id: 2, title: 'Discover Experts', desc: 'Browse counselors by expertise, rating, or availability.', image: IMAGES.Logo_Img },
    { id: 3, title: 'Chat in Real Time', desc: 'Get live support through secure video or chat sessions.', image: IMAGES.Logo_Img },
    { id: 4, title: 'Join as Counceller or User', desc: 'Get live support through secure video or chat sessions.', image: IMAGES.Logo_Img }
];

// Memoized SlideItem component
const SlideItem = memo(({ item, index, isLastSlide, onGetStarted }) => (
    <View style={styles.slide}>
        {item.image && <Image source={item.image} style={styles.image} />}
        <Text className='text-center text-[22px] text-white font-semibold mb-3' style={styles.fontFamily}>
            {item.title}
        </Text>
        <Text className='text-[15px] text-neutral-400 text-center leading-[22px]'>
            {item.desc}
        </Text>

        {/* Get started button on last slide */}
        <View className='w-full my-10 h-16 justify-center'>
            {isLastSlide && (
                <ButtonFullWidth
                    text={"Get Started"}
                    onPress={onGetStarted}
                />
            )}
        </View>
    </View>
));

export default function WelcomeCarousel() {
    const navigation = useNavigation();

    // Memoize navigation handler
    const handleGetStarted = useCallback(() => {
        navigation.navigate(ROUTES.LOGIN);
    }, [navigation]);

    // Memoize renderItem
    const renderItem = useCallback(({ item, index }) => {
        const isLastSlide = index === SLIDES.length - 1;
        return (
            <SlideItem
                item={item}
                index={index}
                isLastSlide={isLastSlide}
                onGetStarted={handleGetStarted}
            />
        );
    }, [handleGetStarted]);

    // Memoize keyExtractor
    const keyExtractor = useCallback((item) => item.id.toString(), []);

    return (
        <SwiperFlatList
            showPagination
            paginationActiveColor="#a18aff"
            paginationDefaultColor="#666"
            autoplay={false}
            data={SLIDES}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
        />
    );
}

const styles = StyleSheet.create({
    slide: {
        width,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0c0c1a',
        padding: 20,
    },
    image: {
        width: width * 0.7,
        height: height * 0.4,
        resizeMode: 'center',
        marginBottom: 20,
    },
    fontFamily: {
        fontFamily: "Inter-Bold"
    }
});
