// Weather service using OpenWeatherMap API
class WeatherService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
  }

  async getCurrentWeather(location) {
    if (!this.apiKey) {
      throw new Error('API key not set. Please configure in settings.');
    }

    try {
      const url = `${this.baseUrl}?q=${encodeURIComponent(location)}&appid=${this.apiKey}&units=metric`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        temp: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        location: data.name
      };
    } catch (error) {
      console.error('Failed to fetch weather:', error);
      throw error;
    }
  }
}

export default WeatherService;
