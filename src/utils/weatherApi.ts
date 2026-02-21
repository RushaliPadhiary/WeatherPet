import { WeatherCondition, WeatherData } from '../types';

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export async function fetchWeather(
  location: string,
  apiKey: string,
  unit: 'C' | 'F' = 'C'
): Promise<WeatherData> {
  const units = unit === 'C' ? 'metric' : 'imperial';
  
  try {
    const response = await fetch(
      `${OPENWEATHER_BASE_URL}?q=${encodeURIComponent(location)}&appid=${apiKey}&units=${units}`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      condition: mapWeatherCondition(data.weather[0].main, data.weather[0].id),
      temperature: Math.round(data.main.temp),
      temperatureUnit: unit,
      note: generateWeatherNote(data.weather[0].main, data.main.temp),
      location: data.name,
    };
  } catch (error) {
    console.error('Failed to fetch weather:', error);
    throw error;
  }
}

function mapWeatherCondition(_main: string, id: number): WeatherCondition {
  // OpenWeatherMap condition IDs: https://openweathermap.org/weather-conditions
  if (id >= 200 && id < 300) return 'stormy'; // Thunderstorm
  if (id >= 300 && id < 600) return 'rainy'; // Drizzle & Rain
  if (id >= 600 && id < 700) return 'snowy'; // Snow
  if (id >= 700 && id < 800) return 'foggy'; // Atmosphere (fog, mist, etc)
  if (id === 800) return 'sunny'; // Clear
  if (id === 801) return 'partly-cloudy'; // Few clouds
  if (id > 801) return 'cloudy'; // Clouds
  
  return 'sunny'; // Default
}

function generateWeatherNote(condition: string, _temp: number): string {
  const notes: Record<string, string[]> = {
    Clear: [
      "Perfect day for adventures! ☀️",
      "Sunshine vibes! 🌞",
      "Time to go outside! ✨",
    ],
    Clouds: [
      "Cozy cloudy day! ☁️",
      "Nice and mild! 🌥️",
      "Perfect weather! 💭",
    ],
    Rain: [
      "Stay dry out there! ☔",
      "Cozy indoor weather! 🌧️",
      "Umbrella time! 💧",
    ],
    Drizzle: [
      "Light drizzle today! 🌦️",
      "Gentle rain vibes! 💦",
    ],
    Thunderstorm: [
      "Stay safe inside! ⚡",
      "Stormy weather! 🌩️",
      "Dramatic skies! ⛈️",
    ],
    Snow: [
      "Snowy wonderland! ❄️",
      "Bundle up! ⛄",
      "Winter magic! 🌨️",
    ],
    Mist: [
      "Mystical vibes! 🌫️",
      "Foggy morning! 🌁",
    ],
    Fog: [
      "Misty day ahead! 🌁",
      "Mysterious weather! 🌫️",
    ],
  };

  const conditionNotes = notes[condition] || ["Have a great day! 💕"];
  return conditionNotes[Math.floor(Math.random() * conditionNotes.length)];
}
