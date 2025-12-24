import AsyncStorage from '@react-native-async-storage/async-storage'

const FAVORITES_KEY = 'favoriteCounselors'

/**
 * Favorites Utility Functions
 * 
 * Manages favorite counselors using AsyncStorage for persistence
 */

/**
 * Get all favorite counselors
 * @returns {Promise<Array>} Array of favorite counselors
 */
export const getFavorites = async () => {
  try {
    const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY)
    if (favoritesJson) {
      return JSON.parse(favoritesJson)
    }
    return []
  } catch (error) {
    console.error('Error getting favorites:', error)
    return []
  }
}


export const addToFavorites = async (counselor) => {
  try {
    const favorites = await getFavorites()
    
    // Check if already in favorites
    const isAlreadyFavorite = favorites.some(
      fav => (fav.id && fav.id === counselor.id) || fav.name === counselor.name
    )
    
    if (!isAlreadyFavorite) {
      // Add unique ID if not present
      const counselorWithId = {
        ...counselor,
        id: counselor.id || counselor.name || Date.now().toString(),
        favoritedAt: new Date().toISOString()
      }
      
      favorites.push(counselorWithId)
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
      return true
    }
    return false
  } catch (error) {
    console.error('Error adding to favorites:', error)
    return false
  }
}


export const removeFromFavorites = async (counselorId) => {
  try {
    const favorites = await getFavorites()
    const updatedFavorites = favorites.filter(
      fav => (fav.id && fav.id !== counselorId) && fav.name !== counselorId
    )
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites))
    return true
  } catch (error) {
    console.error('Error removing from favorites:', error)
    return false
  }
}


export const isFavorite = async (counselorId) => {
  try {
    const favorites = await getFavorites()
    return favorites.some(
      fav => (fav.id && fav.id === counselorId) || fav.name === counselorId
    )
  } catch (error) {
    console.error('Error checking favorite:', error)
    return false
  }
}


export const toggleFavorite = async (counselor) => {
  try {
    const counselorId = counselor.id || counselor.name
    const currentlyFavorite = await isFavorite(counselorId)
    
    if (currentlyFavorite) {
      await removeFromFavorites(counselorId)
      return false
    } else {
      await addToFavorites(counselor)
      return true
    }
  } catch (error) {
    console.error('Error toggling favorite:', error)
    return false
  }
}

