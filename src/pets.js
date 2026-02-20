// Pet definitions with emoji-based representations
const PETS = {
  'guinea-pig': {
    name: 'Guinea Pig',
    emoji: '🐹',
    reactions: {
      sunny: { emoji: '🐹', accessory: '😎', text: 'Sunbathing!' },
      rainy: { emoji: '🐹', accessory: '☂️', text: 'Staying dry!' },
      cloudy: { emoji: '🐹', accessory: '☁️', text: 'Hmm...' },
      snowy: { emoji: '🐹', accessory: '🧣', text: 'Brrr!' },
      stormy: { emoji: '🐹', accessory: '😰', text: 'Scared!' },
      windy: { emoji: '🐹', accessory: '💨', text: 'Whoosh!' },
      hot: { emoji: '🐹', accessory: '🥵', text: 'Too hot!' },
      cold: { emoji: '🐹', accessory: '🥶', text: 'So cold!' }
    }
  },
  cat: {
    name: 'Cat',
    emoji: '🐱',
    reactions: {
      sunny: { emoji: '🐱', accessory: '😎', text: 'Purr-fect!' },
      rainy: { emoji: '🐱', accessory: '☂️', text: 'Staying inside!' },
      cloudy: { emoji: '🐱', accessory: '☁️', text: 'Nap time?' },
      snowy: { emoji: '🐱', accessory: '🧣', text: 'Too cold!' },
      stormy: { emoji: '🐱', accessory: '😰', text: 'Hide!' },
      windy: { emoji: '🐱', accessory: '💨', text: 'Fur ruffled!' },
      hot: { emoji: '🐱', accessory: '🥵', text: 'Panting...' },
      cold: { emoji: '🐱', accessory: '🥶', text: 'Need blanket!' }
    }
  },
  dog: {
    name: 'Dog',
    emoji: '🐶',
    reactions: {
      sunny: { emoji: '🐶', accessory: '😎', text: 'Walkies!' },
      rainy: { emoji: '🐶', accessory: '☂️', text: 'Puddle time!' },
      cloudy: { emoji: '🐶', accessory: '☁️', text: 'Still good!' },
      snowy: { emoji: '🐶', accessory: '🧣', text: 'Snow play!' },
      stormy: { emoji: '🐶', accessory: '😰', text: 'Thunder!' },
      windy: { emoji: '🐶', accessory: '💨', text: 'Ears flying!' },
      hot: { emoji: '🐶', accessory: '🥵', text: 'Pant pant!' },
      cold: { emoji: '🐶', accessory: '🥶', text: 'Chilly!' }
    }
  },
  bird: {
    name: 'Bird',
    emoji: '🐦',
    reactions: {
      sunny: { emoji: '🐦', accessory: '😎', text: 'Chirp chirp!' },
      rainy: { emoji: '🐦', accessory: '☂️', text: 'Wet feathers!' },
      cloudy: { emoji: '🐦', accessory: '☁️', text: 'Flying high!' },
      snowy: { emoji: '🐦', accessory: '🧣', text: 'Migration time!' },
      stormy: { emoji: '🐦', accessory: '😰', text: 'Taking cover!' },
      windy: { emoji: '🐦', accessory: '💨', text: 'Wheee!' },
      hot: { emoji: '🐦', accessory: '🥵', text: 'Seeking shade!' },
      cold: { emoji: '🐦', accessory: '🥶', text: 'Fluffed up!' }
    }
  },
  rabbit: {
    name: 'Rabbit',
    emoji: '🐰',
    reactions: {
      sunny: { emoji: '🐰', accessory: '😎', text: 'Hopping!' },
      rainy: { emoji: '🐰', accessory: '☂️', text: 'In burrow!' },
      cloudy: { emoji: '🐰', accessory: '☁️', text: 'Perfect!' },
      snowy: { emoji: '🐰', accessory: '🧣', text: 'White coat!' },
      stormy: { emoji: '🐰', accessory: '😰', text: 'Underground!' },
      windy: { emoji: '🐰', accessory: '💨', text: 'Ears flapping!' },
      hot: { emoji: '🐰', accessory: '🥵', text: 'Too warm!' },
      cold: { emoji: '🐰', accessory: '🥶', text: 'Bundled up!' }
    }
  },
  turtle: {
    name: 'Turtle',
    emoji: '🐢',
    reactions: {
      sunny: { emoji: '🐢', accessory: '😎', text: 'Basking!' },
      rainy: { emoji: '🐢', accessory: '☂️', text: 'Love it!' },
      cloudy: { emoji: '🐢', accessory: '☁️', text: 'Slow day...' },
      snowy: { emoji: '🐢', accessory: '🧣', text: 'Hibernating!' },
      stormy: { emoji: '🐢', accessory: '😰', text: 'In shell!' },
      windy: { emoji: '🐢', accessory: '💨', text: 'Steady...' },
      hot: { emoji: '🐢', accessory: '🥵', text: 'Need water!' },
      cold: { emoji: '🐢', accessory: '🥶', text: 'So slow!' }
    }
  },
  fish: {
    name: 'Fish',
    emoji: '🐠',
    reactions: {
      sunny: { emoji: '🐠', accessory: '😎', text: 'Bubbles!' },
      rainy: { emoji: '🐠', accessory: '☂️', text: 'More water!' },
      cloudy: { emoji: '🐠', accessory: '☁️', text: 'Swimming!' },
      snowy: { emoji: '🐠', accessory: '🧣', text: 'Ice above!' },
      stormy: { emoji: '🐠', accessory: '😰', text: 'Rough seas!' },
      windy: { emoji: '🐠', accessory: '💨', text: 'Waves!' },
      hot: { emoji: '🐠', accessory: '🥵', text: 'Warm water!' },
      cold: { emoji: '🐠', accessory: '🥶', text: 'Cold water!' }
    }
  }
};

// Map OpenWeather conditions to our weather types
function getWeatherType(condition, temp) {
  condition = condition.toLowerCase();
  
  if (condition.includes('thunder') || condition.includes('storm')) return 'stormy';
  if (condition.includes('rain') || condition.includes('drizzle')) return 'rainy';
  if (condition.includes('snow')) return 'snowy';
  if (condition.includes('wind')) return 'windy';
  if (condition.includes('clear')) {
    if (temp > 30) return 'hot';
    if (temp < 5) return 'cold';
    return 'sunny';
  }
  if (condition.includes('cloud')) return 'cloudy';
  
  // Temperature-based fallback
  if (temp > 30) return 'hot';
  if (temp < 5) return 'cold';
  
  return 'cloudy';
}

export { PETS, getWeatherType };
