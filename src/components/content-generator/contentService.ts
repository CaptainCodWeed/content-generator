
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
  isRegeneration?: boolean;
}

export interface GeneratedContentResponse {
  content: string;
  imagePrompt: string;
}

const WEBHOOK_URL = 'https://captaincodem.app.n8n.cloud/webhook/cedc017c-fa8d-41f4-9612-6306575ccb1e';

export const generateContent = async (data: GenerateContentRequest): Promise<GeneratedContentResponse> => {
  // Format data for ChatGPT AI agent understanding
  const chatGPTPrompt = `
عنوان: ${data.title}
درخواست کاربر: ${data.prompt}
کلمات کلیدی: ${data.keywords}
نوع محتوا: ${data.content_type}
زبان محتوا: ${data.content_language}
سبک محتوا: ${data.content_style}
نوع تصویر: ${data.image_type}
${data.image_type !== 'no-image' ? `سبک تصویر: ${data.ai_image_style}` : ''}

لطفاً محتوای مناسب تولید کن و همچنین پرامپت مناسب برای تولید تصویر ارائه بده.
  `.trim();

  const requestData = {
    user_id: data.user_id,
    prompt: chatGPTPrompt,
    content_details: {
      title: data.title,
      content_type: data.content_type,
      language: data.content_language,
      style: data.content_style,
      keywords: data.keywords,
      image_type: data.image_type,
      ai_image_style: data.ai_image_style
    },
    timestamp: new Date().toISOString(),
    isRegeneration: data.isRegeneration || false
  };

  console.log('Sending request to n8n webhook:', requestData);

  const response = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData),
    mode: 'cors',
  });

  console.log('Response status:', response.status);
  console.log('Response headers:', response.headers);

  if (!response.ok) {
    throw new Error(`خطا در درخواست: ${response.status} - ${response.statusText}`);
  }

  const result = await response.json();
  console.log('Response data:', result);

  return result;
};
