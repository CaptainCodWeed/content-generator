
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles } from 'lucide-react';
import GeneratedContent from './GeneratedContent';
import { useToast } from '@/hooks/use-toast';

interface FormData {
  title: string;
  headings: string;
  keywords: string;
  imageType: string;
  contentStyle: string;
}

interface GeneratedResult {
  content: string;
  imagePrompt: string;
}

const ContentGenerator = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    headings: '',
    keywords: '',
    imageType: '',
    contentStyle: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<GeneratedResult | null>(null);
  const { toast } = useToast();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.contentStyle || !formData.imageType) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in title, content style, and image type.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('https://your-n8n-server.com/webhook/content-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          headings: formData.headings,
          keywords: formData.keywords,
          imageType: formData.imageType,
          contentStyle: formData.contentStyle
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const result = await response.json();
      setGeneratedResult({
        content: result.content || "Generated content will appear here...",
        imagePrompt: result.imagePrompt || "Generated image description will appear here..."
      });
      
      toast({
        title: "Content Generated Successfully!",
        description: "Your content has been generated and is ready to use.",
      });
      
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating your content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Content Generator
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Create engaging content with AI-powered generation. Fill in the details below and let our AI craft compelling content for you.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid gap-8 lg:grid-cols-2">
          {/* Form Card */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="text-xl font-semibold">Content Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Input */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter your content title..."
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                {/* Headings Input */}
                <div className="space-y-2">
                  <Label htmlFor="headings" className="text-sm font-medium text-gray-700">
                    Headings/Subheadings
                  </Label>
                  <Textarea
                    id="headings"
                    placeholder="Enter headings or subheadings (one per line)..."
                    value={formData.headings}
                    onChange={(e) => handleInputChange('headings', e.target.value)}
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 min-h-[100px]"
                    rows={4}
                  />
                </div>

                {/* Keywords Input */}
                <div className="space-y-2">
                  <Label htmlFor="keywords" className="text-sm font-medium text-gray-700">
                    Keywords
                  </Label>
                  <Input
                    id="keywords"
                    type="text"
                    placeholder="Enter keywords separated by commas..."
                    value={formData.keywords}
                    onChange={(e) => handleInputChange('keywords', e.target.value)}
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                {/* Image Type Dropdown */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Image Type *
                  </Label>
                  <Select onValueChange={(value) => handleInputChange('imageType', value)}>
                    <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                      <SelectValue placeholder="Select image type..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                      <SelectItem value="realistic">Realistic</SelectItem>
                      <SelectItem value="ai-art">AI Art</SelectItem>
                      <SelectItem value="cartoon">Cartoon</SelectItem>
                      <SelectItem value="abstract">Abstract</SelectItem>
                      <SelectItem value="fantasy">Fantasy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Content Style Dropdown */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Content Style *
                  </Label>
                  <Select onValueChange={(value) => handleInputChange('contentStyle', value)}>
                    <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                      <SelectValue placeholder="Select content style..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                      <SelectItem value="news">News</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="mystical">Mystical</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="funny">Funny</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Generate Button */}
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Content
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results Card */}
          <div>
            {generatedResult ? (
              <GeneratedContent 
                result={generatedResult} 
                onRegenerate={handleRegenerate}
                isLoading={isLoading}
              />
            ) : (
              <Card className="shadow-xl border-0 bg-white/60 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <Sparkles className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Ready to Generate
                  </h3>
                  <p className="text-gray-500">
                    Fill out the form and click "Generate Content" to see your AI-generated content appear here.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentGenerator;
