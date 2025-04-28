
// API service for Pokemon TCG

// Base URL for the Pokemon TCG API
const API_BASE_URL = 'https://api.pokemontcg.io/v2';

// Interface for Set data
export interface PokemonSet {
  id: string;
  name: string;
  series: string;
  printedTotal: number;
  total: number;
  images: {
    symbol: string;
    logo: string;
  };
  releaseDate: string;
}

// Interface for Card data
export interface PokemonCard {
  id: string;
  name: string;
  supertype: string;
  subtypes: string[];
  number: string;
  rarity: string;
  images: {
    small: string;
    large: string;
  };
  tcgplayer?: {
    url: string;
    updatedAt: string;
    prices: {
      [key: string]: {
        low: number;
        mid: number;
        high: number;
        market: number;
        directLow: number | null;
      };
    };
  };
}

// Get all Pokemon TCG sets
export const getPokemonSets = async (): Promise<PokemonSet[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sets`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching Pokemon sets:', error);
    return [];
  }
};

// Get cards from a specific set, sorted by price
export const getTopCardsBySet = async (setId: string): Promise<PokemonCard[]> => {
  try {
    // Fetch cards from the specific set
    const response = await fetch(`${API_BASE_URL}/cards?q=set.id:${setId}`);
    const data = await response.json();
    const cards: PokemonCard[] = data.data;

    // Filter cards that have price data and sort by highest price
    const cardsWithPrices = cards
      .filter(card => card.tcgplayer && card.tcgplayer.prices)
      .sort((a, b) => {
        // Get the highest price for card A
        const pricesA = Object.values(a.tcgplayer!.prices);
        const highestPriceA = Math.max(...pricesA.map(price => price.market || 0));
        
        // Get the highest price for card B
        const pricesB = Object.values(b.tcgplayer!.prices);
        const highestPriceB = Math.max(...pricesB.map(price => price.market || 0));
        
        return highestPriceB - highestPriceA;
      });

    // Return the top 5 cards or fewer if there aren't 5
    return cardsWithPrices.slice(0, 5);
  } catch (error) {
    console.error('Error fetching cards by set:', error);
    return [];
  }
};

// Get a specific set by ID
export const getSetById = async (setId: string): Promise<PokemonSet | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sets/${setId}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching set details:', error);
    return null;
  }
};
