
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { checkPremiumAccess } from '@/utils/premiumUtils';

interface VideoToggleProps {
  videoEnabled: boolean;
  onVideoToggle: (enabled: boolean) => void;
}

const VideoToggle: React.FC<VideoToggleProps> = ({ videoEnabled, onVideoToggle }) => {
  const { user } = useAuth();
  const isPremium = checkPremiumAccess(user);

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 space-x-reverse">
        <Label htmlFor="video-toggle" className="text-sm font-medium text-gray-700 flex items-center gap-2">
          تولید ویدیو (5 ثانیه)
          {!isPremium && <Crown className="h-4 w-4 text-yellow-500" />}
        </Label>
        <Switch
          id="video-toggle"
          checked={videoEnabled && isPremium}
          onCheckedChange={onVideoToggle}
          disabled={!isPremium}
        />
      </div>
      {!isPremium && (
        <p className="text-xs text-yellow-600">قابلیت تولید ویدیو فقط برای کاربران پریمیوم فعال است</p>
      )}
    </div>
  );
};

export default VideoToggle;
