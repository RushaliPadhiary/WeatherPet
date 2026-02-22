export type WeatherCondition = 
  | 'sunny' 
  | 'cloudy' 
  | 'rainy' 
  | 'snowy' 
  | 'stormy' 
  | 'foggy'
  | 'partly-cloudy';

export interface WeatherData {
  condition: WeatherCondition;
  temperature: number;
  temperatureUnit: 'C' | 'F';
  note: string;
  location: string;
}

export interface Settings {
  location: string;
  alwaysOnTop: boolean;
  temperatureUnit: 'C' | 'F';
  updateInterval: number; // in minutes
}

export interface Position {
  x: number;
  y: number;
}
