
import { useState } from "react";
import SetLogo from "./SetLogo";
import CardDisplay from "./CardDisplay";
import { Button } from "./ui/button";

interface OverlayViewProps {
  setId: string;
  onBackToSearch: () => void;
}

const OverlayView = ({ setId, onBackToSearch }: OverlayViewProps) => {
  const [isOBSMode, setIsOBSMode] = useState(false);

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

      <div className={`${isOBSMode ? "p-0 bg-transparent" : "p-6 bg-white rounded-lg shadow-md"}`}>
        <div className="mb-6">
          <SetLogo setId={setId} />
        </div>

        <h2 className={`text-xl font-bold mb-4 ${isOBSMode ? "text-white" : "text-gray-800"}`}>
          Top 5 Cards
        </h2>

        <CardDisplay setId={setId} />

        {isOBSMode && (
          <div className="fixed top-4 right-4 z-10">
            <Button
              onClick={() => setIsOBSMode(false)}
              className="bg-pokemon-red text-white hover:bg-pokemon-blue"
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
