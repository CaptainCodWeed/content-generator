
export interface ImageType {
  label: string;
  value: string;
}

export interface AIImageStyle {
  label: string;
  value: string;
}

export interface ContentLanguage {
  label: string;
  value: string;
}

export const imageTypes: ImageType[] = [
  { label: "تصویر مرتبط با عنوان", value: "title-related" },
  { label: "تصویر مرتبط با کلمات کلیدی", value: "keywords-related" },
  { label: "بدون تصویر", value: "no-image" },
];

export const aiImageStyles: AIImageStyle[] = [
  { label: "واقع‌گرایانه", value: "realistic" },
  { label: "کارتونی", value: "cartoon" },
  { label: "نقاشی روغن", value: "oil-painting" },
  { label: "آبرنگ", value: "watercolor" },
  { label: "مینیمال", value: "minimalist" },
  { label: "انتزاعی", value: "abstract" },
  { label: "سه‌بعدی", value: "3d-render" },
  { label: "فتوگرافیک", value: "photographic" },
];

export const contentLanguages: ContentLanguage[] = [
  { label: "فارسی", value: "persian" },
  { label: "انگلیسی", value: "english" },
  { label: "عربی", value: "arabic" },
];

export const contentStyles = [
  "رسمی",
  "دوستانه",
  "خلاقانه",
  "آموزشی",
  "تبلیغاتی",
];

export const contentOptions = [
  { value: "article", label: "مقاله" },
  { value: "blog-post", label: "پست وبلاگ" },
  { value: "social-media", label: "محتوای شبکه اجتماعی" },
  { value: "product-description", label: "توضیحات محصول" },
  { value: "email", label: "ایمیل تبلیغاتی" },
  { value: "story", label: "داستان" },
  { value: "poem", label: "شعر" },
  { value: "summary", label: "خلاصه" },
];
