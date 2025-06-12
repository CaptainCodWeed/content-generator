
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Image, Download } from 'lucide-react';
import DownloadButton from './DownloadButton';

interface ImagePromptCardProps {
  imagePrompt: string;
  onCopy: (text: string, type: string) => void;
  onDownload: (text: string, filename: string) => void;
}

const ImagePromptCard: React.FC<ImagePromptCardProps> = ({ imagePrompt, onCopy, onDownload }) => {
  return (
    <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white">
        <CardTitle className="text-2xl font-bold flex items-center gap-3">
          <Image className="h-6 w-6" />
          پرامپت تصویر هوش مصنوعی
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Image className="h-5 w-5 text-purple-600" />
              دستور تولید تصویر
            </h4>
            <div className="flex gap-2">
              <Button
                onClick={() => onCopy(imagePrompt, 'پرامپت تصویر')}
                variant="outline"
                size="sm"
                className="text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400"
              >
                <Copy className="h-4 w-4 ml-2" />
                کپی
              </Button>
              <DownloadButton
                onClick={() => onDownload(imagePrompt, 'image-prompt.txt')}
                className="text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400"
              >
                <Download className="h-4 w-4 ml-2" />
                دانلود
              </DownloadButton>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 rounded-2xl p-6 border-2 border-purple-100">
            <p className="text-gray-700 leading-relaxed text-lg italic text-justify bg-white/70 rounded-lg p-4 shadow-sm">
              {imagePrompt}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImagePromptCard;
