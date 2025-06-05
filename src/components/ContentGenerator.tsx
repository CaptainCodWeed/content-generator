
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import GeneratedContent from "./GeneratedContent";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles, FileText, Globe, Image, Palette } from "lucide-react";

interface GeneratedContentProps {
  content: string;
  imagePrompt: string;
}

interface ImageType {
  label: string;
  value: string;
}

interface AIImageStyle {
  label: string;
  value: string;
}

interface ContentLanguage {
  label: string;
  value: string;
}

const imageTypes: ImageType[] = [
  { label: "تصویر مرتبط با عنوان", value: "title-related" },
  { label: "تصویر مرتبط با کلمات کلیدی", value: "keywords-related" },
  { label: "بدون تصویر", value: "no-image" },
];

const aiImageStyles: AIImageStyle[] = [
  { label: "واقع‌گرایانه", value: "realistic" },
  { label: "کارتونی", value: "cartoon" },
  { label: "نقاشی روغن", value: "oil-painting" },
  { label: "آبرنگ", value: "watercolor" },
  { label: "مینیمال", value: "minimalist" },
  { label: "انتزاعی", value: "abstract" },
  { label: "سه‌بعدی", value: "3d-render" },
  { label: "فتوگرافیک", value: "photographic" },
];

const contentLanguages: ContentLanguage[] = [
  { label: "فارسی", value: "persian" },
  { label: "انگلیسی", value: "english" },
  { label: "عربی", value: "arabic" },
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
  const [aiImageStyle, setAiImageStyle] = useState(aiImageStyles[0].value);
  const [contentLanguage, setContentLanguage] = useState(contentLanguages[0].value);
  const [contentStyle, setContentStyle] = useState(contentStyles[0]);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContentProps | null>(null);
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
        aiImageStyle,
        contentLanguage,
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
          ai_image_style: aiImageStyle,
          content_language: contentLanguage,
          content_style: contentStyle,
        })
        .select()
        .single();

      if (dbError) {
        throw new Error('خطا در ذخیره اطلاعات: ' + dbError.message);
      }

      // Send to n8n webhook
      const response = await fetch('https://captaincodem.app.n8n.cloud/webhook/8a32e120-322b-4015-aa4c-4f609571cf18', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          headings: headings,
          keywords: keywords,
          imageType: imageType,
          aiImageStyle: aiImageStyle,
          contentLanguage: contentLanguage,
          contentStyle: contentStyle,
          userId: user?.id,
          timestamp: new Date().toISOString(),
          recordId: savedContent.id
        }),
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
        aiImageStyle,
        contentLanguage,
        contentStyle,
      };

      const response = await fetch('https://captaincodem.app.n8n.cloud/webhook-test/cedc017c-fa8d-41f4-9612-6306575ccb1e', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          headings: headings,
          keywords: keywords,
          imageType: imageType,
          aiImageStyle: aiImageStyle,
          contentLanguage: contentLanguage,
          contentStyle: contentStyle,
          userId: user?.id,
          timestamp: new Date().toISOString(),
          isRegeneration: true
        }),
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

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <Sparkles className="h-6 w-6" />
              ایجاد محتوای جدید
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    عنوان
                  </Label>
                  <Input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="عنوان محتوای خود را وارد کنید..."
                    required
                    className="h-12 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headings" className="text-lg font-semibold">
                    عناوین فرعی
                  </Label>
                  <Input
                    type="text"
                    id="headings"
                    value={headings}
                    onChange={(e) => setHeadings(e.target.value)}
                    placeholder="عناوین فرعی را با کاما جدا کنید..."
                    required
                    className="h-12 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords" className="text-lg font-semibold">
                    کلمات کلیدی
                  </Label>
                  <Input
                    type="text"
                    id="keywords"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="کلمات کلیدی را با کاما جدا کنید..."
                    required
                    className="h-12 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-lg font-semibold flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    زبان محتوا
                  </Label>
                  <Select value={contentLanguage} onValueChange={setContentLanguage}>
                    <SelectTrigger className="h-12 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {contentLanguages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-lg font-semibold">
                    سبک محتوا
                  </Label>
                  <Select value={contentStyle} onValueChange={setContentStyle}>
                    <SelectTrigger className="h-12 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {contentStyles.map((style) => (
                        <SelectItem key={style} value={style}>
                          {style}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-lg font-semibold flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    نوع تصویر
                  </Label>
                  <Select value={imageType} onValueChange={setImageType}>
                    <SelectTrigger className="h-12 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {imageTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {imageType !== "no-image" && (
                  <div className="space-y-2">
                    <Label className="text-lg font-semibold flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      سبک تصویر هوش مصنوعی
                    </Label>
                    <Select value={aiImageStyle} onValueChange={setAiImageStyle}>
                      <SelectTrigger className="h-12 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {aiImageStyles.map((style) => (
                          <SelectItem key={style.value} value={style.value}>
                            {style.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

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

        {generatedContent && (
          <div className="space-y-6">
            <GeneratedContent
              content={generatedContent.content}
              imagePrompt={generatedContent.imagePrompt}
            />
            <div className="flex justify-center">
              <Button
                onClick={handleRegenerate}
                disabled={isLoading}
                variant="outline"
                size="lg"
                className="px-8 py-3 text-lg font-semibold border-2 border-blue-500 text-blue-600 hover:bg-blue-50 shadow-md"
              >
                تولید مجدد
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentGenerator;
