
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import GeneratedContent from "./GeneratedContent";
import { useAuth } from "@/contexts/AuthContext";
import ContentForm from "./content-generator/ContentForm";
import RegenerateButton from "./content-generator/RegenerateButton";
import UserHistory from "./content-generator/UserHistory";
import { GeneratedContentResponse } from "./content-generator/contentService";

const ContentGenerator = () => {
  const [generatedContent, setGeneratedContent] = useState<GeneratedContentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const handleContentGenerated = (content: GeneratedContentResponse) => {
    setGeneratedContent(content);
  };

  const handleSelectHistory = (historyItem: any) => {
    if (historyItem.content && historyItem.imagePrompt) {
      setGeneratedContent({
        content: historyItem.content,
        imagePrompt: historyItem.imagePrompt,
      });
      
      toast({
        title: "بارگذاری تاریخچه",
        description: "محتوای قبلی با موفقیت بارگذاری شد",
      });
    } else {
      toast({
        title: "اطلاعات",
        description: "این درخواست هنوز پردازش نشده است",
        variant: "destructive",
      });
    }
  };

  const handleRegenerate = async () => {
    if (!generatedContent) return;

    setIsLoading(true);
    setError("");

    try {
      toast({
        title: "اطلاعات",
        description: "برای تولید مجدد، لطفاً فرم را دوباره پر کنید و دکمه تولید محتوا را بزنید.",
      });
    } catch (err) {
      console.error('Error in handleRegenerate:', err);
      let errorMessage = 'خطای نامشخص رخ داد';
      
      if (err instanceof TypeError && err.message.includes('fetch')) {
        errorMessage = 'خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید.';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast({
        title: "خطا",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            تولیدکننده محتوای هوشمند
          </h1>
          <p className="text-gray-600 text-lg">
            با استفاده از قدرت هوش مصنوعی، محتوای باکیفیت و جذاب بسازید
          </p>
        </div>

        <UserHistory onSelectHistory={handleSelectHistory} />

        <ContentForm onContentGenerated={handleContentGenerated} />

        {generatedContent && (
          <div className="space-y-6">
            <GeneratedContent
              content={generatedContent.content}
              imagePrompt={generatedContent.imagePrompt}
            />
            <RegenerateButton
              onRegenerate={handleRegenerate}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentGenerator;
