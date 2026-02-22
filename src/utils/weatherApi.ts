import { WeatherCondition, WeatherData } from '../types';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

export async function fetchWeather(
  location: string,
  unit: 'C' | 'F' = 'C'
): Promise<WeatherData> {
  try {
    // First, geocode the location
    const geoResponse = await fetch(
      `${GEOCODING_URL}?name=${encodeURIComponent(location)}&count=1&language=en&format=json`
    );

    if (!geoResponse.ok) {
      throw new Error(`Geocoding error: ${geoResponse.statusText}`);
    }

    const geoData = await geoResponse.json();
    
    if (!geoData.results || geoData.results.length === 0) {
      throw new Error('Location not found');
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // Then fetch weather data
    const tempUnit = unit === 'C' ? 'celsius' : 'fahrenheit';
    const weatherResponse = await fetch(
      `${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=${tempUnit}`
    );

    if (!weatherResponse.ok) {
      throw new Error(`Weather API error: ${weatherResponse.statusText}`);
    }

    const weatherData = await weatherResponse.json();
    const current = weatherData.current;
    
    const condition = mapWeatherCode(current.weather_code);
    
    return {
      condition,
      temperature: Math.round(current.temperature_2m),
      temperatureUnit: unit,
      note: generateWeatherNote(condition),
      location: country ? `${name}, ${country}` : name,
    };
  } catch (error) {
    console.error('Failed to fetch weather:', error);
    throw error;
  }
}

function mapWeatherCode(code: number): WeatherCondition {
  // Open-Meteo WMO Weather codes: https://open-meteo.com/en/docs
  if (code === 0) return 'sunny'; // Clear sky
  if (code === 1) return 'sunny'; // Mainly clear
  if (code === 2) return 'partly-cloudy'; // Partly cloudy
  if (code === 3) return 'cloudy'; // Overcast
  if (code >= 45 && code <= 48) return 'foggy'; // Fog
  if (code >= 51 && code <= 67) return 'rainy'; // Drizzle/Rain
  if (code >= 71 && code <= 77) return 'snowy'; // Snow
  if (code >= 80 && code <= 82) return 'rainy'; // Rain showers
  if (code >= 85 && code <= 86) return 'snowy'; // Snow showers
  if (code >= 95 && code <= 99) return 'stormy'; // Thunderstorm
  
  return 'sunny'; // Default
}

function generateWeatherNote(condition: WeatherCondition): string {
  const notes: Record<WeatherCondition, string[]> = {
    sunny: [
      "Perfect day for adventures! ☀️",
      "Sunshine vibes! 🌞",
      "Time to go outside! ✨",
    ],
    'partly-cloudy': [
      "Nice weather today! 🌤️",
      "Partly sunny! 🌥️",
      "Great day ahead! ☁️✨",
    ],
    cloudy: [
      "Cozy cloudy day! ☁️",
      "Nice and mild! 🌥️",
      "Perfect weather! 💭",
    ],
    rainy: [
      "Stay dry out there! ☔",
      "Cozy indoor weather! 🌧️",
      "Umbrella time! 💧",
    ],
    stormy: [
      "Stay safe inside! ⚡",
      "Stormy weather! 🌩️",
      "Dramatic skies! ⛈️",
    ],
    snowy: [
      "Snowy wonderland! ❄️",
      "Bundle up! ⛄",
      "Winter magic! 🌨️",
    ],
    foggy: [
      "Mystical vibes! 🌫️",
      "Foggy morning! 🌁",
      "Mysterious weather! 🌫️",
    ],
  };

  const conditionNotes = notes[condition] || ["Have a great day! 💕"];
  return conditionNotes[Math.floor(Math.random() * conditionNotes.length)];
}
