// Search utility functions
import { IMAGES } from '@/constants/images';

// Mock counselor data for search (in production, this would come from API)
export const getAllCounselors = () => {
    return [
        {
            id: '1',
            name: 'Sarah Wilson',
            tag: 'Anxiety',
            rating: 4.8,
            rate: 35,
            avatar: IMAGES.ProfileAvatar,
            experience: 8,
            specialties: ['Anxiety', 'Stress', 'Depression'],
            isOnline: true,
        },
        {
            id: '2',
            name: 'Mike Chen',
            tag: 'Career',
            rating: 4.9,
            rate: 45,
            avatar: IMAGES.ProfileAvatar,
            experience: 10,
            specialties: ['Career', 'Motivation', 'Stress'],
            isOnline: false,
        },
        {
            id: '3',
            name: 'Emma Davis',
            tag: 'Relationships',
            rating: 4.7,
            rate: 40,
            avatar: IMAGES.ProfileAvatar,
            experience: 6,
            specialties: ['Relationships', 'Self-Esteem'],
            isOnline: true,
        },
        {
            id: '4',
            name: 'James Miller',
            tag: 'Motivation',
            rating: 4.6,
            rate: 38,
            avatar: IMAGES.ProfileAvatar,
            experience: 5,
            specialties: ['Motivation', 'Career', 'Self-Esteem'],
            isOnline: false,
        },
        {
            id: '5',
            name: 'Lisa Taylor',
            tag: 'Stress',
            rating: 4.8,
            rate: 42,
            avatar: IMAGES.ProfileAvatar,
            experience: 7,
            specialties: ['Stress', 'Anxiety', 'Depression'],
            isOnline: true,
        },
        {
            id: '6',
            name: 'Dr. Robert Brown',
            tag: 'Depression',
            rating: 4.9,
            rate: 50,
            avatar: IMAGES.ProfileAvatar,
            experience: 12,
            specialties: ['Depression', 'Trauma', 'Grief'],
            isOnline: true,
        },
        {
            id: '7',
            name: 'Dr. Maria Garcia',
            tag: 'Addiction',
            rating: 4.7,
            rate: 45,
            avatar: IMAGES.ProfileAvatar,
            experience: 9,
            specialties: ['Addiction', 'Trauma', 'Stress'],
            isOnline: false,
        },
        {
            id: '8',
            name: 'Dr. John Smith',
            tag: 'Trauma',
            rating: 4.8,
            rate: 48,
            avatar: IMAGES.ProfileAvatar,
            experience: 11,
            specialties: ['Trauma', 'Grief', 'Depression'],
            isOnline: true,
        },
    ];
};

// Generate search suggestions
export const generateSuggestions = (query, counselors) => {
    if (!query || query.length < 2) return [];
    if (!counselors || !Array.isArray(counselors)) return [];

    const lowerQuery = query.toLowerCase();
    const suggestions = [];

    // Match counselor names
    counselors.forEach(counselor => {
        if (!counselor) return;
        if (counselor.name && typeof counselor.name === 'string' && counselor.name.toLowerCase().includes(lowerQuery)) {
            suggestions.push({
                text: counselor.name,
                type: 'Counselor',
                data: counselor
            });
        }
    });

    // Match specialties/tags
    const specialties = new Set();
    counselors.forEach(counselor => {
        if (!counselor) return;
        
        if (Array.isArray(counselor.specialties)) {
            counselor.specialties.forEach(spec => {
                if (spec && typeof spec === 'string' && spec.toLowerCase().includes(lowerQuery) && !specialties.has(spec)) {
                    specialties.add(spec);
                    suggestions.push({
                        text: spec,
                        type: 'Specialty',
                        data: { specialty: spec }
                    });
                }
            });
        }
        
        if (counselor.tag && typeof counselor.tag === 'string' && counselor.tag.toLowerCase().includes(lowerQuery) && !specialties.has(counselor.tag)) {
            specialties.add(counselor.tag);
            suggestions.push({
                text: counselor.tag,
                type: 'Specialty',
                data: { specialty: counselor.tag }
            });
        }
    });

    return suggestions.slice(0, 7);
};

// Search counselors
export const searchCounselors = (query, counselors, filters = {}) => {
    if (!counselors || !Array.isArray(counselors)) return [];
    
    if (!query || query.trim().length === 0) {
        return applyFilters(counselors, filters);
    }

    const lowerQuery = query.toLowerCase();
    let results = counselors.filter(counselor => {
        if (!counselor) return false;
        
        const nameMatch = counselor.name && typeof counselor.name === 'string' 
            ? counselor.name.toLowerCase().includes(lowerQuery) 
            : false;
        const tagMatch = counselor.tag && typeof counselor.tag === 'string'
            ? counselor.tag.toLowerCase().includes(lowerQuery)
            : false;
        const specialtyMatch = Array.isArray(counselor.specialties)
            ? counselor.specialties.some(spec => 
                spec && typeof spec === 'string' && spec.toLowerCase().includes(lowerQuery)
            )
            : false;
        return nameMatch || tagMatch || specialtyMatch;
    });

    return applyFilters(results, filters || {});
};

// Apply filters to results
const applyFilters = (results, filters) => {
    if (!results || !Array.isArray(results)) return [];
    if (!filters) filters = {};
    
    let filtered = results.filter(counselor => counselor != null);

    // Filter by specialty
    if (filters.specialty && typeof filters.specialty === 'string') {
        filtered = filtered.filter(counselor =>
            (counselor.tag && counselor.tag === filters.specialty) ||
            (Array.isArray(counselor.specialties) && counselor.specialties.includes(filters.specialty))
        );
    }

    // Filter by online status
    if (filters.onlineOnly === true) {
        filtered = filtered.filter(counselor => counselor.isOnline === true);
    }

    // Filter by rating
    if (filters.minRating && typeof filters.minRating === 'number') {
        filtered = filtered.filter(counselor => 
            counselor.rating != null && typeof counselor.rating === 'number' && counselor.rating >= filters.minRating
        );
    }

    // Filter by price
    if (filters.maxPrice && typeof filters.maxPrice === 'number') {
        filtered = filtered.filter(counselor => 
            counselor.rate != null && typeof counselor.rate === 'number' && counselor.rate <= filters.maxPrice
        );
    }

    // Sort results
    if (filters.sortBy) {
        switch (filters.sortBy) {
            case 'rating':
                filtered.sort((a, b) => {
                    const ratingA = a.rating != null && typeof a.rating === 'number' ? a.rating : 0;
                    const ratingB = b.rating != null && typeof b.rating === 'number' ? b.rating : 0;
                    return ratingB - ratingA;
                });
                break;
            case 'experience':
                filtered.sort((a, b) => {
                    const expA = a.experience != null && typeof a.experience === 'number' ? a.experience : 0;
                    const expB = b.experience != null && typeof b.experience === 'number' ? b.experience : 0;
                    return expB - expA;
                });
                break;
            case 'relevance':
            default:
                // Keep original order
                break;
        }
    }

    return filtered;
};

// Debounce function
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

