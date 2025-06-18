
-- ایجاد جدول برای ذخیره درخواست‌های تولید محتوا
CREATE TABLE IF NOT EXISTS public.content_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  keywords TEXT,
  image_type TEXT NOT NULL,
  ai_image_style TEXT NOT NULL,
  content_language TEXT NOT NULL,
  content_style TEXT NOT NULL,
  content_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  generated_content TEXT,
  image_prompt TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- فعال کردن Row Level Security
ALTER TABLE public.content_requests ENABLE ROW LEVEL SECURITY;

-- ایجاد سیاست‌های امنیتی برای content_requests
CREATE POLICY "Users can view their own content requests" 
  ON public.content_requests 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own content requests" 
  ON public.content_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own content requests" 
  ON public.content_requests 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own content requests" 
  ON public.content_requests 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- بروزرسانی جدول generated_content موجود برای سازگاری
ALTER TABLE public.generated_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own generated content" 
  ON public.generated_content 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own generated content" 
  ON public.generated_content 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own generated content" 
  ON public.generated_content 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own generated content" 
  ON public.generated_content 
  FOR DELETE 
  USING (auth.uid() = user_id);
