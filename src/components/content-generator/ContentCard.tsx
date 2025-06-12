
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, FileText, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { checkPremiumAccess } from '@/utils/premiumUtils';
import DownloadButton from './DownloadButton';
import { formatContent } from './ContentFormatter';

interface ContentCardProps {
  content: string;
  onCopy: (text: string, type: string) => void;
  onDownload: (text: string, filename: string) => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ content, onCopy, onDownload }) => {
  return (
    <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white">
        <CardTitle className="text-2xl font-bold flex items-center gap-3">
          <FileText className="h-6 w-6" />
          محتوای تولید شده
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              متن محتوا
            </h4>
            <div className="flex gap-2">
              <Button
                onClick={() => onCopy(content, 'محتوا')}
                variant="outline"
                size="sm"
                className="text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400"
              >
                <Copy className="h-4 w-4 ml-2" />
                کپی
              </Button>
              <DownloadButton
                onClick={() => onDownload(content, 'content.txt')}
                className="text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400"
              >
                <Download className="h-4 w-4 ml-2" />
                دانلود
              </DownloadButton>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border-2 border-gray-100 max-h-96 overflow-y-auto">
            <div className="prose prose-lg max-w-none text-right">
              {formatContent(content)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentCard;
