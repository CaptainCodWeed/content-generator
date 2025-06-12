
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Eye, Clock, ChevronDown, ChevronUp } from "lucide-react";

interface HistoryItem {
  id: string;
  title: string;
  prompt: string;
  contentType: string;
  date: string;
  content?: string;
  imagePrompt?: string;
}

interface UserHistoryProps {
  onSelectHistory: (item: HistoryItem) => void;
}

const UserHistory: React.FC<UserHistoryProps> = ({ onSelectHistory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [historyItems] = useState<HistoryItem[]>([
    {
      id: "1",
      title: "مقاله درباره هوش مصنوعی",
      prompt: "یک مقاله جامع درباره تأثیر هوش مصنوعی بر آینده بشر",
      contentType: "مقاله",
      date: "۱۴۰۳/۰۹/۲۱",
    },
    {
      id: "2", 
      title: "پست اینستاگرام محصول",
      prompt: "پست جذاب برای معرفی محصول جدید کفش ورزشی",
      contentType: "محتوای شبکه اجتماعی",
      date: "۱۴۰۳/۰۹/۲۰",
    },
    {
      id: "3",
      title: "داستان کوتاه",
      prompt: "داستان کوتاهی درباره سفر به فضا",
      contentType: "داستان",
      date: "۱۴۰۳/۰۹/۱۹",
    },
  ]);

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
                      {item.date}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-2 text-sm line-clamp-2">{item.prompt}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {item.contentType}
                    </span>
                    
                    <Button
                      onClick={() => onSelectHistory(item)}
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-300 hover:bg-blue-50"
                    >
                      <Eye className="h-4 w-4 ml-1" />
                      مشاهده
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default UserHistory;
