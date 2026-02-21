import { useState, useEffect } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import WeatherWidget from './components/WeatherWidget';
import SettingsWindow from './components/SettingsWindow';
import { WeatherData, Settings } from './types';
import { fetchWeather } from './utils/weatherApi';
import { loadSettings } from './utils/storage';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSettingsWindow, setIsSettingsWindow] = useState(false);

  useEffect(() => {
    const init = async () => {
      const window = getCurrentWindow();
      const label = window.label;
      setIsSettingsWindow(label === 'settings');

      if (label === 'widget') {
        // Show widget window on startup
        await window.show();
        await window.setFocus();
        
        // Load initial weather data
        await updateWeather();
      } else if (label === 'settings') {
        // Settings window starts hidden and is shown by system tray
        await window.show();
      }
    };

    init();
  }, []);

  const updateWeather = async () => {
    const settings = loadSettings();
    
    if (!settings.location || !settings.apiKey) {
      console.log('No location or API key configured');
      return;
    }

    setLoading(true);
    try {
      const data = await fetchWeather(
        settings.location,
        settings.apiKey,
        settings.temperatureUnit
      );
      setWeatherData(data);
    } catch (error) {
      console.error('Failed to fetch weather:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsSave = async (settings: Settings) => {
    await updateWeather();
    
    // Set up auto-refresh interval
    const intervalMs = settings.updateInterval * 60 * 1000;
    const intervalId = setInterval(updateWeather, intervalMs);
    
    return () => clearInterval(intervalId);
  };

  if (isSettingsWindow) {
    return <SettingsWindow onSave={handleSettingsSave} />;
  }

  return <WeatherWidget weatherData={weatherData} loading={loading} />;
}

export default App;
