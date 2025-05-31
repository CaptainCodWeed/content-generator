
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, RefreshCw, FileText, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GeneratedResult {
  content: string;
  imagePrompt: string;
}

interface GeneratedContentProps {
  result: GeneratedResult;
  onRegenerate: () => void;
  isLoading: boolean;
}

const GeneratedContent: React.FC<GeneratedContentProps> = ({ result, onRegenerate, isLoading }) => {
  const { toast } = useToast();

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to Clipboard!",
        description: `${type} has been copied to your clipboard.`,
      });
    } catch (error) {
      console.error('Failed to copy text:', error);
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatContent = (content: string) => {
    // Simple formatting for better display
    return content.split('\n').map((paragraph, index) => {
      if (paragraph.trim() === '') return null;
      
      // Check if it's a heading (starts with # or is all caps)
      if (paragraph.startsWith('#') || (paragraph.length < 50 && paragraph === paragraph.toUpperCase())) {
        return (
          <h3 key={index} className="text-lg font-semibold text-gray-800 mt-4 mb-2">
            {paragraph.replace(/^#+\s*/, '')}
          </h3>
        );
      }
      
      return (
        <p key={index} className="text-gray-700 mb-3 leading-relaxed">
          {paragraph}
        </p>
      );
    }).filter(Boolean);
  };

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Generated Content
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Generated Content Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Content
              </h4>
              <Button
                onClick={() => copyToClipboard(result.content, 'Content')}
                variant="outline"
                size="sm"
                className="text-gray-600 hover:text-gray-800"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-96 overflow-y-auto">
              <div className="prose prose-sm max-w-none">
                {formatContent(result.content)}
              </div>
            </div>
          </div>

          {/* Image Prompt Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                <Image className="h-4 w-4" />
                Image Prompt
              </h4>
              <Button
                onClick={() => copyToClipboard(result.imagePrompt, 'Image prompt')}
                variant="outline"
                size="sm"
                className="text-gray-600 hover:text-gray-800"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
              <p className="text-gray-700 leading-relaxed italic">
                {result.imagePrompt}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => copyToClipboard(`${result.content}\n\nImage Prompt: ${result.imagePrompt}`, 'All content')}
              variant="outline"
              className="flex-1 border-gray-300 hover:border-gray-400"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy All
            </Button>
            <Button
              onClick={onRegenerate}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneratedContent;
