
import { useEffect, useState } from "react";
import { PokemonCard, getTopCardsBySet } from "../services/pokemonTcgService";
import { Card } from "./ui/card";

interface CardDisplayProps {
  setId: string;
}

const CardDisplay = ({ setId }: CardDisplayProps) => {
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      if (!setId) return;

      setIsLoading(true);
      setError(null);

      try {
        const topCards = await getTopCardsBySet(setId);
        setCards(topCards);
      } catch (err) {
        console.error("Error fetching cards:", err);
        setError("Failed to load cards. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, [setId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-10 w-10 border-4 border-pokemon-blue border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-red-50 text-red-600 rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  if (cards.length === 0 && !isLoading) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500">No card data available for this set.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {cards.map((card) => {
        // Calculate the highest price
        let highestPrice = 0;
        let priceCategory = '';
        
        if (card.tcgplayer && card.tcgplayer.prices) {
          Object.entries(card.tcgplayer.prices).forEach(([category, prices]) => {
            if (prices.market && prices.market > highestPrice) {
              highestPrice = prices.market;
              priceCategory = category;
            }
          });
        }

        return (
          <Card
            key={card.id}
            className="p-3 flex flex-col items-center animate-fade-in hover:shadow-lg transition-all"
          >
            <div className="relative w-full">
              <img
                src={card.images.small}
                alt={card.name}
                className="w-full h-auto object-contain rounded-md"
              />
            </div>
            <div className="mt-2 text-center w-full">
              <h3 className="font-bold text-sm truncate">{card.name}</h3>
              <p className="text-xs text-gray-500">{card.rarity || "Unknown Rarity"}</p>
              <div className="mt-1 font-bold text-pokemon-blue">
                ${highestPrice.toFixed(2)}
                <span className="text-xs text-gray-500 ml-1">
                  {priceCategory ? `(${priceCategory})` : ""}
                </span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default CardDisplay;
