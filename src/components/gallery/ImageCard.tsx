import { useState } from "react";
import { ExternalLink, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GalleryImage } from "@/lib/spaceGalleryApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ImageCardProps {
  image: GalleryImage;
}

export const ImageCard = ({ image }: ImageCardProps) => {
  const [imageError, setImageError] = useState(false);

  const handleDownload = () => {
    if (image.imageUrl) {
      const link = document.createElement("a");
      link.href = image.imageUrl;
      link.download = `${image.title.replace(/\s+/g, "-")}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case "nasa":
        return "bg-blue-500/20 text-blue-300 border-blue-500/50";
      case "esa":
        return "bg-purple-500/20 text-purple-300 border-purple-500/50";
      case "jwst":
        return "bg-orange-500/20 text-orange-300 border-orange-500/50";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/50";
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="glass-panel border border-border/50 overflow-hidden hover:border-primary/50 transition-all cursor-pointer group">
          {/* Image Container */}
          <div className="relative w-full h-48 bg-background overflow-hidden">
            {!imageError && image.imageUrl ? (
              <img
                src={image.imageUrl}
                alt={image.title}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <span className="text-muted-foreground text-sm">
                  Image unavailable
                </span>
              </div>
            )}

            {/* Source Badge */}
            <div
              className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium border ${getSourceBadgeColor(image.source)} backdrop-blur-sm`}
            >
              {image.source.toUpperCase()}
            </div>

            {/* Date Badge */}
            <div className="absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-medium bg-black/40 text-white/80 backdrop-blur-sm">
              {formatDate(image.date)}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {image.title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {image.description}
            </p>
          </div>
        </Card>
      </DialogTrigger>

      {/* Full Image Dialog */}
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{image.title}</DialogTitle>
          <DialogDescription>{image.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Full Image */}
          <div className="relative w-full bg-background rounded-lg overflow-hidden">
            {!imageError && image.imageUrl ? (
              <img
                src={image.imageUrl}
                alt={image.title}
                onError={() => setImageError(true)}
                className="w-full h-auto"
              />
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <span className="text-muted-foreground">
                  Image unavailable
                </span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                Source
              </p>
              <p className="text-sm font-semibold mt-1">
                {image.source.toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                Date
              </p>
              <p className="text-sm font-semibold mt-1">
                {formatDate(image.date)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            {image.sourceUrl && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => window.open(image.sourceUrl, "_blank")}
              >
                <ExternalLink className="w-4 h-4" />
                View Source
              </Button>
            )}
            {image.imageUrl && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
