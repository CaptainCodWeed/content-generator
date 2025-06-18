
-- اضافه کردن ستون‌های جدید برای ویدیو و تصویر
ALTER TABLE public.content_requests 
ADD COLUMN IF NOT EXISTS video_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS generated_video TEXT,
ADD COLUMN IF NOT EXISTS generated_image TEXT;

-- به‌روزرسانی جدول generated_content برای سازگاری
ALTER TABLE public.generated_content 
ADD COLUMN IF NOT EXISTS video_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS generated_video TEXT,
ADD COLUMN IF NOT EXISTS generated_image TEXT;
