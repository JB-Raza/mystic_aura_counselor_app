import { IMAGES } from "./constants/images.js";

export const SERVICES = [
  {
    id: "srv001",
    name: "Depression Counseling",
    tagline: "Improve emotional wellbeing",
    icon: "chatbubbles-outline",
    rating: 4.8,
    category: "Mental Health",
    patientServed: 24,
    price: 4200,
    description: "Then both children can read/update the same state, and React will re-render things properly.",
    duration: 34

  },
  {
    id: "srv002",
    name: "Anxiety Disorder Therapy",
    tagline: "Reduce stress & anxious thoughts",
    icon: "leaf-outline",
    rating: 4.6,
    category: "Mental Health",
    patientServed: 23,
    price: 4200,
    description: "Then both children can read/update the same state, and React will re-render things properly.",
    duration: 34
  },
  {
    id: "srv003",
    name: "Relationship Guidance",
    tagline: "Heal trust & rebuild communication",
    icon: "heart-outline",
    rating: 0, // No reviews yet
    category: "Relationship",
    patientServed: 20,
    price: 4200,
    description: "Then both children can read/update the same state, and React will re-render things properly.",
    duration: 34
  },
  {
    id: "srv004",
    name: "Career Counseling",
    tagline: "Choose the right career path",
    icon: "briefcase-outline",
    rating: 4.3,
    category: "Career",
    patientServed: 12,
    price: 4200,
    description: "Then both children can read/update the same state, and React will re-render things properly.",
    duration: 34
  },
  {
    id: "srv005",
    name: "Addiction Support",
    tagline: "Recover with structured care",
    icon: "bandage-outline",
    rating: 0,
    category: "Rehabilitation",
    patientServed: 7,
    price: 4200,
    description: "Then both children can read/update the same state, and React will re-render things properly.",
    duration: 34
  },
  {
    id: "srv006",
    name: "Stress Management",
    tagline: "Find balance & calm your mind",
    icon: "happy-outline",
    rating: 4.7,
    category: "Lifestyle",
    patientServed: 2,
    price: 4200,
    description: "Then both children can read/update the same state, and React will re-render things properly.",
    duration: 34
  },
];


export const REVIEWS = [
  {
    user: {
      name: "Ayesha Khan",
      avatar: IMAGES.ProfileAvatar,
    },
    rating: 5,
    comment:
      "Very patient and truly listened to my concerns. I feel much lighter after the session.",
    date: "Oct 10, 2023",
  },
  {
    user: {
      name: "John Carter",
      avatar: IMAGES.ProfileAvatar,
    },
    rating: 4,
    comment:
      "Great experience! Helped me understand my anxiety triggers. Just wish the call duration was a bit longer.",
    date: "Sep 29, 2023",
  },
  {
    user: {
      name: "Fatima Ali",
      avatar: IMAGES.ProfileAvatar,
    },
    rating: 5,
    comment:
      "Made me feel heard and supported. Professional guidance and very comforting approach.",
    date: "Aug 04, 2023",
  },
  {
    user: {
      name: "Michael Brown",
      avatar: IMAGES.ProfileAvatar,
    },
    rating: 3,
    comment:
      "The doctor was knowledgeable, but the explanation felt a bit rushed.",
    date: "Jul 22, 2023",
  },
  {
    user: {
      name: "Sophia Lee",
      avatar: IMAGES.ProfileAvatar,
    },
    rating: 4,
    comment:
      "Helped me build strategies to improve confidence. I would definitely book again!",
    date: "Jun 11, 2023",
  },
];

export const AvailableBookingSlots = [
  {
    date: new Date("2025-10-28"),
    timeSlots: [
      { time: "09:00 AM", isBooked: false },
      { time: "10:30 AM", isBooked: true },
      { time: "12:00 PM", isBooked: false },
      { time: "01:30 PM", isBooked: false },
      { time: "03:00 PM", isBooked: true },
      { time: "04:30 PM", isBooked: false },
    ]
  },
  {
    date: new Date("2025-10-29"),
    timeSlots: [
      { time: "09:00 AM", isBooked: false },
      { time: "10:30 AM", isBooked: false },
      { time: "12:00 PM", isBooked: true },
      { time: "01:30 PM", isBooked: false },
      { time: "03:00 PM", isBooked: false },
    ]
  },
  {
    date: new Date("2025-10-30"),
    timeSlots: [
      { time: "09:00 AM", isBooked: true },
      { time: "10:30 AM", isBooked: false },
      { time: "12:00 PM", isBooked: false },
      { time: "01:30 PM", isBooked: true },
      { time: "03:00 PM", isBooked: false },
      { time: "04:30 PM", isBooked: false },
      { time: "06:00 PM", isBooked: false },
    ]
  },
  {
    date: new Date("2025-10-31"),
    timeSlots: [
      { time: "09:00 AM", isBooked: false },
      { time: "10:30 AM", isBooked: false },
      { time: "12:00 PM", isBooked: true },
      { time: "01:30 PM", isBooked: true },
      { time: "03:00 PM", isBooked: false },
      { time: "04:30 PM", isBooked: true },
    ]
  },
  {
    date: new Date("2025-11-01"),
    timeSlots: [
      { time: "09:00 AM", isBooked: false },
      { time: "10:30 AM", isBooked: false },
      { time: "12:00 PM", isBooked: false },
      { time: "01:30 PM", isBooked: false },
      { time: "03:00 PM", isBooked: true },
      { time: "04:30 PM", isBooked: false },
      { time: "06:00 PM", isBooked: false },
    ]
  },
];



