// Storage utility for web and mobile compatibility
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

const isNative = Capacitor.isNativePlatform();

export const storage = {
  async setItem(key, value) {
    if (isNative) {
      // Use Capacitor Preferences for mobile
      await Preferences.set({ key, value });
    } else {
      // Use localStorage for web
      localStorage.setItem(key, value);
    }
  },

  async getItem(key) {
    if (isNative) {
      // Use Capacitor Preferences for mobile
      const { value } = await Preferences.get({ key });
      return value;
    } else {
      // Use localStorage for web
      return localStorage.getItem(key);
    }
  },

  async removeItem(key) {
    if (isNative) {
      // Use Capacitor Preferences for mobile
      await Preferences.remove({ key });
    } else {
      // Use localStorage for web
      localStorage.removeItem(key);
    }
  }
};