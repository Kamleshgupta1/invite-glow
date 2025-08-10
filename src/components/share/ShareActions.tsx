import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Share2, Download, FileImage, FileText, Copy, QrCode } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ShareActionsProps {
  greetingData: any;
  greetingRef?: React.RefObject<HTMLDivElement>;
}

const ShareActions = ({ greetingData, greetingRef }: ShareActionsProps) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateShareableURL = () => {
    const params = new URLSearchParams();
    Object.entries(greetingData).forEach(([key, value]) => {
      if (value && typeof value === 'string') {
        params.append(key, value);
      } else if (Array.isArray(value)) {
        params.append(key, JSON.stringify(value));
      } else if (typeof value === 'object') {
        params.append(key, JSON.stringify(value));
      }
    });

    return `${window.location.origin}/?${params.toString()}`;
  };

  const copyShareLink = () => {
    const shareableURL = generateShareableURL();
    navigator.clipboard.writeText(shareableURL);
    toast({
      title: "Link copied!",
      description: "Greeting link has been copied to your clipboard.",
    });
  };

  const shareToSocialMedia = (platform: string) => {
    const shareableURL = generateShareableURL();
    const text = "Check out this beautiful greeting I created!";
    
    let shareURL = '';
    switch (platform) {
      case 'whatsapp':
        shareURL = `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareableURL)}`;
        break;
      case 'facebook':
        shareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableURL)}`;
        break;
      case 'twitter':
        shareURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareableURL)}`;
        break;
      case 'telegram':
        shareURL = `https://t.me/share/url?url=${encodeURIComponent(shareableURL)}&text=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        shareURL = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareableURL)}`;
        break;
    }
    
    if (shareURL) {
      window.open(shareURL, '_blank');
    }
  };

  const saveAsImage = async () => {
    if (!greetingRef?.current) {
      toast({
        title: "Error",
        description: "No greeting content to save.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    try {
      // Add a small delay to ensure all elements are rendered
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const canvas = await html2canvas(greetingRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: false,
        foreignObjectRendering: true,
        logging: false,
        width: greetingRef.current.scrollWidth,
        height: greetingRef.current.scrollHeight
      });
      
      const link = document.createElement('a');
      link.download = `greeting-card-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Image saved!",
        description: "Your greeting has been saved as an image.",
      });
    } catch (error) {
      console.error('Error saving image:', error);
      toast({
        title: "Error",
        description: "Failed to save image. Please try again.",
        variant: "destructive"
      });
    }
    setIsGenerating(false);
  };

  const saveAsPDF = async () => {
    if (!greetingRef?.current) {
      toast({
        title: "Error",
        description: "No greeting content to save.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    try {
      // Add a small delay to ensure all elements are rendered
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const canvas = await html2canvas(greetingRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: false,
        foreignObjectRendering: true,
        logging: false,
        width: greetingRef.current.scrollWidth,
        height: greetingRef.current.scrollHeight
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Calculate PDF dimensions to fit content
      const pdfWidth = imgWidth * 0.75; // Convert px to pt (1px = 0.75pt)
      const pdfHeight = imgHeight * 0.75;
      
      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
        unit: 'pt',
        format: [pdfWidth, pdfHeight]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`greeting-card-${Date.now()}.pdf`);
      
      toast({
        title: "PDF saved!",
        description: "Your greeting has been saved as a PDF.",
      });
    } catch (error) {
      console.error('Error saving PDF:', error);
      toast({
        title: "Error",
        description: "Failed to save PDF. Please try again.",
        variant: "destructive"
      });
    }
    setIsGenerating(false);
  };

  const generateQRCode = () => {
    const shareableURL = generateShareableURL();
    const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareableURL)}`;
    
    const link = document.createElement('a');
    link.download = 'greeting-qr-code.png';
    link.href = qrCodeURL;
    link.click();
    
    toast({
      title: "QR Code generated!",
      description: "QR code for your greeting has been downloaded.",
    });
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setShareDialogOpen(true)} className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
        <Button variant="outline" onClick={saveAsImage} disabled={isGenerating}>
          <FileImage className="h-4 w-4 mr-2" />
          Save as Image
        </Button>
        <Button variant="outline" onClick={saveAsPDF} disabled={isGenerating}>
          <FileText className="h-4 w-4 mr-2" />
          Save as PDF
        </Button>
        <Button variant="outline" onClick={generateQRCode}>
          <QrCode className="h-4 w-4 mr-2" />
          QR Code
        </Button>
      </div>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Greeting</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Button onClick={copyShareLink} className="w-full justify-start" variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => shareToSocialMedia('whatsapp')} variant="outline" className="justify-start">
                📱 WhatsApp
              </Button>
              <Button onClick={() => shareToSocialMedia('facebook')} variant="outline" className="justify-start">
                📘 Facebook
              </Button>
              <Button onClick={() => shareToSocialMedia('twitter')} variant="outline" className="justify-start">
                🐦 Twitter
              </Button>
              <Button onClick={() => shareToSocialMedia('telegram')} variant="outline" className="justify-start">
                ✈️ Telegram
              </Button>
              <Button onClick={() => shareToSocialMedia('linkedin')} variant="outline" className="justify-start">
                💼 LinkedIn
              </Button>
              <Button onClick={generateQRCode} variant="outline" className="justify-start">
                <QrCode className="h-4 w-4 mr-2" />
                QR Code
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShareActions;