import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video } from 'lucide-react';

interface VideoUploaderProps {
  videoUrl: string;
  videoPosition: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  onVideoUrlChange: (url: string) => void;
  onPositionChange: (position: { x: number; y: number; width: number; height: number }) => void;
}

const VideoUploader = ({ 
  videoUrl, 
  videoPosition, 
  onVideoUrlChange, 
  onPositionChange 
}: VideoUploaderProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Video className="h-4 w-4" />
          Main Video (Optional)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="videoUrl">Video URL</Label>
          <Input
            id="videoUrl"
            value={videoUrl}
            onChange={(e) => onVideoUrlChange(e.target.value)}
            placeholder="https://example.com/video.mp4"
            type="url"
          />
        </div>

        {videoUrl && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>X Position (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={videoPosition.x}
                  onChange={(e) => onPositionChange({
                    ...videoPosition,
                    x: parseInt(e.target.value) || 0
                  })}
                />
              </div>
              <div>
                <Label>Y Position (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={videoPosition.y}
                  onChange={(e) => onPositionChange({
                    ...videoPosition,
                    y: parseInt(e.target.value) || 0
                  })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Width (px)</Label>
                <Input
                  type="number"
                  min="200"
                  max="800"
                  value={videoPosition.width}
                  onChange={(e) => onPositionChange({
                    ...videoPosition,
                    width: parseInt(e.target.value) || 400
                  })}
                />
              </div>
              <div>
                <Label>Height (px)</Label>
                <Input
                  type="number"
                  min="150"
                  max="600"
                  value={videoPosition.height}
                  onChange={(e) => onPositionChange({
                    ...videoPosition,
                    height: parseInt(e.target.value) || 300
                  })}
                />
              </div>
            </div>

            <div className="mt-3">
              <Label className="text-xs text-muted-foreground">Preview:</Label>
              <video
                src={videoUrl}
                className="w-full max-w-sm h-32 object-cover rounded border mt-1"
                controls
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <p className="text-xs text-muted-foreground mt-1">
                When video plays with sound, background music will be automatically reduced to 30% volume.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoUploader;