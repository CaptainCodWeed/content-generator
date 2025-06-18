
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { checkPremiumAccess } from '@/utils/premiumUtils';
import ContentCard from './content-generator/ContentCard';
import VideoCard from './content-generator/VideoCard';
import ActionButtons from './content-generator/ActionButtons';

interface GeneratedContentProps {
  content: string;
  imageUrl?: string;
  videoUrl?: string;
}

const GeneratedContent: React.FC<GeneratedContentProps> = ({ content, imageUrl, videoUrl }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const isPremium = checkPremiumAccess(user);

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
    if (!isPremium) {
      toast({
        title: "دسترسی محدود",
        description: "دانلود فایل فقط برای کاربران پریمیوم فعال است.",
        variant: "destructive"
      });
      return;
    }

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'محتوای تولید شده',
        text: content,
      });
    } else {
      copyToClipboard(content, 'محتوا برای اشتراک‌گذاری');
    }
  };

  return (
    <div dir="rtl" className="space-y-6">
      <ContentCard
        content={content}
        onCopy={copyToClipboard}
        onDownload={downloadAsText}
      />

      {videoUrl && (
        <VideoCard
          videoUrl={videoUrl}
          onCopy={copyToClipboard}
          onDownload={downloadAsText}
        />
      )}

      <ActionButtons
        content={content}
        videoUrl={videoUrl}
        onCopy={copyToClipboard}
        onDownload={downloadAsText}
        onShare={handleShare}
      />
    </div>
  );
};

export default GeneratedContent;
