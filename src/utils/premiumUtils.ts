
import { useAuth } from '@/contexts/AuthContext';

export const useIsPremium = () => {
  const { user } = useAuth();
  
  // Check if user has premium subscription
  // This would typically check user metadata or a subscription field
  const isPremium = user?.user_metadata?.subscription === 'premium' || 
                   user?.user_metadata?.plan === 'premium' ||
                   user?.app_metadata?.subscription === 'premium';
  
  return isPremium || false;
};

export const checkPremiumAccess = (user: any): boolean => {
  return user?.user_metadata?.subscription === 'premium' || 
         user?.user_metadata?.plan === 'premium' ||
         user?.app_metadata?.subscription === 'premium' || false;
};
