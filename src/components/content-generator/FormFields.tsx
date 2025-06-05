
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Globe, Image, Palette } from "lucide-react";
import { imageTypes, aiImageStyles, contentLanguages, contentStyles } from "./constants";

interface FormFieldsProps {
  title: string;
  setTitle: (value: string) => void;
  headings: string;
  setHeadings: (value: string) => void;
  keywords: string;
  setKeywords: (value: string) => void;
  imageType: string;
  setImageType: (value: string) => void;
  aiImageStyle: string;
  setAiImageStyle: (value: string) => void;
  contentLanguage: string;
  setContentLanguage: (value: string) => void;
  contentStyle: string;
  setContentStyle: (value: string) => void;
}

const FormFields: React.FC<FormFieldsProps> = ({
  title,
  setTitle,
  headings,
  setHeadings,
  keywords,
  setKeywords,
  imageType,
  setImageType,
  aiImageStyle,
  setAiImageStyle,
  contentLanguage,
  setContentLanguage,
  contentStyle,
  setContentStyle,
}) => {
  return (
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
  );
};

export default FormFields;
