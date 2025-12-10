// routes.js
export const ROUTES = {
  // Auth
  SPLASH: 'SplashScreen',
  LANDING: 'Landing',
  LOGIN: 'Login',
  FORGET_PASSWORD: 'ForgetPassword',
  INTRO: 'IntroScreen',
  
  // Main/General
  NOTIFICATIONS: 'Notifications',
  APPEARANCE: 'Appearance',
  HELP_AND_SUPPORT: 'HelpAndSupport',
  ABOUT_MYSTIC_AURA: 'AboutMysticAura',
  ADD_COINS: 'AddCoins',
  WITHDRAW_COINS: 'WithdrawCoins',
  CHAT_SCREEN: 'ChatScreen',
  
  // User Side
  EDIT_PROFILE: 'EditProfile',
  BOOK_APPOINTMENT: 'BookApointment',
  CONFIRM_BOOKING: 'ConfirmBooking',
  FAVORITES: 'Favorites',
  MY_BOOKINGS: "MyBookings",
  
  // Counselor Side
  COUNSELOR_PROFILE: 'CouncelorProfile',
};

// Aliases for convenience
export const {
  SPLASH,
  LANDING,
  LOGIN,
  FORGET_PASSWORD,
  INTRO,
  NOTIFICATIONS,
  APPEARANCE,
  HELP_AND_SUPPORT,
  ABOUT_MYSTIC_AURA,
  ADD_COINS,
  WITHDRAW_COINS,
  CHAT_SCREEN,
  EDIT_PROFILE,
  BOOK_APPOINTMENT,
  CONFIRM_BOOKING,
  FAVORITES,
  COUNSELOR_PROFILE,
} = ROUTES;

// Arrays for different screen categories
export const AUTH_ROUTES = [
  ROUTES.LANDING,
  ROUTES.LOGIN,
  ROUTES.FORGET_PASSWORD,
  ROUTES.INTRO,
];

export const MAIN_ROUTES = [
  ROUTES.NOTIFICATIONS,
  ROUTES.APPEARANCE,
  ROUTES.HELP_AND_SUPPORT,
  ROUTES.ABOUT_MYSTIC_AURA,
  ROUTES.ADD_COINS,
  ROUTES.WITHDRAW_COINS,
  ROUTES.CHAT_SCREEN,
];

export const USER_ROUTES = [
  ROUTES.EDIT_PROFILE,
  ROUTES.BOOK_APPOINTMENT,
  ROUTES.CONFIRM_BOOKING,
  ROUTES.FAVORITES,
];

export const COUNSELOR_ROUTES = [
  ROUTES.COUNSELOR_PROFILE,
];

// Screens that should not show header
export const NO_HEADER_SCREENS = [
  ROUTES.SPLASH,
  ROUTES.LANDING,
  ROUTES.LOGIN,
  ROUTES.FORGET_PASSWORD,
  ROUTES.INTRO,
  ROUTES.CHAT_SCREEN,
];

// Screen titles mapping
export const SCREEN_TITLES = {
  [ROUTES.LANDING]: 'Home',
  [ROUTES.LOGIN]: 'Login',
  [ROUTES.FORGET_PASSWORD]: 'Forgot Password',
  [ROUTES.INTRO]: 'Introduction',
  [ROUTES.NOTIFICATIONS]: 'Notifications',
  [ROUTES.APPEARANCE]: 'Appearance',
  [ROUTES.HELP_AND_SUPPORT]: 'Help & Support',
  [ROUTES.ABOUT_MYSTIC_AURA]: 'About MysticAura',
  [ROUTES.ADD_COINS]: 'Add Coins',
  [ROUTES.WITHDRAW_COINS]: 'Withdraw Coins',
  [ROUTES.CHAT_SCREEN]: 'Chat',
  [ROUTES.EDIT_PROFILE]: 'Edit Profile',
  [ROUTES.BOOK_APPOINTMENT]: 'Book Appointment',
  [ROUTES.CONFIRM_BOOKING]: 'Confirm Booking',
  [ROUTES.FAVORITES]: 'Favorites',
  [ROUTES.COUNSELOR_PROFILE]: 'Counselor Profile',
};

// Helper function to get screen title
export const getScreenTitle = (routeName) => {
  return SCREEN_TITLES[routeName] || routeName;
};

// Helper to check if screen should show header
export const shouldShowHeader = (routeName) => {
  return !NO_HEADER_SCREENS.includes(routeName);
};

export default ROUTES;