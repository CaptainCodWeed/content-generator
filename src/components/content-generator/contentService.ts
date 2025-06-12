
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

const WEBHOOK_URL = 'http://localhost:5678/webhook-test/dc6df3e7-fcdf-41dd-a762-dcb2649fc01a';

export const generateContent = async (data: GenerateContentRequest): Promise<GeneratedContentResponse> => {
  const requestData = {
    table_name: "generated_content",
    fields: data,
    timestamp: new Date().toISOString(),
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
