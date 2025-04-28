
import { useState } from "react";
import SetSelector from "../components/SetSelector";
import OverlayView from "../components/OverlayView";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSelectSet = (setId: string) => {
    setSelectedSetId(setId);
    toast({
      title: "Set Selected",
      description: "Loading the top cards from this set...",
    });
  };

  const handleBackToSearch = () => {
    setSelectedSetId(null);
  };

  return (
    <div className="min-h-screen bg-pokemon-light">
      <div className="container px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-pokemon-red mb-2">
            Pokemon TCG OBS Overlay
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select a TCG set to display its logo and the top 5 most valuable cards with pricing.
            Toggle OBS mode for a clean overlay you can capture in your streaming software.
          </p>
        </header>

        {!selectedSetId ? (
          <SetSelector onSelectSet={handleSelectSet} />
        ) : (
          <OverlayView 
            setId={selectedSetId} 
            onBackToSearch={handleBackToSearch} 
          />
        )}

        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>
            Powered by the Pokemon TCG API. Card prices provided by TCGPlayer.
          </p>
          <p className="mt-1">
            This app is not affiliated with, endorsed, or sponsored by The Pokemon Company.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
