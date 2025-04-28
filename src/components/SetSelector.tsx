
import { useState, useEffect } from "react";
import { getPokemonSets, PokemonSet } from "../services/pokemonTcgService";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";

interface SetSelectorProps {
  onSelectSet: (setId: string) => void;
}

const SetSelector = ({ onSelectSet }: SetSelectorProps) => {
  const [sets, setSets] = useState<PokemonSet[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const pokemonSets = await getPokemonSets();
        // Sort sets by release date (newest first)
        pokemonSets.sort((a, b) => {
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        });
        setSets(pokemonSets);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading Pokemon sets:", error);
        setIsLoading(false);
      }
    };

    fetchSets();
  }, []);

  // Filter sets based on search query
  const filteredSets = sets.filter((set) =>
    set.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search for a set..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-pokemon-blue border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading sets...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto p-2">
          {filteredSets.map((set) => (
            <Card
              key={set.id}
              className="p-4 cursor-pointer hover:bg-gray-100 transition-colors flex items-center"
              onClick={() => onSelectSet(set.id)}
            >
              <div className="flex-shrink-0 mr-4">
                {set.images?.symbol && (
                  <img
                    src={set.images.symbol}
                    alt={`${set.name} symbol`}
                    className="w-10 h-10 object-contain"
                  />
                )}
              </div>
              <div className="flex-grow">
                <h3 className="font-bold text-sm">{set.name}</h3>
                <p className="text-xs text-gray-500">
                  {set.series} • {set.printedTotal} cards
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-2 bg-pokemon-red text-white hover:bg-pokemon-blue"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSet(set.id);
                }}
              >
                Select
              </Button>
            </Card>
          ))}
          
          {filteredSets.length === 0 && (
            <div className="col-span-2 text-center py-8">
              <p>No sets found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SetSelector;
