import { NeoItem } from "@/lib/meteorApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface NeoDetailModalProps {
  neo: NeoItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NeoDetailModal = ({ neo, open, onOpenChange }: NeoDetailModalProps) => {
  if (!neo) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            {neo.name}
            {neo.is_potentially_hazardous_asteroid && (
              <Badge variant="destructive" className="ml-auto">
                Potentially Hazardous
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Near-Earth Object Details & Close Approach History
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase">
                Object ID
              </p>
              <p className="text-sm font-mono">{neo.id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase">
                Absolute Magnitude
              </p>
              <p className="text-sm">{neo.absolute_magnitude_h?.toFixed(2) ?? "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase">
                Size (meters)
              </p>
              <p className="text-sm">
                {neo.estimated_diameter_m_min?.toFixed(1) ?? "—"} — {neo.estimated_diameter_m_max?.toFixed(1) ?? "—"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase">
                Size (km)
              </p>
              <p className="text-sm">
                {neo.estimated_diameter_km_min?.toFixed(4) ?? "—"} — {neo.estimated_diameter_km_max?.toFixed(4) ?? "—"}
              </p>
            </div>
          </div>

          {/* Orbital Data */}
          {neo.orbital_data && (
            <div className="glass-panel border border-border/40 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wide">Orbital Elements</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {neo.orbital_data.semi_major_axis_au !== undefined && (
                  <div>
                    <p className="text-xs text-muted-foreground">Semi-Major Axis (AU)</p>
                    <p className="font-mono">{neo.orbital_data.semi_major_axis_au.toFixed(4)}</p>
                  </div>
                )}
                {neo.orbital_data.eccentricity !== undefined && (
                  <div>
                    <p className="text-xs text-muted-foreground">Eccentricity</p>
                    <p className="font-mono">{neo.orbital_data.eccentricity.toFixed(4)}</p>
                  </div>
                )}
                {neo.orbital_data.inclination_deg !== undefined && (
                  <div>
                    <p className="text-xs text-muted-foreground">Inclination (°)</p>
                    <p className="font-mono">{neo.orbital_data.inclination_deg.toFixed(2)}</p>
                  </div>
                )}
                {neo.orbital_data.period_years !== undefined && (
                  <div>
                    <p className="text-xs text-muted-foreground">Orbital Period (years)</p>
                    <p className="font-mono">{neo.orbital_data.period_years.toFixed(4)}</p>
                  </div>
                )}
                {neo.first_observation_date && (
                  <div>
                    <p className="text-xs text-muted-foreground">First Observed</p>
                    <p className="font-mono text-xs">{neo.first_observation_date}</p>
                  </div>
                )}
                {neo.last_observation_date && (
                  <div>
                    <p className="text-xs text-muted-foreground">Last Observed</p>
                    <p className="font-mono text-xs">{neo.last_observation_date}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Close Approaches */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wide">
              Close Approach History ({neo.close_approach_data?.length ?? 0})
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {neo.close_approach_data?.map((approach, idx) => (
                <div
                  key={idx}
                  className="glass-panel border border-border/30 rounded p-3 text-sm space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-medium">{approach.date}</span>
                    <span className="text-xs text-muted-foreground">{approach.orbiting_body}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Miss Distance</p>
                      <p className="font-mono">
                        {approach.miss_distance_km.toLocaleString()} km / {approach.miss_distance_au.toFixed(6)} AU
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Velocity</p>
                      <p className="font-mono">
                        {approach.relative_velocity_km_s.toFixed(2)} km/s / {approach.relative_velocity_miles_per_hour.toLocaleString()} mph
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* JPL Link */}
          {neo.nasa_jpl_url && (
            <a
              href={neo.nasa_jpl_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              View on NASA JPL
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
