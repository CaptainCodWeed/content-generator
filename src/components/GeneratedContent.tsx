
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, RefreshCw, FileText, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GeneratedContentProps {
  content: string;
  imagePrompt: string;
}

const GeneratedContent: React.FC<GeneratedContentProps> = ({ content, imagePrompt }) => {
  const { toast } = useToast();

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "کپی شد!",
        description: `${type} در کلیپ‌بورد کپی شد.`,
      });
    } catch (error) {
      console.error('Failed to copy text:', error);
      toast({
        title: "خطا در کپی",
        description: "کپی کردن متن ناموفق بود. لطفا دوباره تلاش کنید.",
        variant: "destructive"
      });
    }
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => {
      if (paragraph.trim() === '') return null;
      
      if (paragraph.startsWith('#') || (paragraph.length < 50 && paragraph === paragraph.toUpperCase())) {
        return (
          <h3 key={index} className="text-lg font-semibold text-gray-800 mt-4 mb-2">
            {paragraph.replace(/^#+\s*/, '')}
          </h3>
        );
      }
      
      return (
        <p key={index} className="text-gray-700 mb-3 leading-relaxed">
          {paragraph}
        </p>
      );
    }).filter(Boolean);
  };

  return (
    <div dir="rtl">
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            محتوای تولید شده
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  محتوا
                </h4>
                <Button
                  onClick={() => copyToClipboard(content, 'محتوا')}
                  variant="outline"
                  size="sm"
                  className="text-gray-600 hover:text-gray-800"
                >
                  <Copy className="h-4 w-4 ml-2" />
                  کپی
                </Button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-96 overflow-y-auto">
                <div className="prose prose-sm max-w-none">
                  {formatContent(content)}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  پرامپت تصویر
                </h4>
                <Button
                  onClick={() => copyToClipboard(imagePrompt, 'پرامپت تصویر')}
                  variant="outline"
                  size="sm"
                  className="text-gray-600 hover:text-gray-800"
                >
                  <Copy className="h-4 w-4 ml-2" />
                  کپی
                </Button>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                <p className="text-gray-700 leading-relaxed italic">
                  {imagePrompt}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => copyToClipboard(`${content}\n\nپرامپت تصویر: ${imagePrompt}`, 'تمام محتوا')}
                variant="outline"
                className="flex-1 border-gray-300 hover:border-gray-400"
              >
                <Copy className="h-4 w-4 ml-2" />
                کپی همه
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneratedContent;
