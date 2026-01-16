import AsyncStorage from '@react-native-async-storage/async-storage'

const SEARCH_HISTORY_KEY = 'searchHistory'
const MAX_HISTORY_ITEMS = 10

// Get all search history
export const getSearchHistory = async () => {
  try {
    const historyJson = await AsyncStorage.getItem(SEARCH_HISTORY_KEY)
    if (historyJson) {
      return JSON.parse(historyJson)
    }
    return []
  } catch (error) {
    console.error('Error getting search history:', error)
    return []
  }
}

// Add search query to history
export const addToSearchHistory = async (query) => {
  try {
    if (!query || query.trim().length === 0) return false
    
    const history = await getSearchHistory()
    const trimmedQuery = query.trim()
    
    // Remove if already exists (to move to top)
    const filteredHistory = history.filter(item => item.toLowerCase() !== trimmedQuery.toLowerCase())
    
    // Add to beginning
    const updatedHistory = [trimmedQuery, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS)
    
    await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory))
    return true
  } catch (error) {
    console.error('Error adding to search history:', error)
    return false
  }
}

// Clear search history
export const clearSearchHistory = async () => {
  try {
    await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify([]))
    return true
  } catch (error) {
    console.error('Error clearing search history:', error)
    return false
  }
}