export const RecentCounselorsData = [
    {
        id: '1',
        name: 'Sarah Wilson',
        tag: 'Anxiety',
        rating: 4.8,
        rate: 35,
        avatar: IMAGES.ProfileAvatar,
        viewedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
    {
        id: '2',
        name: 'Mike Chen',
        tag: 'Career',
        rating: 4.9,
        rate: 45,
        avatar: IMAGES.ProfileAvatar,
        viewedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    },
    {
        id: '3',
        name: 'Emma Davis',
        tag: 'Relationships',
        rating: 4.7,
        rate: 40,
        avatar: IMAGES.ProfileAvatar,
        viewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
    {
        id: '4',
        name: 'James Miller',
        tag: 'Motivation',
        rating: 4.6,
        rate: 38,
        avatar: IMAGES.ProfileAvatar,
        viewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
    {
        id: '5',
        name: 'Lisa Taylor',
        tag: 'Stress',
        rating: 4.8,
        rate: 42,
        avatar: IMAGES.ProfileAvatar,
        viewedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    },
]

export const sampleChats = [
  {
    id: '1',
    host: {
      id: 'counselor_1',
      name: 'Dr. Sarah Chen',
      type: 'counselor',
      specialty: 'Anxiety & Stress',
      isOnline: true,
      avatar: null
    },
    lastMessage: {
      text: 'I understand how you\'re feeling. Let\'s schedule a session to discuss this further.',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      sender: 'host',
      unread: true
    },
    unreadCount: 2,
    chatType: 'user',
    lastActive: new Date(Date.now() - 300000)
  },
  {
    id: '2',
    host: {
      id: 'counselor_2',
      name: 'Michael Rodriguez',
      type: 'counselor',
      specialty: 'Relationship Counseling',
      isOnline: false,
      avatar: null
    },
    lastMessage: {
      text: 'Thank you for sharing that. The breathing techniques seem to be helping based on our last session.',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      sender: 'host',
      unread: false
    },
    unreadCount: 0,
    chatType: 'user',
    lastActive: new Date(Date.now() - 3600000)
  },
  {
    id: '3',
    host: {
      id: 'ai_1',
      name: 'MysticAura AI',
      type: 'ai',
      specialty: '24/7 Support',
      isOnline: true,
      avatar: null
    },
    lastMessage: {
      text: 'I\'m here to help you practice mindfulness. Would you like to try a 5-minute meditation?',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      sender: 'host',
      unread: true
    },
    unreadCount: 1,
    chatType: 'ai_chat',
    lastActive: new Date(Date.now() - 7200000)
  },
  {
    id: '4',
    host: {
      id: 'support_1',
      name: 'Customer Support',
      type: 'support',
      specialty: 'Technical Help',
      isOnline: true,
      avatar: null
    },
    lastMessage: {
      text: 'Your coin purchase has been processed successfully. The coins have been added to your account.',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      sender: 'host',
      unread: false
    },
    unreadCount: 0,
    chatType: 'customer_service',
    lastActive: new Date(Date.now() - 86400000)
  },
  {
    id: '5',
    host: {
      id: 'counselor_3',
      name: 'Dr. Emily Watson',
      type: 'counselor',
      specialty: 'Trauma & PTSD',
      isOnline: false,
      avatar: null
    },
    lastMessage: {
      text: 'Looking forward to our session tomorrow. Remember to complete the journal exercise we discussed.',
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      sender: 'host',
      unread: false
    },
    unreadCount: 0,
    chatType: 'user',
    lastActive: new Date(Date.now() - 172800000)
  },
  {
    id: '6',
    host: {
      id: 'counselor_4',
      name: 'Dr. Jacob',
      type: 'counselor',
      specialty: 'Trauma & PTSD',
      isOnline: false,
      avatar: null
    },
    lastMessage: {
      text: 'Looking forward to our session tomorrow. Remember to complete the journal exercise we discussed.',
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      sender: 'host',
      unread: false
    },
    unreadCount: 0,
    chatType: 'user',
    lastActive: new Date(Date.now() - 172800000)
  },
]