import { useEffect, useState } from "react";
import { PokemonCard, getTopCardsBySet } from "../services/pokemonTcgService";
import { Card } from "./ui/card";
import { DollarSign } from "lucide-react";

interface CardDisplayProps {
  setId: string;
  isOBSMode?: boolean;
}

const CardDisplay = ({ setId, isOBSMode }: CardDisplayProps) => {
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

  const sortedCards = [...cards].sort((a, b) => {
    const aPrice = Math.max(...Object.values(a.tcgplayer?.prices || {}).map(p => p.market || 0));
    const bPrice = Math.max(...Object.values(b.tcgplayer?.prices || {}).map(p => p.market || 0));
    return bPrice - aPrice;
  });

  const [topCard, ...otherCards] = sortedCards;

  return (
    <div className="relative h-screen pt-32">
      {topCard && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 animate-bounce-slow">
          <Card className="relative w-64 bg-black/40 backdrop-blur-sm border border-yellow-400/30">
            <img
              src={topCard.images.small}
              alt={topCard.name}
              className="w-full h-auto"
            />
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-600 px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <DollarSign className="w-6 h-6" />
              <span className="text-2xl font-bold">
                {Math.max(...Object.values(topCard.tcgplayer?.prices || {}).map(p => p.market || 0)).toFixed(2)}
              </span>
            </div>
          </Card>
        </div>
      )}

      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 w-full">
        <div className="relative h-64">
          {otherCards.slice(0, 4).map((card, index) => {
            const rotation = -15 + (index * 10);
            const translateX = -30 + (index * 20);

            return (
              <Card
                key={card.id}
                className="absolute left-1/2 w-48 bg-black/40 backdrop-blur-sm border border-yellow-400/30"
                style={{
                  transform: `translateX(-50%) translateX(${translateX}%) rotate(${rotation}deg)`,
                  zIndex: 20 - index,
                }}
              >
                <img
                  src={card.images.small}
                  alt={card.name}
                  className="w-full h-auto"
                />
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black/80 px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-yellow-400" />
                  <span className="text-lg font-bold text-yellow-400">
                    {Math.max(...Object.values(card.tcgplayer?.prices || {}).map(p => p.market || 0)).toFixed(2)}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CardDisplay;
