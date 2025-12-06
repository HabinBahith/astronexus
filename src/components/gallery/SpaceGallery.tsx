import { useState, useEffect } from "react";
import { Search, Filter, X, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GalleryImage, fetchSpaceImages } from "@/lib/spaceGalleryApi";
import { ImageCard } from "./ImageCard";

type SourceFilter = "all" | "nasa" | "esa" | "jwst";

export const SpaceGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [source, setSource] = useState<SourceFilter>("all");
  const [sortBy, setSortBy] = useState<"date" | "relevance">("date");
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setError("Please enter a search term");
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const results = await fetchSpaceImages(query, source);
      setImages(results);
      applyFilters(results, source, sortBy);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch images";
      setError(message);
      setImages([]);
      setFilteredImages([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (
    imagesToFilter: GalleryImage[],
    selectedSource: SourceFilter,
    sortMethod: "date" | "relevance"
  ) => {
    let filtered = imagesToFilter;

    // Apply source filter
    if (selectedSource !== "all") {
      filtered = filtered.filter((img) => img.source === selectedSource);
    }

    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (img) =>
          img.title.toLowerCase().includes(query) ||
          img.description.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (sortMethod === "date") {
      filtered.sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }

    setFilteredImages(filtered);
  };

  useEffect(() => {
    applyFilters(images, source, sortBy);
  }, [searchQuery, source, sortBy, images]);

  const handleSourceChange = (value: string) => {
    setSource(value as SourceFilter);
  };

  const handleReset = () => {
    setSearchQuery("");
    setSource("all");
    setSortBy("date");
    setImages([]);
    setFilteredImages([]);
    setError(null);
    setHasSearched(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel border border-primary/20 rounded-2xl p-6 md:p-8">
        <h1 className="text-4xl md:text-5xl font-bold text-glow-cyan mb-2">
          Space Gallery
        </h1>
        <p className="text-muted-foreground">
          Explore stunning images from NASA, ESA, and JWST. Search and filter to
          discover the universe.
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="glass-panel border border-border/50 p-6 space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search for nebulas, galaxies, stars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(searchQuery);
                }
              }}
              className="pl-10 py-6 text-base"
            />
          </div>
          <Button
            onClick={() => handleSearch(searchQuery)}
            disabled={loading}
            size="lg"
            className="gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Search
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Source
            </label>
            <Select value={source} onValueChange={handleSourceChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="nasa">NASA</SelectItem>
                <SelectItem value="esa">ESA</SelectItem>
                <SelectItem value="jwst">JWST</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Sort By</label>
            <Select value={sortBy} onValueChange={(val) => setSortBy(val as "date" | "relevance")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Newest First</SelectItem>
                <SelectItem value="relevance">Most Relevant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Actions</label>
            <Button
              variant="outline"
              onClick={handleReset}
              className="w-full gap-2"
            >
              <X className="w-4 h-4" />
              Reset Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Searching space for images...</p>
        </div>
      )}

      {/* No Results */}
      {!loading && hasSearched && filteredImages.length === 0 && !error && (
        <div className="glass-panel border border-border/50 rounded-lg p-12 text-center">
          <p className="text-muted-foreground text-lg">
            No images found. Try different search terms or filters.
          </p>
        </div>
      )}

      {/* Results Summary */}
      {!loading && filteredImages.length > 0 && (
        <div className="glass-panel border border-border/50 rounded-lg p-4 text-sm text-muted-foreground">
          Found <span className="font-semibold text-foreground">{filteredImages.length}</span> image{filteredImages.length !== 1 ? "s" : ""}
        </div>
      )}

      {/* Image Grid */}
      {!loading && filteredImages.length > 0 && (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredImages.map((image) => (
            <ImageCard key={`${image.source}-${image.id}`} image={image} />
          ))}
        </div>
      )}
    </div>
  );
};
