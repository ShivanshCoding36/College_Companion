/**
 * MongoDB User Service
 * Handles user profile and onboarding data
 */

const API_BASE_URL = '/api';

/**
 * Create user profile in MongoDB
 * @param {string} userId - Firebase Auth UID
 * @param {Object} profileData - { fullName, email, collegeName, degree, age }
 * @returns {Promise<Object>} Created user profile
 */
export const createUserProfile = async (userId, profileData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...profileData })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create user profile');
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Create user profile error:', error);
    throw error;
  }
};

/**
 * Get user profile from MongoDB
 * @param {string} userId - Firebase Auth UID
 * @returns {Promise<Object|null>} User profile or null if not found
 */
export const getUserProfile = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    
    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
};

/**
 * Update user profile
 * @param {string} userId - Firebase Auth UID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated profile
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error('Failed to update user profile');
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Update user profile error:', error);
    throw error;
  }
};

/**
 * Save onboarding data
 * @param {string} userId - Firebase Auth UID
 * @param {Object} onboardingData - Onboarding answers
 * @returns {Promise<Object>} Updated user with onboarding
 */
export const saveOnboardingData = async (userId, onboardingData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(onboardingData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to save onboarding data');
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Save onboarding error:', error);
    throw error;
  }
};

/**
 * Check if user has completed onboarding
 * @param {string} userId - Firebase Auth UID
 * @returns {Promise<boolean>} True if onboarding completed
 */
export const hasCompletedOnboarding = async (userId) => {
  try {
    const profile = await getUserProfile(userId);
    return !!(profile && profile.onboarding && profile.onboarding.completedAt);
  } catch (error) {
    console.error('Check onboarding error:', error);
    return false;
  }
};
