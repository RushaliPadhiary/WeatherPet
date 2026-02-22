import { useState } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { Settings } from '../types';
import { loadSettings, saveSettings } from '../utils/storage';
import './SettingsWindow.css';

interface SettingsWindowProps {
  onSave: (settings: Settings) => void;
}

export default function SettingsWindow({ onSave }: SettingsWindowProps) {
  const [settings, setSettings] = useState<Settings>(loadSettings());
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    saveSettings(settings);
    onSave(settings);
    setSaved(true);
    
    // Update always on top for widget window
    try {
      const { WebviewWindow } = await import('@tauri-apps/api/webviewWindow');
      const widgetWindow = await WebviewWindow.getByLabel('widget');
      if (widgetWindow) {
        await widgetWindow.setAlwaysOnTop(settings.alwaysOnTop);
      }
    } catch (err) {
      console.error('Failed to update always on top:', err);
    }

    setTimeout(() => setSaved(false), 2000);
  };

  const handleClose = async () => {
    const window = getCurrentWindow();
    await window.hide();
  };

  return (
    <div className="settings-window">
      <div className="settings-header">
        <h1>⚙️ WeatherPet Settings</h1>
        <button className="close-btn" onClick={handleClose}>✕</button>
      </div>

      <div className="settings-content">
        <div className="setting-group">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            value={settings.location}
            onChange={(e) => setSettings({ ...settings, location: e.target.value })}
            placeholder="e.g., London, Tokyo, New York"
            className="pixel-input"
          />
          <div className="hint">City name or "City, Country Code"</div>
        </div>

        <div className="setting-group">
          <label htmlFor="temp-unit">Temperature Unit</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="temp-unit"
                checked={settings.temperatureUnit === 'C'}
                onChange={() => setSettings({ ...settings, temperatureUnit: 'C' })}
              />
              <span>Celsius (°C)</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="temp-unit"
                checked={settings.temperatureUnit === 'F'}
                onChange={() => setSettings({ ...settings, temperatureUnit: 'F' })}
              />
              <span>Fahrenheit (°F)</span>
            </label>
          </div>
        </div>

        <div className="setting-group">
          <label htmlFor="update-interval">Update Interval (minutes)</label>
          <input
            id="update-interval"
            type="number"
            min="5"
            max="120"
            value={settings.updateInterval}
            onChange={(e) => setSettings({ ...settings, updateInterval: parseInt(e.target.value) || 30 })}
            className="pixel-input"
          />
        </div>

        <div className="setting-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.alwaysOnTop}
              onChange={(e) => setSettings({ ...settings, alwaysOnTop: e.target.checked })}
            />
            <span>Keep widget always on top</span>
          </label>
        </div>
      </div>

      <div className="settings-footer">
        <button 
          className={`save-btn ${saved ? 'saved' : ''}`}
          onClick={handleSave}
          disabled={!settings.location}
        >
          {saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
