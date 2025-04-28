
import { useEffect, useState } from "react";
import { PokemonSet, getSetById } from "../services/pokemonTcgService";

interface SetLogoProps {
  setId: string;
}

const SetLogo = ({ setId }: SetLogoProps) => {
  const [setData, setSetData] = useState<PokemonSet | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSetData = async () => {
      if (!setId) return;

      setIsLoading(true);
      try {
        const data = await getSetById(setId);
        setSetData(data);
      } catch (error) {
        console.error("Error fetching set data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSetData();
  }, [setId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin h-8 w-8 border-4 border-pokemon-yellow border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!setData || !setData.images?.logo) {
    return <div className="h-32 flex items-center justify-center">No logo available</div>;
  }

  return (
    <div className="flex justify-center">
      <img
        src={setData.images.logo}
        alt={`${setData.name} logo`}
        className="h-32 object-contain animate-fade-in"
      />
    </div>
  );
};

export default SetLogo;
