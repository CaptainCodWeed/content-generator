
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles } from "lucide-react";
import FormFields from "./FormFields";
import { generateContent, GeneratedContentResponse } from "./contentService";
import { imageTypes, aiImageStyles, contentLanguages, contentStyles, contentOptions } from "./constants";

interface ContentFormProps {
  onContentGenerated: (content: GeneratedContentResponse) => void;
}

export const ContentForm: React.FC<ContentFormProps> = ({ onContentGenerated }) => {
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [keywords, setKeywords] = useState("");
  const [imageType, setImageType] = useState(imageTypes[0].value);
  const [aiImageStyle, setAiImageStyle] = useState(aiImageStyles[0].value);
  const [contentLanguage, setContentLanguage] = useState(contentLanguages[0].value);
  const [contentStyle, setContentStyle] = useState(contentStyles[0]);
  const [contentType, setContentType] = useState(contentOptions[0].value);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await generateContent({
        user_id: user?.id,
        title,
        prompt,
        keywords,
        image_type: imageType,
        ai_image_style: aiImageStyle,
        content_language: contentLanguage,
        content_style: contentStyle,
        content_type: contentType,
      });

      onContentGenerated(result);

      toast({
        title: "موفق!",
        description: "محتوا با موفقیت تولید شد",
      });
    } catch (err) {
      console.error('Error in handleSubmit:', err);
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
    <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm mb-8">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold flex items-center gap-3">
          <Sparkles className="h-6 w-6" />
          ایجاد محتوای جدید
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <FormFields
            title={title}
            setTitle={setTitle}
            prompt={prompt}
            setPrompt={setPrompt}
            keywords={keywords}
            setKeywords={setKeywords}
            imageType={imageType}
            setImageType={setImageType}
            aiImageStyle={aiImageStyle}
            setAiImageStyle={setAiImageStyle}
            contentLanguage={contentLanguage}
            setContentLanguage={setContentLanguage}
            contentStyle={contentStyle}
            setContentStyle={setContentStyle}
            contentType={contentType}
            setContentType={setContentType}
          />

          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              disabled={isLoading}
              size="lg"
              className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                  در حال تولید...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 ml-2" />
                  تولید محتوا
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-center">
              {error}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default ContentForm;
