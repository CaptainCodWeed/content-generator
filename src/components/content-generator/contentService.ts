
interface GenerateContentRequest {
  user_id: string | undefined;
  title: string;
  headings: string;
  keywords: string;
  image_type: string;
  ai_image_style: string;
  content_language: string;
  content_style: string;
  isRegeneration?: boolean;
}

export interface GeneratedContentResponse {
  content: string;
  imagePrompt: string;
}

const WEBHOOK_URL = 'https://captaincodem.app.n8n.cloud/webhook-test/cedc017c-fa8d-41f4-9612-6306575ccb1e';

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
      'Content-Type': 'application/json',
      'Accept': 'application/json',
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
