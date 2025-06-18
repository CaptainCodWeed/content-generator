
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Video, Download } from 'lucide-react';
import DownloadButton from './DownloadButton';

interface VideoCardProps {
  videoUrl: string;
  onCopy: (text: string, type: string) => void;
  onDownload: (text: string, filename: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ videoUrl, onCopy, onDownload }) => {
  return (
    <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white">
        <CardTitle className="text-2xl font-bold flex items-center gap-3">
          <Video className="h-6 w-6" />
          ویدیوی تولید شده
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Video className="h-5 w-5 text-purple-600" />
              ویدیو (5 ثانیه)
            </h4>
            <div className="flex gap-2">
              <Button
                onClick={() => onCopy(videoUrl, 'لینک ویدیو')}
                variant="outline"
                size="sm"
                className="text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400"
              >
                <Copy className="h-4 w-4 ml-2" />
                کپی لینک
              </Button>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl p-6 border-2 border-gray-100">
            <video 
              controls 
              className="w-full rounded-lg shadow-lg max-h-96"
              poster="https://picsum.photos/800/400?random=video"
            >
              <source src={videoUrl} type="video/mp4" />
              مرورگر شما از نمایش ویدیو پشتیبانی نمی‌کند.
            </video>
            <p className="text-sm text-gray-600 mt-3 text-center">
              ویدیوی کوتاه 5 ثانیه‌ای مرتبط با محتوای شما
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
