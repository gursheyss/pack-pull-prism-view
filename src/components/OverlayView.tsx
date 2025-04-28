import { useState, useEffect } from "react";
import SetLogo from "./SetLogo";
import CardDisplay from "./CardDisplay";
import { Button } from "./ui/button";

interface OverlayViewProps {
  setId: string;
  onBackToSearch: () => void;
}

declare global {
  interface Window {
    obsstudio?: unknown;
  }
}

const OverlayView = ({ setId, onBackToSearch }: OverlayViewProps) => {
  const [isOBSMode, setIsOBSMode] = useState(false);

  useEffect(() => {
    if (window.obsstudio) {
      setIsOBSMode(true);
    }
  }, []);

  return (
    <div className={`w-full ${isOBSMode ? "p-0" : "p-4"}`}>
      {!isOBSMode && (
        <div className="flex justify-between mb-4">
          <Button 
            variant="outline" 
            onClick={onBackToSearch}
            className="bg-pokemon-blue text-white hover:bg-pokemon-red"
          >
            ← Back to Search
          </Button>
          <Button 
            onClick={() => setIsOBSMode(!isOBSMode)}
            className="bg-pokemon-red text-white hover:bg-pokemon-yellow hover:text-black"
          >
            Toggle OBS Mode
          </Button>
        </div>
      )}

      <div className={`relative min-h-screen ${
        isOBSMode 
          ? "p-0 bg-transparent" 
          : "p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-md"
      }`}>
        <div className="absolute bottom-0 left-0 right-0 z-10 mb-8">
          <SetLogo setId={setId} />
        </div>

        <CardDisplay setId={setId} isOBSMode={isOBSMode} />

        {isOBSMode && (
          <div className="fixed top-4 right-4 z-50">
            <Button
              onClick={() => setIsOBSMode(false)}
              className="bg-pokemon-red/80 backdrop-blur-sm text-white hover:bg-pokemon-blue"
            >
              Exit OBS Mode
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverlayView;
