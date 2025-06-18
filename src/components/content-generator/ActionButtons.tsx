
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Download, Share2, Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { checkPremiumAccess } from '@/utils/premiumUtils';
import DownloadButton from './DownloadButton';

interface ActionButtonsProps {
  content: string;
  videoUrl?: string;
  onCopy: (text: string, type: string) => void;
  onDownload: (text: string, filename: string) => void;
  onShare: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  content, 
  videoUrl, 
  onCopy, 
  onDownload, 
  onShare 
}) => {
  const { user } = useAuth();
  const isPremium = checkPremiumAccess(user);
  const fullContent = videoUrl 
    ? `${content}\n\n--- لینک ویدیو ---\n${videoUrl}`
    : content;

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            onClick={() => onCopy(fullContent, 'تمام محتوا')}
            size="lg"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <Copy className="h-5 w-5 ml-2" />
            کپی همه محتوا
          </Button>
          
          <DownloadButton
            onClick={() => onDownload(fullContent, 'complete-content.txt')}
            variant="outline"
            size="lg"
            className="px-8 py-3 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold shadow-md"
          >
            <Download className="h-5 w-5 ml-2" />
            دانلود کامل
          </DownloadButton>
          
          <Button
            onClick={onShare}
            variant="outline"
            size="lg"
            className="px-8 py-3 border-2 border-green-500 text-green-600 hover:bg-green-50 font-semibold shadow-md"
          >
            <Share2 className="h-5 w-5 ml-2" />
            اشتراک‌گذاری
          </Button>
        </div>
        
        {!isPremium && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
            <div className="flex items-center justify-center gap-2 text-yellow-700">
              <Crown className="h-5 w-5" />
              <span className="font-semibold">برای دسترسی به قابلیت‌های پریمیوم، به اشتراک پریمیوم نیاز دارید</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActionButtons;
