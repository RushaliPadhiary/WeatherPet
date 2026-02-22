import { Settings } from '../types';

const STORAGE_KEY = 'weather-cat-settings';

export const defaultSettings: Settings = {
  location: '',
  alwaysOnTop: false,
  temperatureUnit: 'C',
  updateInterval: 30, // 30 minutes
};

export function loadSettings(): Settings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return defaultSettings;
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}
