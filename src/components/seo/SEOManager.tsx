import { useEffect } from 'react';
import { useLanguageTranslation } from '@/hooks/useLanguageTranslation';
import { generateAdvancedSEO, updateAdvancedPageSEO } from '@/utils/seoEnhanced';

interface SEOManagerProps {
  eventType?: string;
  customEventName?: string;
  isPreview?: boolean;
}

const SEOManager = ({ eventType = 'greeting', customEventName, isPreview = false }: SEOManagerProps) => {
  const { currentLanguage } = useLanguageTranslation();

  useEffect(() => {
    // Determine the event type for SEO
    const seoEventType = eventType === 'custom' && customEventName 
      ? customEventName.toLowerCase().replace(/\s+/g, '-')
      : eventType;

    // Generate SEO data based on current language and event type
    const seoData = generateAdvancedSEO(seoEventType, currentLanguage);

    // Update page title for custom events
    if (eventType === 'custom' && customEventName) {
      seoData.title = `${customEventName} Greeting Cards | Create & Share Free`;
      seoData.description = `Create beautiful ${customEventName} greeting cards with animations, music, and custom messages.`;
      seoData.ogTitle = `${customEventName} Greeting Cards - Free & Personalized`;
      seoData.ogDescription = `Create and share stunning ${customEventName} greeting cards with custom animations, music, and messages.`;
      seoData.keywords = [
        ...seoData.keywords,
        customEventName.toLowerCase(),
        `${customEventName.toLowerCase()} cards`,
        `${customEventName.toLowerCase()} greetings`
      ];
    }

    // Add preview-specific modifications
    if (isPreview) {
      seoData.title = `Preview: ${seoData.title}`;
      seoData.robots = 'noindex, nofollow';
    }

    // Apply SEO updates
    updateAdvancedPageSEO(seoData);
  }, [eventType, customEventName, currentLanguage, isPreview]);

  return null; // This is a utility component that doesn't render anything
};

export default SEOManager;