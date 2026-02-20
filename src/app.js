import { PETS, getWeatherType } from './pets.js';
import WeatherService from './weather.js';

class WeatherPetApp {
  constructor() {
    this.currentPet = null;
    this.currentWeather = null;
    this.weatherService = null;
    this.updateInterval = null;
    
    this.loadSettings();
    this.init();
  }

  init() {
    // Show settings if not configured
    if (!this.currentPet || !this.settings.location || !this.settings.apiKey) {
      this.showSettings();
    } else {
      this.updateWeatherAndPet();
      // Update every 30 minutes
      this.updateInterval = setInterval(() => this.updateWeatherAndPet(), 30 * 60 * 1000);
    }

    // Setup event listeners
    document.getElementById('settings-btn').addEventListener('click', () => this.showSettings());
    document.getElementById('save-settings').addEventListener('click', () => this.saveSettings());
    document.getElementById('cancel-settings').addEventListener('click', () => this.hideSettings());
    
    // Make window draggable
    document.getElementById('pet-container').addEventListener('mousedown', () => {
      window.__TAURI__.window.appWindow.startDragging();
    });
  }

  loadSettings() {
    this.settings = {
      pet: localStorage.getItem('pet') || null,
      location: localStorage.getItem('location') || '',
      apiKey: localStorage.getItem('apiKey') || ''
    };

    this.currentPet = this.settings.pet;
    if (this.settings.apiKey) {
      this.weatherService = new WeatherService(this.settings.apiKey);
    }
  }

  showSettings() {
    const modal = document.getElementById('settings-modal');
    modal.style.display = 'flex';

    // Populate current values
    document.getElementById('pet-select').value = this.settings.pet || 'cat';
    document.getElementById('location-input').value = this.settings.location;
    document.getElementById('api-key-input').value = this.settings.apiKey;
  }

  hideSettings() {
    document.getElementById('settings-modal').style.display = 'none';
  }

  saveSettings() {
    const pet = document.getElementById('pet-select').value;
    const location = document.getElementById('location-input').value.trim();
    const apiKey = document.getElementById('api-key-input').value.trim();

    if (!pet || !location || !apiKey) {
      alert('Please fill in all fields');
      return;
    }

    // Save to localStorage
    localStorage.setItem('pet', pet);
    localStorage.setItem('location', location);
    localStorage.setItem('apiKey', apiKey);

    this.settings = { pet, location, apiKey };
    this.currentPet = pet;
    this.weatherService = new WeatherService(apiKey);

    this.hideSettings();
    this.updateWeatherAndPet();

    // Setup interval if not already running
    if (!this.updateInterval) {
      this.updateInterval = setInterval(() => this.updateWeatherAndPet(), 30 * 60 * 1000);
    }
  }

  async updateWeatherAndPet() {
    try {
      // Fetch weather
      this.currentWeather = await this.weatherService.getCurrentWeather(this.settings.location);
      
      // Determine weather type
      const weatherType = getWeatherType(this.currentWeather.condition, this.currentWeather.temp);
      
      // Render pet with reaction
      this.renderPet(weatherType);
    } catch (error) {
      console.error('Failed to update weather:', error);
      this.showError('Failed to fetch weather. Check your API key and location.');
    }
  }

  renderPet(weatherType) {
    const pet = PETS[this.currentPet];
    const reaction = pet.reactions[weatherType];

    const petEmoji = document.getElementById('pet-emoji');
    const accessory = document.getElementById('pet-accessory');
    const bubble = document.getElementById('speech-bubble');
    const bubbleText = document.getElementById('bubble-text');

    // Update pet
    petEmoji.textContent = reaction.emoji;
    accessory.textContent = reaction.accessory;

    // Update speech bubble
    const weatherText = `${this.currentWeather.temp}°C\n${this.currentWeather.condition}\n${reaction.text}`;
    bubbleText.textContent = weatherText;

    // Show bubble with animation
    bubble.style.display = 'block';
    bubble.classList.remove('bounce');
    void bubble.offsetWidth; // Trigger reflow
    bubble.classList.add('bounce');
  }

  showError(message) {
    const bubbleText = document.getElementById('bubble-text');
    bubbleText.textContent = message;
    document.getElementById('speech-bubble').style.display = 'block';
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new WeatherPetApp());
} else {
  new WeatherPetApp();
}
