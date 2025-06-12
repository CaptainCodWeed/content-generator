
import React from 'react';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { checkPremiumAccess } from '@/utils/premiumUtils';
import type { ButtonProps } from '@/components/ui/button';

interface DownloadButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  className?: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ 
  onClick, 
  children, 
  variant = "outline", 
  size = "sm", 
  className = "" 
}) => {
  const { user } = useAuth();
  const isPremium = checkPremiumAccess(user);

  return (
    <div className="relative">
      <Button
        onClick={onClick}
        variant={variant}
        size={size}
        className={`${className} ${!isPremium ? 'opacity-75' : ''}`}
        disabled={!isPremium}
      >
        {!isPremium && <Crown className="h-4 w-4 ml-2 text-yellow-500" />}
        {children}
      </Button>
      {!isPremium && (
        <div className="absolute -top-1 -right-1">
          <Crown className="h-3 w-3 text-yellow-500" />
        </div>
      )}
    </div>
  );
};

export default DownloadButton;
