
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Eye, Clock, ChevronDown, ChevronUp, Video } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserContentHistory } from "./contentService";
import { useToast } from "@/hooks/use-toast";

interface HistoryItem {
  id: string;
  title: string;
  prompt: string;
  content_type: string;
  created_at: string;
  generated_content?: string;
  generated_image?: string;
  generated_video?: string;
  video_enabled?: boolean;
  status: string;
}

interface UserHistoryProps {
  onSelectHistory: (item: HistoryItem) => void;
}

const UserHistory: React.FC<UserHistoryProps> = ({ onSelectHistory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user && isOpen) {
      loadHistory();
    }
  }, [user, isOpen]);

  const loadHistory = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const history = await getUserContentHistory(user.id);
      setHistoryItems(history);
    } catch (error) {
      console.error('Error loading history:', error);
      toast({
        title: "خطا",
        description: "خطا در بارگذاری تاریخچه",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR');
  };

  const getContentTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'article': 'مقاله',
      'social-media': 'محتوای شبکه اجتماعی',
      'story': 'داستان',
      'email': 'ایمیل',
      'product-description': 'توضیحات محصول'
    };
    return labels[type] || type;
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'pending': 'در انتظار',
      'completed': 'تکمیل شده',
      'failed': 'ناموفق'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm mb-8">
      <CardHeader 
        className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardTitle className="text-xl font-bold flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History className="h-5 w-5" />
            تاریخچه درخواست‌ها
          </div>
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </CardTitle>
      </CardHeader>
      
      {isOpen && (
        <CardContent className="p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-3 text-gray-500">در حال بارگذاری...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {historyItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <History className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>هنوز هیچ درخواستی ثبت نشده است</p>
                </div>
              ) : (
                historyItems.map((item) => (
                  <div 
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">{item.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        {formatDate(item.created_at)}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-3 text-sm line-clamp-2">{item.prompt}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {getContentTypeLabel(item.content_type)}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
                          {getStatusLabel(item.status)}
                        </span>
                        {item.video_enabled && (
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full flex items-center gap-1">
                            <Video className="h-3 w-3" />
                            ویدیو
                          </span>
                        )}
                      </div>
                      
                      <Button
                        onClick={() => onSelectHistory(item)}
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-300 hover:bg-blue-50"
                        disabled={item.status !== 'completed'}
                      >
                        <Eye className="h-4 w-4 ml-1" />
                        {item.status === 'completed' ? 'مشاهده' : 'در انتظار'}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default UserHistory;
