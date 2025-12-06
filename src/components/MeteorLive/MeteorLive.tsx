import { useState, useEffect } from "react";
import { Filter, X, Loader2, AlertCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { fetchNeosByQuery, fetchNeoFeed, NeoItem } from "@/lib/meteorApi";
import { NeoDetailModal } from "./NeoDetailModal";

type HazardFilter = "all" | "hazardous" | "nonhazardous";

export const MeteorLive = () => {
  const [neos, setNeos] = useState<NeoItem[]>([]);
  const [filtered, setFiltered] = useState<NeoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hazard, setHazard] = useState<HazardFilter>("all");
  const [sortBy, setSortBy] = useState<"closest" | "size" | "name">("closest");
  const [selectedNeo, setSelectedNeo] = useState<NeoItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleLoadMore = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load NEO feed for multiple dates to get more objects
      let results: NeoItem[] = [];
      const today = new Date();
      
      // Fetch from today and next 6 days to get more meteorites
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().slice(0, 10);
        const feed = await fetchNeoFeed(dateStr);
        results = [...results, ...feed];
      }
      
      // Deduplicate by ID
      const seen = new Set<string>();
      const unique = results.filter((r) => {
        if (seen.has(r.id)) return false;
        seen.add(r.id);
        return true;
      });

      setNeos(unique);
      applyFilters(unique, hazard, sortBy);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setNeos([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (
    items: NeoItem[],
    hazardFilter: HazardFilter,
    sort: "closest" | "size" | "name",
  ) => {
    let out = items.slice();

    if (hazardFilter !== "all") {
      out = out.filter((n) =>
        hazardFilter === "hazardous" ? n.is_potentially_hazardous_asteroid : !n.is_potentially_hazardous_asteroid,
      );
    }

    // sort
    if (sort === "closest") {
      out.sort((a, b) => {
        const aDist = a.close_approach_data?.[0]?.miss_distance_km ?? Infinity;
        const bDist = b.close_approach_data?.[0]?.miss_distance_km ?? Infinity;
        return aDist - bDist;
      });
    } else if (sort === "size") {
      out.sort((a, b) => {
        const aMax = a.estimated_diameter_m_max ?? 0;
        const bMax = b.estimated_diameter_m_max ?? 0;
        return bMax - aMax;
      });
    } else if (sort === "name") {
      out.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFiltered(out);
  };

  useEffect(() => {
    applyFilters(neos, hazard, sortBy);
  }, [hazard, sortBy, neos]);

  // On mount, load extended meteorite data
  useEffect(() => {
    handleLoadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = () => {
    setHazard("all");
    setSortBy("closest");
    setError(null);
  };

  const handleViewDetails = (neo: NeoItem) => {
    setSelectedNeo(neo);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel border border-primary/20 rounded-2xl p-6 md:p-8">
        <h1 className="text-4xl md:text-5xl font-bold text-glow-cyan mb-2">
          Meteor Live
        </h1>
        <p className="text-muted-foreground">
          Discover Near-Earth Objects (NEOs) from NASA's Near-Earth Object Web Service. Explore close approaches, orbital data, and more.
        </p>
      </div>

      <Card className="glass-panel border border-border/50 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Hazard Status
            </label>
            <Select value={hazard} onValueChange={(v) => setHazard(v as HazardFilter)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="hazardous">Potentially Hazardous</SelectItem>
                <SelectItem value="nonhazardous">Non-hazardous</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Sort By</label>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="closest">Closest Approach</SelectItem>
                <SelectItem value="size">Largest First</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Actions</label>
            <Button variant="outline" onClick={handleReset} className="w-full gap-2">
              <X className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Fetching near-Earth objects...</p>
        </div>
      )}

      {!loading && neos.length === 0 && !error && (
        <div className="glass-panel border border-border/50 rounded-lg p-12 text-center">
          <p className="text-muted-foreground text-lg">
            No meteorites found. Please try again.
          </p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="glass-panel border border-border/50 rounded-lg p-4 text-sm text-muted-foreground">
          Displaying <span className="font-semibold text-foreground">{filtered.length}</span> object
          {filtered.length !== 1 ? "s" : ""}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((neo) => {
            const nextApproach = neo.close_approach_data?.[0];
            const isHazardous = neo.is_potentially_hazardous_asteroid;

            return (
              <div
                key={neo.id}
                className="glass-panel border border-border/40 rounded-lg p-4 hover:border-primary/50 transition-all cursor-pointer group"
                onClick={() => handleViewDetails(neo)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {neo.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono mt-1">{neo.id}</p>
                  </div>
                  <Badge
                    variant={isHazardous ? "destructive" : "secondary"}
                    className="ml-2 shrink-0"
                  >
                    {isHazardous ? "Hazardous" : "Safe"}
                  </Badge>
                </div>

                {/* Size & Magnitude */}
                <div className="grid grid-cols-2 gap-2 mb-4 pb-4 border-b border-border/30">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                      Size
                    </p>
                    <p className="text-sm font-mono">
                      {neo.estimated_diameter_m_min?.toFixed(0) ?? "—"} — {neo.estimated_diameter_m_max?.toFixed(0) ?? "—"}m
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                      Magnitude
                    </p>
                    <p className="text-sm font-mono">{neo.absolute_magnitude_h?.toFixed(2) ?? "—"}</p>
                  </div>
                </div>

                {/* Next Approach */}
                {nextApproach && (
                  <div className="space-y-2 mb-4 pb-4 border-b border-border/30">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                      Next Close Approach
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm font-mono font-medium">{nextApproach.date}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div>
                          <p className="text-muted-foreground">Miss Distance</p>
                          <p className="font-mono text-foreground">
                            {nextApproach.miss_distance_km.toLocaleString()} km
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Velocity</p>
                          <p className="font-mono text-foreground">
                            {nextApproach.relative_velocity_km_s.toFixed(2)} km/s
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Orbital Data Summary */}
                {neo.orbital_data && (
                  <div className="mb-4 pb-4 border-b border-border/30">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">
                      Orbital Elements
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {neo.orbital_data.semi_major_axis_au !== undefined && (
                        <div>
                          <p className="text-muted-foreground">Semi-Major Axis</p>
                          <p className="font-mono">{neo.orbital_data.semi_major_axis_au.toFixed(3)} AU</p>
                        </div>
                      )}
                      {neo.orbital_data.eccentricity !== undefined && (
                        <div>
                          <p className="text-muted-foreground">Eccentricity</p>
                          <p className="font-mono">{neo.orbital_data.eccentricity.toFixed(3)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* View Details Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-between group-hover:bg-primary/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(neo);
                  }}
                >
                  View Details
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      <NeoDetailModal neo={selectedNeo} open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
};

export default MeteorLive;
