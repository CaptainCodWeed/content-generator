
import { supabase } from '@/integrations/supabase/client';

interface GenerateContentRequest {
  user_id: string | undefined;
  title: string;
  prompt: string;
  keywords: string;
  image_type: string;
  ai_image_style: string;
  content_language: string;
  content_style: string;
  content_type: string;
  video_enabled?: boolean;
  isRegeneration?: boolean;
}

export interface GeneratedContentResponse {
  content: string;
  imageUrl?: string;
  videoUrl?: string;
}

export const generateContent = async (data: GenerateContentRequest): Promise<GeneratedContentResponse> => {
  if (!data.user_id) {
    throw new Error('کاربر وارد نشده است');
  }

  // ایجاد درخواست در پایگاه داده
  const { data: contentRequest, error: insertError } = await supabase
    .from('content_requests')
    .insert({
      user_id: data.user_id,
      title: data.title,
      prompt: data.prompt,
      keywords: data.keywords,
      image_type: data.image_type,
      ai_image_style: data.ai_image_style,
      content_language: data.content_language,
      content_style: data.content_style,
      content_type: data.content_type,
      video_enabled: data.video_enabled || false,
      status: 'pending'
    })
    .select()
    .single();

  if (insertError) {
    console.error('Error inserting content request:', insertError);
    throw new Error('خطا در ایجاد درخواست');
  }

  // شبیه‌سازی تولید محتوا
  const simulatedContent = generateSimulatedContent(data);
  
  // به‌روزرسانی درخواست با محتوای تولید شده
  const { error: updateError } = await supabase
    .from('content_requests')
    .update({
      generated_content: simulatedContent.content,
      generated_image: simulatedContent.imageUrl,
      generated_video: simulatedContent.videoUrl,
      status: 'completed',
      updated_at: new Date().toISOString()
    })
    .eq('id', contentRequest.id);

  if (updateError) {
    console.error('Error updating content request:', updateError);
    throw new Error('خطا در به‌روزرسانی محتوا');
  }

  return simulatedContent;
};

// تابع شبیه‌سازی تولید محتوا
function generateSimulatedContent(data: GenerateContentRequest): GeneratedContentResponse {
  const contentTemplates = {
    'article': `# ${data.title}

![تصویر مرتبط با ${data.title}](https://picsum.photos/800/400?random=${Math.floor(Math.random() * 1000)})

در دنیای امروز، ${data.keywords} نقش مهمی در زندگی ما ایفا می‌کند. این مقاله به بررسی جوانب مختلف این موضوع می‌پردازد.

## مقدمه

${data.prompt} یکی از مسائل مهم عصر حاضر است که توجه بسیاری از متخصصان و علاقه‌مندان را به خود جلب کرده است.

## بحث و بررسی

بر اساس تحقیقات انجام شده، می‌توان نتیجه گیری کرد که این موضوع دارای ابعاد گوناگونی است که در ادامه به آن‌ها خواهیم پرداخت.

### نکات کلیدی

- اهمیت موضوع در جامعه امروز
- تأثیرات مثبت و منفی  
- راه‌حل‌های پیشنهادی

## نتیجه‌گیری

در نهایت، می‌توان گفت که ${data.title} موضوعی است که نیاز به توجه بیشتر دارد و امیدواریم این مقاله بتواند نگاهی جامع به این مسئله ارائه دهد.`,

    'social-media': `🌟 ${data.title} 🌟

![${data.title}](https://picsum.photos/600/600?random=${Math.floor(Math.random() * 1000)})

${data.prompt}

✨ ویژگی‌های کلیدی:
${data.keywords.split(',').map(keyword => `• ${keyword.trim()}`).join('\n')}

#محتوای_جذاب #${data.keywords.replace(/,/g, ' #')}`,

    'story': `# ${data.title}

![صحنه‌ای از داستان](https://picsum.photos/700/400?random=${Math.floor(Math.random() * 1000)})

${data.prompt}

روزی روزگاری، در دنیایی که ${data.keywords} حکمفرما بود، داستانی شگفت‌انگیز رخ داد...

این داستان پر از ماجراجویی و هیجان است که قطعاً شما را مجذوب خواهد کرد.

پایان داستان نشان می‌دهد که گاهی کوچک‌ترین تصمیمات می‌توانند بزرگ‌ترین تغییرات را به همراه داشته باشند.`
  };

  const content = contentTemplates[data.content_type as keyof typeof contentTemplates] || 
    contentTemplates['article'];

  const imageUrl = data.image_type !== 'no-image' 
    ? `https://picsum.photos/800/400?random=${Math.floor(Math.random() * 1000)}`
    : undefined;

  const videoUrl = data.video_enabled 
    ? `https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4?random=${Math.floor(Math.random() * 1000)}`
    : undefined;

  return {
    content,
    imageUrl,
    videoUrl
  };
}

export const getUserContentHistory = async (userId: string) => {
  const { data, error } = await supabase
    .from('content_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching user history:', error);
    throw new Error('خطا در بارگذاری تاریخچه');
  }

  return data || [];
};
