
import React from "react";
import { Button } from "@/components/ui/button";

interface RegenerateButtonProps {
  onRegenerate: () => void;
  isLoading: boolean;
}

const RegenerateButton: React.FC<RegenerateButtonProps> = ({ onRegenerate, isLoading }) => {
  return (
    <div className="flex justify-center">
      <Button
        onClick={onRegenerate}
        disabled={isLoading}
        variant="outline"
        size="lg"
        className="px-8 py-3 text-lg font-semibold border-2 border-blue-500 text-blue-600 hover:bg-blue-50 shadow-md"
      >
        تولید مجدد
      </Button>
    </div>
  );
};

export default RegenerateButton;
