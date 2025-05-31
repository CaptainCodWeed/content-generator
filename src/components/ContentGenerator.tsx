import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import GeneratedContent from "./GeneratedContent";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface GeneratedContentProps {
  content: string;
  imagePrompt: string;
}

interface ImageType {
  label: string;
  value: string;
}

const imageTypes: ImageType[] = [
  { label: "تصویر مرتبط با عنوان", value: "title-related" },
  { label: "تصویر مرتبط با کلمات کلیدی", value: "keywords-related" },
  { label: "بدون تصویر", value: "no-image" },
];

const contentStyles = [
  "رسمی",
  "دوستانه",
  "خلاقانه",
  "آموزشی",
  "تبلیغاتی",
];

const ContentGenerator = () => {
  const [title, setTitle] = useState("");
  const [headings, setHeadings] = useState("");
  const [keywords, setKeywords] = useState("");
  const [imageType, setImageType] = useState(imageTypes[0].value);
  const [contentStyle, setContentStyle] = useState(contentStyles[0]);
  const [generatedContent, setGeneratedContent] =
    useState<GeneratedContentProps | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const requestData = {
        title,
        headings,
        keywords,
        imageType,
        contentStyle,
      };

      // Save to database first
      const { data: savedContent, error: dbError } = await supabase
        .from('generated_content')
        .insert({
          user_id: user?.id,
          title,
          headings,
          keywords,
          image_type: imageType,
          content_style: contentStyle,
        })
        .select()
        .single();

      if (dbError) {
        throw new Error('خطا در ذخیره اطلاعات: ' + dbError.message);
      }

      const response = await fetch('https://your-n8n-server.com/webhook/content-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`خطا در درخواست: ${response.status}`);
      }

      const result = await response.json();
      
      // Update the database record with the response
      const { error: updateError } = await supabase
        .from('generated_content')
        .update({
          generated_content: result.content,
          image_prompt: result.imagePrompt,
          webhook_response: result,
          updated_at: new Date().toISOString(),
        })
        .eq('id', savedContent.id);

      if (updateError) {
        console.error('خطا در به‌روزرسانی:', updateError);
      }

      setGeneratedContent(result);
      
      toast({
        title: "موفق!",
        description: "محتوا با موفقیت تولید شد",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطای نامشخص رخ داد';
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

  const handleRegenerate = async () => {
    if (!generatedContent) return;

    setIsLoading(true);
    setError("");

    try {
      const requestData = {
        title,
        headings,
        keywords,
        imageType,
        contentStyle,
      };

      const response = await fetch('https://your-n8n-server.com/webhook/content-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setGeneratedContent(result);
      toast({
        title: "موفق!",
        description: "محتوا با موفقیت تولید شد",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
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
    <div dir="rtl">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 space-y-6">
        <div>
          <Label htmlFor="title">عنوان:</Label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان را وارد کنید"
            required
          />
        </div>
        <div>
          <Label htmlFor="headings">عناوین:</Label>
          <Input
            type="text"
            id="headings"
            value={headings}
            onChange={(e) => setHeadings(e.target.value)}
            placeholder="عناوین را وارد کنید"
            required
          />
        </div>
        <div>
          <Label htmlFor="keywords">کلمات کلیدی:</Label>
          <Input
            type="text"
            id="keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="کلمات کلیدی را وارد کنید"
            required
          />
        </div>
        <div>
          <Label htmlFor="imageType">نوع تصویر:</Label>
          <select
            id="imageType"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            value={imageType}
            onChange={(e) => setImageType(e.target.value)}
          >
            {imageTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="contentStyle">سبک محتوا:</Label>
          <select
            id="contentStyle"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            value={contentStyle}
            onChange={(e) => setContentStyle(e.target.value)}
          >
            {contentStyles.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "در حال تولید..." : "تولید محتوا"}
        </Button>
        {error && <p className="text-red-500">{error}</p>}
      </form>

      {generatedContent && (
        <div className="mt-8">
          <GeneratedContent
            content={generatedContent.content}
            imagePrompt={generatedContent.imagePrompt}
          />
          <Button onClick={handleRegenerate} disabled={isLoading} className="mt-4">
            تولید مجدد
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContentGenerator;
