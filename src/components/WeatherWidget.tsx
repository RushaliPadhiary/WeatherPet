import { useState, useEffect, useRef } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { WeatherData } from '../types';
import './WeatherWidget.css';

interface WeatherWidgetProps {
  weatherData: WeatherData | null;
  loading: boolean;
}

export default function WeatherWidget({ weatherData, loading }: WeatherWidgetProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const widgetRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    
    const rect = widgetRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  useEffect(() => {
    const handleMouseMove = async (e: MouseEvent) => {
      if (!isDragging) return;

      const window = getCurrentWindow();
      const { PhysicalPosition } = await import('@tauri-apps/api/dpi');
      await window.setPosition(new PhysicalPosition(
        e.screenX - dragOffset.x,
        e.screenY - dragOffset.y
      ));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
    } else {
      document.body.style.cursor = 'default';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  if (loading) {
    return (
      <div className="weather-widget loading" ref={widgetRef}>
        <div className="cat-placeholder">🐱</div>
        <div className="loading-text">Loading weather...</div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="weather-widget" ref={widgetRef}>
        <div className="cat-placeholder">😿</div>
        <div className="error-text">No weather data</div>
        <div className="hint-text">Open settings to configure</div>
      </div>
    );
  }

  const catImage = `/src/assets/cats/${weatherData.condition}.png`;

  return (
    <div 
      className={`weather-widget ${isDragging ? 'dragging' : ''}`}
      ref={widgetRef}
      onMouseDown={handleMouseDown}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div className="cat-container">
        <img 
          src={catImage} 
          alt={`${weatherData.condition} cat`}
          className="cat-sprite"
          onError={(e) => {
            // Fallback to emoji if image not found
            (e.target as HTMLImageElement).style.display = 'none';
            const fallback = document.createElement('div');
            fallback.className = 'cat-placeholder';
            fallback.textContent = '🐱';
            (e.target as HTMLImageElement).parentElement?.appendChild(fallback);
          }}
        />
      </div>
      
      <div className="weather-bubble">
        <div className="temperature">
          {weatherData.temperature}°{weatherData.temperatureUnit}
        </div>
        <div className="weather-note">
          {weatherData.note}
        </div>
      </div>
    </div>
  );
}
