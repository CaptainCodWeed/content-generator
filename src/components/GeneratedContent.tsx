
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, FileText, Image, Download, Share2 } from 'lucide-react';
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

  const downloadAsText = (text: string, filename: string) => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "دانلود موفق!",
      description: "فایل با موفقیت دانلود شد.",
    });
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => {
      if (paragraph.trim() === '') return null;
      
      if (paragraph.startsWith('#') || (paragraph.length < 50 && paragraph === paragraph.toUpperCase())) {
        return (
          <h3 key={index} className="text-xl font-bold text-gray-800 mt-6 mb-3 border-r-4 border-blue-500 pr-4">
            {paragraph.replace(/^#+\s*/, '')}
          </h3>
        );
      }
      
      return (
        <p key={index} className="text-gray-700 mb-4 leading-relaxed text-justify">
          {paragraph}
        </p>
      );
    }).filter(Boolean);
  };

  return (
    <div dir="rtl" className="space-y-6">
      {/* محتوای تولید شده */}
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
                  onClick={() => copyToClipboard(content, 'محتوا')}
                  variant="outline"
                  size="sm"
                  className="text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400"
                >
                  <Copy className="h-4 w-4 ml-2" />
                  کپی
                </Button>
                <Button
                  onClick={() => downloadAsText(content, 'content.txt')}
                  variant="outline"
                  size="sm"
                  className="text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400"
                >
                  <Download className="h-4 w-4 ml-2" />
                  دانلود
                </Button>
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

      {/* پرامپت تصویر */}
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
                  onClick={() => copyToClipboard(imagePrompt, 'پرامپت تصویر')}
                  variant="outline"
                  size="sm"
                  className="text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400"
                >
                  <Copy className="h-4 w-4 ml-2" />
                  کپی
                </Button>
                <Button
                  onClick={() => downloadAsText(imagePrompt, 'image-prompt.txt')}
                  variant="outline"
                  size="sm"
                  className="text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400"
                >
                  <Download className="h-4 w-4 ml-2" />
                  دانلود
                </Button>
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

      {/* دکمه‌های عمومی */}
      <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              onClick={() => copyToClipboard(`${content}\n\n--- پرامپت تصویر ---\n${imagePrompt}`, 'تمام محتوا')}
              size="lg"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Copy className="h-5 w-5 ml-2" />
              کپی همه محتوا
            </Button>
            
            <Button
              onClick={() => downloadAsText(`${content}\n\n--- پرامپت تصویر ---\n${imagePrompt}`, 'complete-content.txt')}
              variant="outline"
              size="lg"
              className="px-8 py-3 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold shadow-md"
            >
              <Download className="h-5 w-5 ml-2" />
              دانلود کامل
            </Button>
            
            <Button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'محتوای تولید شده',
                    text: content,
                  });
                } else {
                  copyToClipboard(content, 'محتوا برای اشتراک‌گذاری');
                }
              }}
              variant="outline"
              size="lg"
              className="px-8 py-3 border-2 border-green-500 text-green-600 hover:bg-green-50 font-semibold shadow-md"
            >
              <Share2 className="h-5 w-5 ml-2" />
              اشتراک‌گذاری
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneratedContent;
