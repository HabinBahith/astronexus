import { useState } from "react";
import { Globe2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageLayout } from "./PageLayout";

type CelestialBody = {
  id: string;
  name: string;
  summary: string;
  distance: string;
  radius: string;
  fact: string;
  orbit: number;
  size: number;
  tint: string;
  color: string;
  speed: number;
};

const celestialBodies: CelestialBody[] = [
  {
    id: "mercury",
    name: "Mercury",
    summary: "Airless rocky world with extreme day-night temperature swings.",
    distance: "57.9 million km",
    radius: "2,439 km",
    fact: "Year lasts just 88 Earth days.",
    orbit: 10,
    size: 0.7,
    tint: "from-slate-300/80 to-slate-500/60",
    color: "#cbd5e1",
    speed: 1.7,
  },
  {
    id: "venus",
    name: "Venus",
    summary: "Super-heated greenhouse planet with crushing atmospheric pressure.",
    distance: "108.2 million km",
    radius: "6,052 km",
    fact: "Spins retrograde and more slowly than it orbits.",
    orbit: 14,
    size: 0.95,
    tint: "from-amber-200/80 to-orange-400/60",
    color: "#f59e0b",
    speed: 1.2,
  },
  {
    id: "earth",
    name: "Earth",
    summary: "Ocean world with protective magnetosphere and a breathable atmosphere.",
    distance: "149.6 million km",
    radius: "6,371 km",
    fact: "Only known world with liquid surface water and life.",
    orbit: 18,
    size: 1,
    tint: "from-cyan-300/80 to-blue-500/60",
    color: "#22d3ee",
    speed: 1,
  },
  {
    id: "mars",
    name: "Mars",
    summary: "Cold desert planet with the largest volcano and canyon.",
    distance: "227.9 million km",
    radius: "3,390 km",
    fact: "Olympus Mons towers ~22 km high.",
    orbit: 22,
    size: 0.75,
    tint: "from-orange-300/80 to-red-500/60",
    color: "#f97316",
    speed: 0.8,
  },
  {
    id: "jupiter",
    name: "Jupiter",
    summary: "Gas giant with intense storms and a powerful magnetic field.",
    distance: "778.5 million km",
    radius: "69,911 km",
    fact: "Has 90+ known moons and the iconic Great Red Spot.",
    orbit: 30,
    size: 2.6,
    tint: "from-amber-200/70 to-amber-500/60",
    color: "#f7c272",
    speed: 0.45,
  },
  {
    id: "saturn",
    name: "Saturn",
    summary: "Ringed gas giant with icy rings and diverse moon system.",
    distance: "1.43 billion km",
    radius: "58,232 km",
    fact: "Rings span ~273,000 km wide but are razor thin.",
    orbit: 36,
    size: 2.2,
    tint: "from-amber-100/80 to-amber-400/60",
    color: "#facc15",
    speed: 0.3,
  },
  {
    id: "uranus",
    name: "Uranus",
    summary: "Ice giant tilted on its side with pale cyan hue.",
    distance: "2.87 billion km",
    radius: "25,362 km",
    fact: "Axis tilt is ~98°, causing extreme seasonal lighting.",
    orbit: 42,
    size: 1.8,
    tint: "from-teal-200/80 to-cyan-400/60",
    color: "#5eead4",
    speed: 0.22,
  },
  {
    id: "neptune",
    name: "Neptune",
    summary: "Windy ice giant with supersonic storms and deep blue color.",
    distance: "4.5 billion km",
    radius: "24,622 km",
    fact: "Fastest winds in the solar system, >1,900 km/h.",
    orbit: 48,
    size: 1.7,
    tint: "from-blue-300/80 to-indigo-500/60",
    color: "#38bdf8",
    speed: 0.18,
  },
];

const Planets = () => {
  const [selectedPlanet, setSelectedPlanet] = useState<CelestialBody | null>(null);

  return (
    <PageLayout>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {celestialBodies.map((body) => (
          <Card
            key={body.id}
            className="glass-panel border border-border/50 hover:border-primary/50 transition-all cursor-pointer"
            onClick={() => setSelectedPlanet(body)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedPlanet(body);
              }
            }}
          >
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <div
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${body.tint} border border-white/20`}
              />
              <div>
                <CardTitle className="text-base">{body.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{body.distance}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{body.summary}</p>
              <div className="flex items-center gap-2 text-xs text-primary">
                <Globe2 className="w-4 h-4" />
                Click to view details
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <Dialog open={!!selectedPlanet} onOpenChange={(open) => !open && setSelectedPlanet(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <div
                className={`w-8 h-8 rounded-full bg-gradient-to-br ${
                  selectedPlanet?.tint || ""
                } border border-white/20`}
              />
              {selectedPlanet?.name}
            </DialogTitle>
            <DialogDescription>Detailed information about {selectedPlanet?.name}</DialogDescription>
          </DialogHeader>
          {selectedPlanet && (
            <div className="space-y-4 mt-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">{selectedPlanet.summary}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-4 space-y-2">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Distance from Sun
                  </p>
                  <p className="text-lg font-semibold">{selectedPlanet.distance}</p>
                </div>
                <div className="glass-panel p-4 space-y-2">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Mean radius</p>
                  <p className="text-lg font-semibold">{selectedPlanet.radius}</p>
                </div>
              </div>
              <div className="glass-panel p-4 border border-primary/30">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                  Quick fact
                </p>
                <p className="text-base font-semibold">{selectedPlanet.fact}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Orbit period</p>
                  <p className="font-semibold mt-1">
                    {selectedPlanet.orbit < 20
                      ? "~88 days"
                      : selectedPlanet.orbit < 25
                        ? "~365 days"
                        : selectedPlanet.orbit < 35
                          ? "~687 days"
                          : selectedPlanet.orbit < 40
                            ? "~12 years"
                            : selectedPlanet.orbit < 45
                              ? "~29 years"
                              : selectedPlanet.orbit < 50
                                ? "~84 years"
                                : "~165 years"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Type</p>
                  <p className="font-semibold mt-1">
                    {selectedPlanet.id === "mercury" || selectedPlanet.id === "venus" || 
                     selectedPlanet.id === "earth" || selectedPlanet.id === "mars"
                      ? "Terrestrial"
                      : selectedPlanet.id === "jupiter" || selectedPlanet.id === "saturn"
                        ? "Gas Giant"
                        : "Ice Giant"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Planets;

